-- 🎯 Script SQL para adicionar Sistema de Follow ao Supabase
-- Cole isso no SQL Editor do Supabase Dashboard

-- ============================================
-- 1. ATUALIZAR Tabela PERFIS (adicionar campos)
-- ============================================

ALTER TABLE perfis ADD COLUMN IF NOT EXISTS
  descricao TEXT;

ALTER TABLE perfis ADD COLUMN IF NOT EXISTS
  bio TEXT;

ALTER TABLE perfis ADD COLUMN IF NOT EXISTS
  link_externo TEXT;

ALTER TABLE perfis ADD COLUMN IF NOT EXISTS
  seguidores_count INTEGER DEFAULT 0;

ALTER TABLE perfis ADD COLUMN IF NOT EXISTS
  seguindo_count INTEGER DEFAULT 0;

-- ============================================
-- 2. CRIAR Tabela FOLLOWERS (Sistema de Follow)
-- ============================================

CREATE TABLE IF NOT EXISTS followers (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  seguidor_id TEXT NOT NULL,
  seguindo_id TEXT NOT NULL,
  data_follow TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (seguidor_id) REFERENCES perfis(id_discord) ON DELETE CASCADE,
  FOREIGN KEY (seguindo_id) REFERENCES perfis(id_discord) ON DELETE CASCADE,
  
  UNIQUE(seguidor_id, seguindo_id)
);

-- ============================================
-- 3. CRIAR Índices para Performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_followers_seguidor ON followers(seguidor_id);
CREATE INDEX IF NOT EXISTS idx_followers_seguindo ON followers(seguindo_id);
CREATE INDEX IF NOT EXISTS idx_perfis_discord ON perfis(id_discord);

-- ============================================
-- 4. CRIAR View para Contar Seguidores
-- ============================================

CREATE OR REPLACE VIEW perfis_com_contagem AS
SELECT 
  p.*,
  (SELECT COUNT(*) FROM followers WHERE seguindo_id = p.id_discord) as total_seguidores,
  (SELECT COUNT(*) FROM followers WHERE seguidor_id = p.id_discord) as total_seguindo
FROM perfis p;

-- ============================================
-- Pronto! Tabelas criadas com sucesso ✅
-- ============================================
