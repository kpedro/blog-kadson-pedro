// Sistema de Links de Afiliado Rastreados
document.addEventListener('DOMContentLoaded', function() {
    // Configuração de links de afiliado
    const affiliateLinks = {
        // Produtos Amway - Substitua pelos seus links reais
        'daily-bem-estar': {
            url: 'https://www.amway.com.br/pt/Daily%2B1-BEM-ESTAR-D45/p/326994/60338539204',
            product: 'Daily+ Bem-Estar D45',
            category: 'Suplementos'
        },
        'daily-imunidade': {
            url: 'https://www.amway.com.br/pt/Daily-%2B1-IMUNIDADE-D45/p/326995/60338539204',
            product: 'Daily+ Imunidade D45',
            category: 'Suplementos'
        },
        'daily-beleza': {
            url: 'https://www.amway.com.br/pt/Daily%2B1-BELEZA-D45/p/326996/60338539204',
            product: 'Daily+ Beleza D45',
            category: 'Suplementos'
        },
        'daily-brilho': {
            url: 'https://www.amway.com.br/pt/Daily-%2B-1-Brilho-D45/p/323874/60338539204',
            product: 'Daily+ Brilho D45',
            category: 'Suplementos'
        }
    };

    // Função para adicionar parâmetros UTM aos links
    function addUTMParams(url, source = 'blog', medium = 'organic', campaign = '') {
        const urlObj = new URL(url);
        urlObj.searchParams.set('utm_source', source);
        urlObj.searchParams.set('utm_medium', medium);
        urlObj.searchParams.set('utm_campaign', campaign || document.title);
        urlObj.searchParams.set('ref', 'kadsonpedro-blog');
        return urlObj.toString();
    }

    // Processa todos os links de afiliado na página
    function processAffiliateLinks() {
        // Links com classe .affiliate-link
        document.querySelectorAll('a.affiliate-link').forEach(link => {
            const productId = link.getAttribute('data-product');
            if (affiliateLinks[productId]) {
                const product = affiliateLinks[productId];
                const trackedUrl = addUTMParams(product.url, 'blog', 'affiliate', productId);
                link.href = trackedUrl;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                
                // Adiciona evento de tracking
                link.addEventListener('click', function() {
                    trackAffiliateClick(productId, product.product);
                });
            }
        });

        // Botões de CTA com classe .cta-affiliate
        document.querySelectorAll('button.cta-affiliate, a.cta-affiliate').forEach(button => {
            const productId = button.getAttribute('data-product');
            if (affiliateLinks[productId]) {
                const product = affiliateLinks[productId];
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const trackedUrl = addUTMParams(product.url, 'blog', 'cta-button', productId);
                    trackAffiliateClick(productId, product.product);
                    window.open(trackedUrl, '_blank', 'noopener,noreferrer');
                });
            }
        });
    }

    // Função de tracking (pode integrar com Google Analytics)
    function trackAffiliateClick(productId, productName) {
        // Google Analytics 4 (se configurado)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'affiliate_click', {
                'product_id': productId,
                'product_name': productName,
                'page_title': document.title,
                'page_url': window.location.href
            });
        }

        // Console log para debug
        console.log('Affiliate Click:', {
            productId,
            productName,
            timestamp: new Date().toISOString(),
            page: window.location.href
        });

        // Pode enviar para seu backend também
        // fetch('/api/track-click', { method: 'POST', body: JSON.stringify({...}) });
    }

    // Inicializa o processamento
    processAffiliateLinks();

    // Observa mudanças dinâmicas (para conteúdo carregado via AJAX)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                processAffiliateLinks();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// Função global para criar links de afiliado programaticamente
window.createAffiliateLink = function(productId, text, className = 'affiliate-link') {
    const link = document.createElement('a');
    link.href = '#';
    link.className = className;
    link.setAttribute('data-product', productId);
    link.textContent = text;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    return link;
};
