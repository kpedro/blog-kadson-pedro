# 📊 Criar Tabelas do Blog Newsletter no Supabase

## 📍 Localização do Arquivo SQL

O arquivo SQL está localizado em:
```
C:\Users\Kadson\app-pedagoflow\supabase\CRIAR_TABELAS_BLOG_NEWSLETTER.sql
```

---

## 🚀 Como Executar

### **Passo 1: Acessar Supabase Dashboard**
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral)

### **Passo 2: Abrir o Arquivo SQL**
1. Abra o arquivo: `app-pedagoflow\supabase\CRIAR_TABELAS_BLOG_NEWSLETTER.sql`
2. Copie TODO o conteúdo do arquivo

### **Passo 3: Executar no SQL Editor**
1. No SQL Editor do Supabase, cole o conteúdo copiado
2. Clique em **Run** ou pressione `Ctrl + Enter`
3. Aguarde a execução

### **Passo 4: Verificar Tabelas Criadas**
Execute esta query para verificar:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'blog_%'
ORDER BY table_name;
```

Você deve ver 3 tabelas:
- ✅ `blog_newsletter_subscribers`
- ✅ `blog_newsletter_campaigns`
- ✅ `blog_newsletter_email_logs`

---

## 📋 O que o SQL Cria

### **1. Tabela: `blog_newsletter_subscribers`**
Armazena os inscritos na newsletter:
- `id` - UUID único
- `email` - Email (único)
- `name` - Nome
- `source` - Origem da inscrição
- `status` - active/inactive/unsubscribed
- `subscribed_at` - Data de inscrição
- `total_emails_received` - Contador de emails

### **2. Tabela: `blog_newsletter_campaigns`**
Armazena as campanhas enviadas:
- `id` - UUID único
- `subject` - Assunto
- `content` - Conteúdo
- `sent_at` - Data de envio
- `total_sent` - Total enviado
- `total_failed` - Total falhado

### **3. Tabela: `blog_newsletter_email_logs`**
Logs de envio para rastreamento:
- `id` - UUID único
- `subscriber_id` - Referência ao inscrito
- `campaign_id` - Referência à campanha
- `status` - sent/failed/bounced
- `sent_at` - Data de envio

---

## ⚠️ Importante

- **Prefixo `blog_`**: Garante que não haverá conflito com outras tabelas do projeto
- **RLS Habilitado**: Row Level Security está ativo
- **Políticas Públicas**: Configuradas para permitir leitura/escrita via API

---

## 🔍 Troubleshooting

### **Erro: "relation already exists"**
- As tabelas já existem
- Use `DROP TABLE IF EXISTS` se quiser recriar (cuidado: apaga dados!)

### **Erro: "permission denied"**
- Verifique se está logado no projeto correto
- Confirme permissões de administrador

### **Tabelas não aparecem:**
- Verifique se executou o SQL completo
- Recarregue a página do Supabase
- Verifique se está no schema `public`

---

## ✅ Próximo Passo

Após criar as tabelas, continue com:
1. **Deploy da Edge Function**: Veja `DEPLOY_FUNCAO_BLOG_NEWSLETTER.md`
2. **Configurar Frontend**: Veja `CONFIGURAR_RESEND_SUPABASE.md`

---

## 📄 Código SQL Completo

```sql
-- ============================================
-- TABELAS PARA BLOG KADSON PEDRO - NEWSLETTER
-- Prefixo: blog_ para evitar conflitos
-- ============================================

-- Tabela de Inscritos na Newsletter
CREATE TABLE IF NOT EXISTS blog_newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    source TEXT DEFAULT 'newsletter',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'unsubscribed')),
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    last_email_sent_at TIMESTAMPTZ,
    total_emails_received INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_blog_subscribers_email ON blog_newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_blog_subscribers_status ON blog_newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_blog_subscribers_subscribed_at ON blog_newsletter_subscribers(subscribed_at);

-- Tabela de Campanhas
CREATE TABLE IF NOT EXISTS blog_newsletter_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    template TEXT DEFAULT 'default',
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    total_sent INTEGER DEFAULT 0,
    total_failed INTEGER DEFAULT 0,
    total_recipients INTEGER DEFAULT 0,
    status TEXT DEFAULT 'sent' CHECK (status IN ('draft', 'sending', 'sent', 'failed')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para campanhas
CREATE INDEX IF NOT EXISTS idx_blog_campaigns_sent_at ON blog_newsletter_campaigns(sent_at);
CREATE INDEX IF NOT EXISTS idx_blog_campaigns_status ON blog_newsletter_campaigns(status);

-- Tabela de Logs de Envio (para rastreamento)
CREATE TABLE IF NOT EXISTS blog_newsletter_email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscriber_id UUID REFERENCES blog_newsletter_subscribers(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES blog_newsletter_campaigns(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    subject TEXT,
    status TEXT CHECK (status IN ('sent', 'failed', 'bounced')),
    error_message TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Índices para logs
CREATE INDEX IF NOT EXISTS idx_blog_logs_subscriber ON blog_newsletter_email_logs(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_blog_logs_campaign ON blog_newsletter_email_logs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_blog_logs_sent_at ON blog_newsletter_email_logs(sent_at);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION blog_update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS blog_update_subscribers_updated_at ON blog_newsletter_subscribers;
CREATE TRIGGER blog_update_subscribers_updated_at
    BEFORE UPDATE ON blog_newsletter_subscribers
    FOR EACH ROW
    EXECUTE FUNCTION blog_update_updated_at_column();

-- RLS (Row Level Security) - Permitir leitura/escrita para usuários autenticados
-- Ajuste conforme sua política de segurança

ALTER TABLE blog_newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_newsletter_email_logs ENABLE ROW LEVEL SECURITY;

-- Política: Permitir leitura pública (para API)
CREATE POLICY "blog_subscribers_select" ON blog_newsletter_subscribers
    FOR SELECT USING (true);

CREATE POLICY "blog_subscribers_insert" ON blog_newsletter_subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "blog_subscribers_update" ON blog_newsletter_subscribers
    FOR UPDATE USING (true);

-- Políticas para campanhas (apenas leitura pública)
CREATE POLICY "blog_campaigns_select" ON blog_newsletter_campaigns
    FOR SELECT USING (true);

CREATE POLICY "blog_campaigns_insert" ON blog_newsletter_campaigns
    FOR INSERT WITH CHECK (true);

-- Políticas para logs (apenas inserção)
CREATE POLICY "blog_logs_insert" ON blog_newsletter_email_logs
    FOR INSERT WITH CHECK (true);

-- Comentários nas tabelas
COMMENT ON TABLE blog_newsletter_subscribers IS 'Inscritos na newsletter do blog Kadson Pedro';
COMMENT ON TABLE blog_newsletter_campaigns IS 'Campanhas de email enviadas';
COMMENT ON TABLE blog_newsletter_email_logs IS 'Logs de envio de emails para rastreamento';
```

---

**Arquivo SQL original está em: `app-pedagoflow\supabase\CRIAR_TABELAS_BLOG_NEWSLETTER.sql`**
