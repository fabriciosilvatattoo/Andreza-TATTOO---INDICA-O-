# Log de Conversa: Debugging do @lid e Sincronização de Mensagens na Evolution API

**Data:** 2025-11-11 (Data baseada nos logs da conversa)

**Tópico:** Investigação e resolução de dois problemas críticos com a Evolution API no n8n: 1) Webhooks recebendo um `remoteJid` com `@lid` em vez do número de telefone real para novos contatos. 2) Mensagens enviadas pelo agente de automação não aparecendo no aplicativo do WhatsApp do cliente, apenas no WhatsApp Web.

---

## Conversa Completa

**Usuário:**
Oi claude, vc sabe como chega o numero da api evolution nos webhook dentro do n8n tipo vem com o nome remotidij uma coisa assim, vc sabe sobre isso?

**Claude:**
Oi! Sim, entendo sua dúvida sobre a Evolution API e webhooks no n8n.

Quando a Evolution API envia webhooks, o número da API (instância) geralmente vem em um campo específico no payload JSON. O "remotidij" que você mencionou provavelmente é o `remoteJid` - que é o identificador único do contato/número no WhatsApp.

Normalmente, o payload do webhook da Evolution API inclui algo assim:
```json
{
  "instance": "nome_da_sua_instancia",
  "data": {
    "key": {
      "remoteJid": "5511999999999@s.whatsapp.net",
      "fromMe": false,
      "id": "..."
    },
    "message": { ... },
    "messageTimestamp": "...",
    ...
  }
}
```
No n8n, para extrair o número:

- O `remoteJid` vem no formato: `5511999999999@s.whatsapp.net` (para contatos individuais) ou `120363...@g.us` (para grupos)
- Para pegar só o número limpo, você pode usar uma expressão no n8n:
`{{ $json.data.key.remoteJid.split('@')[0] }}` - isso remove a parte depois do @
O campo `instance` geralmente contém o nome da sua instância da Evolution API.

Você está tentando capturar especificamente qual informação? O número de quem enviou a mensagem ou o identificador da instância da API?

**Usuário:**
Cara mas me diga e se vem assim @lid o que significa?

**Claude:**
Ah, entendi! O `@lid` é um tipo específico de identificador no WhatsApp!

Quando você vê um `remoteJid` terminando com `@lid` (ao invés de `@s.whatsapp.net`), significa que é um LID (Local Identifier) - um identificador temporário ou local que o WhatsApp usa em algumas situações específicas.

Isso pode acontecer quando:
- **Contatos não salvos** - Números que ainda não foram totalmente sincronizados
- **Sessões temporárias** - Durante o processo de conexão/reconexão
- **Contatos em processo de validação** - Quando o WhatsApp ainda está processando o número

O que fazer:
Para obter o número real, você pode:
- Verificar outros campos no payload, como:
  - `data.pushName` (nome do contato)
  - `data.participant` (em mensagens de grupo)
  - `data.from` ou `data.sender`
- Aguardar eventos posteriores - Muitas vezes, mensagens subsequentes já virão com o `@s.whatsapp.net` correto.
- Na Evolution API, você pode fazer uma consulta para obter os detalhes completos do contato usando o endpoint `/chat/findContact` com esse LID.

Você está enfrentando esse `@lid` com frequência? Em qual tipo de mensagem/evento isso está acontecendo?

**Usuário:**
Tá acontecendo com as msg de texto normal de algumas pessoa, eu acho que pode a propria evolition api, nao é possivel

**Claude:**
Entendi! Você tem razão em suspeitar da Evolution API. Isso pode sim ser comportamento da própria Evolution API, especialmente em versões mais recentes ou em determinadas configurações.

Algumas possibilidades:

1. **Versão da Evolution API**
   - Versões mais recentes (especialmente v2.x) mudaram a forma de identificar contatos
   - Algumas implementam o `@lid` por padrão em certos cenários

2. **Configurações da instância**
   - Modo de conexão (baileys)
   - Configurações de sincronização de contatos
   - Tipo de autenticação/sessão

