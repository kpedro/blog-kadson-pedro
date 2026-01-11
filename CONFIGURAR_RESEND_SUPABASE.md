# 🔧 Configurar Resend + Supabase para Email Marketing

## 📋 Pré-requisitos

1. ✅ Resend já configurado no projeto Supabase
2. ✅ Variáveis de ambiente já existentes:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`

---

## 🚀 Passo a Passo

### **1. Criar Tabelas no Supabase**

Execute o SQL em: `supabase/CRIAR_TABELAS_BLOG_NEWSLETTER.sql`

**No Supabase Dashboard:**
1. Acesse **SQL Editor**
2. Cole o conteúdo do arquivo SQL
3. Execute o script
4. Verifique se as tabelas foram criadas:
   - `blog_newsletter_subscribers`
   - `blog_newsletter_campaigns`
   - `blog_newsletter_email_logs`

**⚠️ IMPORTANTE:** As tabelas usam prefixo `blog_` para evitar conflitos com outras tabelas do projeto!

---

### **2. Criar Edge Function**

**No Supabase Dashboard:**
1. Vá em **Edge Functions**
2. Clique em **Create Function**
3. Nome: `blog-newsletter`
4. Cole o código de: `supabase/functions/blog-newsletter/index.ts`
5. Deploy a função

**Ou via CLI:**
```bash
cd supabase
supabase functions deploy blog-newsletter
```

---

### **3. Configurar Variáveis de Ambiente**

**No Supabase Dashboard:**
1. Vá em **Project Settings** → **Edge Functions**
2. Adicione/Verifique:
   - `RESEND_API_KEY` - Sua chave do Resend
   - `RESEND_FROM_EMAIL` - Email remetente (ex: `Kadson Pedro <noreply@kadsonpedro.com.br>`)
   - `BLOG_URL` - URL do blog (ex: `https://kadsonpedro.com.br`)

---

### **4. Configurar no Frontend**

No arquivo `index.html` (ou onde carregar scripts), adicione ANTES dos outros scripts:

```html
<script>
    // Configuração do Supabase para o Blog
    window.SUPABASE_CONFIG = {
        url: 'https://seu-projeto.supabase.co',
        anonKey: 'sua-chave-anon-key'
    };
</script>
```

**Onde encontrar:**
- **URL:** Supabase Dashboard → Project Settings → API → Project URL
- **Anon Key:** Supabase Dashboard → Project Settings → API → anon/public key

---

### **5. Atualizar Scripts do Blog**

Substitua o carregamento do `email-marketing.js` por:

```html
<!-- Sistema de Email Marketing com Resend + Supabase -->
<script src="assets/js/email-marketing-resend.js"></script>
```

Ou mantenha ambos (fallback automático):
```html
<script src="assets/js/email-marketing.js"></script>
<script src="assets/js/email-marketing-resend.js"></script>
```

---

## 🔍 Verificação

### **Testar Inscrição:**
1. Acesse o blog
2. Preencha o formulário de newsletter
3. Verifique no Supabase:
   - Tabela `blog_newsletter_subscribers` deve ter o novo registro
   - Email de boas-vindas deve chegar

### **Testar Campanha:**
1. Acesse `admin-newsletter.html`
2. Crie uma nova campanha
3. Envie para teste
4. Verifique:
   - Tabela `blog_newsletter_campaigns` deve ter o registro
   - Tabela `blog_newsletter_email_logs` deve ter os logs

---

## 📊 Estrutura das Tabelas

### **blog_newsletter_subscribers**
- `id` - UUID único
- `email` - Email do inscrito (único)
- `name` - Nome
- `source` - Origem da inscrição
- `status` - active/inactive/unsubscribed
- `subscribed_at` - Data de inscrição
- `total_emails_received` - Contador de emails

### **blog_newsletter_campaigns**
- `id` - UUID único
- `subject` - Assunto da campanha
- `content` - Conteúdo
- `sent_at` - Data de envio
- `total_sent` - Total enviado
- `total_failed` - Total falhado

### **blog_newsletter_email_logs**
- `id` - UUID único
- `subscriber_id` - Referência ao inscrito
- `campaign_id` - Referência à campanha
- `status` - sent/failed/bounced
- `sent_at` - Data de envio

---

## 🔒 Segurança

### **RLS (Row Level Security):**
- Tabelas têm RLS habilitado
- Políticas permitem leitura/escrita pública (para API)
- Ajuste conforme necessário para produção

### **Recomendações:**
1. Use Service Role Key apenas no backend
2. Use Anon Key no frontend
3. Configure políticas RLS mais restritivas em produção
4. Adicione autenticação se necessário

---

## 🎯 Vantagens do Resend + Supabase

### **vs EmailJS:**
- ✅ Sem limite de 200 emails/mês
- ✅ Melhor deliverability
- ✅ Analytics integrados
- ✅ Templates HTML
- ✅ Dados persistentes (Supabase)

### **vs Sistema Local:**
- ✅ Sincronização entre dispositivos
- ✅ Backup automático
- ✅ Histórico completo
- ✅ Escalável

---

## 🔄 Migração de Dados

Se você já tem inscritos no localStorage:

```javascript
// Script de migração (executar no console do navegador)
const localSubscribers = JSON.parse(localStorage.getItem('blog_subscribers') || '[]');

for (const sub of localSubscribers) {
    await fetch('https://seu-projeto.supabase.co/functions/v1/blog-newsletter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': 'sua-chave'
        },
        body: JSON.stringify({
            action: 'subscribe',
            email: sub.email,
            name: sub.name,
            source: sub.source || 'migration'
        })
    });
}
```

---

## 📝 Checklist

- [ ] Tabelas criadas no Supabase
- [ ] Edge Function `blog-newsletter` criada e deployada
- [ ] Variáveis de ambiente configuradas
- [ ] Configuração do Supabase no frontend
- [ ] Scripts atualizados
- [ ] Teste de inscrição funcionando
- [ ] Teste de campanha funcionando
- [ ] Dados migrados (se houver)

---

## 🆘 Troubleshooting

### **Erro: "Function not found"**
- Verifique se a função foi deployada
- Confirme o nome: `blog-newsletter`

### **Erro: "Invalid API key"**
- Verifique `RESEND_API_KEY` no Supabase
- Confirme que a chave está ativa no Resend

### **Emails não chegam:**
- Verifique domínio verificado no Resend
- Confirme `RESEND_FROM_EMAIL` está correto
- Veja logs na função Edge Function

### **Tabelas não criadas:**
- Execute o SQL novamente
- Verifique permissões do usuário
- Confirme que está no projeto correto

---

**Pronto para usar Resend + Supabase! 🚀**
