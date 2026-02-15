# Script SQL Final para Migração do Supabase

Este arquivo contém a versão final e funcional do script SQL (Versão 1.3) que foi desenvolvida em colaboração com o Claude para migrar os dados do projeto para o Supabase.

Este foi o script que foi executado com sucesso.

```sql
-- =====================================================
-- SCRIPT DE MIGRAÇÃO - GERENCIADOR PROJETO TATTOO V2
-- Supabase (PostgreSQL)
-- Versão: 1.3 (PROBLEMA DE CONSTRAINT RESOLVIDO)
-- Data: 2025-10-31
-- =====================================================

-- =====================================================
-- LIMPEZA (SE NECESSÁRIO - DESCOMENTE PARA RESETAR)
-- =====================================================
/*
DROP TABLE IF EXISTS sorteios CASCADE;
DROP TABLE IF EXISTS parcelas CASCADE;
DROP TABLE IF EXISTS participantes CASCADE;
DROP TABLE IF EXISTS projetos CASCADE;
*/

-- =====================================================
-- ETAPA 1: CRIAR TABELAS SEM FOREIGN KEYS
-- =====================================================

-- Tabela: projetos
CREATE TABLE IF NOT EXISTS projetos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    valor_total_cota NUMERIC(10, 2) NOT NULL,
    numero_parcelas INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela: participantes (SEM FK ainda)
CREATE TABLE IF NOT EXISTS participantes (
    id TEXT PRIMARY KEY,
    projeto_id UUID NOT NULL,
    nome TEXT NOT NULL,
    telefone TEXT,
    cota INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela: parcelas (SEM FK ainda)
CREATE TABLE IF NOT EXISTS parcelas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participante_id TEXT NOT NULL,
    mes_referencia TEXT NOT NULL,
    valor_pago NUMERIC(10, 2) NOT NULL,
    data_pagamento DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela: sorteios (SEM FK ainda)
CREATE TABLE IF NOT EXISTS sorteios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    projeto_id UUID NOT NULL,
    mes_referencia TEXT NOT NULL,
    data_realizacao DATE NOT NULL,
    ganhador_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================
-- ETAPA 2: INSERIR DADOS (ANTES DE ADICIONAR CONSTRAINTS)
-- =====================================================

-- Inserir Projeto
INSERT INTO projetos (id, nome, valor_total_cota, numero_parcelas)
VALUES ('11111111-1111-1111-1111-111111111111', 'Projeto Tattoo - 1ª Edição', 400.00, 12)
ON CONFLICT (id) DO NOTHING;

-- Inserir Participantes
INSERT INTO participantes (id, projeto_id, nome, telefone, cota) VALUES
('p01', '11111111-1111-1111-1111-111111111111', 'Carol', '+55 19 98869-0683', 1),
('p02', '11111111-1111-1111-1111-111111111111', 'Karina', '+55 19 99715-9746', 1),
('p03', '11111111-1111-1111-1111-111111111111', 'Thais', '+55 19 99713-7501', 1),
('p04', '11111111-1111-1111-1111-111111111111', 'Jean', '+55 19 97414-9937', 1),
('p05', '11111111-1111-1111-1111-111111111111', 'Ariane', '+55 19 97111-3414', 1),
('p06', '11111111-1111-1111-1111-111111111111', 'Samuel', '+55 19 99445-7735', 1),
('p07', '11111111-1111-1111-1111-111111111111', 'Lucas', '+55 19 99337-0237', 1),
('p08', '11111111-1111-1111-1111-111111111111', 'Kethilly', '+55 19 99819-9053', 1),
('p09', '11111111-1111-1111-1111-111111111111', 'Larissa', '+55 19 97421-0560', 1),
('p10', '11111111-1111-1111-1111-111111111111', 'Flávio', '+55 19 97406-8984', 1),
('p11', '11111111-1111-1111-1111-111111111111', 'Roberta', '+55 19 99874-2841', 1),
('p12', '11111111-1111-1111-1111-111111111111', 'Aline', '+55 19 98346-3318', 1),
('p13', '11111111-1111-1111-1111-111111111111', 'Julia', '+55 19 99779-1255', 1),
('p14', '11111111-1111-1111-1111-111111111111', 'Wenyuli', '+55 19 99581-0047', 2),
('p15', '11111111-1111-1111-1111-111111111111', 'Soelma', '+55 19 99133-4346', 1),
('p16', '11111111-1111-1111-1111-111111111111', 'Felipe', '+55 19 99937-5045', 1),
('p17', '11111111-1111-1111-1111-111111111111', 'Jonas', '+55 19 98420-7381', 1)
ON CONFLICT (id) DO NOTHING;

-- Inserir Parcelas - Carol (p01)
INSERT INTO parcelas (participante_id, mes_referencia, valor_pago, data_pagamento) VALUES
('p01', 'Julho/2025', 33.33, '2025-07-25'),
('p01', 'Agosto/2025', 33.33, '2025-08-25'),
('p01', 'Setembro/2025', 33.33, '2025-09-25'),
('p01', 'Outubro/2025', 33.33, '2025-10-25'),
('p01', 'Novembro/2025', 33.33, '2025-11-25');

-- Karina (p02)
INSERT INTO parcelas (participante_id, mes_referencia, valor_pago, data_pagamento) VALUES
('p02', 'Julho/2025', 33.33, '2025-07-25'),
('p02', 'Agosto/2025', 33.33, '2025-08-25'),
('p02', 'Setembro/2025', 33.33, '2025-09-25');

-- Thais (p03)
INSERT INTO parcelas (participante_id, mes_referencia, valor_pago, data_pagamento) VALUES
('p03', 'Julho/2025', 33.33, '2025-07-25'),
('p03', 'Agosto/2025', 33.33, '2025-08-25'),
('p03', 'Setembro/2025', 33.33, '2025-09-25'),
('p03', 'Outubro/2025', 33.33, '2025-10-25');

-- Jean (p04)
INSERT INTO parcelas (participante_id, mes_referencia, valor_pago, data_pagamento) VALUES
('p04', 'Julho/2025', 33.33, '2025-07-25'),
('p04', 'Agosto/2025', 33.33, '2025-08-25'),
('p04', 'Setembro/2025', 33.33, '2025-09-25'),
('p04', 'Outubro/2025', 33.33, '2025-10-25'),
('p04', 'Novembro/2025', 33.33, '2025-11-25');

-- Ariane (p05)
INSERT INTO parcelas (participante_id, mes_referencia, valor_pago, data_pagamento) VALUES
('p05', 'Julho/2025', 33.33, '2025-07-25'),
('p05', 'Agosto/2025', 33.33, '2025-08-25'),
('p05', 'Setembro/2025', 33.33, '2025-09-25'),
('p05', 'Outubro/2025', 33.33, '2025-10-25');

-- Samuel (p06)
INSERT INTO parcelas (participante_id, mes_referencia, valor_pago, data_pagamento) VALUES
('p06', 'Julho/2025', 33.33, '2025-07-25'),
('p06', 'Agosto/2025', 33.33, '2025-08-25'),
('p06', 'Setembro/2025', 33.33, '2025-09-25'),
('p06', 'Outubro/2025', 33.33, '2025-10-25'),
('p06', 'Novembro/2025', 33.33, '2025-11-25');

-- Lucas (p07)
INSERT INTO parcelas (participante_id, mes_referencia, valor_pago, data_pagamento) VALUES
('p07', 'Julho/2025', 33.33, '2025-07-25'),
('p07', 'Agosto/2025', 33.33, '2025-08-25'),
('p07', 'Setembro/2025', 33.33, '2025-09-25'),
('p07', 'Outubro/2025', 33.33, '2025-10-25'),
('p07', 'Novembro/2025', 33.33, '2025-11-25');

-- Kethilly (p08)
INSERT INTO parcelas (participante_id, mes_referencia, valor_pago, data_pagamento) VALUES
('p08', 'Julho/2025', 33.33, '2025-07-25'),
('p08', 'Agosto/2025', 33.33, '2025-08-25'),
('p08', 'Setembro/2025', 33.33, '2025-09-25'),
('p08', 'Outubro/2025', 33.33, '2025-10-25');

-- Larissa (p09)
INSERT INTO parcelas (participante_id, mes_referencia, valor_pago, data_pagamento) VALUES
('p09', 'Julho/2025', 33.33, '2025-07-25'),
('p09', 'Agosto/2025', 33.33, '2025-08-25'),
('p09', 'Setembro/2025', 33.33, '2025-09-25'),
('p09', 'Outubro/2025', 33.33, '2025-10-25');

-- Flávio (p10) - PAGAMENTO COMPLETO
INSERT INTO parcelas (participante_id, mes_referencia, valor_pago, data_pagamento) VALUES
('p10', 'Julho/2025', 33.33, '2025-07-25'),
('p10', 'Agosto/2025', 33.33, '2025-08-25'),
('p10', 'Setembro/2025', 33.33, '2025-09-25'),
('p10', 'Outubro/2025', 33.33, '2025-10-25'),
('p10', 'Novembro/2025', 33.33, '2025-11-25'),
('p10', 'Dezembro/2025', 33.33, '2025-11-25'),
('p10', 'Janeiro/2026', 33.33, '2025-11-25'),
('p10', 'Fevereiro/2026', 33.33, '2025-11-25'),
('p10', 'Março/2026', 33.33, '2025-11-25'),
('p10', 'Abril/2026', 33.33, '2025-11-25'),
('p10', 'Maio/2026', 33.33, '2025-11-25'),
('p10', 'Junho/2026', 33.33, '2025-11-25');

-- Roberta (p11)
INSERT INTO parcelas (participante_id, mes_referencia, valor_pago, data_pagamento) VALUES
('p11', 'Julho/2025', 33.33, '2025-07-25'),
('p11', 'Agosto/2025', 33.33, '2025-08-25'),
('p11', 'Setembro/2025', 33.33, '2025-09-25'),
('p11', 'Outubro/2025', 33.33, '2025-10-25');

-- Aline (p12)
INSERT INTO parcelas (participante_id, mes_referencia, valor_pago, data_pagamento) VALUES
('p12', 'Julho/2025', 33.33, '2025-07-25'),
('p12', 'Agosto/2025', 33.33, '2025-08-25'),
('p12', 'Setembro/2025', 33.33, '2025-09-25'),
('p12', 'Outubro/2025', 33.33, '2025-10-25');

-- Julia (p13)
INSERT INTO parcelas (participante_id, mes_referencia, valor_pago, data_pagamento) VALUES
('p13', 'Julho/2025', 33.33, '2025-07-25'),
('p13', 'Agosto/2025', 33.33, '2025-08-25'),
('p13', 'Setembro/2025', 33.33, '2025-09-25'),
('p13', 'Outubro/2025', 33.33, '2025-10-25');

-- Wenyuli (p14) - 2 COTAS
INSERT INTO parcelas (participante_id, mes_referencia, valor_pago, data_pagamento) VALUES
('p14', 'Julho/2025', 33.33, '2025-07-25'),
('p14', 'Agosto/2025', 33.33, '2025-08-25'),
('p14', 'Setembro/2025', 33.33, '2025-09-25'),
('p14', 'Outubro/2025', 33.33, '2025-10-25'),
('p14', 'Novembro/2025', 33.33, '2025-11-25');

-- Soelma (p15)
INSERT INTO parcelas (participante_id, mes_referencia, valor_pago, data_pagamento) VALUES
('p15', 'Julho/2025', 33.33, '2025-07-25'),
('p15', 'Agosto/2025', 33.33, '2025-08-25');

-- Felipe (p16)
INSERT INTO parcelas (participante_id, mes_referencia, valor_pago, data_pagamento) VALUES
('p16', 'Julho/2025', 33.33, '2025-07-25'),
('p16', 'Agosto/2025', 33.33, '2025-08-25'),
('p16', 'Setembro/2025', 33.33, '2025-09-25'),
('p16', 'Outubro/2025', 33.33, '2025-10-25');

-- Jonas (p17)
INSERT INTO parcelas (participante_id, mes_referencia, valor_pago, data_pagamento) VALUES
('p17', 'Julho/2025', 33.33, '2025-07-25'),
('p17', 'Agosto/2025', 33.33, '2025-08-25'),
('p17', 'Setembro/2025', 33.33, '2025-09-25'),
('p17', 'Outubro/2025', 33.33, '2025-10-25'),
('p17', 'Novembro/2025', 33.33, '2025-11-25'),
('p17', 'Dezembro/2025', 33.33, '2025-11-25');

-- Inserir Sorteios
INSERT INTO sorteios (projeto_id, mes_referencia, data_realizacao, ganhador_id) VALUES
('11111111-1111-1111-1111-111111111111', 'Agosto/2025', '2025-08-27', 'p03'),
('11111111-1111-1111-1111-111111111111', 'Setembro/2025', '2025-09-27', 'p08'),
('11111111-1111-1111-1111-111111111111', 'Setembro/2025', '2025-09-27', 'p14'),
('11111111-1111-1111-1111-111111111111', 'Outubro/2025', '2025-10-27', 'p07'),
('11111111-1111-1111-1111-111111111111', 'Outubro/2025', '2025-10-27', 'p17');

-- =====================================================
-- ETAPA 3: ADICIONAR FOREIGN KEYS (DEPOIS DOS DADOS)
-- =====================================================

-- FK: participantes -> projetos
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_participantes_projeto'
    ) THEN
        ALTER TABLE participantes 
        ADD CONSTRAINT fk_participantes_projeto 
        FOREIGN KEY (projeto_id) 
        REFERENCES projetos(id) 
        ON DELETE CASCADE;
    END IF;
END $$;

-- FK: parcelas -> participantes
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_parcelas_participante'
    ) THEN
        ALTER TABLE parcelas 
        ADD CONSTRAINT fk_parcelas_participante 
        FOREIGN KEY (participante_id) 
        REFERENCES participantes(id) 
        ON DELETE CASCADE;
    END IF;
END $$;

-- FK: sorteios -> projetos
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_sorteios_projeto'
    ) THEN
        ALTER TABLE sorteios 
        ADD CONSTRAINT fk_sorteios_projeto 
        FOREIGN KEY (projeto_id) 
        REFERENCES projetos(id) 
        ON DELETE CASCADE;
    END IF;
END $$;

-- FK: sorteios -> participantes (ganhador)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_sorteios_ganhador'
    ) THEN
        ALTER TABLE sorteios 
        ADD CONSTRAINT fk_sorteios_ganhador 
        FOREIGN KEY (ganhador_id) 
        REFERENCES participantes(id) 
        ON DELETE CASCADE;
    END IF;
END $$;

-- =====================================================
-- ETAPA 4: CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_participantes_projeto ON participantes(projeto_id);
CREATE INDEX IF NOT EXISTS idx_participantes_nome ON participantes(nome);
CREATE INDEX IF NOT EXISTS idx_parcelas_participante ON parcelas(participante_id);
CREATE INDEX IF NOT EXISTS idx_parcelas_data ON parcelas(data_pagamento);
CREATE INDEX IF NOT EXISTS idx_parcelas_mes ON parcelas(mes_referencia);
CREATE INDEX IF NOT EXISTS idx_sorteios_projeto ON sorteios(projeto_id);
CREATE INDEX IF NOT EXISTS idx_sorteios_ganhador ON sorteios(ganhador_id);
CREATE INDEX IF NOT EXISTS idx_sorteios_data ON sorteios(data_realizacao);

-- =====================================================
-- QUERIES DE VALIDAÇÃO
-- =====================================================

-- 1. Verificar estrutura criada
SELECT 
    'projetos' as tabela, COUNT(*) as registros FROM projetos
UNION ALL
SELECT 'participantes', COUNT(*) FROM participantes
UNION ALL
SELECT 'parcelas', COUNT(*) FROM parcelas
UNION ALL
SELECT 'sorteios', COUNT(*) FROM sorteios;

-- 2. Total arrecadado
SELECT 
    'R$ ' || TO_CHAR(SUM(valor_pago), 'FM9G999D00') as total_arrecadado,
    COUNT(*) as total_parcelas,
    COUNT(DISTINCT participante_id) as participantes_pagantes
FROM parcelas;

-- 3. Status dos participantes
SELECT 
    p.nome,
    p.cota,
    COUNT(pa.id) as parcelas_pagas,
    'R$ ' || TO_CHAR(COALESCE(SUM(pa.valor_pago), 0), 'FM9G999D00') as total_pago,
    CASE 
        WHEN COUNT(pa.id) >= 12 THEN '✅ QUITADO'
        WHEN COUNT(pa.id) >= 4 THEN '🟡 EM DIA'
        ELSE '🔴 ATRASADO'
    END as status
FROM participantes p 
LEFT JOIN parcelas pa ON p.id = pa.participante_id 
GROUP BY p.id, p.nome, p.cota
ORDER BY parcelas_pagas DESC;

-- 4. Ganhadores dos sorteios
SELECT 
    s.mes_referencia,
    TO_CHAR(s.data_realizacao, 'DD/MM/YYYY') as data,
    p.nome as ganhador
FROM sorteios s
JOIN participantes p ON s.ganhador_id = p.id
ORDER BY s.data_realizacao;

-- =====================================================
-- FIM DO SCRIPT - MIGRAÇÃO COMPLETA
-- =====================================================
```
