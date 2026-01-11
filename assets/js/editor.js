// Editor de Posts - Funcionalidades
let simplemde;
let currentDraft = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeEditor();
    setupEventListeners();
    loadDrafts();
    updateWordCount();
    setDefaultDate();
});

// Inicializa o editor SimpleMDE
function initializeEditor() {
    simplemde = new SimpleMDE({
        element: document.getElementById('post-editor'),
        placeholder: 'Comece a escrever seu post aqui...',
        spellChecker: false,
        autosave: {
            enabled: true,
            uniqueId: 'blog-post-editor',
            delay: 1000
        },
        toolbar: [
            'bold', 'italic', 'strikethrough', '|',
            'heading-1', 'heading-2', 'heading-3', '|',
            'code', 'quote', 'unordered-list', 'ordered-list', '|',
            'link', 'image', 'table', '|',
            'preview', 'side-by-side', 'fullscreen', '|',
            'guide'
        ],
        status: ['lines', 'words', 'cursor']
    });

    // Atualiza preview quando o conteúdo muda
    simplemde.codemirror.on('change', function() {
        updatePreview();
        updateWordCount();
        autoSaveDraft();
    });
}

// Configura event listeners
function setupEventListeners() {
    // Botões da toolbar
    document.querySelectorAll('.toolbar-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleToolbarAction(action);
        });
    });

    // Botões principais
    document.getElementById('btn-preview').addEventListener('click', togglePreview);
    document.getElementById('btn-save-draft').addEventListener('click', saveDraft);
    document.getElementById('btn-publish').addEventListener('click', publishPost);
    
    // Sidebar
    document.getElementById('toggle-sidebar').addEventListener('click', toggleSidebar);
    document.getElementById('toggle-preview').addEventListener('click', togglePreview);
    
    // Carregar rascunho
    document.getElementById('load-draft').addEventListener('click', loadSelectedDraft);
    
    // Modal
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-cancel').addEventListener('click', closeModal);
    
    // Gerar slug automaticamente
    document.getElementById('post-title').addEventListener('input', function() {
        if (!document.getElementById('post-slug').value) {
            generateSlug(this.value);
        }
    });
    
    // Criar botão flutuante para sidebar
    createSidebarToggle();
}

// Ações da toolbar
function handleToolbarAction(action) {
    const editor = simplemde.codemirror;
    const cursor = editor.getCursor();
    const selectedText = editor.getSelection();
    
    switch(action) {
        case 'affiliate-link':
            insertAffiliateLink(editor, cursor, selectedText);
            break;
        case 'cta-button':
            insertCTAButton(editor, cursor);
            break;
        case 'product-card':
            insertProductCard(editor, cursor);
            break;
        case 'product-highlight':
            insertProductHighlight(editor, cursor);
            break;
        case 'template-intro':
            insertIntroTemplate(editor);
            break;
        case 'template-full':
            insertFullTemplate(editor);
            break;
    }
}

// Insere link de afiliado
function insertAffiliateLink(editor, cursor, selectedText) {
    const products = {
        'daily-bem-estar': 'Daily+ Bem-Estar D45',
        'daily-imunidade': 'Daily+ Imunidade D45',
        'daily-beleza': 'Daily+ Beleza D45',
        'daily-brilho': 'Daily+ Brilho D45'
    };
    
    const productId = prompt('Digite o ID do produto (daily-bem-estar, daily-imunidade, etc.):');
    if (!productId || !products[productId]) {
        alert('ID de produto inválido!');
        return;
    }
    
    const text = selectedText || products[productId];
    const markdown = `[${text}](affiliate:${productId})`;
    
    editor.replaceSelection(markdown);
    updatePreview();
}

// Insere botão CTA
function insertCTAButton(editor, cursor) {
    const products = {
        'daily-bem-estar': 'Daily+ Bem-Estar D45',
        'daily-imunidade': 'Daily+ Imunidade D45',
        'daily-beleza': 'Daily+ Beleza D45',
        'daily-brilho': 'Daily+ Brilho D45'
    };
    
    const productId = prompt('Digite o ID do produto:');
    if (!productId || !products[productId]) {
        alert('ID de produto inválido!');
        return;
    }
    
    const buttonText = prompt('Texto do botão:', `Conheça o ${products[productId]} →`);
    
    const html = `<a href="#" class="cta-button cta-affiliate" data-product="${productId}">${buttonText}</a>`;
    
    editor.replaceSelection(html);
    updatePreview();
}

