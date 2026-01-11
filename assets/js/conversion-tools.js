// Ferramentas de Conversão e Otimização
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Adiciona disclosure de afiliado automaticamente em posts
    function addAffiliateDisclosure() {
        const postContent = document.getElementById('post-content');
        if (!postContent) return;

        // Verifica se há links de afiliado no conteúdo
        const hasAffiliateLinks = postContent.querySelectorAll('.affiliate-link, .cta-affiliate').length > 0;
        
        if (hasAffiliateLinks) {
            const disclosure = document.createElement('div');
            disclosure.className = 'affiliate-disclosure';
            disclosure.innerHTML = '<strong>📌 Aviso:</strong> Este post contém links de afiliado. Se você comprar através desses links, posso receber uma pequena comissão, sem custo adicional para você. Isso me ajuda a continuar criando conteúdo de qualidade para você!';
            
            // Insere antes do primeiro link de afiliado ou no final do conteúdo
            const firstAffiliateLink = postContent.querySelector('.affiliate-link, .cta-affiliate');
            if (firstAffiliateLink) {
                firstAffiliateLink.parentNode.insertBefore(disclosure, firstAffiliateLink);
            } else {
                postContent.insertBefore(disclosure, postContent.firstChild);
            }
        }
    }

    // 2. Cria seção "Produtos Recomendados" dinamicamente
    function createRecommendedProductsSection() {
        const postContent = document.getElementById('post-content');
        if (!postContent) return;

        // Verifica se já existe
        if (postContent.querySelector('.products-recommended')) return;

        // Produtos recomendados baseados em palavras-chave do conteúdo
        const content = postContent.textContent.toLowerCase();
        const recommendedProducts = [];

        if (content.includes('digest') || content.includes('intestin') || content.includes('sistema digestivo')) {
            recommendedProducts.push({
                id: 'daily-bem-estar',
                name: 'Daily+ Bem-Estar D45',
                description: 'Suplemento completo para fortalecer o sistema imunológico e a saúde cardiovascular.',
                badge: 'Mais Vendido'
            });
        }

        if (content.includes('imunidade') || content.includes('defesa') || content.includes('resfriado')) {
            recommendedProducts.push({
                id: 'daily-imunidade',
                name: 'Daily+ Imunidade D45',
                description: 'Perfeito para reforçar o sistema imunológico com vitamina C e nutrientes essenciais.',
                badge: 'Recomendado'
            });
        }

        if (content.includes('pele') || content.includes('beleza') || content.includes('antioxidante')) {
            recommendedProducts.push({
                id: 'daily-beleza',
                name: 'Daily+ Beleza D45',
                description: 'Para promover uma pele saudável e radiante com vitamina E e nutrientes.',
                badge: 'Novo'
            });
        }

        if (recommendedProducts.length > 0) {
            const section = document.createElement('div');
            section.className = 'products-recommended';
            section.innerHTML = '<h3>🛍️ Produtos Recomendados</h3>';
            
            recommendedProducts.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    <h4>${product.name}</h4>
                    <p>${product.description}</p>
                    <a href="#" class="cta-button cta-affiliate" data-product="${product.id}">
                        Conheça o Produto →
                    </a>
                `;
                section.appendChild(productCard);
            });

            // Insere após o primeiro parágrafo ou no meio do conteúdo
            const firstParagraph = postContent.querySelector('p');
            if (firstParagraph && firstParagraph.nextSibling) {
                postContent.insertBefore(section, firstParagraph.nextSibling);
            } else {
                postContent.appendChild(section);
            }
        }
    }

    // 3. Adiciona CTA no final do artigo
    function addFinalCTA() {
        const postContent = document.getElementById('post-content');
        if (!postContent) return;

        // Verifica se já existe
        if (postContent.querySelector('.final-cta')) return;

        const finalCTA = document.createElement('div');
        finalCTA.className = 'final-cta product-highlight';
        finalCTA.innerHTML = `
            <h4>🚀 Transforme sua saúde hoje!</h4>
            <p>Se você está buscando resultados reais e duradouros, conheça nossos produtos recomendados. Cada um foi cuidadosamente selecionado para oferecer o melhor em qualidade e resultados.</p>
            <a href="contato.html" class="cta-button primary">
                Quero Saber Mais →
            </a>
        `;

        postContent.appendChild(finalCTA);
    }

    // 4. Scroll tracking (rastreia quanto o usuário leu)
    function trackScrollDepth() {
        let maxScroll = 0;
        const milestones = [25, 50, 75, 100];
        const tracked = [];

        window.addEventListener('scroll', function() {
            const scrollPercent = Math.round(
                ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
            );

            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;

                milestones.forEach(milestone => {
                    if (scrollPercent >= milestone && !tracked.includes(milestone)) {
                        tracked.push(milestone);
                        
                        // Google Analytics
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'scroll_depth', {
                                'event_category': 'Engagement',
                                'event_label': `${milestone}%`,
                                'value': milestone
                            });
                        }

                        console.log(`Scroll depth: ${milestone}%`);
                    }
                });
            }
        });
    }

    // 5. Time on page tracking
    function trackTimeOnPage() {
        const startTime = Date.now();
        
        window.addEventListener('beforeunload', function() {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'time_on_page', {
                    'event_category': 'Engagement',
                    'event_label': 'seconds',
                    'value': timeSpent
                });
            }

            console.log(`Time on page: ${timeSpent} seconds`);
        });
    }

    // Inicializa todas as funções
    setTimeout(() => {
        addAffiliateDisclosure();
        createRecommendedProductsSection();
        addFinalCTA();
    }, 1000); // Aguarda conteúdo carregar

    trackScrollDepth();
    trackTimeOnPage();
});

// Função para criar link de afiliado no markdown
window.insertAffiliateLink = function(productId, text) {
    const link = document.createElement('a');
    link.href = '#';
    link.className = 'affiliate-link';
    link.setAttribute('data-product', productId);
    link.textContent = text;
    return link.outerHTML;
};
