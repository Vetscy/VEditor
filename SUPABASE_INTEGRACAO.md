# Integração Supabase - VEditor

## 📋 Configuração do Banco de Dados

Este documento descreve como configurar o Supabase para armazenar dados de usuários e produtos comprados.

## 🗄️ Tabelas Necessárias

### 1. Tabela `perfis`
Armazena os dados de perfil dos usuários Discord.

```sql
CREATE TABLE perfis (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_discord TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Campos:**
- `id`: ID único (auto-gerado)
- `id_discord`: ID do usuário no Discord (único)
- `username`: Nome de usuário do Discord
- `avatar_url`: URL do avatar do Discord
- `created_at`: Data de criação
- `updated_at`: Data da última atualização

---

### 2. Tabela `produtos_usuarios`
Armazena os produtos comprados por cada usuário.

```sql
CREATE TABLE produtos_usuarios (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_usuario_discord TEXT NOT NULL,
  nome_produto TEXT NOT NULL,
  descricao TEXT,
  link_download TEXT NOT NULL,
  data_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario_discord) REFERENCES perfis(id_discord) ON DELETE CASCADE
);
```

**Campos:**
- `id`: ID único (auto-gerado)
- `id_usuario_discord`: ID Discord do comprador (referência)
- `nome_produto`: Nome do produto/comissão
- `descricao`: Descrição breve do produto
- `link_download`: URL para download do arquivo
- `data_compra`: Quando o produto foi adquirido

---

## 🔐 Credenciais

**URL do Projeto:**
```
https://knbloqfdvlioxxkxthhif.supabase.co
```

**Chave Anônima (ANON_KEY):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuYmxvcWZkdmxpb3h4a3h0aGlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNTIxNTMsImV4cCI6MjA5NDcyODE1M30.wDdPtUEBv8I00j0t-mlmdp3GDEcCZyRe1_BacNsQoCU
```

> ⚠️ Essas credenciais são públicas (chave anônima) - são seguras para uso em client-side per design do Supabase.

---

## 🚀 Como Usar

### Fluxo de Login e Compras

1. **Login com Discord**
   - Usuário clica no ícone Discord na navbar
   - OAuth flow redireciona para Discord
   - Supabase salva/atualiza perfil na tabela `perfis`

2. **Visualizar Compras**
   - Usuário clica em "Minhas Compras"
   - Script busca produtos na tabela `produtos_usuarios`
   - Modal exibe lista de produtos com downloads

### Funções JavaScript

**`salvarPerfilSupabase(discordId, username, avatarUrl)`**
- Salva ou atualiza perfil do usuário no Supabase
- Chamada automaticamente após login bem-sucedido

**`carregarProdutosSupabase(discordId, modalElement)`**
- Busca produtos comprados do usuário
- Preenche modal com lista de downloads
- Chamada quando usuário clica em "Minhas Compras"

---

## 📝 Exemplo de Inserção Manual (no Dashboard Supabase)

### Adicionar um Usuário
```sql
INSERT INTO perfis (id_discord, username, avatar_url)
VALUES ('123456789', 'usuario_discord', 'https://cdn.discordapp.com/avatars/...');
```

### Adicionar um Produto
```sql
INSERT INTO produtos_usuarios (id_usuario_discord, nome_produto, descricao, link_download)
VALUES (
  '123456789',
  'Comissão Full Body',
  'Desenho do seu personagem em alta resolução',
  'https://drive.google.com/file/d/...'
);
```

---

## 🔒 Políticas de Segurança (Row Level Security)

Recomenda-se configurar RLS no Supabase para que usuários só vejam seus próprios dados:

```sql
-- Para tabela 'perfis'
ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem apenas seus perfis"
  ON perfis
  FOR SELECT
  USING (id_discord = auth.jwt() -> 'sub');

-- Para tabela 'produtos_usuarios'
ALTER TABLE produtos_usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem apenas seus produtos"
  ON produtos_usuarios
  FOR SELECT
  USING (id_usuario_discord = auth.jwt() -> 'sub');
```

---

## 📱 Testando Localmente

1. Abra o site em http://localhost
2. Faça login com Discord
3. Clique em "Minhas Compras"
4. Adicione dados de teste no Supabase Dashboard
5. Refresque a página para ver os produtos

---

## 🐛 Troubleshooting

**Erro: "Erro ao conectar ao banco de dados"**
- Verifique se as credenciais do Supabase estão corretas
- Verifique se as tabelas existem
- Abra o Console do navegador (F12) para ver erros

**Produtos não aparecem**
- Verifique se `id_usuario_discord` no Supabase combina com o ID do Discord do usuário logado
- Confirme que a tabela tem dados

**Modal não fecha**
- Clique no X ou fora do modal
- Pressione ESC

---

## 📞 Suporte

Para mais informações sobre Supabase: https://supabase.com/docs