// Insere card de produto
function insertProductCard(editor, cursor) {
    const productId = prompt('ID do produto (daily-bem-estar, daily-imunidade, etc.):');
    const badge = prompt('Badge (Mais Vendido, Novo, Recomendado) ou deixe vazio:');
    
    const html = `<div class="product-card">
    ${badge ? `<span class="product-badge">${badge}</span>` : ''}
    <h4>Nome do Produto</h4>
    <p>Descrição do produto aqui...</p>
    <a href="#" class="cta-button cta-affiliate" data-product="${productId}">
        Conheça o Produto →
    </a>
</div>`;
    
    editor.replaceSelection(html);
    updatePreview();
}

// Insere destaque de produto
function insertProductHighlight(editor, cursor) {
    const productId = prompt('ID do produto:');
    const title = prompt('Título do destaque:', '💊 Produto Recomendado');
    
    const html = `<div class="product-highlight">
    <h4>${title}</h4>
    <p>Descrição do produto e seus benefícios...</p>
    <a href="#" class="cta-button cta-affiliate" data-product="${productId}">
        Quero Conhecer o Produto →
    </a>
</div>`;
    
    editor.replaceSelection(html);
    updatePreview();
}

// Templates
function insertIntroTemplate(editor) {
    const template = `## Introdução

[Seu texto de introdução aqui. Fale sobre o problema que o leitor enfrenta e o que ele vai aprender neste artigo.]

---

## Por que isso é importante?

[Explique a importância do tema e como isso afeta a vida do leitor.]

---

## O que você vai descobrir

- [ ] Primeiro ponto
- [ ] Segundo ponto
- [ ] Terceiro ponto

---`;
    
    editor.setValue(template);
    updatePreview();
}

function insertFullTemplate(editor) {
    const title = document.getElementById('post-title').value || 'Título do Post';
    const date = document.getElementById('post-date').value || new Date().toISOString().split('T')[0];
    const author = document.getElementById('post-author').value || 'Kadson Pedro';
    const category = document.getElementById('post-category').value || 'Saúde & Bem-Estar';
    
    const template = `# ${title}

📅 **${formatDate(date)}**
✍️ **Por ${author}**
🏷️ **${category}**

![Imagem do Post](../assets/images/nome-imagem.jpg)
_Descrição da imagem_

## Introdução

[Introduza o tema e o que o leitor vai aprender.]

---

## Desenvolvimento

### Seção 1: Título

[Conteúdo da primeira seção...]

### Seção 2: Título

[Conteúdo da segunda seção...]

<div class="product-highlight">
    <h4>💊 Produto Recomendado</h4>
    <p>Para quem busca resultados, recomendo o <a href="#" class="affiliate-link" data-product="daily-bem-estar">Daily+ Bem-Estar D45</a>...</p>
    <a href="#" class="cta-button cta-affiliate" data-product="daily-bem-estar">
        Conheça o Produto →
    </a>
</div>

---

## Conclusão

[Resumo dos pontos principais e próximos passos.]

---

<div class="final-cta product-highlight">
    <h4>🚀 Transforme sua saúde hoje!</h4>
    <p>Se você está buscando resultados reais, conheça nossos produtos recomendados.</p>
    <a href="contato.html" class="cta-button primary">
        Quero Saber Mais →
    </a>
</div>`;
    
    editor.setValue(template);
    updatePreview();
}

// Atualiza preview
function updatePreview() {
    const markdown = simplemde.value();
    const previewContent = document.getElementById('preview-content');
    
    if (!markdown.trim()) {
        previewContent.innerHTML = '<p class="preview-placeholder">O preview aparecerá aqui...</p>';
        return;
    }
    
    // Processa links de afiliado no markdown
    let processedMarkdown = markdown.replace(
        /\[([^\]]+)\]\(affiliate:([^)]+)\)/g,
        '<a href="#" class="affiliate-link" data-product="$2">$1</a>'
    );
    
    // Converte markdown para HTML
    const html = marked.parse(processedMarkdown);
    previewContent.innerHTML = html;
    
    // Reaplica scripts de afiliado (se necessário)
    if (typeof processAffiliateLinks === 'function') {
        processAffiliateLinks();
    }
}

// Toggle preview
function togglePreview() {
    const previewPanel = document.getElementById('preview-panel');
    previewPanel.classList.toggle('hidden');
    updatePreview();
}

// Salva rascunho
function saveDraft() {
    const draft = {
        title: document.getElementById('post-title').value,
        content: simplemde.value(),
        date: document.getElementById('post-date').value,
        author: document.getElementById('post-author').value,
        category: document.getElementById('post-category').value,
        image: document.getElementById('post-image').value,
        slug: document.getElementById('post-slug').value,
        timestamp: new Date().toISOString()
    };
    
    const drafts = JSON.parse(localStorage.getItem('blog_drafts') || '[]');
    drafts.push(draft);
    localStorage.setItem('blog_drafts', JSON.stringify(drafts));
    
    showNotification('Rascunho salvo com sucesso!', 'success');
    loadDrafts();
}

