# 📝 Guia: Como Usar Links de Afiliado nos Posts

## 🎯 Estratégia de Implementação

### 1. **No Markdown do Post**

#### Opção A: Link Simples (Recomendado)
```markdown
Para melhorar o sistema digestivo, recomendo o [Daily+ Bem-Estar D45](daily-bem-estar), 
que contém nutrientes essenciais para sua saúde.
```

#### Opção B: Botão de CTA
```html
<div class="product-highlight">
    <h4>💊 Solução Recomendada</h4>
    <p>O Daily+ Bem-Estar D45 é ideal para quem busca fortalecer o sistema imunológico...</p>
    <a href="#" class="cta-button cta-affiliate" data-product="daily-bem-estar">
        Conheça o Produto →
    </a>
</div>
```

#### Opção C: Seção de Produtos
```html
<div class="products-recommended">
    <h3>🛍️ Produtos Recomendados</h3>
    <div class="product-card">
        <span class="product-badge">Mais Vendido</span>
        <h4>Daily+ Bem-Estar D45</h4>
        <p>Suplemento completo para fortalecer o sistema imunológico...</p>
        <a href="#" class="cta-button cta-affiliate" data-product="daily-bem-estar">
            Conheça o Produto →
        </a>
    </div>
</div>
```

---

## 📋 Produtos Disponíveis

### IDs de Produtos (use no atributo `data-product`):

1. **`daily-bem-estar`** - Daily+ Bem-Estar D45
2. **`daily-imunidade`** - Daily+ Imunidade D45
3. **`daily-beleza`** - Daily+ Beleza D45
4. **`daily-brilho`** - Daily+ Brilho D45

---

## ✍️ Exemplo de Post Completo

```markdown
# Como Cuidar do Sistema Digestivo Naturalmente

## Introdução
O sistema digestivo é fundamental para nossa saúde geral...

## Problemas Comuns
Muitas pessoas sofrem com...

## Soluções Naturais

### 1. Alimentação Equilibrada
Uma dieta rica em fibras...

### 2. Suplementação Inteligente
Para quem busca uma solução completa, recomendo o 
[Daily+ Bem-Estar D45](daily-bem-estar), que combina 
nutrientes essenciais para fortalecer o sistema imunológico 
e melhorar a saúde digestiva.

<div class="product-highlight">
    <h4>💊 Por que o Daily+ Bem-Estar?</h4>
    <p>Este suplemento foi desenvolvido com uma combinação única de 
    nutrientes que trabalham em sinergia para:</p>
    <ul>
        <li>Fortalecer o sistema imunológico</li>
        <li>Melhorar a saúde cardiovascular</li>
        <li>Fornecer nutrientes essenciais diários</li>
    </ul>
    <a href="#" class="cta-button cta-affiliate" data-product="daily-bem-estar">
        Quero Conhecer o Produto →
    </a>
</div>

## Conclusão
Cuidar do sistema digestivo é essencial...

---

<div class="final-cta product-highlight">
    <h4>🚀 Transforme sua saúde hoje!</h4>
    <p>Se você está buscando resultados reais, conheça nossos produtos recomendados.</p>
    <a href="contato.html" class="cta-button primary">
        Quero Saber Mais →
    </a>
</div>
```

---

## 🎨 Elementos Visuais Disponíveis

### 1. **Link Contextual** (no meio do texto)
```markdown
[texto do link](daily-bem-estar)
```
- Aparece como link normal com seta
- Ideal para menções naturais no texto

### 2. **Botão CTA Simples**
```html
<a href="#" class="cta-button cta-affiliate" data-product="daily-bem-estar">
    Conheça o Produto →
</a>
```

### 3. **Botão CTA Primário** (destaque)
```html
<a href="#" class="cta-button primary cta-affiliate" data-product="daily-bem-estar">
    Quero Transformar Minha Saúde →
</a>
```

### 4. **Card de Produto**
```html
<div class="product-card">
    <span class="product-badge">Mais Vendido</span>
    <h4>Nome do Produto</h4>
    <p>Descrição do produto...</p>
    <a href="#" class="cta-button cta-affiliate" data-product="daily-bem-estar">
        Conheça o Produto →
    </a>
</div>
```

### 5. **Destaque de Produto**
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

## 📊 Boas Práticas

### ✅ FAÇA:
1. **Mencione produtos naturalmente** - No contexto da solução
2. **Eduque primeiro** - Conteúdo de valor antes da venda
3. **Use depoimentos** - Prova social aumenta conversão
4. **Seja transparente** - Disclosure de afiliado é obrigatório
5. **Teste diferentes CTAs** - Veja o que funciona melhor

### ❌ NÃO FAÇA:
1. **Não seja muito comercial** - Evite parecer apenas publicidade
2. **Não force o produto** - Deixe o leitor interessado naturalmente
3. **Não esqueça o disclosure** - É obrigatório por lei
4. **Não use muitos links** - 1-3 por artigo é suficiente
5. **Não ignore o conteúdo** - Conteúdo de qualidade vem primeiro

---

## 🔗 Atualizar Links de Afiliado

Para adicionar novos produtos ou atualizar links, edite o arquivo:
`assets/js/affiliate-links.js`

```javascript
const affiliateLinks = {
    'novo-produto': {
        url: 'https://seu-link-amway.com/produto',
        product: 'Nome do Produto',
        category: 'Categoria'
    }
};
```

---

## 📈 Tracking e Analytics

Todos os cliques são automaticamente rastreados com:
- **UTM Parameters** (fonte, meio, campanha)
- **Google Analytics** (se configurado)
- **Console logs** (para debug)

---

## 💡 Dicas de Conversão

1. **Posicione links estrategicamente:**
   - Meio do artigo (após educar)
   - Final do artigo (CTA final)
   - Sidebar (sempre visível)

2. **Use palavras de ação:**
   - "Conheça", "Descubra", "Transforme"
   - "Quero", "Vou", "Agora"

3. **Crie urgência:**
   - "Oferta limitada"
   - "Últimas unidades"
   - "Promoção válida até..."

4. **Prova social:**
   - "Mais de 10.000 clientes satisfeitos"
   - "Avaliação 5 estrelas"
   - Depoimentos reais

---

**Pronto para começar a converter! 🚀**
