
import React, { useState, useMemo } from 'react';
import { Voucher, Client, VoucherWaitlistEntry } from '../types';
import { TicketIcon, UsersIcon, CheckCircleIcon, PlusIcon } from './icons';

// Mock Data
const mockClients: Client[] = [
    { id: 'cli01', name: 'Fabrício', totalSpent: 1500 },
    { id: 'cli02', name: 'Carol', totalSpent: 800 },
    { id: 'cli03', name: 'Jean', totalSpent: 2200 },
    { id: 'cli04', name: 'Lucas', totalSpent: 450 },
    { id: 'cli05', name: 'Samuel', totalSpent: 1100 },
];

const initialVouchers: Voucher[] = [
    { id: 'v01', code: 'TATTOO-F8B3', purchaser: 'Samuel', purchaseValue: 180, tattooValue: 250, status: 'Ativo', issueDate: '2024-07-20', expiryDate: '2025-01-20' },
    { id: 'v02', code: 'TATTOO-A9C1', purchaser: 'Jean', purchaseValue: 300, tattooValue: 500, status: 'Utilizado', issueDate: '2024-07-15', expiryDate: '2025-01-15', usedBy: 'Larissa' },
    { id: 'v03', code: 'TATTOO-D4E7', purchaser: 'Fabrício', purchaseValue: 180, tattooValue: 250, status: 'Ativo', issueDate: '2024-07-28', expiryDate: '2025-01-28' },
];

const initialWaitlist: VoucherWaitlistEntry[] = [
    { id: 'wl01', clientName: 'Carol', dateAdded: '2024-07-25', status: 'Aguardando'},
    { id: 'wl02', clientName: 'Lucas', dateAdded: '2024-07-26', status: 'Aguardando'},
];

const VOUCHER_OPTIONS = [
    { tattooValue: 250, tiers: { high: 180, mid: 200, low: 220 } },
    { tattooValue: 500, tiers: { high: 350, mid: 400, low: 450 } },
];

const getLoyaltyTier = (spent: number) => {
    if (spent >= 1000) return 'high';
    if (spent >= 500) return 'mid';
    return 'low';
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; colorClass: string }> = ({ icon, label, value, colorClass }) => (
     <div className="group relative overflow-hidden bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl">
        <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity duration-300 transform group-hover:scale-110`}>
             {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "h-24 w-24" })}
        </div>
        <div className="relative z-10 flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${colorClass} shadow-inner`}>
                {icon}
            </div>
            <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">{label}</p>
                <p className="text-2xl font-bold text-white mt-0.5 tracking-tight">{value}</p>
            </div>
        </div>
    </div>
);

const StatusBadge: React.FC<{ status: 'Ativo' | 'Utilizado' | 'Expirado' }> = ({ status }) => {
    const styles = {'Ativo': 'bg-teal-500/20 text-teal-300 border-teal-500/30', 'Utilizado': 'bg-slate-500/20 text-slate-400 border-slate-500/30', 'Expirado': 'bg-amber-500/20 text-amber-300 border-amber-500/30'};
    return <span className={`px-2 py-1 text-xs font-bold rounded-md border ${styles[status]}`}>{status}</span>;
};

