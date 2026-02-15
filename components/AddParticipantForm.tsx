import React, { useState } from 'react';
import { Participant } from '../types';
import { ArrowLeftIcon, SaveIcon } from './icons';

interface AddParticipantFormProps {
    onAdd: (newParticipant: Omit<Participant, 'id' | 'parcelas_pagas' | 'status_pagamento_total' | 'cotas_sorteadas' | 'data_sorteio'>) => void;
    onBack: () => void;
}

const AddParticipantForm: React.FC<AddParticipantFormProps> = ({ onAdd, onBack }) => {
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cota, setCota] = useState(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome || !telefone) {
            alert("Por favor, preencha o nome e o telefone.");
            return;
        }
        onAdd({ nome, telefone, cota });
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in max-w-2xl mx-auto">
            <button onClick={onBack} className="flex items-center text-slate-300 hover:text-white mb-6 group">
                <ArrowLeftIcon className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                Voltar
            </button>
            <h1 className="text-3xl font-bold mb-2">Adicionar Novo Participante</h1>
            <p className="text-slate-400 mb-8">Preencha os detalhes abaixo para incluir um novo participante no projeto.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl">
                <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-slate-300 mb-2">Nome Completo</label>
                    <input 
                        type="text" 
                        id="nome"
                        value={nome} 
                        onChange={e => setNome(e.target.value)} 
                        className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-slate-300 mb-2">Telefone (WhatsApp)</label>
                    <input 
                        type="tel" 
                        id="telefone"
                        value={telefone} 
                        onChange={e => setTelefone(e.target.value)} 
                        className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="cota" className="block text-sm font-medium text-slate-300 mb-2">Número de Cotas</label>
                    <input 
                        type="number" 
                        id="cota"
                        value={cota} 
                        onChange={e => setCota(Number(e.target.value))} 
                        min="1"
                        className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                    />
                </div>
                <button type="submit" className="w-full flex items-center justify-center bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-lg shadow-violet-600/30">
                    <SaveIcon className="h-5 w-5 mr-2" />
                    Salvar Novo Participante
                </button>
            </form>
        </div>
    );
};

export default AddParticipantForm;