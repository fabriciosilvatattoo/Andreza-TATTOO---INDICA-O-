import React from 'react';
import { Participant, View } from '../types';
import { PlusIcon, ChevronRightIcon } from './icons';

interface ParticipantListProps {
    participants: Participant[];
    onNavigate: (view: View, id?: string) => void;
    totalParcelas: number;
}

const ParticipantList: React.FC<ParticipantListProps> = ({ participants, onNavigate, totalParcelas }) => {
    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100">Lista de Participantes</h1>
                    <p className="text-slate-400">Total de {participants.length} participantes.</p>
                </div>
                <button 
                    onClick={() => onNavigate('add_participant')}
                    className="flex items-center justify-center bg-violet-600 hover:bg-violet-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 shadow-lg shadow-violet-600/30">
                    <PlusIcon />
                    Adicionar Novo
                </button>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                <ul className="divide-y divide-white/10">
                    {participants.map(p => (
                        <li 
                            key={p.id} 
                            onClick={() => onNavigate('detail', p.id)}
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors duration-200"
                        >
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-violet-300 mr-4">
                                    {p.nome.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-slate-100">{p.nome}</p>
                                        {p.cota > 1 && (
                                            <span className="bg-teal-500/20 text-teal-300 text-xs font-semibold px-2 py-0.5 rounded-full">
                                                {p.cota} Cotas
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-400">{p.telefone}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                               <div className="text-right">
                                  <p className="text-sm text-slate-400">Parcelas Pagas</p>
                                  <p className="font-mono text-slate-100">{p.parcelas_pagas.length} / {totalParcelas * p.cota}</p>
                               </div>
                               <ChevronRightIcon />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ParticipantList;