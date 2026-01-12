/**
 * Atualiza URLs dinamicamente usando window.location.origin
 * Remove dependência de domínio fixo
 */

(function() {
    const origin = window.location.origin;
    const currentPath = window.location.pathname + window.location.search;
    
    // Atualiza canonical links
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && canonical.href.startsWith('/')) {
        canonical.href = origin + canonical.href;
    }
    
    // Atualiza meta tags Open Graph
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
        if (ogUrl.content.startsWith('/')) {
            ogUrl.content = origin + ogUrl.content;
        } else if (!ogUrl.content.startsWith('http')) {
            ogUrl.content = origin + currentPath;
        }
    }
    
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && ogImage.content.startsWith('/')) {
        ogImage.content = origin + ogImage.content;
    }
    
    // Atualiza meta tags Twitter
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl && twitterUrl.content.startsWith('/')) {
        twitterUrl.content = origin + twitterUrl.content;
    }
    
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage && twitterImage.content.startsWith('/')) {
        twitterImage.content = origin + twitterImage.content;
    }
    
    // Atualiza Schema.org JSON-LD
    const schemaScript = document.querySelector('script[type="application/ld+json"]');
    if (schemaScript) {
        try {
            const schema = JSON.parse(schemaScript.textContent);
            if (schema.url) {
                if (schema.url.startsWith('/')) {
                    schema.url = origin + schema.url;
                } else if (!schema.url.startsWith('http')) {
                    schema.url = origin + '/' + schema.url;
                }
            }
            if (schema.author && schema.author.url) {
                if (schema.author.url.startsWith('/')) {
                    schema.author.url = origin + schema.author.url;
                } else if (!schema.author.url.startsWith('http')) {
                    schema.author.url = origin + '/' + schema.author.url;
                }
            }
            schemaScript.textContent = JSON.stringify(schema);
        } catch (e) {
            console.warn('Erro ao atualizar Schema.org:', e);
        }
    }
})();
