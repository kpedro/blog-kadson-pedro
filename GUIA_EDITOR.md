# 📝 Guia do Editor de Posts

## 🚀 Como Usar o Editor

### 1. **Acessar o Editor**
- Acesse `editor.html` no navegador
- Ou clique em "Editor" no menu do blog

### 2. **Interface do Editor**

O editor possui 3 áreas principais:

#### **Painel Esquerdo: Editor Markdown**
- Escreva seu conteúdo em Markdown
- Suporte completo a formatação
- Auto-save a cada segundo

#### **Painel Direito: Preview**
- Visualize como o post ficará publicado
- Atualiza em tempo real
- Clique no "X" para ocultar

#### **Sidebar: Configurações** (botão flutuante no canto inferior direito)
- Título do post
- Data de publicação
- Autor
- Categoria
- URL da imagem
- Slug (nome do arquivo)
- Produtos relacionados

---

## 🛠️ Ferramentas Rápidas

### **Barra de Ferramentas Superior**

#### **Inserir Elementos:**

1. **Link Afiliado** 🔗
   - Insere link de afiliado no texto
   - Formato: `[Texto](affiliate:product-id)`
   - Exemplo: `[Daily+ Bem-Estar](affiliate:daily-bem-estar)`

2. **Botão CTA** 👆
   - Insere botão de call-to-action
   - Formato HTML pronto
   - Personalizável

3. **Card Produto** 📦
   - Insere card completo de produto
   - Com badge, descrição e botão
   - Pronto para usar

4. **Destaque Produto** ⭐
   - Insere seção destacada de produto
   - Ideal para menções no meio do texto
   - Com botão CTA

#### **Templates:**

1. **Template Introdução**
   - Estrutura básica de introdução
   - Com seções pré-formatadas

2. **Template Completo**
   - Post completo com todas as seções
   - Metadados automáticos
   - Pronto para personalizar

---

## ✍️ Como Criar um Post

### **Passo 1: Configurar Metadados**
1. Clique no botão de configurações (canto inferior direito)
2. Preencha:
   - **Título**: Título do post
   - **Data**: Data de publicação
   - **Autor**: Seu nome (padrão: Kadson Pedro)
   - **Categoria**: Selecione a categoria
   - **Imagem**: URL da imagem (ex: `assets/images/nome.jpg`)
   - **Slug**: Nome do arquivo (gerado automaticamente do título)

### **Passo 2: Escrever Conteúdo**
1. Use o editor Markdown para escrever
2. Use as ferramentas rápidas para inserir elementos de afiliado
3. Visualize o preview em tempo real

### **Passo 3: Inserir Links de Afiliado**

#### **Opção A: Link Simples**
Clique em "Link Afiliado" e digite o ID do produto:
- `daily-bem-estar`
- `daily-imunidade`
- `daily-beleza`
- `daily-brilho`

#### **Opção B: Botão CTA**
Clique em "Botão CTA" e personalize o texto

#### **Opção C: Card Completo**
Clique em "Card Produto" para inserir card completo

### **Passo 4: Salvar Rascunho**
- Clique em "Salvar Rascunho" para salvar localmente
- Rascunhos ficam salvos no navegador
- Pode carregar depois na sidebar

### **Passo 5: Publicar**
1. Clique em "Publicar"
2. Confirme a publicação
3. O arquivo `.md` será baixado automaticamente
4. Salve o arquivo na pasta `posts/` do blog

---

## 📋 Estrutura de um Post Completo

```markdown
# Título do Post

📅 **Data**
✍️ **Por Autor**
🏷️ **Categoria**

![Imagem](caminho/imagem.jpg)
_Descrição da imagem_

## Introdução
[Seu conteúdo...]

---

## Desenvolvimento
[Seu conteúdo...]

<div class="product-highlight">
    <h4>💊 Produto Recomendado</h4>
    <p>Descrição...</p>
    <a href="#" class="cta-button cta-affiliate" data-product="daily-bem-estar">
        Botão →
    </a>
</div>

---

## Conclusão
[Seu conteúdo...]
```

---

## 💡 Dicas de Uso

### **1. Atalhos do Editor**
- `Ctrl + B` - Negrito
- `Ctrl + I` - Itálico
- `Ctrl + K` - Link
- `Ctrl + Shift + P` - Preview

### **2. Auto-Save**
- O editor salva automaticamente a cada segundo
- Rascunhos são salvos no navegador
- Não perca seu trabalho!

### **3. Preview em Tempo Real**
- Veja como ficará o post antes de publicar
- Links de afiliado são processados automaticamente
- Estilos CSS aplicados

### **4. Gerar Slug Automaticamente**
- Digite o título primeiro
- O slug é gerado automaticamente
- Pode editar manualmente se necessário

### **5. Templates**
- Use templates para começar rápido
- Personalize depois
- Economize tempo

---

## 🎨 Elementos Disponíveis

### **Links de Afiliado**
```markdown
[Texto do Link](affiliate:product-id)
```

### **Botões CTA**
```html
<a href="#" class="cta-button cta-affiliate" data-product="daily-bem-estar">
    Texto do Botão →
</a>
```

### **Cards de Produto**
```html
<div class="product-card">
    <span class="product-badge">Mais Vendido</span>
    <h4>Nome do Produto</h4>
    <p>Descrição...</p>
    <a href="#" class="cta-button cta-affiliate" data-product="daily-bem-estar">
        Conheça o Produto →
    </a>
</div>
```

### **Destaques de Produto**
```html
<div class="product-highlight">
    <h4>💊 Título</h4>
    <p>Descrição...</p>
    <a href="#" class="cta-button cta-affiliate" data-product="daily-bem-estar">
        Botão →
    </a>
</div>
```

---

## 🔧 Solução de Problemas

### **Preview não atualiza?**
- Clique no botão "Preview" novamente
- Verifique se há erros no console (F12)

### **Links de afiliado não funcionam?**
- Certifique-se de usar o formato correto: `affiliate:product-id`
- Verifique se o ID do produto existe

### **Arquivo não baixa ao publicar?**
- Verifique se o bloqueador de pop-ups está desativado
- Tente em outro navegador

### **Rascunhos não aparecem?**
- Verifique se está usando o mesmo navegador
- Rascunhos são salvos localmente (localStorage)

---

## 📝 Exemplo Prático

1. **Abra o editor**
2. **Clique em "Template Completo"**
3. **Preencha os metadados na sidebar**
4. **Personalize o conteúdo**
5. **Use "Link Afiliado" ou "Botão CTA" para inserir produtos**
6. **Visualize no preview**
7. **Salve como rascunho**
8. **Publique quando estiver pronto**

---

## 🚀 Próximos Passos

Após publicar:
1. Salve o arquivo `.md` na pasta `posts/`
2. Adicione a entrada no `posts/index.json` (se houver)
3. Teste o post acessando `post.html?post=nome-do-arquivo`

---

**Pronto para criar posts incríveis! 🎉**