// Carrega rascunhos
function loadDrafts() {
    const drafts = JSON.parse(localStorage.getItem('blog_drafts') || '[]');
    const select = document.getElementById('drafts-list');
    
    select.innerHTML = '<option value="">Selecione um rascunho...</option>';
    
    drafts.reverse().forEach((draft, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${draft.title || 'Sem título'} - ${formatDate(draft.date || draft.timestamp)}`;
        select.appendChild(option);
    });
}

// Carrega rascunho selecionado
function loadSelectedDraft() {
    const select = document.getElementById('drafts-list');
    const index = select.value;
    
    if (!index) {
        alert('Selecione um rascunho!');
        return;
    }
    
    const drafts = JSON.parse(localStorage.getItem('blog_drafts') || '[]');
    const draft = drafts.reverse()[index];
    
    if (draft) {
        document.getElementById('post-title').value = draft.title || '';
        document.getElementById('post-date').value = draft.date || '';
        document.getElementById('post-author').value = draft.author || 'Kadson Pedro';
        document.getElementById('post-category').value = draft.category || 'Saúde & Bem-Estar';
        document.getElementById('post-image').value = draft.image || '';
        document.getElementById('post-slug').value = draft.slug || '';
        simplemde.value(draft.content || '');
        
        updatePreview();
        updateWordCount();
        showNotification('Rascunho carregado!', 'success');
    }
}

// Publica post
function publishPost() {
    const title = document.getElementById('post-title').value;
    const slug = document.getElementById('post-slug').value;
    const content = simplemde.value();
    
    if (!title || !slug || !content) {
        alert('Preencha título, slug e conteúdo antes de publicar!');
        return;
    }
    
    showModal(
        'Publicar Post',
        `Tem certeza que deseja publicar "${title}"? O arquivo será gerado para download.`,
        function() {
            generatePostFile();
        }
    );
}

// Gera arquivo do post
function generatePostFile() {
    const title = document.getElementById('post-title').value;
    const date = document.getElementById('post-date').value;
    const author = document.getElementById('post-author').value;
    const category = document.getElementById('post-category').value;
    const image = document.getElementById('post-image').value;
    const content = simplemde.value();
    
    // Adiciona metadados no início
    let finalContent = `# ${title}\n\n`;
    finalContent += `📅 **${formatDate(date)}**\n`;
    finalContent += `✍️ **Por ${author}**\n`;
    finalContent += `🏷️ **${category}**\n\n`;
    
    if (image) {
        finalContent += `![${title}](${image})\n`;
        finalContent += `_Descrição da imagem_\n\n`;
    }
    
    finalContent += content;
    
    // Cria arquivo para download
    const blob = new Blob([finalContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${document.getElementById('post-slug').value || 'post'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Post gerado com sucesso! Salve o arquivo na pasta posts/', 'success');
    closeModal();
}

// Funções auxiliares
function updateWordCount() {
    const content = simplemde.value();
    const words = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    document.getElementById('word-count').textContent = words;
}

function generateSlug(title) {
    const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    document.getElementById('post-slug').value = slug;
}

function formatDate(dateString) {
    if (!dateString) return new Date().toLocaleDateString('pt-BR');
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
    });
}

function setDefaultDate() {
    const dateInput = document.getElementById('post-date');
    if (!dateInput.value) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
}

function toggleSidebar() {
    document.getElementById('editor-sidebar').classList.toggle('open');
}

function createSidebarToggle() {
    const btn = document.createElement('button');
    btn.className = 'sidebar-toggle';
    btn.innerHTML = '<i class="fas fa-cog"></i>';
    btn.title = 'Abrir configurações';
    btn.addEventListener('click', toggleSidebar);
    document.body.appendChild(btn);
}

function autoSaveDraft() {
    // Auto-save a cada 30 segundos
    if (!window.autoSaveTimer) {
        window.autoSaveTimer = setTimeout(() => {
            const title = document.getElementById('post-title').value;
            if (title && simplemde.value()) {
                saveDraft();
            }
            window.autoSaveTimer = null;
        }, 30000);
    }
}

function showModal(title, message, onConfirm) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').textContent = message;
    document.getElementById('modal').classList.add('show');
    
    const confirmBtn = document.getElementById('modal-confirm');
    confirmBtn.onclick = function() {
        if (onConfirm) onConfirm();
    };
}

function closeModal() {
    document.getElementById('modal').classList.remove('show');
}

function showNotification(message, type = 'info') {
    // Cria notificação temporária
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        background: ${type === 'success' ? '#4caf50' : '#2196f3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Adiciona animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
