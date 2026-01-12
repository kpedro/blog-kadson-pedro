# 🔐 Como Acessar a Área Administrativa

## 📍 Localização

A área administrativa está localizada em:
```
/admin.html
```

**URL completa (quando o blog estiver no ar):**
```
https://seu-dominio.com/admin.html
```

**URL local (para desenvolvimento):**
```
http://localhost:3000/admin.html
```

---

## 🔑 Credenciais de Acesso

**Senha padrão:** `admin2025`

⚠️ **IMPORTANTE:** Altere esta senha no arquivo `assets/js/admin-auth.js` (linha 5) para maior segurança!

---

## 🎯 O que você encontra na área administrativa?

Após fazer login, você terá acesso a:

1. **📝 Editor de Posts** (`editor.html`)
   - Criar novos artigos
   - Editar posts existentes
   - Gerenciar rascunhos
   - Publicar conteúdo

2. **📧 Gerenciar Newsletter** (`admin-newsletter.html`)
   - Ver lista de assinantes
   - Enviar campanhas de email
   - Estatísticas de newsletter
   - Exportar dados

---

## 🔒 Segurança

- ✅ **Protegida por senha** - Apenas você pode acessar
- ✅ **Links removidos do menu público** - Usuários comuns não veem
- ✅ **Sessão temporária** - Expira após 2 horas
- ✅ **Redirecionamento automático** - Páginas protegidas redirecionam para login

---

## 📝 Como Alterar a Senha

1. Abra o arquivo: `assets/js/admin-auth.js`
2. Localize a linha 5: `this.ADMIN_PASSWORD = 'admin2025';`
3. Altere para sua senha desejada
4. Salve o arquivo

---

## 🚀 Acesso Rápido

Você pode acessar diretamente digitando na barra de endereços:
- `/admin.html` (relativo)
- Ou a URL completa do seu domínio
