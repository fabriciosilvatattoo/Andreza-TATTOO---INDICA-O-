# Log de Conversa: Finalização do Agente, Prompt e Criação da Tabela Supabase

**Data:** 2024-07-31 (Data aproximada da conversa)

**Tópico:** Esta conversa com o Claude abrange a configuração final do Agente de IA do Workflow 1, incluindo a criação de um prompt de sistema detalhado para garantir que ele colete os dados corretamente e use sua ferramenta. A conversa também inclui a criação da query SQL para a tabela `indicadores` no Supabase e a definição da lógica completa para o Workflow 2.

---

## Conversa Completa

**Usuário:**
oi claude veja isso aqui, vou pedir pra vc atualizar pra mim o prompt desse agente pra ele de fato usar a ferramenta que ele tem e com isso vc pode atualizar tudo o nome de ferramenta descrção,  descrição dos campos me diga se entendeu por favor, ainda tem coisa que vou fazer mas de uma olhada no agente  e na ferramenta dele pra vc ver o que estou tentando fazer, o numero do indicador deve ir para o workflow 2 para que seja enviado o link e o qr code para o link de quem mandou msg, e não esse fixo só me diga se entendeu e a gente vai atualizando cada uma das partes que precisa ser atualizada

**Claude:**
Entendi perfeitamente! 👍

Deixa eu resumir o que você está fazendo:

Workflow 1 (Agente de IA):

Recebe mensagens do WhatsApp
O agente conversa com a pessoa para coletar:
Nome completo do indicador
4 últimos dígitos do documento (RG/CPF)
Tem uma ferramenta HTTP Request que deveria chamar o webhook do Workflow 2
Workflow 2 (Gerador de QR Code):

Recebe os dados via webhook
Gera um QR Code personalizado com o nome do indicador
Envia o QR Code para o WhatsApp
Problemas identificados:

A ferramenta HTTP Request está mal configurada - tem placeholders genéricos nos campos e não está sendo acionada corretamente pelo agente
O número fixo no Workflow 2 (5519998748041) precisa ser dinâmico - vindo do Workflow 1
O prompt do agente precisa instruir claramente quando e como usar a ferramenta
Os nomes/descrições dos parâmetros da ferramenta precisam ser claros para o agente entender
Você quer que eu te ajude a:

Atualizar o prompt do agente para ele usar a ferramenta corretamente
Renomear e descrever melhor a ferramenta HTTP Request
Ajustar os parâmetros que vão do Workflow 1 para o Workflow 2
É isso? Vamos começar por qual parte? 🚀

**Usuário:**
certo me de a ferramenta configurada corretamente, veja que as descriçoes dos campos estão no lugar certo, a ferramenta em si não tem uma descrição mas os campos que ele deve preencher já tem uma descrição no lugar certo vc só atualziar pra melhorar se quiser e tbm claro da um nome para a ferramenta, por hora me de  o prompt do agente atualziado e garanta que sim eole vai usar a ferramenta quando tiver tudo e vai ser gentil bem humano

**Claude:**
Perfeito! Vou te dar o prompt do agente atualizado e a ferramenta configurada corretamente:

🤖 PROMPT DO AGENTE (System Message)
Você é Luna, assistente virtual do programa de indicações 'TattooFlow'. Seu papel é conversar de forma natural e amigável para cadastrar novos indicadores.

## SEU FLUXO DE CONVERSA:

1. **Boas-vindas calorosas**: Se apresente de forma simpática e confirme se a pessoa quer se cadastrar no programa de indicações.

2. **Coletar o NOME COMPLETO**: Peça o nome completo da pessoa de forma natural. Exemplo: "Qual seu nome completo?"

3. **Coletar os 4 ÚLTIMOS DÍGITOS do documento**: Peça os 4 últimos dígitos do RG ou CPF, explicando que é para segurança. Exemplo: "Para finalizar, preciso dos 4 últimos dígitos do seu RG ou CPF. É só para garantir a segurança do seu cadastro 😊"

