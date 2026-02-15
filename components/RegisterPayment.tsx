import React, { useState, useMemo } from 'react';
import { Participant, Parcela, View } from '../types';
import { ArrowLeftIcon, SaveIcon } from './icons';

interface RegisterPaymentProps {
    participants: Participant[];
    onRegister: (participantId: string, parcelas: Parcela[], isFullPayment: boolean) => void;
    onBack: () => void;
    totalParcelas: number;
}

const PROJECT_MONTHS = [
    "Julho/2025", "Agosto/2025", "Setembro/2025", "Outubro/2025", "Novembro/2025", "Dezembro/2025",
    "Janeiro/2026", "Fevereiro/2026", "Março/2026", "Abril/2026", "Maio/2026", "Junho/2026"
];

const RegisterPayment: React.FC<RegisterPaymentProps> = ({ participants, onRegister, onBack, totalParcelas }) => {
    const [participantId, setParticipantId] = useState<string>('');
    const [month, setMonth] = useState<string>('');
    const [amount, setAmount] = useState<number>(33.33);
    const [isFullPayment, setIsFullPayment] = useState<boolean>(false);

    const availableParticipants = useMemo(() => {
        return participants.filter(p => !p.status_pagamento_total);
    }, [participants]);
    
    const availableMonths = useMemo(() => {
        if (!participantId) return [];
        const participant = participants.find(p => p.id === participantId);
        if (!participant) return [];
        const paidMonths = participant.parcelas_pagas.map(p => p.mes);
        return PROJECT_MONTHS.slice(0, totalParcelas).filter(m => !paidMonths.includes(m));
    }, [participantId, participants, totalParcelas]);

    const handleRegister = () => {
        if (!participantId) {
            alert("Por favor, selecione um participante.");
            return;
        }

        let parcelas: Parcela[] = [];
        if (isFullPayment) {
            parcelas = availableMonths.map(m => ({
                mes: m,
                valor: 33.33, // TODO: This could be dynamic based on project data
                data_pagamento: new Date().toISOString().split('T')[0]
            }));
        } else {
            if (!month) {
                alert("Por favor, selecione um mês.");
                return;
            }
            parcelas.push({
                mes: month,
                valor: amount,
                data_pagamento: new Date().toISOString().split('T')[0]
            });
        }
        
        onRegister(participantId, parcelas, isFullPayment);
        setParticipantId('');
        setMonth('');
        setAmount(33.33);
        setIsFullPayment(false);
    };

    const handleParticipantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newId = e.target.value;
        setParticipantId(newId);
        setMonth(''); // Reset month on participant change
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in max-w-2xl mx-auto">
            <button onClick={onBack} className="flex items-center text-slate-300 hover:text-white mb-6 group">
                <ArrowLeftIcon className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                Voltar
            </button>
            <h1 className="text-3xl font-bold mb-2">Registrar Pagamento</h1>
            <p className="text-slate-400 mb-8">Selecione o participante e o mês para registrar o pagamento.</p>

            <div className="space-y-6 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl">
                <div>
                    <label htmlFor="participant" className="block text-sm font-medium text-slate-300 mb-2">Participante</label>
                    <select id="participant" value={participantId} onChange={handleParticipantChange} className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-violet-500">
                        <option value="">Selecione um participante</option>
                        {availableParticipants.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                    </select>
                </div>

                <div className="flex items-center">
                    <input id="fullPayment" type="checkbox" checked={isFullPayment} onChange={e => setIsFullPayment(e.target.checked)} className="h-4 w-4 rounded border-white/20 bg-white/10 text-violet-600 focus:ring-violet-500" />
                    <label htmlFor="fullPayment" className="ml-2 block text-sm text-slate-300">Pagamento Total (R$400,00)</label>
                </div>

                {!isFullPayment && (
                    <>
                        <div>
                            <label htmlFor="month" className="block text-sm font-medium text-slate-300 mb-2">Mês Referente</label>
                            <select id="month" value={month} onChange={e => setMonth(e.target.value)} disabled={!participantId} className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50">
                                <option value="">Selecione um mês</option>
                                {availableMonths.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-slate-300 mb-2">Valor Pago</label>
                            <input type="number" id="amount" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                        </div>
                    </>
                )}

                <button onClick={handleRegister} className="w-full flex items-center justify-center bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-lg shadow-violet-600/30">
                    <SaveIcon className="h-5 w-5 mr-2" />
                    Salvar Pagamento
                </button>
            </div>
        </div>
    );
};

export default RegisterPayment;