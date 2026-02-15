# 🧠 Arquitetura de Memória e Contexto do Agente

Este documento descreve a estratégia para dar ao agente uma memória persistente entre as sessões, resolvendo o problema de "amnésia" a cada recarregamento.

---

## 1. O Conceito: Memória Rápida vs. Memória Lenta

Para entender a solução, vamos usar uma analogia com o cérebro humano:

-   🧠 **Memória Rápida (de Curto Prazo):** É como a memória RAM do agente. Existe apenas durante uma sessão de chat ativa. Guarda o fluxo da conversa atual, as variáveis, o último workflow que mencionamos, etc. **Se a página recarregar, essa memória é apagada.**

-   💾 **Memória Lenta (de Longo Prazo):** É o nosso "disco rígido". É onde salvamos as informações importantes da Memória Rápida antes que a sessão termine. Quando uma nova sessão começa, o agente primeiro consulta essa memória para lembrar "onde paramos?".

Esta implementação cria o sistema de **Memória Lenta**.

---

## 2. Arquitetura da Memória Lenta (Baseada em Arquivos)

A memória lenta é implementada através de uma estrutura de arquivos específica dentro da pasta `docs/04-memory/`.

### Estrutura de Arquivos

```
docs/
└── 04-memory/
    ├── architecture.md (este arquivo)
    ├── embeddings_guide.md
    └── sessions/
        ├── README.md
        ├── active_session.json
        └── session_20251012_153000.json
```

-   `sessions/`: Um diretório que armazena o histórico de todas as conversas passadas.
-   `active_session.json`: Um arquivo simples que contém o ID (nome do arquivo) da última sessão de conversa. Funciona como um "ponteiro" ou um "marcador de página".
-   `session_[timestamp].json`: Um arquivo JSON que representa uma única sessão de conversa.

### Conteúdo de um Arquivo de Sessão

```json
{
  "sessionId": "session_20251012_153000",
  "startTime": "2025-10-12T15:30:00.000Z",
  "lastUpdateTime": "2025-10-12T15:55:23.000Z",
  "summary": "O usuário pediu para adicionar um nó 'Code' ao workflow 'YGO' e estávamos discutindo a melhor posição para inseri-lo.",
  "messages": [
    { "role": "user", "text": "liste os workflows com YGO no nome" },
    { "role": "model", "text": "Encontrei 2 workflows..." },
    { "role": "user", "text": "adicione um nó de código no primeiro" }
  ]
}
```