4. **Finalizar o cadastro**: Quando tiver NOME COMPLETO e os 4 DÍGITOS, use a ferramenta "Cadastrar_Novo_Indicador" imediatamente para completar o cadastro.

## REGRAS IMPORTANTES:

✅ Sempre responda no idioma do cliente
✅ Seja calorosa, amigável e use emojis com moderação
✅ Confirme os dados antes de cadastrar: "Deixa eu confirmar: seu nome é [NOME] e os últimos dígitos são [XXXX], correto?"
✅ Após usar a ferramenta, agradeça e informe que o QR Code personalizado será enviado em instantes
✅ Se a pessoa fugir do assunto, gentilmente retorne ao cadastro
✅ Nunca invente dados - sempre peça ao usuário

## VOCÊ DEVE USAR A FERRAMENTA QUANDO:
- Tiver coletado o nome completo E os 4 dígitos do documento
- O usuário confirmar que os dados estão corretos

Seja natural, humana e eficiente! 🌟
🔧 CONFIGURAÇÃO DA FERRAMENTA HTTP REQUEST
Nome da ferramenta: Cadastrar_Novo_Indicador

Descrição da ferramenta (campo description - você precisa adicionar):
Use esta ferramenta para finalizar o cadastro do novo indicador no sistema. Chame esta ferramenta SOMENTE quando tiver coletado o nome completo e os 4 últimos dígitos do documento da pessoa. O sistema irá gerar e enviar automaticamente o QR Code personalizado para o indicador.
Campos da ferramenta (bodyParameters):
Campo 1 - Nome_Indicador:

Descrição atual: "Aqui você coloca o nome do novo indicador."
Descrição melhorada: Nome completo do indicador que está se cadastrando. Exemplo: João Silva Santos
Campo 2 - Numero:

Já está correto: ={{ $('Edit Fields3').item.json.numero }}
Este pega o número do WhatsApp automaticamente
Campo 3 - Digitos_Documento:

Descrição atual: "Aqui você coloca os 4 digitos do documento."
Descrição melhorada: Os 4 últimos dígitos do RG ou CPF do indicador. Apenas números, sem traços ou pontos. Exemplo: 1234
📋 RESUMO DAS MUDANÇAS:
✅ Prompt deixa claro QUANDO usar a ferramenta
✅ Agente confirma dados antes de cadastrar
✅ Tom mais humano e caloroso
✅ Ferramenta tem descrição clara
✅ Campos têm exemplos práticos
Quer que eu ajuste mais alguma coisa ou já posso te passar a configuração do Workflow 2 também? 🚀

**Usuário:**
Certo aqui esta tudo finalizado eu vou rodar tudo e ver se ele envia o conteudo para o workflow 2 calma ai

**Claude:**
Perfeito! Fica tranquilo, vou aguardar aqui.

Roda aí e me avisa:

✅ Se o agente usou a ferramenta corretamente
✅ Se os dados chegaram no Workflow 2
✅ Se o QR Code foi gerado e enviado
Qualquer coisa que não funcionar, me manda o erro ou o comportamento estranho que a gente ajusta! 🚀

Estou no aguardo! 👀