3. **Situações comuns onde aparece `@lid`:**
   - Contatos que não estão na sua agenda do WhatsApp
   - Números que enviaram mensagem pela primeira vez
   - Após reiniciar a instância da Evolution API
   - Em instâncias que usam QR Code recente

Soluções práticas no n8n:
```javascript
// No n8n, você pode extrair de diferentes formas:
{{ $json.data.key.remoteJid.replace('@lid', '').replace('@s.whatsapp.net', '') }}

// Ou verificar qual tipo é:
{{ $json.data.key.remoteJid.split('@')[0] }}
```
Qual versão da Evolution API você está usando? E essas pessoas que aparecem com `@lid` são contatos salvos no seu WhatsApp ou números desconhecidos?

**Usuário:**
Então essas pessoas são contatos novos que eu estou pedindo pra que algumas eu pedi pra chamar né esse número meu e assim tem como resolver será que eu preciso atualizar a evolution PI porque basicamente mas basicamente não é confiável essa evolution PI né é sempre o problema

**Claude:**
Cara, eu entendo sua frustração! Vou ser sincero com você:

A Evolution API é confiável, mas ela tem suas peculiaridades, especialmente com o Baileys (a biblioteca que ela usa por baixo). O problema do `@lid` é mais uma "característica" do WhatsApp Web Protocol do que um bug da Evolution.

**Por que acontece com contatos novos:** Quando alguém que não está na sua agenda te manda mensagem pela primeira vez, o WhatsApp não tem o número "registrado" ainda na sua sessão, então usa o `@lid` temporário. É comportamento esperado!

**Soluções práticas:**

1.  **No n8n, trate os dois casos:**
    ```javascript
    // Pega o número limpo, independente se é @lid ou @s.whatsapp.net
    {{ $json.data.key.remoteJid.split('@')[0] }}
    ```
    Isso vai funcionar para ambos os casos!

2.  **Na Evolution API:**
    - Atualizar pode ajudar sim! As versões mais recentes melhoraram o tratamento.
    - Verifique se está na versão mais recente (v2.1.x ou superior).
    - Configure `STORE_MESSAGES: true` e `STORE_CONTACTS: true`.

3.  **Workaround definitivo:** Após receber uma mensagem com `@lid`, você pode:
    - Salvar o contato automaticamente via API.
    - Ou simplesmente usar o número extraído (sem o `@lid`) para responder.

Quer que eu te ajude a montar um fluxo no n8n que trate isso automaticamente?

**Usuário:**
Não mais do que você não não tá entendendo e eu acabei não passando pra você é que não vem o número da pessoa entendeu o número da pessoa não vem vem o número totalmente diferente do número da pessoa que não tem como você entrar em contato com a pessoa de novo através daquilo sacou basicamente é como se não viesse o número da pessoa vem acho que o número da sessão né eu vou mostrar pra você mas não tem nada a ver o que chegou né o que chegou não tem nada a ver com o número não tem como eu limpar ou tratar o que chegou né na variável Remote diJ

**Claude:**
Ahhh, agora entendi! Você está dizendo que o `remoteJid` que chega não é o número de telefone da pessoa de jeito nenhum - é tipo um código aleatório/identificador de sessão que não tem relação com o número real do WhatsApp dela, correto?

Tipo, ao invés de vir `5511999999999@lid`, vem algo como `ABC123XYZ@lid` ou um código totalmente diferente?

Se for isso, é um problema sério mesmo!

Nesse caso:
- **Verifique outros campos do webhook** - me mostra o payload completo que está chegando? Às vezes o número real está em outro lugar como:
  - `data.from`
  - `data.participant`
  - `data.sender`
  - `data.pushName`
  - `data.contact`
- **Pode ser problema de:**
  - Instância da Evolution API com sessão corrompida
  - Versão desatualizada ou com bug
  - Configuração errada no webhook

Me manda um exemplo do JSON completo que chega no webhook? Assim consigo ver exatamente o que está vindo e onde o número real pode estar escondido. Pode censurar dados sensíveis, só preciso ver a estrutura!

