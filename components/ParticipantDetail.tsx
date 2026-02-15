import React, { useState, useEffect, useRef } from 'react';
import { Participant } from '../types';
import { ArrowLeftIcon, SaveIcon, TrashIcon } from './icons';
import { deleteParticipant } from '../services/api';

interface ParticipantDetailProps {
    participant: Participant | undefined;
    onSave: (updatedParticipant: Participant) => void;
    onDeleteSuccess: () => void;
    onBack: () => void;
}

const ParticipantDetail: React.FC<ParticipantDetailProps> = ({ participant, onSave, onDeleteSuccess, onBack }) => {
    const [formData, setFormData] = useState<Participant | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const deleteTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (participant) {
            setFormData(JSON.parse(JSON.stringify(participant)));
        } else {
            setFormData(null);
        }
        // Reset confirmation state when participant changes
        setConfirmDelete(false); 
        if (deleteTimeoutRef.current) {
            clearTimeout(deleteTimeoutRef.current);
        }
    }, [participant]);

    // Cleanup timeout on component unmount
    useEffect(() => {
        return () => {
            if (deleteTimeoutRef.current) {
                clearTimeout(deleteTimeoutRef.current);
            }
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!formData) return;
        setConfirmDelete(false); // Reset delete confirm on any change
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = () => {
        if (formData) {
            onSave(formData);
        }
    };

    const handleDelete = async () => {
        if (!formData || !formData.id) {
            alert("Não é possível excluir: ID do participante não encontrado.");
            return;
        }

        if (confirmDelete) {
            setIsDeleting(true);
            try {
                await deleteParticipant(formData.id);
                alert("Participante excluído com sucesso!");
                onDeleteSuccess();
            } catch (err) {
                console.error("Erro ao excluir participante:", err);
                alert(`Falha ao excluir participante. Detalhes: ${err instanceof Error ? err.message : String(err)}`);
            } finally {
                setIsDeleting(false);
                setConfirmDelete(false);
            }
        } else {
            setConfirmDelete(true);
            // Reset confirmation after 5 seconds if not clicked again
            deleteTimeoutRef.current = window.setTimeout(() => {
                setConfirmDelete(false);
            }, 5000);
        }
    };

    if (!participant) {
        return <div className="p-8 text-center">Participante não encontrado.</div>;
    }

    if (!formData) {
        return <div className="p-8 text-center">Carregando dados do participante...</div>;
    }
    
    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in max-w-3xl mx-auto">
            <button onClick={onBack} className="flex items-center text-slate-300 hover:text-white mb-6 group">
                <ArrowLeftIcon className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                Voltar para a Lista
            </button>
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{formData.nome}</h1>
                    <p className="text-slate-400">ID: {formData.id}</p>
                </div>
                <button 
                    onClick={handleDelete} 
                    disabled={isDeleting}
                    className={`flex items-center text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 shadow-lg disabled:cursor-not-allowed disabled:shadow-none
                        ${isDeleting ? 'bg-slate-600' : ''}
                        ${!isDeleting && confirmDelete ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/40' : ''}
                        ${!isDeleting && !confirmDelete ? 'bg-red-600 hover:bg-red-500 shadow-red-600/40' : ''}
                    `}
                >
                    <TrashIcon className="h-5 w-5 mr-2" />
                    {isDeleting ? 'Excluindo...' : (confirmDelete ? 'Confirmar Exclusão?' : 'Excluir')}
                </button>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-slate-300 mb-2">Nome</label>
                    <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
                <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-slate-300 mb-2">Telefone</label>
                    <input type="text" name="telefone" value={formData.telefone} onChange={handleInputChange} className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
                <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">Status</h3>
                    <div className="flex justify-around">
                        <div className="text-center">
                            <p className="text-sm text-slate-400">Sorteado</p>
                            <p className={`font-bold text-lg ${formData.cotas_sorteadas > 0 ? 'text-fuchsia-400' : 'text-amber-400'}`}>
                                {formData.cotas_sorteadas > 0 ? `Sim (${formData.cotas_sorteadas}/${formData.cota})` : 'Não'}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-slate-400">Pagamento Total</p>
                            <p className={`font-bold text-lg ${formData.status_pagamento_total ? 'text-fuchsia-400' : 'text-amber-400'}`}>{formData.status_pagamento_total ? 'Sim' : 'Não'}</p>
                        </div>
                    </div>
                </div>
                <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">Parcelas Pagas</h3>
                    {formData.parcelas_pagas.length > 0 ? (
                        <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {formData.parcelas_pagas.map(p => (
                                <li key={p.mes} className="flex justify-between p-2 bg-white/10 rounded-md">
                                    <span className="font-medium">{p.mes}</span>
                                    <span className="text-slate-400">{p.data_pagamento}</span>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-slate-500 text-center py-4">Nenhuma parcela paga.</p> }
                </div>
                <div className="md:col-span-2">
                    <button onClick={handleSave} className="w-full flex items-center justify-center bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300">
                        <SaveIcon className="h-5 w-5 mr-2" />
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ParticipantDetail;