const VoucherCard: React.FC<{ voucher: Voucher, onUse: (id: string) => void }> = ({ voucher, onUse }) => {
    const isActive = voucher.status === 'Ativo';
    
    return (
        <div className={`relative flex flex-col md:flex-row overflow-hidden rounded-2xl border ${isActive ? 'border-teal-500/30 bg-slate-900/80' : 'border-white/5 bg-black/40 opacity-70'} backdrop-blur-md transition-all duration-300 hover:scale-[1.01]`}>
            {/* Lado Esquerdo: Detalhes Visuais */}
            <div className={`p-6 flex-1 flex flex-col justify-center relative overflow-hidden`}>
                {isActive && <div className="absolute -top-10 -left-10 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl"></div>}
                
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Valor do Crédito</p>
                        <p className={`text-3xl font-extrabold ${isActive ? 'text-white' : 'text-slate-500'}`}>
                            R$ {voucher.tattooValue.toFixed(2).replace('.', ',')}
                        </p>
                    </div>
                    <StatusBadge status={voucher.status} />
                </div>
                
                <div className="space-y-1">
                    <p className="text-sm text-slate-300">
                        <span className="text-slate-500">Código:</span> <span className="font-mono font-bold tracking-wider">{voucher.code}</span>
                    </p>
                    <p className="text-sm text-slate-300">
                        <span className="text-slate-500">Comprador:</span> {voucher.purchaser}
                    </p>
                    <p className="text-xs text-slate-500">Válido até: {new Date(voucher.expiryDate).toLocaleDateString('pt-BR')}</p>
                </div>
            </div>

            {/* Divisória Perfurada */}
            <div className="relative hidden md:flex flex-col items-center justify-center w-8">
                <div className="absolute inset-y-0 left-1/2 border-l-2 border-dashed border-slate-700"></div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-slate-950 rounded-full border-b border-white/10"></div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-slate-950 rounded-full border-t border-white/10"></div>
            </div>

            {/* Lado Direito: Ação */}
            <div className="p-6 bg-black/20 flex flex-col items-center justify-center min-w-[160px]">
                {isActive ? (
                    <button 
                        onClick={() => onUse(voucher.id)}
                        className="w-full bg-teal-600/20 hover:bg-teal-500/30 border border-teal-500/50 text-teal-300 font-bold py-2 px-4 rounded-xl transition-all"
                    >
                        Utilizar
                    </button>
                ) : (
                    <div className="text-center">
                         <p className="text-xs text-slate-500 mb-1">Utilizado por</p>
                         <p className="font-bold text-slate-300">{voucher.usedBy || '---'}</p>
                    </div>
                )}
                <div className="mt-4 text-center">
                    <p className="text-[10px] text-slate-600 uppercase">Pago: R$ {voucher.purchaseValue}</p>
                </div>
            </div>
        </div>
    );
}

