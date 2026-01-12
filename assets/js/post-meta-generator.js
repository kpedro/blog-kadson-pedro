/**
 * Gera meta tags Open Graph dinamicamente ANTES do conteúdo carregar
 * Isso ajuda com o scraping do WhatsApp/Facebook
 * 
 * IMPORTANTE: Este script executa imediatamente, mas ainda depende de JavaScript.
 * Para melhor resultado, considere gerar HTML estático para cada post.
 */

(function() {
    // Executa imediatamente quando o script carrega
    const postId = new URLSearchParams(window.location.search).get("post");
    
    if (!postId) return;
    
    // Base URL - usa o domínio atual dinamicamente
    const baseUrl = window.location.origin;
    const currentUrl = window.location.href;
    
    // Metadata dos posts - sincronizado com posts/index.json
    const postMetadata = {
        'saude-mental': {
            title: 'Dicas de Bem-Estar para Aumentar sua Energia Diária',
            description: 'Sentir-se com pouca energia durante o dia é um problema comum, especialmente em rotinas agitadas. A boa notícia é que há práticas simples que você pode adotar para recarregar suas energias e melhorar sua qualidade de vida.',
            image: baseUrl + '/assets/images/saude-mental.jpg'
        },
        'produtividade': {
            title: 'Marketing Multinível: Como Iniciar no Mercado de Bem-Estar',
            description: 'Transforme saúde e bem-estar em oportunidades de sucesso. Um guia completo para novos empreendedores que desejam construir um negócio sólido no mercado de saúde e bem-estar.',
            image: baseUrl + '/assets/images/produtividade.jpg'
        },
        'mentoria': {
            title: 'Como Melhorar sua Produtividade: Dicas Práticas para o Dia a Dia',
            description: 'Maximize seus resultados com estratégias simples e eficazes que você pode aplicar imediatamente. Descubra técnicas comprovadas para aumentar sua produtividade.',
            image: baseUrl + '/assets/images/mentoria.jpg'
        },
        'equilibrio-vida': {
            title: 'Equilíbrio entre Vida Pessoal e Profissional',
            description: 'Descubra estratégias para encontrar o equilíbrio perfeito entre sua vida pessoal e profissional, mantendo alta performance em ambas as áreas.',
            image: baseUrl + '/assets/images/logo-blog.png'
        },
        'exemplo-com-afiliado': {
            title: 'Exemplo de Artigo com Links Afiliados',
            description: 'Veja como integrar links afiliados de forma natural e eficaz em seus artigos, mantendo a qualidade do conteúdo.',
            image: baseUrl + '/assets/images/logo-blog.png'
        }
    };
    
    const metadata = postMetadata[postId];
    
    if (metadata) {
        // Atualiza meta tags imediatamente (antes do DOM estar pronto)
        updateMetaTag('og:title', metadata.title);
        updateMetaTag('og:description', metadata.description);
        updateMetaTag('og:image', metadata.image);
        updateMetaTag('og:url', currentUrl);
        
        updateMetaTag('twitter:title', metadata.title, 'name');
        updateMetaTag('twitter:description', metadata.description, 'name');
        updateMetaTag('twitter:image', metadata.image, 'name');
        
        // Aguarda DOM estar pronto para atualizar outros elementos
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                updatePageElements(metadata);
            });
        } else {
            updatePageElements(metadata);
        }
    }
    
    function updateMetaTag(property, content, type = 'property') {
        // Tenta atualizar se já existe
        let meta = document.querySelector(`meta[${type}="${property}"]`);
        if (meta) {
            meta.content = content;
        } else {
            // Cria se não existe (pode não funcionar antes do head estar pronto)
            if (document.head) {
                meta = document.createElement('meta');
                meta.setAttribute(type, property);
                meta.content = content;
                document.head.appendChild(meta);
            }
        }
    }
    
    function updatePageElements(metadata) {
        // Atualiza meta description padrão
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = metadata.description;
        }
        
        // Atualiza título da página
        document.title = `${metadata.title} - Kadson Pedro`;
        
        // Atualiza canonical URL
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            canonical.href = currentUrl;
        }
    }
})();
