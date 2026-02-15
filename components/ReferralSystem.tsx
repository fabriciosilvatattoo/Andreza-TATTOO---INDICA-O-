
import React, { useState } from 'react';
import { GiftIcon, TrophyIcon, ClipboardIcon, UsersIcon, CheckCircleIcon, TrendingUpIcon, PlusIcon, QrCodeIcon } from './icons';
import { Referrer, Referee, RefereeStatus } from '../types';
import { normalizeName } from '../utils/formatters';

// Mock Data
const initialReferrers: Referrer[] = [
    { 
        id: 'ref01', name: 'Fabricio da Silva', phone: '5519998364108', documentSuffix: '1234', code: 'IND-F8B3', referrals: 8, conversions: 5,
        link: 'https://wa.me/5519998364108?text=Oi%2C%20vim%20pela%20indica%C3%A7%C3%A3o%20de%20Fabricio%20da%20Silva%20(c%C3%B3digo%3A%20IND-F8B3)',
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('https://wa.me/5519998364108?text=Oi%2C%20vim%20pela%20indica%C3%A7%C3%A3o%20de%20Fabricio%20da%20Silva%20(c%C3%B3digo%3A%20IND-F8B3)')}`
    },
    { 
        id: 'ref02', name: 'Carol de Souza', phone: '5519988690683', documentSuffix: '5678', code: 'IND-C4A1', referrals: 5, conversions: 2,
        link: 'https://wa.me/5519998364108?text=Oi%2C%20vim%20pela%20indica%C3%A7%C3%A3o%20de%20Carol%20de%20Souza%20(c%C3%B3digo%3A%20IND-C4A1)',
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('https://wa.me/5519998364108?text=Oi%2C%20vim%20pela%20indica%C3%A7%C3%A3o%20de%20Carol%20de%20Souza%20(c%C3%B3digo%3A%20IND-C4A1)')}`
    },
];

const initialReferees: Referee[] = [
    { id: 'ind01', name: 'Samuel', referrerCode: 'IND-F8B3', status: 'Convertido', date: '2024-07-28' },
    { id: 'ind02', name: 'Larissa', referrerCode: 'IND-C4A1', status: 'Agendado', date: '2024-07-27' },
    { id: 'ind03', name: 'Ariane', referrerCode: 'IND-F8B3', status: 'Convertido', date: '2024-07-26' },
];

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; colorClass: string }> = ({ icon, label, value, colorClass }) => (
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
                <p className="text-3xl font-bold text-white mt-0.5 tracking-tight">{value}</p>
            </div>
        </div>
    </div>
);

