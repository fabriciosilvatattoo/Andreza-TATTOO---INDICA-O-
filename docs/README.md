# Projeto Tattoo - 1ª Edição [ARQUIVADO]

## 1. Visão Geral

Este documento centraliza as informações sobre o "Projeto Tattoo - 1ª Edição", uma iniciativa idealizada por Andreza Souza Tattoo e gerenciada por Fabrício.

O objetivo do projeto era organizar um grupo de participantes que, através de pagamentos mensais, concorriam a sorteios de tatuagens.

## 2. Status Atual

**Arquivado.**

A aplicação foi desmontada em [Data da alteração]. O objetivo foi preservar a arquitetura de backend, a estrutura de dados e toda a documentação para servirem de base para um novo projeto para o mesmo cliente, mas com um escopo diferente.

A interface do usuário foi removida, e a aplicação agora exibe apenas uma tela de status "Arquivado".

## 3. Ativos Preservados para Reutilização

A decisão de arquivar em vez de deletar foi estratégica. Os seguintes ativos foram mantidos intactos e estão prontos para serem adaptados para a próxima aplicação:

*   **`services/api.ts`**: **O ativo mais importante.** Este arquivo contém toda a lógica de comunicação com o backend (n8n), incluindo os URLs dos webhooks e as funções para buscar e enviar dados para o banco de dados Supabase.
*   **`types.ts`**: Contém todas as interfaces TypeScript (`Participant`, `Sorteio`, `Projeto`) que espelham a estrutura do banco de dados. Essencial para o desenvolvimento rápido da nova aplicação.
*   **Documentação (`docs/`)**: Toda a pasta de documentação foi preservada. Isso inclui:
    *   O script final de migração do Supabase (`final_supabase_migration_script.md`), que define o esquema do banco de dados.
    *   Logs de desenvolvimento, conversas e decisões arquiteturais.
    *   O `system_prompt.json` que define a personalidade e as regras deste agente de IA.

## 4. Funcionalidades da Versão Arquivada

A aplicação original era dividida nas seguintes seções:

*   **Dashboard:** Visão geral, roleta de sorteio e histórico.
*   **Lista de Participantes:** Gerenciamento de todos os membros.
*   **Detalhes do Participante:** Edição, exclusão e visualização de parcelas pagas.
*   **Adicionar Participante:** Formulário de cadastro.
*   **Registrar Pagamento:** Ferramenta para registrar pagamentos mensais ou integrais.

## 5. Estrutura de Dados

As estruturas de dados principais foram preservadas no arquivo `types.ts` e no esquema do Supabase:

*   **`Participant`**: Representa um participante.
*   **`Sorteio`**: Representa um sorteio realizado.
*   **`Projeto`**: Detalhes da edição do projeto.
*   **`Parcela`**: Registro de um pagamento mensal.

## 6. Tecnologias

*   **Frontend:** React com TypeScript
*   **Estilização:** Tailwind CSS
*   **Backend as a Service:** n8n (orquestração) e Supabase (banco de dados PostgreSQL).