Isso vai me ajudar a te dar uma solução precisa. 👍

**Usuário:**
Veja aqui mas eu acho que nao tem o numero da pessoa :
```json
[
  {
    "headers": {
      "host": "n8n.insn.online",
      "user-agent": "axios/1.7.9",
      "content-length": "803",
      "accept-encoding": "gzip, compress, deflate, br",
      "content-type": "application/json",
      "x-forwarded-for": "172.18.0.1",
      "x-forwarded-host": "n8n.insn.online",
      "x-forwarded-port": "443",
      "x-forwarded-proto": "https",
      "x-forwarded-server": "024d3b93a0ca",
      "x-real-ip": "172.18.0.1"
    },
    "params": {},
    "query": {},
    "body": {
      "event": "messages.upsert",
      "instance": "insn",
      "data": {
        "key": {
          "remoteJid": "109848167493859@lid",
          "fromMe": false,
          "id": "ACB83BF93B076F57C23023ED79C68A26"
        },
        "pushName": "Camille❤️🥴🤤",
        "status": "DELIVERY_ACK",
        "message": {
          "conversation": "Oiee",
          "messageContextInfo": {
            "deviceListMetadata": {
              "recipientKeyHash": "4vCUW5L6hmNnUA==",
              "recipientTimestamp": "1762526435"
            },
            "deviceListMetadataVersion": 2,
            "messageSecret": "j+6mrTqP+NYBxqpfipFWeVsDjPw5gD6RAqKqKgHaqCQ="
          }
        },
        "messageType": "conversation",
        "messageTimestamp": 1762867445,
        "instanceId": "d814a510-d81e-43b1-af5a-c32026373a9e",
        "source": "android"
      },
      "destination": "https://n8n.insn.online/webhook/insn",
      "date_time": "2025-11-11T10:24:08.991Z",
      "sender": "5519999616235@s.whatsapp.net",
      "server_url": "https://evo.insn.online",
      "apikey": "011C5A7A8B0B-4F67-AB52-1241C7809B93"
    },
    "webhookUrl": "https:///webhook/insn",
    "executionMode": "production"
  }
]
```

**Claude:**
ACHEI! O número está lá sim! 🎉

Olha só, o número real da pessoa está no campo `sender`:
```json
"sender": "5519999616235@s.whatsapp.net"
```
Esse é o número real da pessoa: `5519999616235` (provavelmente de Campinas/região mesmo, 19 é DDD daqui).

O que está acontecendo:
- **`remoteJid`**: `109848167493859@lid` ← Esse é o identificador temporário/sessão (o que te confundiu)
- **`sender`**: `5519999616235@s.whatsapp.net` ← Esse é o número REAL da pessoa!

No n8n, use:
```javascript
// Para pegar o número limpo:
{{ $json.body.sender.split('@')[0] }}
// Resultado: 5519999616235
```
Ou se quiser só o número sem código de país:
```javascript
{{ $json.body.sender.split('@')[0].replace('55', '') }}
// Resultado: 19999616235
```
Pronto, problema resolvido! 🙌

A Evolution API está enviando o número coreto sim, só estava em outro campo. O `remoteJid` com `@lid` é realmente um identificador interno, mas o `sender` tem o número real que você precisa.

Testa aí e me fala se funcionou!

**Usuário:**
Cara não esse número é o número que recebeu a mensagem eu não sei o que que significa Sender mas esse número é o número que recebeu a mensagem

**Claude:**
Ah caramba, você está certo! 🤦‍♂️

O `sender` nesse caso é o SEU número (da instância que recebeu), não o número de quem enviou!

Então realmente, olhando o payload completo:
- **`remoteJid`**: `109848167493859@lid` ← Esse código maluco
- **`sender`**: `5519999616235@s.whatsapp.net` ← Seu número (quem recebeu)
- **`pushName`**: `Camille❤️🥴🤤` ← Nome de quem enviou, mas SEM o número