const VoucherSystem: React.FC = () => {
    const [vouchers, setVouchers] = useState<Voucher[]>(initialVouchers);
    const [waitlist, setWaitlist] = useState<VoucherWaitlistEntry[]>(initialWaitlist);
    const [selectedClientId, setSelectedClientId] = useState('');
    const [selectedVoucherOption, setSelectedVoucherOption] = useState(0);

    const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

    const handleMarkAsUsed = (id: string) => {
        const usedBy = prompt("Voucher utilizado por (nome):");
        if(usedBy) {
            setVouchers(vouchers.map(v => v.id === id ? { ...v, status: 'Utilizado', usedBy } : v));
        }
    };

    const handleEmitVoucher = (e: React.FormEvent) => {
        e.preventDefault();
        if(!selectedClientId) {
            alert("Por favor, selecione um cliente.");
            return;
        }

        const client = mockClients.find(c => c.id === selectedClientId);
        if (!client) return;
        
        const tier = getLoyaltyTier(client.totalSpent);
        const voucherOption = VOUCHER_OPTIONS[selectedVoucherOption];
        const purchaseValue = voucherOption.tiers[tier];

        const newVoucher: Voucher = {
            id: `v${Date.now()}`,
            code: `TATTOO-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            purchaser: client.name,
            purchaseValue: purchaseValue,
            tattooValue: voucherOption.tattooValue,
            status: 'Ativo',
            issueDate: new Date().toISOString().split('T')[0],
            expiryDate: new Date(new Date().setDate(new Date().getDate() + 60)).toISOString().split('T')[0], // 60 days validity
        };

        setVouchers(prev => [newVoucher, ...prev]);
        setSelectedClientId('');
    };
    
    const selectedClient = useMemo(() => mockClients.find(c => c.id === selectedClientId), [selectedClientId]);

    const activeVouchers = vouchers.filter(v => v.status === 'Ativo');
    const totalValueInHand = activeVouchers.reduce((sum, v) => sum + v.purchaseValue, 0);
    const totalValueInTattoos = activeVouchers.reduce((sum, v) => sum + v.tattooValue, 0);

    return (
        <div className="animate-fade-in pb-12">
             <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    Tattoo Currency
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl">
                    Emissão e controle de <span className="text-teal-400 font-bold">Vouchers</span> como moeda de troca.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard icon={<TicketIcon className="h-6 w-6 text-teal-300" />} label="Vouchers Ativos" value={activeVouchers.length.toString()} colorClass="bg-teal-500/20" />
                <StatCard icon={<UsersIcon className="h-6 w-6 text-violet-300" />} label="Caixa (Ativos)" value={formatCurrency(totalValueInHand)} colorClass="bg-violet-500/20" />
                <StatCard icon={<CheckCircleIcon className="h-6 w-6 text-sky-300" />} label="Crédito (Tattoo)" value={formatCurrency(totalValueInTattoos)} colorClass="bg-sky-500/20" />
                <StatCard icon={<CheckCircleIcon className="h-6 w-6 text-slate-400" />} label="Utilizados" value={vouchers.filter(v => v.status === 'Utilizado').length.toString()} colorClass="bg-slate-500/20" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna Esquerda: Emissão */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-violet-600/20 blur-3xl"></div>
                        
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-violet-600 w-1 h-6 rounded-full mr-3"></span>
                            Emitir Voucher
                        </h2>
                        
                        <form className="space-y-5" onSubmit={handleEmitVoucher}>
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 ml-1 font-semibold">Cliente Comprador</label>
                                <div className="relative">
                                    <select id="client" value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 appearance-none cursor-pointer">
                                        <option value="">Selecione...</option>
                                        {mockClients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 ml-1 font-semibold">Tipo do Voucher</label>
                                <div className="relative">
                                    <select value={selectedVoucherOption} onChange={e => setSelectedVoucherOption(Number(e.target.value))} className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 appearance-none cursor-pointer">
                                        {VOUCHER_OPTIONS.map((opt, index) => <option key={index} value={index}>Crédito de {formatCurrency(opt.tattooValue)}</option>)}
                                    </select>
                                     <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                            
                            {selectedClient && (
                                <div className="p-4 bg-gradient-to-r from-violet-900/40 to-fuchsia-900/40 border border-violet-500/30 rounded-xl text-center animate-fade-in">
                                    <p className="text-xs text-violet-200 uppercase tracking-widest mb-1">Preço Fidelidade para {selectedClient.name}</p>
                                    <p className="text-3xl font-extrabold text-white drop-shadow-lg">{formatCurrency(VOUCHER_OPTIONS[selectedVoucherOption].tiers[getLoyaltyTier(selectedClient.totalSpent)])}</p>
                                    <p className="text-[10px] text-slate-400 mt-1">(Total gasto: {formatCurrency(selectedClient.totalSpent)})</p>
                                </div>
                            )}

                            <button type="submit" className="w-full flex items-center justify-center bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-violet-600/20 transform hover:-translate-y-0.5">
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Confirmar Emissão
                            </button>
                        </form>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white">Fila de Espera</h3>
                            <span className="bg-sky-500/20 text-sky-300 text-xs px-2 py-0.5 rounded-full font-mono">{waitlist.length}</span>
                        </div>
                        <ul className="space-y-3 mb-4">
                           {waitlist.map(item => (
                               <li key={item.id} className="text-sm p-3 bg-black/20 rounded-xl flex justify-between items-center border border-white/5">
                                   <span className="text-slate-300 font-medium">{item.clientName}</span>
                                   <span className="text-[10px] text-slate-500 bg-black/30 px-2 py-1 rounded uppercase">{item.status}</span>
                               </li>
                           ))}
                        </ul>
                         <button className="w-full text-center bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold py-2.5 rounded-xl text-xs transition-colors uppercase tracking-wider">
                            Notificar Próximos da Fila
                        </button>
                    </div>
                </div>

                {/* Coluna Direita: Lista de Vouchers */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold text-white pl-2">Carteira de Vouchers</h2>
                    </div>
                    
                    <div className="space-y-4">
                        {vouchers.map(v => (
                            <VoucherCard key={v.id} voucher={v} onUse={handleMarkAsUsed} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoucherSystem;
