# 🚀 Deploy do Blog no Vercel

## 📋 Pré-requisitos

- ✅ GitHub atualizado
- ✅ Conta Vercel (https://vercel.com)
- ✅ Repositório conectado ao GitHub

---

## 🚀 Passo a Passo

### **1. Acessar Vercel**

1. Acesse: https://vercel.com
2. Faça login (pode usar GitHub)
3. Clique em **Add New...** → **Project**

### **2. Importar Projeto do GitHub**

1. Selecione o repositório: `blog-kadson-pedro`
2. Clique em **Import**

### **3. Configurar Projeto**

**Configurações:**
- **Framework Preset**: `Other` ou `Static Site`
- **Root Directory**: `.` (raiz)
- **Build Command**: Deixe vazio (site estático)
- **Output Directory**: `.` (raiz)
- **Install Command**: `npm install` (opcional, só se precisar)

### **4. Variáveis de Ambiente (Opcional)**

Se precisar de variáveis (ex: EmailJS, Supabase):
- Clique em **Environment Variables**
- Adicione conforme necessário

**Para o blog, geralmente não precisa de variáveis no build!**

### **5. Deploy**

1. Clique em **Deploy**
2. Aguarde o build (1-2 minutos)
3. ✅ Deploy concluído!

---

## 🌐 Configurar Domínio

### **Opção 1: Usar Domínio da Vercel**
- URL automática: `blog-kadson-pedro.vercel.app`
- Já funciona após deploy!

### **Opção 2: Domínio Customizado**
1. No projeto Vercel, vá em **Settings** → **Domains**
2. Adicione seu domínio: `kadsonpedro.com.br` (ou subdomínio)
3. Configure DNS conforme instruções da Vercel

---

## ✅ Verificação

Após o deploy, verifique:
- ✅ Site carrega corretamente
- ✅ Links funcionam
- ✅ Formulários funcionam
- ✅ Newsletter funciona
- ✅ Imagens carregam

---

## 🔄 Atualizações Futuras

**Push automático:**
- Faça `git push` no GitHub
- Vercel detecta automaticamente
- Faz novo deploy automaticamente

**Ou manual:**
- Vercel Dashboard → **Deployments** → **Redeploy**

---

## 🔍 Troubleshooting

### **Erro: "Build failed"**
- Verifique se todos os arquivos estão no GitHub
- Confirme que `vercel.json` está correto
- Veja logs de build no Vercel

### **Erro: "404 Not Found"**
- Verifique se `index.html` está na raiz
- Confirme configuração de rotas no `vercel.json`

### **CSS/JS não carrega:**
- Verifique caminhos relativos nos HTML
- Confirme que arquivos estão na pasta correta

---

## 📝 Próximos Passos

Após deploy bem-sucedido:
1. ✅ Anotar URL do Vercel
2. ✅ Configurar domínio (se necessário)
3. ✅ Adicionar URL no Supabase (variável `BLOG_URL`)

---

**Deploy pronto! 🎉**
