# 🚀 Deploy da Função Blog Newsletter

## 📋 Passo a Passo

### **1. Criar Tabelas no Supabase**

1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor**
3. Execute o arquivo: `supabase/CRIAR_TABELAS_BLOG_NEWSLETTER.sql`
4. Verifique se as 3 tabelas foram criadas:
   - ✅ `blog_newsletter_subscribers`
   - ✅ `blog_newsletter_campaigns`
   - ✅ `blog_newsletter_email_logs`

**⚠️ IMPORTANTE:** Prefixo `blog_` garante que não haverá conflito com outras tabelas!

---

### **2. Deploy da Edge Function**

#### **Opção A: Via Dashboard (Recomendado)**

1. Acesse **Edge Functions** no Supabase Dashboard
2. Clique em **Create Function**
3. Nome: `blog-newsletter`
4. Cole o código de: `supabase/functions/blog-newsletter/index.ts`
5. Clique em **Deploy**

#### **Opção B: Via CLI**

```bash
cd C:\Users\Kadson\app-pedagoflow\supabase
supabase functions deploy blog-newsletter
```

---

### **3. Configurar Variáveis de Ambiente**

**No Supabase Dashboard:**
1. Vá em **Project Settings** → **Edge Functions**
2. Adicione/Verifique:
   - ✅ `RESEND_API_KEY` - Já deve existir
   - ✅ `RESEND_FROM_EMAIL` - Já deve existir (ou adicione: `Kadson Pedro <noreply@kadsonpedro.com.br>`)
   - ✅ `BLOG_URL` - Adicione: `https://kadsonpedro.com.br` (ou seu domínio)

---

### **4. Configurar Frontend**

No `index.html` do blog, adicione ANTES dos scripts:

```html
<script>
    // Configuração do Supabase para o Blog
    window.SUPABASE_CONFIG = {
        url: 'https://seu-projeto.supabase.co',  // Substitua pela sua URL
        anonKey: 'sua-chave-anon-key'            // Substitua pela sua chave
    };
</script>
```

**Onde encontrar:**
- **URL:** Supabase Dashboard → Project Settings → API → Project URL
- **Anon Key:** Supabase Dashboard → Project Settings → API → anon/public key

---

### **5. Atualizar Scripts**

No `index.html` e `admin-newsletter.html`, adicione:

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

## ✅ Verificação

### **Teste 1: Inscrição**
1. Acesse o blog
2. Preencha newsletter
3. Verifique:
   - ✅ Tabela `blog_newsletter_subscribers` tem o registro
   - ✅ Email de boas-vindas chegou

### **Teste 2: Campanha**
1. Acesse `admin-newsletter.html`
2. Crie campanha de teste
3. Verifique:
   - ✅ Tabela `blog_newsletter_campaigns` tem registro
   - ✅ Emails foram enviados

---

## 🔍 Troubleshooting

### **Erro: "Function not found"**
- Verifique se função foi deployada
- Confirme nome: `blog-newsletter`

### **Erro: "Invalid API key"**
- Verifique `RESEND_API_KEY` no Supabase
- Confirme chave ativa no Resend

### **Tabelas não criadas:**
- Execute SQL novamente
- Verifique permissões
- Confirme projeto correto

---

**Pronto! Sistema integrado com Resend + Supabase! 🎉**
