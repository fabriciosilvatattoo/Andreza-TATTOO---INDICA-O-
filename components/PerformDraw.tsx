import React, { useState, useMemo } from 'react';
import { Participant, Sorteio, View } from '../types';
import { ArrowLeftIcon, TrophyIcon } from './icons';

interface PerformDrawProps {
    participants: Participant[];
    sorteios: Sorteio[];
    onDraw: (month: string, winnerIds: string[]) => void;
    onBack: () => void;
}

const PROJECT_MONTHS = [
    "Julho/2025", "Agosto/2025", "Setembro/2025", "Outubro/2025", "Novembro/2025", "Dezembro/2025",
    "Janeiro/2026", "Fevereiro/2026", "Março/2026", "Abril/2026", "Maio/2026", "Junho/2026"
];

const PerformDraw: React.FC<PerformDrawProps> = ({ participants, sorteios, onDraw, onBack }) => {
    const [month, setMonth] = useState<string>('');
    const [winner, setWinner] = useState<Participant | null>(null);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);

    const availableMonths = useMemo(() => {
        const drawnMonths = sorteios.map(s => s.mes_referencia);
        return PROJECT_MONTHS.filter(m => !drawnMonths.includes(m));
    }, [sorteios]);

    const eligibleParticipants = useMemo(() => {
        if (!month) return [];
        
        const monthIndex = PROJECT_MONTHS.indexOf(month);
        if (monthIndex === -1) return [];

        const requiredMonths = PROJECT_MONTHS.slice(0, monthIndex + 1);

        return participants.filter(p => {
            if (p.cota <= p.cotas_sorteadas) {
                return false;
            }
            const paidMonths = new Set(p.parcelas_pagas.map(parcela => parcela.mes));
            const isUpToDate = requiredMonths.every(requiredMonth => paidMonths.has(requiredMonth));
            
            return isUpToDate;
        });
    }, [month, participants]);

    const handleDraw = () => {
        if (eligibleParticipants.length === 0) {
            alert("Não há participantes aptos para este sorteio.");
            return;
        }
        setIsDrawing(true);
        setWinner(null);
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * eligibleParticipants.length);
            const drawnWinner = eligibleParticipants[randomIndex];
            setWinner(drawnWinner);
            onDraw(month, [drawnWinner.id]);
            setIsDrawing(false);
        }, 3000); // Simulate drawing animation
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in max-w-4xl mx-auto">
            <button onClick={onBack} className="flex items-center text-slate-300 hover:text-white mb-6 group">
                <ArrowLeftIcon className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                Voltar
            </button>
            <h1 className="text-3xl font-bold mb-2">Realizar Sorteio Mensal</h1>
            <p className="text-slate-400 mb-8">Escolha o mês e sorteie um ganhador entre os participantes aptos.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl">
                    <h2 className="text-xl font-bold mb-4">Configuração do Sorteio</h2>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="month" className="block text-sm font-medium text-slate-300 mb-2">Mês do Sorteio</label>
                            <select id="month" value={month} onChange={e => setMonth(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-violet-500">
                                <option value="">Selecione um mês</option>
                                {availableMonths.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <button 
                            onClick={handleDraw} 
                            disabled={!month || isDrawing || eligibleParticipants.length === 0}
                            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-lg shadow-violet-600/30 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            {isDrawing ? "Sorteando..." : "Sortear Ganhador!"}
                        </button>
                    </div>
                    {winner && (
                        <div className="mt-8 p-4 bg-black/30 rounded-lg text-center animate-fade-in">
                            <h3 className="text-lg font-semibold text-violet-300">Parabéns ao Ganhador!</h3>
                            <p className="text-2xl font-bold text-white mt-2">{winner.nome}</p>
                        </div>
                    )}
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl">
                    <h2 className="text-xl font-bold mb-4">Participantes Aptos</h2>
                    <p className="text-sm text-slate-400 mb-4">
                        {month ? `${eligibleParticipants.length} participantes aptos para o sorteio de ${month}.` : "Selecione um mês para ver os participantes."}
                    </p>
                    <div className="max-h-80 overflow-y-auto pr-2">
                        {month && eligibleParticipants.length > 0 ? (
                            <ul className="space-y-2">
                                {eligibleParticipants.map(p => (
                                    <li key={p.id} className="bg-white/10 p-3 rounded-md text-slate-200">{p.nome}</li>
                                ))}
                            </ul>
                        ) : (
                           <div className="text-center py-10 text-slate-500">
                                <p>{month ? "Nenhum participante apto." : "Aguardando seleção do mês."}</p>
                           </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformDraw;