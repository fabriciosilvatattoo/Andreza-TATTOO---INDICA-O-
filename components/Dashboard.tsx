import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Participant, Sorteio, View } from '../types';
import { TrophyIcon } from './icons';
import RaffleWheel from './RaffleWheel';

interface DashboardProps {
    participants: Participant[];
    sorteios: Sorteio[];
    onNavigate: (view: View) => void;
    onDraw: (month: string, winnerIds: string[]) => void;
}

const PROJECT_MONTHS = [
    "Julho/2025", "Agosto/2025", "Setembro/2025", "Outubro/2025", "Novembro/2025", "Dezembro/2025",
    "Janeiro/2026", "Fevereiro/2026", "Março/2026", "Abril/2026", "Maio/2026", "Junho/2026"
];

const Dashboard: React.FC<DashboardProps> = ({ participants, sorteios, onNavigate, onDraw }) => {
    const [raffleMonth, setRaffleMonth] = useState<string>('');
    const [unconfirmedWinner, setUnconfirmedWinner] = useState<Participant | null>(null);
    const sorteiosRealizadosRef = useRef<HTMLDivElement>(null);
    const prevSorteiosLength = useRef(sorteios.length);

    useEffect(() => {
        if (sorteios.length > prevSorteiosLength.current) {
            setTimeout(() => {
                sorteiosRealizadosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500); // Delay to allow state to update and animation to finish
        }
        prevSorteiosLength.current = sorteios.length;
    }, [sorteios]);

    const monthDrawCounts = useMemo(() => {
        return sorteios.reduce((acc, s) => {
            acc[s.mes_referencia] = (acc[s.mes_referencia] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }, [sorteios]);

    const eligibleParticipants = useMemo(() => {
        if (!raffleMonth) return [];

        const raffleMonthIndex = PROJECT_MONTHS.indexOf(raffleMonth);
        if (raffleMonthIndex === -1) return [];

        return participants.filter(p => {
            // Condição 1: Precisa ter cotas disponíveis para sorteio
            if (p.cota <= p.cotas_sorteadas) {
                return false;
            }

            const paidMonthsSet = new Set(p.parcelas_pagas.map(parcela => parcela.mes));
            
            // Condição 2: Precisa ter pago o mês do sorteio atual para ser considerado
            if (!paidMonthsSet.has(raffleMonth)) {
                return false;
            }

            // Encontra o primeiro mês que o participante pagou para definir seu ponto de partida
            const firstPaidMonthIndex = p.parcelas_pagas
                .map(parcela => PROJECT_MONTHS.indexOf(parcela.mes))
                .filter(index => index !== -1) // Garante que apenas meses válidos sejam considerados
                .reduce((minIndex, currentIndex) => Math.min(minIndex, currentIndex), Infinity);
            
            // Se, por algum motivo, não houver um primeiro mês de pagamento válido, ele não é elegível.
            if (firstPaidMonthIndex === Infinity) {
                return false;
            }

            // Define a lista de meses obrigatórios para este participante específico
            const requiredMonthsForParticipant = PROJECT_MONTHS.slice(firstPaidMonthIndex, raffleMonthIndex + 1);

            // Condição 3: Verifica se todos os meses, desde o seu início até o mês do sorteio, foram pagos
            const isUpToDate = requiredMonthsForParticipant.every(requiredMonth => paidMonthsSet.has(requiredMonth));
            
            return isUpToDate;
        });
    }, [raffleMonth, participants]);

    useEffect(() => {
        setUnconfirmedWinner(null);
    }, [raffleMonth]);

    const handleWinnerSelected = (winnerName: string) => {
        const winnerParticipant = participants.find(p => p.nome === winnerName);
        if (winnerParticipant) {
            setUnconfirmedWinner(winnerParticipant);
        }
    };
    
    const handleConfirmWinner = () => {
        if (unconfirmedWinner && raffleMonth) {
            onDraw(raffleMonth, [unconfirmedWinner.id]);
            alert(`Ganhador ${unconfirmedWinner.nome} confirmado!`);
            setUnconfirmedWinner(null); // Reset after confirmation
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Dashboard</h1>
            <p className="text-slate-400 mb-8">Visão geral do Projeto Tattoo - Edição 1.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <button onClick={() => onNavigate('payment')} className="w-full text-left bg-violet-600 hover:bg-violet-500 text-white font-bold p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-violet-600/30">
                    <h3 className="text-xl">Registrar Pagamento</h3>
                    <p className="text-sm text-violet-200 mt-1">Confirmar o pagamento de uma parcela.</p>
                </button>
                 <button onClick={() => onNavigate('participants')} className="w-full text-left bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                    <h3 className="text-xl">Ver Participantes</h3>
                    <p className="text-sm text-slate-300 mt-1">Listar e gerenciar todos os participantes.</p>
                </button>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-2xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center"><TrophyIcon className="h-7 w-7 mr-3 text-teal-300"/> Sorteio do Mês</h2>
                        <p className="text-slate-400 mt-1">Gire a roleta para encontrar o próximo ganhador!</p>
                    </div>
                    <div className="mt-4 sm:mt-0 w-full sm:w-auto">
                         <label htmlFor="month" className="sr-only">Mês do Sorteio</label>
                         <select id="month" value={raffleMonth} onChange={e => setRaffleMonth(e.target.value)} className="w-full sm:w-auto bg-white/10 border border-white/20 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-violet-500">
                             <option value="">Selecione um mês</option>
                             {PROJECT_MONTHS.map(m => {
                                 const count = monthDrawCounts[m] || 0;
                                 let label = m;
                                 if (count === 1) {
                                     label = `${m} (1 sorteio realizado)`;
                                 } else if (count > 1) {
                                     label = `${m} (${count} sorteios realizados)`;
                                 }
                                 return <option key={m} value={m}>{label}</option>
                             })}
                         </select>
                    </div>
                </div>

                <div className="mt-6">
                    {raffleMonth ? (
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                            <div className="lg:col-span-3 flex justify-center">
                                {eligibleParticipants.length > 0 ? (
                                    <RaffleWheel 
                                        key={raffleMonth}
                                        participants={eligibleParticipants.map(p => p.nome)}
                                        onWinnerSelected={handleWinnerSelected}
                                        disabled={!!unconfirmedWinner}
                                    />
                                ) : (
                                    <div className="text-center flex items-center justify-center h-80 w-full bg-black/20 rounded-lg">
                                        <p className="text-lg text-slate-400">Nenhum participante apto para este mês.</p>
                                    </div>
                                )}
                            </div>
                            <div className="lg:col-span-2 bg-black/20 backdrop-blur-lg border border-white/10 p-6 rounded-lg max-h-[440px] overflow-y-auto">
                                <h3 className="text-lg font-bold mb-4 text-slate-200">Aptos para Sorteio ({eligibleParticipants.length})</h3>
                                {eligibleParticipants.length > 0 ? (
                                    <ul className="space-y-2">
                                        {eligibleParticipants.map(p => (
                                            <li key={p.id} className="bg-white/10 p-3 rounded-md text-slate-300 text-sm">{p.nome}</li>
                                        ))}
                                    </ul>
                                ) : (
                                   <div className="text-center py-10 text-slate-500">
                                       <p>Nenhum participante apto.</p>
                                   </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center flex items-center justify-center h-80 text-slate-500 bg-black/20 rounded-lg">
                            <p className="text-lg">Selecione um mês para carregar a roleta e ver os participantes.</p>
                        </div>
                    )}
                    
                    {unconfirmedWinner && (
                         <div className="mt-8 p-6 bg-black/20 backdrop-blur-lg border border-white/10 rounded-lg text-center animate-fade-in flex flex-col items-center space-y-4">
                             <div>
                                 <h3 className="text-lg font-semibold text-fuchsia-400">Ganhador de {raffleMonth}:</h3>
                                 <p className="text-4xl font-bold text-white mt-2 animate-pulse">{unconfirmedWinner.nome}</p>
                             </div>
                             <button 
                                 onClick={handleConfirmWinner}
                                 className="w-full max-w-xs bg-teal-500 hover:bg-teal-400 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-teal-500/30 transform hover:scale-105"
                             >
                                 Confirmar Ganhador e Registrar
                             </button>
                         </div>
                    )}
                </div>
            </div>

            <div ref={sorteiosRealizadosRef} className="mt-12 bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-white flex items-center mb-6">
                    <TrophyIcon className="h-7 w-7 mr-3 text-amber-300"/> Sorteios Realizados
                </h2>
                {sorteios.length > 0 ? (
                    <ul className="space-y-4">
                        {[...sorteios].sort((a, b) => new Date(b.data_realizacao).getTime() - new Date(a.data_realizacao).getTime()).map(sorteio => (
                            <li key={sorteio.id} className="bg-black/20 p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center">
                                <div>
                                    <p className="font-bold text-lg text-slate-100">{sorteio.mes_referencia}</p>
                                    <p className="text-sm text-slate-400">Realizado em {new Date(sorteio.data_realizacao).toLocaleDateString('pt-BR')}</p>
                                </div>
                                <div className="mt-3 sm:mt-0 text-left sm:text-right">
                                    <p className="text-sm text-slate-400 mb-1">Ganhador(es):</p>
                                    {sorteio.ganhadores.map(winnerId => {
                                        const winner = participants.find(p => p.id === winnerId);
                                        return (
                                            <p key={winnerId} className="font-semibold text-fuchsia-400">{winner ? winner.nome : 'Participante não encontrado'}</p>
                                        );
                                    })}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-10 text-slate-500">
                        <p>Nenhum sorteio foi realizado ainda.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Dashboard;