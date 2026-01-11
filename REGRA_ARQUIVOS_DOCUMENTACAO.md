# 📋 Regra: Arquivos de Documentação do Blog

## ✅ Regra Importante

**SEMPRE criar arquivos de explicação/documentação do blog na pasta do blog:**
- ✅ `C:\Users\Kadson\blog-kadson-pedro\`
- ❌ NÃO criar em `C:\Users\Kadson\app-pedagoflow\`

---

## 📁 Estrutura Correta

### **Arquivos do Blog** → `blog-kadson-pedro/`
- ✅ Documentação (`.md`)
- ✅ Guias (`.md`)
- ✅ Exemplos (`.html`, `.md`)
- ✅ Scripts JavaScript
- ✅ CSS
- ✅ HTML

### **Arquivos do Supabase** → `app-pedagoflow/supabase/`
- ✅ SQL scripts (`.sql`)
- ✅ Edge Functions (`.ts`)
- ⚠️ **NÃO** documentação do blog

---

## 📝 Exemplos

### ✅ Correto:
```
blog-kadson-pedro/
  ├── CONFIGURAR_RESEND_SUPABASE.md
  ├── DEPLOY_FUNCAO_BLOG_NEWSLETTER.md
  ├── RESUMO_INTEGRACAO_RESEND.md
  ├── GUIA_EMAIL_MARKETING.md
  └── EXEMPLO_CONFIGURACAO_SUPABASE.html
```

### ❌ Incorreto:
```
app-pedagoflow/
  ├── CONFIGURAR_RESEND_SUPABASE.md  ❌
  └── DEPLOY_FUNCAO_BLOG_NEWSLETTER.md  ❌
```

---

## 🎯 Exceções

**Apenas arquivos técnicos do Supabase ficam em `app-pedagoflow/supabase/`:**
- ✅ `supabase/CRIAR_TABELAS_BLOG_NEWSLETTER.sql` (SQL)
- ✅ `supabase/functions/blog-newsletter/index.ts` (Edge Function)

**Mas a documentação de como usar esses arquivos fica no blog:**
- ✅ `blog-kadson-pedro/DEPLOY_FUNCAO_BLOG_NEWSLETTER.md`

---

**Sempre seguir esta regra! 📌**