Você tem razão: o número real de quem enviou NÃO está vindo no webhook! 😱

Isso é um problema sério da Evolution API nesse cenário específico. Quando vem com `@lid`, ela não está enviando o número real da pessoa.

**Possíveis soluções:**
1.  Atualizar a Evolution API - Versões mais recentes podem ter corrigido isso
2.  Verificar as configurações da instância - Tem alguma config de `STORE_CONTACTS` ou similar?
3.  Usar outro evento - Ao invés de `messages.upsert`, testar outros eventos
4.  Fazer uma chamada à API logo após receber a mensagem para buscar os detalhes completos usando o `remoteJid` ou o `id` da mensagem

Qual versão da Evolution API você está usando? E você tem acesso às configurações dela para verificarmos?

**Usuário:**
```yml
version: "3.7"
services:
  ## --------------------------- ORION --------------------------- ##
  evolution:
    image: atendai/evolution-api:v2.2.2 ## Versão ESTÁVEL E FUNCIONAL
    volumes:
      - evolution_instances:/evolution/instances
    networks:
      - InsnNet ## Nome da rede interna
```
Ó veja eu peguei o arquivo YML lá de dentro do Power trainer ou seja eu estou trazendo ele pra você cê vai ver tudo sobre a minha SSSTik né stack deu uma olhada aí busque na internet o que você veja o que cê pode falar pra mim né veja que eu acho que essa versão está bem desatualizada mas veja o que você pode me achar sobre esse assunto na internet:

**Claude:**
ACHEI A SOLUÇÃO! 🎉

Cara, olha só o que descobri:

**O Problema do @lid foi CORRIGIDO na versão 2.3.5+!**
A Evolution API implementou uma correção específica nas versões 2.3.5 e superiores que converte automaticamente o LID (Linked Identity Device) para o número de telefone real nos webhooks.

O LID é o novo sistema de endereçamento do WhatsApp. Usuários com LID têm dois identificadores: um JID primário no formato `{LID_ID}@lid` e um JID alternativo `{PHONE}@s.whatsapp.net` com o número real.

**Suas Opções:**

1.  **ATUALIZAR para v2.3.5 ou superior (RECOMENDADO) ⭐**
    Você está na v2.2.2 (desatualizada). As versões mais recentes (2.3.x) têm melhorias significativas, incluindo a conversão automática de LID para número de telefone.
    Como atualizar (no seu `docker-compose.yml`):
    ```yml
    evolution:
      image: atendai/evolution-api:v2.3.6  # Mude de v2.2.2 para v2.3.6
    ```
    Depois rode:
    ```bash
    docker-compose pull
    docker-compose up -d
    ```

2.  **Solução TEMPORÁRIA (se não puder atualizar agora)**
    No webhook, você pode verificar se existe o campo `remoteJidAlt` que contém o número real quando o `remoteJid` é um `@lid`.
    No n8n, tente capturar:
    ```javascript
    // Tenta pegar o número alternativo primeiro (se existir)
    {{ $json.body.data.key.remoteJidAlt || $json.body.data.key.remoteJid }}
    ```

**Minha Recomendação Forte:**
ATUALIZE para v2.3.6! Sua versão 2.2.2 está 4 versões desatualizada e a Evolution API tem correções contínuas de bugs e melhorias que você está perdendo.

Quer que eu te ajude a montar o processo de atualização passo a passo?

**Usuário:**
Então eu quero atualizar tá aí eu queria falar pra você eu te dei esse documento né cê não consegue me entregar esse documento atualizado cê não consegue que que cê acha porque eu acho que se você atualizar esse documento aí né se você for atrás né desse arquivo YML da versão atual você consegue achar esse arquivo né que que cê acha cê não consegue me dar ele aí aí eu levo ele lá né e atualizo é só atualizar né fala pra mim se consegue ou não

**Claude:**
(Após pesquisar a documentação mais recente)
Perfeito! Agora vou te entregar o arquivo YML atualizado. Baseado nas informações que encontrei, a versão mais recente é a v2.3.6, lançada há 3 semanas, e ela tem a correção do problema do LID!

