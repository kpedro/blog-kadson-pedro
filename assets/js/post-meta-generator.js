/**
 * Gera meta tags Open Graph dinamicamente ANTES do conteúdo carregar
 * Isso ajuda com o scraping do WhatsApp/Facebook
 */

(function() {
    // Executa imediatamente, antes do DOM carregar
    const postId = new URLSearchParams(window.location.search).get("post");
    
    if (!postId) return;
    
    // Tenta carregar o markdown de forma síncrona (limitado, mas ajuda)
    // Como não podemos fazer fetch síncrono, vamos usar uma abordagem diferente:
    // Preencher com valores baseados no postId conhecido
    
    const postMetadata = {
        'saude-mental': {
            title: 'Dicas de Bem-Estar para Aumentar sua Energia Diária',
            description: 'Sentir-se com pouca energia durante o dia é um problema comum, especialmente em rotinas agitadas. A boa notícia é que há práticas simples que você pode adotar para recarregar suas energias e melhorar sua qualidade de vida.',
            image: 'https://kadsonpedro.com.br/assets/images/saude-mental.jpg'
        },
        'produtividade': {
            title: 'Marketing Multinível: Como Iniciar no Mercado de Bem-Estar',
            description: 'Transforme saúde e bem-estar em oportunidades de sucesso. Um guia completo para novos empreendedores que desejam construir um negócio sólido no mercado de saúde e bem-estar.',
            image: 'https://kadsonpedro.com.br/assets/images/produtividade.jpg'
        },
        'mentoria': {
            title: 'Como Melhorar sua Produtividade: Dicas Práticas para o Dia a Dia',
            description: 'Maximize seus resultados com estratégias simples e eficazes que você pode aplicar imediatamente. Descubra técnicas comprovadas para aumentar sua produtividade.',
            image: 'https://kadsonpedro.com.br/assets/images/mentoria.jpg'
        }
    };
    
    const metadata = postMetadata[postId];
    
    if (metadata) {
        const baseUrl = window.location.origin;
        const currentUrl = window.location.href;
        
        // Atualiza meta tags imediatamente
        updateMetaTag('og:title', metadata.title);
        updateMetaTag('og:description', metadata.description);
        updateMetaTag('og:image', metadata.image.startsWith('http') ? metadata.image : baseUrl + metadata.image);
        updateMetaTag('og:url', currentUrl);
        
        updateMetaTag('twitter:title', metadata.title, 'name');
        updateMetaTag('twitter:description', metadata.description, 'name');
        updateMetaTag('twitter:image', metadata.image.startsWith('http') ? metadata.image : baseUrl + metadata.image, 'name');
        
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
    
    function updateMetaTag(property, content, type = 'property') {
        let meta = document.querySelector(`meta[${type}="${property}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(type, property);
            document.head.appendChild(meta);
        }
        meta.content = content;
    }
})();
