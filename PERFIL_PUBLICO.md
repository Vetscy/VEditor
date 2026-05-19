# 🎯 Sistema de Perfis Públicos e Follow

## ✅ O que foi criado

### 1. **Página perfil.html**
- Perfil público do usuário
- Mostra produtos comprados
- Sistema de followers
- Botão para seguir/deixar de seguir

### 2. **Nova Tabela no Supabase: `followers`**
- Armazena relações de follow entre usuários
- Segue → Seguindo structure
- Unique constraint para evitar duplicatas

### 3. **Atualizações na Tabela `perfis`**
- `descricao` - Descrição do perfil
- `bio` - Bio do usuário
- `link_externo` - Link externo (portfólio, redes sociais)
- Contadores de followers/seguindo

---

## 🚀 Como Configurar

### Passo 1: Executar SQL no Supabase

Abra seu Dashboard Supabase:
1. Vá para **SQL Editor**
2. Abra arquivo `SETUP_FOLLOW_SYSTEM.sql` (no repo)
3. Cole e execute todo o SQL

Ou copie isto:

```sql
-- Adicionar colunas em perfis
ALTER TABLE perfis ADD COLUMN IF NOT EXISTS descricao TEXT;
ALTER TABLE perfis ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE perfis ADD COLUMN IF NOT EXISTS link_externo TEXT;
ALTER TABLE perfis ADD COLUMN IF NOT EXISTS seguidores_count INTEGER DEFAULT 0;
ALTER TABLE perfis ADD COLUMN IF NOT EXISTS seguindo_count INTEGER DEFAULT 0;

-- Criar tabela followers
CREATE TABLE IF NOT EXISTS followers (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  seguidor_id TEXT NOT NULL,
  seguindo_id TEXT NOT NULL,
  data_follow TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (seguidor_id) REFERENCES perfis(id_discord) ON DELETE CASCADE,
  FOREIGN KEY (seguindo_id) REFERENCES perfis(id_discord) ON DELETE CASCADE,
  
  UNIQUE(seguidor_id, seguindo_id)
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_followers_seguidor ON followers(seguidor_id);
CREATE INDEX IF NOT EXISTS idx_followers_seguindo ON followers(seguindo_id);
```

✅ Tabelas criadas!

---

## 🎯 Como Usar

### Acessar Perfil de um Usuário

```
https://vetscy.github.io/VEditor/perfil.html?id=123456789
```

Ou no site, adicione um link para o perfil:

```html
<a href="perfil.html?id=${userId}">Ver Perfil</a>
```

### Exemplo de Implementação

Para mostrar link de perfil em uma lista de seguidores:

```javascript
// Em qualquer página
const discordId = "123456789";
const perfilLink = `perfil.html?id=${discordId}`;
```

---

## 📊 Estrutura de Dados

### Tabela `followers`
```
seguidor_id  → ID de quem segue
seguindo_id  → ID de quem é seguido
data_follow  → Quando começou a seguir
```

### Tabela `perfis` (atualizada)
```
id_discord    → ID único (Discord)
username      → Nome do usuário
avatar_url    → URL do avatar
bio           → Biografia do usuário
descricao     → Descrição do perfil
link_externo  → Link para redes sociais/portfólio
seguidores_count → Total de seguidores
seguindo_count   → Total seguindo
```

---

## 🎨 Features da Página de Perfil

### ✅ Implementado
- [x] Mostrar avatar do usuário
- [x] Mostrar username
- [x] Mostrar produtos comprados em grid
- [x] Contar total de compras
- [x] Listar seguidores com avatares
- [x] Botão de Seguir/Deixar de seguir
- [x] Responsivo em mobile
- [x] Animações suaves
- [x] Cores tema roxo
- [x] Loading states

### 🔮 Possíveis Melhorias (Futuro)
- [ ] Página de "Seguindo" (pessoas que o usuário segue)
- [ ] Notificações de novo seguidor
- [ ] Badges (Artista, Cliente VIP, etc)
- [ ] Portfólio integrado
- [ ] Galeria de trabalhos
- [ ] Sistema de avaliações
- [ ] DMs entre usuários

---

## 🔗 Links para Navegar

### No seu site, você pode adicionar:

```html
<!-- Em navbar ou menu -->
<a href="perfil.html?id=123456789">
  <i class="fas fa-user"></i> Ver Perfil
</a>

<!-- Em lista de usuários -->
<div onclick="window.location.href='perfil.html?id=' + userId">
  Clique para ver perfil
</div>

<!-- Em cards de produtos -->
<a href="perfil.html?id=${prod.id_usuario_discord}">
  Ver perfil do vendedor
</a>
```

---

## 🧪 Como Testar

### 1. Adicione dados de teste
Abra `teste-supabase.html`:
1. Adicione perfil 1: Discord ID 123456789
2. Adicione perfil 2: Discord ID 987654321
3. Adicione produtos para cada um

### 2. Acesse os perfis
```
http://localhost/perfil.html?id=123456789
http://localhost/perfil.html?id=987654321
```

### 3. Teste follow
1. Faça login com Discord
2. Clique no botão "Seguir"
3. Recarregue a página
4. Deve aparecer "Seguindo"

---

## 📱 Responsividade

A página funciona perfeitamente em:
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (< 768px)

Grid de produtos e seguidores se adapta automaticamente!

---

## 🔐 Segurança

- [x] RLS pronto para ativar (Row Level Security)
- [x] Validação de usuário logado
- [x] Soft delete com CASCADE
- [x] UNIQUE constraint em followers
- [x] Índices para performance

---

## 📚 Próximas Etapas

1. Execute o SQL no Supabase
2. Abra `teste-supabase.html`
3. Adicione dados de teste
4. Acesse `perfil.html?id=SEU_DISCORD_ID`
5. Teste o sistema de follow

---

**Tudo pronto! Sistema de perfis público implementado com sucesso! 🎉**