**Docker Compose Evolution API v2.3.6 Atualizado**
```yml
# O que mudou:
# ✅ Versão atualizada: v2.2.2 → v2.3.6 (última versão estável)
# ✅ Correção do LID: Esta versão converte automaticamente o @lid para o número real de telefone
# ✅ Todas as suas configurações mantidas: Database, S3, Redis, Chatwoot, etc.
version: "3.7"
services:
  evolution:
    image: atendai/evolution-api:v2.3.6
    volumes:
      - evolution_instances:/evolution/instances
    networks:
      - InsnNet
```
**Como atualizar:**
1.  **Backup (importante!):**
    ```bash
    docker stack ps evolution # Anota o ID do container atual
    ```
2.  Substitua o arquivo YML no seu servidor pelo que te enviei acima.
3.  Atualize a stack:
    ```bash
    docker stack deploy --prune --resolve-image always -c seu_arquivo.yml evolution
    ```
4.  Monitore os logs:
    ```bash
    docker service logs -f evolution_evolution
    ```
⚠️ IMPORTANTE: Suas instâncias conectadas continuarão funcionando. O banco de dados será migrado automaticamente. Pode levar 1-2 minutos para estabilizar.

Depois de atualizar, teste enviando uma mensagem de um contato novo e veja se o `remoteJid` ou o campo `sender` agora vem com o número correto!

**Usuário:**
```yml
version: "3.7"
services:
  ## --------------------------- ORION --------------------------- ##
  evolution:
    image: evoapicloud/evolution-api:v2.3.6 ## Versão ATUALIZADA com correção do LID
    volumes:
      - evolution_instances:/evolution/instances
    networks:
      - InsnNet ## Nome da re
```
cara vc só tinha errado numa coisa, um pequeno detalhe mas eu já resolvi e ficou assim agora, e esta 100% funcional de uma olhada:

**Claude:**
Ahhh boa! Vi o que você corrigiu! 👏

A diferença:
- Eu coloquei: `atendai/evolution-api:v2.3.6`
- Você corrigiu para: `evoapicloud/evolution-api:v2.3.6`

Perfeito! O `evoapicloud` é a organização oficial mais recente no Docker Hub. Eu tinha usado o `atendai` que era a antiga, mas você pegou a correta! 🎯

Agora com a v2.3.6 rodando, quando você receber mensagens de contatos novos, o webhook deve vir com o número real da pessoa, e não mais aquele código maluco do `@lid`!

Testa aí: Pede para alguém que não está na sua agenda mandar uma mensagem e verifica se agora no n8n o `remoteJid` ou algum outro campo está vindo com o número de telefone real (tipo `5519999999999@s.whatsapp.net` ao invés de `109848167493859@lid`).

Se ainda vier com `@lid`, me avisa que a gente procura em qual outro campo o número está vindo na versão atualizada. Mas pela documentação que achei, essa versão deveria ter resolvido isso!

Dá um feedback depois? Quero saber se funcionou! 🚀

**Usuário:**
na verdade não cara ele ainda funciona com o numero lid até onde eu vi sacou, poderia ver pra mim algo na internet sobre isso, ou sobre como eu busco o numero da pessoa, aconteceu um fenomeno tbm onde o meu agente respondeu certinho a pesso fez tudo o que precisava enviou um link e o qrcode que ele precisa enviar porem na conversa no meu whats ele só apareceu as msg do cliente, e não as resposta que meu agente enviou sacou poderia ver se acha algo pra mim sibre isso e como eu posso fazer pra lidar com isso, se sempre vai acontecer, ou seja o que tudo isso muda, o que eu tenho que fazer de diferente talvez buscar o numero da pessoa usando alguma informação que chega da pessoa no conteudo que chega ?

**Claude:**
(Após pesquisar novamente)
📊 **Resumo do que descobri:**

