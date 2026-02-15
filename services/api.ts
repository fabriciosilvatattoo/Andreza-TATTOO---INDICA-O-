import { AppData, Participant, Parcela } from '../types';

const N8N_BASE_URL = 'https://n8n.insn.online/webhook';

const URLS = {
    GET_APP_DATA: `${N8N_BASE_URL}/Buscar-dados`,
    ADD_PARTICIPANT: `${N8N_BASE_URL}/adicionar-participantes`,
    REGISTER_PAYMENT: `${N8N_BASE_URL}/registra-pagamento`,
    PERFORM_DRAW: `${N8N_BASE_URL}/realizar-sorteio`,
    UPDATE_PARTICIPANT: `${N8N_BASE_URL}/atualizar-participante`,
    DELETE_PARTICIPANT: `${N8N_BASE_URL}/deletar-participante`
};

const postData = async (url: string, data: unknown) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro na chamada do webhook: ${response.status} ${errorText}`);
    }

    // Tenta parsear como JSON, mas retorna sucesso mesmo se a resposta for vazia
    try {
        const responseText = await response.text();
        return responseText ? JSON.parse(responseText) : { success: true };
    } catch (e) {
        console.warn("Resposta do webhook não era JSON, mas a requisição foi OK.", e);
        return { success: true };
    }
};

export const getAppData = async (): Promise<AppData> => {
    try {
        const response = await fetch(URLS.GET_APP_DATA);
        if (!response.ok) {
            throw new Error(`Falha na requisição: ${response.statusText}`);
        }
        
        const result = await response.json();
        const data = (Array.isArray(result) && result.length > 0) ? (result[0].json || result[0]) : null;

        if (data?.projeto && data?.participantes && data?.sorteios) {
            return data;
        }
        
        throw new Error('Formato de payload inesperado do n8n');

    } catch (error) {
        console.error("Erro ao buscar dados da aplicação:", error);
        alert("Falha grave ao conectar com o servidor. A aplicação não poderá funcionar.");
        // Em caso de erro crítico, retorna um estado vazio para não quebrar a UI
        return {
            projeto: { id: 'error', nome: 'Projeto Indisponível', valor_total_cota: 0, numero_parcelas: 0, created_at: ''},
            participantes: [],
            sorteios: []
        };
    }
};

export const addParticipant = (data: Omit<Participant, 'id' | 'parcelas_pagas' | 'status_pagamento_total' | 'cotas_sorteadas' | 'data_sorteio'>) => 
    postData(URLS.ADD_PARTICIPANT, data);

export const registerPayment = (data: { participantId: string, parcelas: Parcela[], isFullPayment: boolean }) => 
    postData(URLS.REGISTER_PAYMENT, data);

export const performDraw = (data: { month: string, winnerIds: string[] }) => 
    postData(URLS.PERFORM_DRAW, data);

export const updateParticipant = (data: Participant) => 
    postData(URLS.UPDATE_PARTICIPANT, data);

export const deleteParticipant = (id: string) => 
    postData(URLS.DELETE_PARTICIPANT, { id });
