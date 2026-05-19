# ⚡ Quick Start - Supabase VEditor

## 🎯 3 Passos para Começar

### Passo 1️⃣: Criar as Tabelas (5 minutos)

Acesse seu Supabase Dashboard e execute isto na seção "SQL Editor":

```sql
-- Tabela 1: Perfis de Usuários
CREATE TABLE perfis (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_discord TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela 2: Produtos Comprados
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

✅ **Pronto!** As tabelas estão criadas.

---

### Passo 2️⃣: Adicionar Dados de Teste (2 minutos)

Abra `teste-supabase.html` no navegador e use a interface para:
1. Testar conexão ✅
2. Adicionar um perfil teste
3. Adicionar um produto teste
4. Listar dados

Ou execute isto no SQL Editor:

```sql
-- Adicionar usuário de teste
INSERT INTO perfis (id_discord, username, avatar_url)
VALUES ('123456789', 'TesteUser', 'https://cdn.discordapp.com/avatars/123456789/test.png');

-- Adicionar produto de teste
INSERT INTO produtos_usuarios (id_usuario_discord, nome_produto, descricao, link_download)
VALUES (
  '123456789',
  'Comissão Full Body',
  'Desenho personagem em alta resolução',
  'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID'
);
```

---

### Passo 3️⃣: Testar no Site (2 minutos)

1. Abra `index.html` ou qualquer página no navegador
2. Clique no ícone Discord (canto superior)
3. Faça login com sua conta Discord
4. Clique em "Minhas Compras"
5. Veja seus produtos! ✅

---

## 🧪 Testar Tudo

Abra `teste-supabase.html` e clique nos botões:
- ✅ Verificar Conexão
- ✅ Adicionar Perfil
- ✅ Adicionar Produto
- ✅ Buscar Produtos
- ✅ Listar Tudo

---

## 📱 No Seu Site

**Usuário faz login Discord:**
```
Clica ícone Discord
    ↓
Autoriza
    ↓
Perfil salvo no Supabase ✅
    ↓
Clica "Minhas Compras"
    ↓
Vê seus produtos ✅
    ↓
Baixa arquivo ✅
```

---

## 💡 Dicas

### Adicionar Novo Produto para Usuário
1. Abra Dashboard Supabase
2. Tabela `produtos_usuarios`
3. Clique "Insert row"
4. Preencha:
   - `id_usuario_discord`: ID do Discord do cliente
   - `nome_produto`: Nome da comissão
   - `descricao`: Descrição
   - `link_download`: URL do Google Drive / Dropbox
5. Salve ✅

### Encontrar ID Discord do Usuário
Abra Developer Tools (F12) → Console
```javascript
JSON.parse(localStorage.getItem('discord_user')).id
```

---

## 🆘 Erros Comuns

| Erro | Solução |
|------|---------|
| "Erro ao conectar" | Verifique credenciais em home-script.js |
| Nenhum produto aparece | Verifique se ID Discord está correto |
| Link não funciona | Teste o URL do link_download |
| Modal não abre | Verifique se está logado (F12 → Console) |

---

## 📖 Documentação Completa

- `SUPABASE_INTEGRACAO.md` - Setup detalhado
- `FLUXO_SUPABASE.md` - Diagramas e fluxos
- `CHECKLIST_SETUP.md` - Checklist passo-a-passo
- `teste-supabase.html` - Interface de testes

---

## ✅ Você Está Pronto!

O site agora tem:
- ✅ Login Discord funcional
- ✅ Salvamento automático de perfis
- ✅ Sistema de compras com downloads
- ✅ Interface bonita e responsiva
- ✅ Banco de dados Supabase integrado

**Parabéns! 🎉**