**Usuário:**
se liga nisso aqui claude: Assunto: Continuação do Workflow 2 (Gerador de QR Code) - Sistema de Indicação TattooFlow
Claude, beleza?
Seguinte, estamos prontos para avançar na construção do nosso Workflow 2: Gerador de QR Code e Registro de Indicador.
Recapitulando onde paramos:
Já definimos o Workflow 1 (Agente de Cadastro). A função dele é ser um agente de WhatsApp que usa um LLM para coletar 3 informações essenciais do futuro indicador:
1. Nome Completo
2. Número de Telefone
3. 4 últimos dígitos do Documento (para evitar fraudes)
O Workflow 1, ao finalizar, vai fazer um POST para o webhook do nosso Workflow 2, enviando exatamente esses 3 dados. O JSON que te mandei é um exemplo real da chamada que o Workflow 2 vai receber.
Nossa missão AGORA (dentro do Workflow 2):
A partir dos dados recebidos (Nome_Indicador, Numero, Digitos_Documento), precisamos construir a seguinte lógica no n8n:
1. Gerar Código Único: Criar um código de indicador único e rastreável (ex: IND-F8B3).
2. Salvar no Supabase: Inserir os dados do novo indicador (Nome, Telefone, Documento e o novo Código Único) na nossa tabela indicadores.
3. Montar Link Personalizado: Construir a URL do WhatsApp para o indicador (ex: https://wa.me/...?text=Oi, vim pela indicação de [Nome] (código: [Código Único])).
4. Gerar Imagem do QR Code: Usar o nó HTTP Request com a API da api.qrserver.com para transformar o link personalizado em uma imagem de QR Code.
5. Enviar para o Indicador: Enviar a imagem do QR Code gerado para o número de WhatsApp do novo indicador, junto com uma mensagem de boas-vindas e o link em formato de texto.
O objetivo é que, ao final da execução, o novo indicador tenha em mãos seu link e QR Code personalizados para começar a indicar.
Vamos montar essa sequência de nós. Fechou?

**Claude:**
Fechou! 🚀 Entendi perfeitamente o fluxo completo. Vamos construir o Workflow 2 do zero com a lógica completa.

📋 ESTRUTURA DO WORKFLOW 2 - Gerador de QR Code e Registro
Vou te passar nó por nó na sequência correta:

NÓ 1: Webhook (Receber dados do Workflow 1)
✅ Já existe no seu workflow

Path: gerar-qr
Vai receber: Nome_Indicador, Numero, Digitos_Documento
NÓ 2: Gerar Código Único do Indicador
Tipo: Code node (JavaScript)

```javascript
// Gera código único no formato IND-XXXX (4 caracteres alfanuméricos)
const gerarCodigo = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = 'IND-';
  for (let i = 0; i < 4; i++) {
    codigo += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return codigo;
};

// Pega os dados do webhook
const nomeIndicador = $input.item.json.Nome_Indicador;
const numero = $input.item.json.Numero;
const digitosDocumento = $input.item.json.Digitos_Documento;

// Gera o código único
const codigoUnico = gerarCodigo();

// Retorna tudo organizado
return {
  nome_indicador: nomeIndicador,
  numero: numero,
  digitos_documento: digitosDocumento,
  codigo_unico: codigoUnico
};
```

---

### **NÓ 3: Salvar no Supabase**
**Tipo:** `Supabase` node

**Configuração:**
- **Operation:** Insert
- **Table:** `indicadores`
- **Columns:**
  - `nome`: `={{ $json.nome_indicador }}`
  - `telefone`: `={{ $json.numero }}`
  - `digitos_documento`: `={{ $json.digitos_documento }}`
  - `codigo_indicador`: `={{ $json.codigo_unico }}`
  - `data_cadastro`: `={{ $now.toISO() }}` (opcional, se tiver essa coluna)

---

### **NÓ 4: Montar Link Personalizado do WhatsApp**
**Tipo:** `Set` node (Edit Fields)

**Assignments:**
- **Nome:** `link_whatsapp`
- **Tipo:** String
- **Valor:** 
`=https://wa.me/5519998748041?text=Oi%2C%20vim%20pela%20indica%C3%A7%C3%A3o%20de%20"{{ $json.nome_indicador.replace(/ /g, '%20') }}",%20c%C3%B3digo:%20{{ $json.codigo_unico }}`

- **Nome:** `mensagem_boas_vindas`
- **Tipo:** String
- **Valor:**
`=🎉 *Bem-vindo(a) ao TattooFlow, {{ $json.nome_indicador }}!*

Você foi cadastrado com sucesso no nosso programa de indicações! 

📱 *Seu código único:* {{ $json.codigo_unico }}

Compartilhe o QR Code abaixo ou o link para começar a indicar e ganhar recompensas:

🔗 {{ $json.link_whatsapp }}

Obrigado por fazer parte do TattooFlow! 💜`
NÓ 5: Gerar QR Code
Tipo: HTTP Request

Configuração:

Method: GET
URL: https://api.qrserver.com/v1/create-qr-code/
Query Parameters:
size: 500x500
data: ={{ $json.link_whatsapp }}
format: png
Options > Response:
Response Format: File
NÓ 6: Converter QR Code para Base64
Tipo: Extract from File

Configuração:

Operation: Binary to Property
Binary Property: data (padrão)
Output Property Name: data (padrão)
NÓ 7: Enviar QR Code para o Indicador
Tipo: HTTP Request

Configuração:

Method: POST
URL: https://evo.insn.online/message/sendMedia/insn
Headers:
apikey: 011C5A7A8B0B-4F67-AB52-1241C7809B93
Body Parameters:
number: ={{ $('Montar Link Personalizado do WhatsApp').item.json.numero }}
mediatype: image
mimetype: image/png
media: ={{ $json.data }}
fileName: qrcode-{{ $('Montar Link Personalizado do WhatsApp').item.json.codigo_unico }}.png
caption: ={{ $('Montar Link Personalizado do WhatsApp').item.json.mensagem_boas_vindas }}
NÓ 8: Responder ao Webhook
Tipo: Respond to Webhook

Configuração:

Response Body:
```json
{
  "success": true,
  "mensagem": "Indicador cadastrado com sucesso!",
  "codigo": "={{ $('Gerar Código Único do Indicador').item.json.codigo_unico }}"
}
```

---

## 🔗 **ORDEM DE CONEXÃO DOS NÓS:**
`Webhook 
  → Gerar Código Único 
    → Salvar no Supabase 
      → Montar Link Personalizado 
        → Gerar QR Code 
          → Converter para Base64 
            → Enviar QR Code 
              → Responder ao Webhook`
✅ CHECKLIST FINAL:
 Webhook recebe os 3 dados do Workflow 1
 Código único é gerado (IND-XXXX)
 Dados salvos no Supabase
 Link personalizado criado com nome e código
 QR Code gerado com o link
 QR Code enviado para o número do indicador
 Mensagem de boas-vindas enviada junto
Quer que eu te passe o JSON completo do workflow ou prefere ir montando nó por nó? 🎯

**Usuário:**
vamos lá devagar eu deixei assim veja, vamos por passos:

**Claude:**
Perfeito! Vejo que você já está avançando bem! 👏

Analisando o que você já tem:

✅ O QUE JÁ ESTÁ FUNCIONANDO:
Webhook - Recebendo os dados corretamente (vejo no pinData que chegou: Fabricio Da silva, número, e dígitos 4578)
Code Node - Gerando o código único (IND-XXXX)
Set Node - Organizando os dados
QR Code Generator - Usando o nome e código único na URL
Extract from File - Convertendo para base64
Enviar WhatsApp - Estrutura pronta
Respond to Webhook - Finalizando
🔧 PROBLEMAS QUE PRECISO CORRIGIR:
1. No nó "Informações que vem do agente vão aqui" (Set Node):
Você está tentando pegar codigo_unico do JSON atual ($json.codigo_unico), mas ele vem do nó anterior (Code). Deveria ser:

`// CORREÇÃO no campo "codigo_unico":
={{ $('Code').item.json.codigo_unico }}`
2. No nó "Envia QR Code WhatsApp1":
O número está fixo (5519998748041). Precisa ser dinâmico:

`// CORREÇÃO no campo "number":
={{ $('Informações que vem do agente vão aqui').item.json.Numero }}`
⚠️ ATENÇÃO: O número que vem do webhook está no formato 5519998364108@s.whatsapp.net. Você precisa limpar isso antes de enviar!

3. Falta o nó do Supabase!
Você não está salvando os dados no banco. Onde quer inserir esse nó?

🎯 PRÓXIMOS PASSOS - ME RESPONDA:
Quer que eu te passe o Set Node corrigido?
Quer que eu adicione um nó para limpar o número do WhatsApp (remover o @s.whatsapp.net)?
Onde quer inserir o nó do Supabase? (Entre Code e Set? Ou depois do Set?)
Quer melhorar a mensagem de caption que vai junto com o QR Code?
Me diz qual passo quer fazer primeiro! 🚀

**Usuário:**
calma cara o set funciona assim e eu preciso antes de me preocupar com o envio eu agora devo pegar essas informações e adicionar no banco sacou?  ou não?

**Claude:**
Ah sim, EXATAMENTE! 🎯

Você está absolutamente certo!

Antes de enviar qualquer coisa, você precisa:

✅ Receber os dados (Webhook) - FEITO
✅ Gerar o código único (Code) - FEITO
✅ Organizar os dados (Set) - FEITO
❌ SALVAR NO SUPABASE - FALTA FAZER ISSO AGORA
Depois disso sim, gerar QR Code e enviar
🎯 AGORA SIM: Nó do Supabase
Posição: Entre o nó "Informações que vem do agente vão aqui" e o "QR Code Generator"

Tipo: Supabase node

Configuração:

Operation: Insert
Table: indicadores (ou o nome da sua tabela)
Columns to Send:
nome: ={{ $json.Nome_Indicador }}
telefone: ={{ $json.Numero }}
digitos_documento: ={{ $json.Digitos_Documento }}
codigo_indicador: ={{ $json.codigo_unico }}
Conexão:

Informações que vem do agente 
    → SUPABASE (novo)
        → QR Code Generator
Qual o nome exato da sua tabela no Supabase e quais os campos? Me passa isso que eu te dou a config certinha! 📊

**Usuário:**
veja isso aqui claude preciso que me ajude a continuar sacou isso aqui eu tinha começado com vc e nesse caso aqui preciso criar a tabela de indicadores sacou, me diga se entendeu e me de a querie para eu criar essa tabela por favor

**Claude:**
Entendi PERFEITAMENTE! 🎯

Você está no Workflow 2 (Gerador de QR Code) e precisa SALVAR OS DADOS DO INDICADOR NO SUPABASE antes de gerar e enviar o QR Code.

Olhando seu fluxo atual:

Webhook → Code (gera código único) → Set (organiza dados) → [FALTA O SUPABASE AQUI] → QR Code Generator → ...
📊 QUERY SQL PARA CRIAR A TABELA indicadores
```sql
CREATE TABLE indicadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL UNIQUE,
  digitos_documento TEXT NOT NULL,
  codigo_indicador TEXT NOT NULL UNIQUE,
  link_personalizado TEXT,
  data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_indicacoes_enviadas INTEGER DEFAULT 0,
  total_indicacoes_fechadas INTEGER DEFAULT 0,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'bloqueado'))
);

-- Índices para busca rápida
CREATE INDEX idx_codigo_indicador ON indicadores(codigo_indicador);
CREATE INDEX idx_telefone ON indicadores(telefone);
CREATE INDEX idx_data_cadastro ON indicadores(data_cadastro DESC);
```

---

## 🔧 **CONFIGURAÇÃO DO NÓ SUPABASE NO N8N**

**Posição:** Entre `"Informações que vem do agente vão aqui"` e `"QR Code Generator"`

**Tipo:** `Supabase` node

**Configuração:**
- **Resource:** `Row`
- **Operation:** `Create`
- **Table:** `indicadores`
- **Columns:**
  - `nome`: `={{ $json.Nome_Indicador }}`
  - `telefone`: `={{ $json.Numero }}`
  - `digitos_documento`: `={{ $json.Digitos_Documento }}`
  - `codigo_indicador`: `={{ $json.codigo_unico }}`
  - `link_personalizado`: `=https://wa.me/5519998748041?text=Oi%2C%20vim%20pela%20indica%C3%A7%C3%A3o%20de%20{{ $json.Nome_Indicador.replace(/ /g, '%20') }}%20(c%C3%B3digo:%20{{ $json.codigo_unico }})`

---

## 🔗 **NOVA ORDEM DE CONEXÃO:**
`Webhook 
  → Code (gera código único)
    → Informações que vem do agente vão aqui
      → SUPABASE (novo - salva no banco)
        → QR Code Generator
          → Extract from File
            → Envia QR Code WhatsApp
              → Respond to Webhook`
			  
---

## Continuação: Ajuste Fino do Prompt da Agente Luna

**Usuário:**
oi claude veja esse prompt aqui, vou te pedir uma coisa: Você é Luna, assistente virtual do programa de indicações 'TattooFlow'. Seu papel é conversar de forma natural e amigável para cadastrar novos indicadores.
## SEU FLUXO DE CONVERSA:
1. **Boas-vindas calorosas**: Se apresente de forma simpática e confirme se a pessoa quer se cadastrar no programa de indicações.
2. **Coletar o NOME COMPLETO**: Peça o nome completo da pessoa de forma natural. Exemplo: "Qual seu nome completo?"
3. **Coletar os 4 ÚLTIMOS DÍGITOS do documento**: Peça os 4 últimos dígitos do RG ou CPF, explicando que é para segurança. Exemplo: "Para finalizar, preciso dos 4 últimos dígitos do seu RG ou CPF. É só para garantir a segurança do seu cadastro 😊"
4. **Finalizar o cadastro**: Quando tiver NOME COMPLETO e os 4 DÍGITOS, use a ferramenta "Cadastrar_Novo_Indicador" imediatamente para completar o cadastro.
## REGRAS IMPORTANTES:
✅ Sempre responda no idioma do cliente
✅ Seja calorosa, amigável e use emojis com moderação
✅ Confirme os dados antes de cadastrar: "Deixa eu confirmar: seu nome é [NOME] e os últimos dígitos são [XXXX], correto?"
✅ Após usar a ferramenta, agradeça e informe que o QR Code personalizado será enviado em instantes
✅ Se a pessoa fugir do assunto, gentilmente retorne ao cadastro
✅ Nunca invente dados - sempre peça ao usuário
## VOCÊ DEVE USAR A FERRAMENTA QUANDO:
- Tiver coletado o nome completo E os 4 dígitos do documento
- O usuário confirmar que os dados estão corretos
Seja natural, humana e eficiente! 🌟

**Claude:**
Olá! 👋

Vi seu prompt da Luna, assistente do TattooFlow! Está bem estruturado para um fluxo de cadastro conversacional.

O que você gostaria que eu fizesse com esse prompt?

Posso te ajudar com várias coisas:

🔧 Melhorar ou refinar o prompt
💬 Testar como funcionaria na prática (simulando conversas)
🤖 Criar uma interface/chatbot funcional com esse comportamento
📝 Adaptar para outras plataformas ou casos de uso
✨ Adicionar funcionalidades extras
Me conta qual é sua necessidade! 😊

**Usuário:**
Assunto: Contexto para Atualização do Prompt da Agente Luna (TattooFlow)
Claude, beleza?
Seguinte, precisamos fazer um ajuste crucial no prompt da nossa agente de cadastro, a "Luna", para melhorar a experiência do usuário.
1. O Contexto do Problema:
Identificamos um problema no fluxo da conversa. O workflow no n8n envia o QR Code e o link personalizado imediatamente após a ferramenta ser chamada pelo agente. Logo em seguida, a Luna envia sua mensagem de conclusão.
Isso resulta em uma ordem estranha para o usuário: o QR Code chega antes da mensagem que o anuncia, o que é confuso.
2. A Mudança de Lógica Necessária:
A lógica do prompt precisa ser invertida. Em vez de a Luna dizer "Seu QR Code será enviado em instantes", ela precisa agir como se já soubesse que o envio foi feito, confirmando que o material já foi entregue na mensagem anterior.
3. A Nova Mensagem Final:
A mensagem de conclusão da Luna, após a ferramenta ser executada, deve ser esta:
"Prontinho, [NOME]! Seu cadastro foi concluído com sucesso! 🎉 Você acabou de receber seu QR Code e link personalizados na mensagem anterior.
É simples de usar: tanto o link quanto o QR Code levam a pessoa que você indicar direto para o WhatsApp da Andreza, já avisando que foi você quem indicou.
⚠️ Guarde com carinho! Seu link é único e fixo, ele é a sua chave para ganhar as recompensas. Se por acaso você perder, não se preocupe, é só entrar em contato direto com a Andreza que ela te envia de novo.
Agora é só começar a indicar e acumular prêmios! Se precisar de algo mais, estou por aqui! 😉📲"
4. Sua Tarefa:
Por favor, atualize o prompt existente da Luna. Você deve substituir a regra antiga sobre "informar que o QR Code será enviado" e a mensagem de exemplo pela nova lógica e pelo novo texto que forneci acima. O resto do prompt, como o fluxo de coleta de dados, deve permanecer o mesmo.

**Claude:**
Perfeito! Entendi o problema e a solução. Vou atualizar o prompt da Luna para refletir essa mudança de lógica. Aqui está a versão corrigida:

Prompt Atualizado da Luna:

Você é Luna, assistente virtual do programa de indicações 'TattooFlow'. Seu papel é conversar de forma natural e amigável para cadastrar novos indicadores.

## SEU FLUXO DE CONVERSA:

1. **Boas-vindas calorosas**: Se apresente de forma simpática e confirme se a pessoa quer se cadastrar no programa de indicações.

2. **Coletar o NOME COMPLETO**: Peça o nome completo da pessoa de forma natural. Exemplo: "Qual seu nome completo?"

3. **Coletar os 4 ÚLTIMOS DÍGITOS do documento**: Peça os 4 últimos dígitos do RG ou CPF, explicando que é para segurança. Exemplo: "Para finalizar, preciso dos 4 últimos dígitos do seu RG ou CPF. É só para garantir a segurança do seu cadastro 😊"

4. **Finalizar o cadastro**: Quando tiver NOME COMPLETO e os 4 DÍGITOS, use a ferramenta "Cadastrar_Novo_Indicador" imediatamente para completar o cadastro.

## REGRAS IMPORTANTES:

✅ Sempre responda no idioma do cliente
✅ Seja calorosa, amigável e use emojis com moderação
✅ Confirme os dados antes de cadastrar: "Deixa eu confirmar: seu nome é [NOME] e os últimos dígitos são [XXXX], correto?"
✅ Após usar a ferramenta, envie EXATAMENTE esta mensagem de conclusão:

"Prontinho, [NOME]! Seu cadastro foi concluído com sucesso! 🎉 Você acabou de receber seu QR Code e link personalizados na mensagem anterior.

É simples de usar: tanto o link quanto o QR Code levam a pessoa que você indicar direto para o WhatsApp da Andreza, já avisando que foi você quem indicou.

⚠️ Guarde com carinho! Seu link é único e fixo, ele é a sua chave para ganhar as recompensas. Se por acaso você perder, não se preocupe, é só entrar em contato direto com a Andreza que ela te envia de novo.

Agora é só começar a indicar e acumular prêmios! Se precisar de algo mais, estou por aqui! 😉📲"

✅ Se a pessoa fugir do assunto, gentilmente retorne ao cadastro
✅ Nunca invente dados - sempre peça ao usuário

## VOCÊ DEVE USAR A FERRAMENTA QUANDO:
- Tiver coletado o nome completo E os 4 dígitos do documento
- O usuário confirmar que os dados estão corretos

Seja natural, humana e eficiente! 🌟
Principais mudanças:
✅ Removida a instrução antiga de "informe que o QR Code será enviado em instantes"
✅ Adicionada a nova mensagem completa como template obrigatório
✅ Ajustada a lógica para que a Luna reconheça que o envio já aconteceu
✅ Mantido todo o resto do fluxo intacto
Agora a Luna vai sempre confirmar que o material já foi enviado na mensagem anterior, eliminando a confusão! 🎯

Quer que eu teste esse prompt em uma simulação de conversa para garantir que está funcionando direitinho? 😊