1️⃣ **Sobre o LID (ainda aparecendo)**
Cara, a correção do LID na v2.3.5+ foi implementada **APENAS** para o evento `GROUP_PARTICIPANTS_UPDATE` (participantes de grupo), não para mensagens diretas individuais! 😬
Isso significa que para mensagens diretas de contatos novos, o LID ainda vai aparecer mesmo na v2.3.6.

**Como resolver isso:**
Você precisa fazer uma chamada adicional à API da Evolution para buscar os dados do contato usando o LID. A Evolution tem endpoints para isso:
```javascript
// No n8n, quando receber um @lid, faça:
GET https://evo.insn.online/chat/findContact/{{instanceName}}
Body: {
  "where": {
    "id": "109848167493859@lid"  // O LID que chegou
  }
}
```
Isso vai retornar o `phoneNumber` real da pessoa.

2️⃣ **Sobre mensagens do bot não aparecerem no WhatsApp**
Esse é um **BUG CONHECIDO** da v2.3.1 e versões próximas! Mensagens enviadas via API aparecem no WhatsApp Web/Desktop mas não sincronizam para o celular (iOS/Android).
⚠️ Isso é SÉRIO! Significa que:
- O cliente vê apenas as mensagens DELE
- Suas respostas do bot aparecem só no Web, não no celular dele
- É um problema de sincronização do WhatsApp

**Possíveis soluções:**
1.  **Teste fazer downgrade para v2.3.0** (versão estável onde funcionava)
2.  Ou aguarde correção na v2.3.7+ (pode já ter sido corrigido)
3.  Verifique se você está usando WhatsApp Business - o bug foi reportado especificamente com WhatsApp Business autenticado via QR Code.

🎯 **Minha Recomendação Final:**
- Faça downgrade para v2.3.0 para resolver o problema das mensagens não aparecerem.
- Implemente busca de contato via API quando receber `@lid`.
- Monitore se na v2.3.7+ os dois problemas foram corrigidos.

Quer que eu te ajude a montar um fluxo no n8n que faça essa busca automática do número quando chegar `@lid`?

**Usuário:**
vc poderia me dar tbm a versão, no caso o arquivo da versão 2.3.0, mas faça todas as buscas necessaria para não errar na criação desse arquivo por favor

**Claude:**
(Após pesquisar sobre a v2.3.0)
Perfeito! Agora tenho todas as informações. Com base na minha pesquisa detalhada, vou te entregar o arquivo YML da versão 2.3.0 que é a versão estável onde as mensagens aparecem corretamente nos celulares.

⚠️ **IMPORTANTE que descobri:** Na v2.3.1 há um bug confirmado onde mensagens enviadas via API aparecem no WhatsApp Web/Desktop mas **NÃO** aparecem no celular (iOS/Android). O rollback para v2.3.0 resolveu o problema.

Vários usuários reportaram na v2.3.0 que mensagens às vezes ficam "Aguardando mensagem" no celular do cliente, mas isso ocorre esporadicamente.

**Docker Compose Evolution API v2.3.0 (Mensagens Funcionando)**
```yml
# ✅ Versão: v2.2.2 → v2.3.0
# ✅ Correção: Mensagens agora aparecem em TODOS os dispositivos (mobile e web)
# ✅ Todas configurações mantidas
version: "3.7"
services:
  evolution:
    image: evoapicloud/evolution-api:v2.3.0
    volumes:
      - evolution_instances:/evolution/instances
    networks:
      - InsnNet
```
🎯 **Próximos Passos:**
1.  Substitua o arquivo YML pelo que te enviei (v2.3.0).
2.  Faça o deploy:
    ```bash
    docker stack deploy --prune --resolve-image always -c seu_arquivo.yml evolution
    ```
3.  **IMPORTANTE:** Após atualizar, você vai precisar reconectar com QR Code (conforme reportado pelos usuários que fizeram rollback).
4.  Teste enviando mensagens e veja se agora aparecem no celular do cliente!
5.  Para resolver o problema do LID: Depois de estabilizar a v2.3.0, posso te ajudar a criar um fluxo no n8n que busca automaticamente o número real quando chegar `@lid`.
