
export interface Parcela {
  mes: string;
  valor: number;
  data_pagamento: string;
}

export interface Participant {
  id: string;
  nome: string;
  telefone: string;
  cota: number;
  status_pagamento_total: boolean;
  cotas_sorteadas: number;
  data_sorteio: string | null;
  parcelas_pagas: Parcela[];
}

export interface Sorteio {
  id: string;
  mes_referencia: string;
  data_realizacao: string;
  ganhadores: string[];
}

export interface Projeto {
    id: string;
    nome: string;
    valor_total_cota: number;
    numero_parcelas: number;
    created_at: string;
}

export interface AppData {
    projeto: Projeto;
    participantes: Participant[];
    sorteios: Sorteio[];
}

// Visão do App antigo, mantido para referência
export type View = 'dashboard' | 'participants' | 'payment' | 'draw' | 'detail' | 'add_participant';


// --- TattooFlow App ---
export type AppView = 'referral' | 'voucher';

export interface Referrer {
  id: string;
  name: string;
  phone: string;
  documentSuffix: string;
  code: string;
  link: string;
  qrCodeUrl: string;
  referrals: number;
  conversions: number;
}

export type RefereeStatus = 'Convertido' | 'Agendado' | 'Contatado' | 'Cancelado';

export interface Referee {
  id: string;
  name: string;
  referrerCode: string;
  status: RefereeStatus;
  date: string;
}

export interface Client {
  id: string;
  name: string;
  totalSpent: number;
}

export interface Voucher {
  id: string;
  code: string;
  purchaser: string;
  purchaseValue: number;
  tattooValue: number;
  status: 'Ativo' | 'Utilizado' | 'Expirado';
  issueDate: string;
  expiryDate: string;
  usedBy?: string;
}

export interface VoucherWaitlistEntry {
    id: string;
    clientName: string;
    dateAdded: string;
    status: 'Aguardando' | 'Notificado';
}