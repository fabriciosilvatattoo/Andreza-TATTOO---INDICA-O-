# Diário de Bordo do Desenvolvimento

Este documento serve como um registro contínuo e mais detalhado do nosso progresso, decisões e próximos passos. Ele complementa os resumos de sessão, fornecendo um contexto narrativo para retomarmos o trabalho.

---

### **Sessão de 2025-11-01: A Grande Conexão**

**Marco Atingido:** Concluímos com sucesso a migração da arquitetura de dados da aplicação. O app agora está 100% conectado a um backend real no n8n, que por sua vez consome os dados do banco Supabase.

**O que foi feito:**
1.  **Leitura de Dados (`GET`):** Criamos um workflow mestre no n8n (`/Buscar-dados`) que busca dados das 4 tabelas (`projetos`, `participantes`, `parcelas`, `sorteios`), os processa em um nó de código e os devolve em um formato unificado e pronto para o consumo do frontend.
2.  **Escrita de Dados (`POST`):** Criamos e conectamos os três webhooks principais para ações de escrita:
    -   `POST /adicionar-participantes`
    -   `POST /registra-pagamento`
    -   `POST /realizar-sorteio`
3.  **Debugging:** Identificamos e resolvemos um erro `Failed to fetch` causado por uma combinação de método HTTP incorreto (`GET` vs `POST`) nos webhooks e políticas de CORS no servidor n8n.
4.  **Refatoração do Frontend:** O `n8nService.ts` foi completamente refatorado para usar os novos endpoints. O `App.tsx` agora recarrega os dados automaticamente após cada ação de escrita, garantindo que a UI esteja sempre sincronizada com o banco de dados.

**Status Atual:**
- A aplicação lê e exibe os dados reais do Supabase.
- A aplicação envia com sucesso os dados para o Supabase via n8n para criar novos participantes, pagamentos e sorteios.
- A arquitetura está robusta, com o frontend agindo como uma camada de visualização "burra" e o n8n como o cérebro da lógica de negócio.

**Próximos Passos Imediatos:**
1.  Implementar os workflows de `atualizar-participante` e `deletar-participante` no n8n.
2.  Conectar as funções `updateParticipant` e `deleteParticipant` no frontend aos seus respectivos webhooks.
3.  Testar o fluxo completo de CRUD (Create, Read, Update, Delete) de um participante.