const StatusBadge: React.FC<{ status: RefereeStatus }> = ({ status }) => {
    const styles = {
        'Convertido': 'bg-teal-500/10 text-teal-400 border-teal-500/20 shadow-[0_0_10px_rgba(45,212,191,0.1)]',
        'Agendado': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        'Contatado': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
        'Cancelado': 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return <span className={`px-3 py-1 text-xs font-bold rounded-full border ${styles[status]}`}>{status}</span>;
};

const ReferralSystem: React.FC = () => {
    const [referrers, setReferrers] = useState<Referrer[]>(initialReferrers);
    const [referees, setReferees] = useState<Referee[]>(initialReferees);
    const [newReferrerName, setNewReferrerName] = useState('');
    const [newReferrerPhone, setNewReferrerPhone] = useState('');
    const [newReferrerDoc, setNewReferrerDoc] = useState('');
    const [lastGenerated, setLastGenerated] = useState<Pick<Referrer, 'link' | 'qrCodeUrl'> | null>(null);
    const [copySuccess, setCopySuccess] = useState('');
    const [newRefereeName, setNewRefereeName] = useState('');
    const [selectedReferrerId, setSelectedReferrerId] = useState('');
    const [newRefereeStatus, setNewRefereeStatus] = useState<RefereeStatus>('Contatado');

    const handleRegisterReferrer = (e: React.FormEvent) => {
        e.preventDefault();
        const normalizedName = normalizeName(newReferrerName);
        if (!normalizedName || !newReferrerPhone || !newReferrerDoc) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const code = `IND-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const message = encodeURIComponent(`Oi, vim pela indicação de ${normalizedName} (código: ${code})`);
        const link = `https://wa.me/5519998364108?text=${message}`;
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(link)}`;

        const newReferrer: Referrer = {
            id: `ref${Date.now()}`,
            name: normalizedName,
            phone: newReferrerPhone,
            documentSuffix: newReferrerDoc,
            code,
            link,
            qrCodeUrl,
            referrals: 0,
            conversions: 0,
        };
        setReferrers(prev => [...prev, newReferrer]);
        setLastGenerated({ link, qrCodeUrl });
        setNewReferrerName('');
        setNewReferrerPhone('');
        setNewReferrerDoc('');
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess('Copiado!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => setCopySuccess('Falha ao copiar.'));
    };

    const handleAddReferee = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newRefereeName || !selectedReferrerId) {
            alert("Por favor, preencha o nome do indicado e selecione quem indicou.");
            return;
        }
        
        const referrer = referrers.find(r => r.id === selectedReferrerId);
        if (!referrer) return;

        const newReferee: Referee = {
            id: `ind${Date.now()}`,
            name: newRefereeName,
            referrerCode: referrer.code,
            status: newRefereeStatus,
            date: new Date().toISOString().split('T')[0],
        };

        setReferees(prev => [newReferee, ...prev]);

        setReferrers(prev => prev.map(r => {
            if (r.id === selectedReferrerId) {
                return {
                    ...r,
                    referrals: r.referrals + 1,
                    conversions: newRefereeStatus === 'Convertido' ? r.conversions + 1 : r.conversions
                };
            }
            return r;
        }));

        setNewRefereeName('');
        setSelectedReferrerId('');
        setNewRefereeStatus('Contatado');
    };
    
    const REWARD_GOAL = 3;

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    Sistema de Indicação
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl">
                    Acompanhe o desempenho dos seus embaixadores e gerencie recompensas do <span className="text-violet-400 font-bold">TattooFlow</span>.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard icon={<UsersIcon className="h-6 w-6 text-violet-300" />} label="Indicadores" value={referrers.length} colorClass="bg-violet-500/20" />
                <StatCard icon={<TrendingUpIcon className="h-6 w-6 text-sky-300" />} label="Contatos Gerados" value={referees.length} colorClass="bg-sky-500/20" />
                <StatCard icon={<CheckCircleIcon className="h-6 w-6 text-teal-300" />} label="Conversões" value={referees.filter(r => r.status === 'Convertido').length} colorClass="bg-teal-500/20" />
                <StatCard icon={<TrophyIcon className="h-6 w-6 text-amber-300" />} label="Prêmios Liberados" value={Math.floor(referrers.reduce((acc, r) => acc + r.conversions, 0) / REWARD_GOAL)} colorClass="bg-amber-500/20" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Coluna da Esquerda: Cadastro e QR Code */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl">
                        <div className="flex items-center mb-6 space-x-3">
                            <div className="p-2 bg-violet-500/20 rounded-lg">
                                <PlusIcon className="h-6 w-6 text-violet-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Novo Indicador</h2>
                        </div>
                        
                        <form onSubmit={handleRegisterReferrer} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 ml-1 font-semibold">Nome Completo</label>
                                <input type="text" value={newReferrerName} onChange={e => setNewReferrerName(e.target.value)} placeholder="Ex: João Silva" className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 ml-1 font-semibold">WhatsApp</label>
                                <input type="text" value={newReferrerPhone} onChange={e => setNewReferrerPhone(e.target.value)} placeholder="Ex: 55199..." className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 ml-1 font-semibold">Documento (4 dígitos)</label>
                                <input type="text" maxLength={4} value={newReferrerDoc} onChange={e => setNewReferrerDoc(e.target.value)} placeholder="Ex: 1234" className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all" />
                            </div>
                            <button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-violet-600/20 transform hover:-translate-y-0.5">
                                Gerar Link & QR Code
                            </button>
                        </form>
                    </div>

                    {lastGenerated && (
                        <div className="bg-gradient-to-b from-teal-900/40 to-slate-900/60 backdrop-blur-xl border border-teal-500/30 p-6 rounded-3xl animate-fade-in shadow-[0_0_30px_rgba(20,184,166,0.1)]">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-teal-200">Cadastro Sucesso! 🎉</h3>
                                <span className="bg-teal-500/20 text-teal-300 text-[10px] px-2 py-1 rounded uppercase font-bold tracking-widest">Pronto</span>
                            </div>
                            
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="p-2 bg-white rounded-2xl shadow-lg">
                                    <img src={lastGenerated.qrCodeUrl} alt="QR Code" className="w-32 h-32 rounded-lg" />
                                </div>
                                <div className="w-full space-y-2">
                                    <p className="text-xs text-teal-200/70">Link personalizado gerado:</p>
                                    <div className="relative group cursor-pointer" onClick={() => handleCopy(lastGenerated.link)}>
                                        <input type="text" readOnly value={lastGenerated.link} className="w-full bg-black/40 border border-teal-500/30 rounded-lg py-2 pl-3 pr-10 text-teal-100 text-xs truncate cursor-pointer group-hover:border-teal-400 transition-colors" />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-teal-400">
                                            <ClipboardIcon className="h-4 w-4" />
                                        </div>
                                    </div>
                                    {copySuccess && <p className="text-xs text-teal-400 font-bold animate-pulse">{copySuccess}</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Coluna da Direita: Tabela de Ranking */}
                <div className="lg:col-span-8 bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Painel de Indicadores</h2>
                            <p className="text-sm text-slate-400">Ranking de performance e metas.</p>
                        </div>
                        <div className="mt-4 sm:mt-0 bg-black/30 px-4 py-2 rounded-lg border border-white/5">
                            <span className="text-xs text-slate-400">Meta p/ Prêmio:</span>
                            <span className="ml-2 text-amber-400 font-bold">{REWARD_GOAL} Conversões</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-slate-300 border-separate border-spacing-y-2">
                             <thead>
                                <tr className="text-xs text-slate-500 uppercase tracking-wider">
                                    <th className="px-4 py-2">Indicador</th>
                                    <th className="px-4 py-2 text-center">Leads</th>
                                    <th className="px-4 py-2 text-center">Conv.</th>
                                    <th className="px-4 py-2 w-1/3">Progresso</th>
                                </tr>
                             </thead>
                             <tbody>
                                {referrers.map(r => {
                                    const progress = Math.min(((r.conversions % REWARD_GOAL) / REWARD_GOAL) * 100, 100);
                                    const rewardsEarned = Math.floor(r.conversions / REWARD_GOAL);
                                    return (
                                        <tr key={r.id} className="bg-white/[0.03] hover:bg-white/[0.07] transition-colors duration-200 group">
                                            <td className="px-4 py-3 rounded-l-xl border-l-2 border-transparent group-hover:border-violet-500 transition-all">
                                                <div className="font-bold text-white">{r.name}</div>
                                                <div className="text-[10px] text-slate-500 font-mono bg-black/30 inline-block px-1.5 py-0.5 rounded mt-1">{r.code}</div>
                                            </td>
                                            <td className="px-4 py-3 text-center font-mono text-slate-400">{r.referrals}</td>
                                            <td className="px-4 py-3 text-center font-mono text-white font-bold text-lg">{r.conversions}</td>
                                            <td className="px-4 py-3 rounded-r-xl">
                                                <div className="flex flex-col justify-center h-full">
                                                    <div className="flex justify-between text-[10px] mb-1">
                                                        <span className="text-violet-300">{r.conversions % REWARD_GOAL} / {REWARD_GOAL}</span>
                                                        {rewardsEarned > 0 && <span className="text-amber-400 font-bold flex items-center gap-1">🏆 {rewardsEarned}x</span>}
                                                    </div>
                                                    <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/5">
                                                        <div 
                                                            className="bg-gradient-to-r from-violet-600 to-fuchsia-500 h-full rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)] transition-all duration-1000 ease-out" 
                                                            style={{width: `${progress}%`}}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                             </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Seção Inferior: Gerenciar Indicados */}
             <div className="mt-8 bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <ClipboardIcon className="h-6 w-6 text-sky-400" />
                    Gerenciar Indicados (CRM)
                </h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 bg-black/20 p-6 rounded-2xl border border-white/5">
                        <form onSubmit={handleAddReferee} className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-2">Registrar Lead</h3>
                            <input type="text" placeholder="Nome do Cliente" value={newRefereeName} onChange={e => setNewRefereeName(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-sm text-white" />
                            
                            <div className="relative">
                                <select value={selectedReferrerId} onChange={e => setSelectedReferrerId(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-sm text-slate-300 appearance-none">
                                    <option value="">Quem indicou?</option>
                                    {referrers.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>

                             <div className="relative">
                                <select value={newRefereeStatus} onChange={e => setNewRefereeStatus(e.target.value as RefereeStatus)} className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-sm text-slate-300 appearance-none">
                                    <option value="Contatado">Contatado</option>
                                    <option value="Agendado">Agendado</option>
                                    <option value="Convertido">Convertido</option>
                                    <option value="Cancelado">Cancelado</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>

                            <button type="submit" className="w-full flex items-center justify-center bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-300 text-sm shadow-lg shadow-sky-600/20 transform hover:-translate-y-0.5">
                               <PlusIcon className="h-4 w-4 mr-2"/> Salvar Contato
                            </button>
                        </form>
                    </div>
                     <div className="md:col-span-2">
                        <div className="overflow-hidden rounded-2xl border border-white/5 bg-black/20">
                            <div className="overflow-x-auto max-h-[400px]">
                                <table className="w-full text-sm text-left text-slate-300">
                                     <thead className="text-xs text-slate-500 uppercase bg-black/40 sticky top-0 z-10 backdrop-blur-sm">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold">Cliente</th>
                                            <th className="px-6 py-3 font-semibold">Indicado Por</th>
                                            <th className="px-6 py-3 font-semibold">Data</th>
                                            <th className="px-6 py-3 font-semibold text-right">Status</th>
                                        </tr>
                                     </thead>
                                     <tbody className="divide-y divide-white/5">
                                        {referees.map(r => (
                                            <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4 font-medium text-white">{r.name}</td>
                                                <td className="px-6 py-4 font-mono text-xs text-slate-500">{r.referrerCode}</td>
                                                <td className="px-6 py-4 text-slate-400">{new Date(r.date).toLocaleDateString('pt-BR')}</td>
                                                <td className="px-6 py-4 text-right"><StatusBadge status={r.status} /></td>
                                            </tr>
                                        ))}
                                     </tbody>
                                </table>
                            </div>
                        </div>
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default ReferralSystem;
