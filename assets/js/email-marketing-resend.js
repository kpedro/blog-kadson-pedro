// Sistema de Email Marketing com Resend + Supabase
class EmailMarketingResend {
    constructor() {
        this.supabaseUrl = 'https://your-project.supabase.co'; // Substitua pela sua URL
        this.supabaseAnonKey = 'your-anon-key'; // Substitua pela sua chave anon
        this.functionUrl = `${this.supabaseUrl}/functions/v1/blog-newsletter`;
        this.storageKey = 'blog_subscribers_backup';
        this.init();
    }

    init() {
        // Tenta carregar do Supabase, fallback para localStorage
        this.loadSubscribers();
    }

    // Carrega inscritos do Supabase
    async loadSubscribers() {
        try {
            const response = await fetch(`${this.functionUrl}?action=get_subscribers`, {
                method: 'GET',
                headers: {
                    'apikey': this.supabaseAnonKey,
                    'Authorization': `Bearer ${this.supabaseAnonKey}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    // Sincroniza com localStorage como backup
                    localStorage.setItem(this.storageKey, JSON.stringify(data.subscribers));
                    return data.subscribers;
                }
            }
        } catch (error) {
            console.warn('Erro ao carregar do Supabase, usando localStorage:', error);
        }

        // Fallback para localStorage
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    // Adiciona novo inscrito
    async addSubscriber(email, name = '', source = 'newsletter', metadata = {}) {
        // Valida email
        if (!this.isValidEmail(email)) {
            return { success: false, error: 'Email inválido' };
        }

        try {
            const response = await fetch(this.functionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': this.supabaseAnonKey,
                    'Authorization': `Bearer ${this.supabaseAnonKey}`
                },
                body: JSON.stringify({
                    action: 'subscribe',
                    email: email.toLowerCase().trim(),
                    name: name.trim() || 'Leitor do Blog',
                    source: source,
                    metadata: {
                        ...metadata,
                        page: window.location.pathname,
                        referrer: document.referrer
                    }
                })
            });

            const data = await response.json();

            if (data.success) {
                // Atualiza localStorage
                const subscribers = await this.loadSubscribers();
                localStorage.setItem(this.storageKey, JSON.stringify(subscribers));

                // Tracking
                this.trackSubscription(email, source);

                return { success: true, subscriber: data.subscriber };
            } else {
                return { success: false, error: data.error || 'Erro ao processar inscrição' };
            }
        } catch (error) {
            console.error('Erro ao adicionar inscrito:', error);
            
            // Fallback: salva localmente
            const subscriber = {
                id: this.generateId(),
                email: email.toLowerCase().trim(),
                name: name.trim() || 'Leitor do Blog',
                source: source,
                subscribedAt: new Date().toISOString(),
                status: 'active',
                metadata: metadata
            };

            const subscribers = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
            subscribers.push(subscriber);
            localStorage.setItem(this.storageKey, JSON.stringify(subscribers));

            return { success: true, subscriber, warning: 'Salvo localmente (offline)' };
        }
    }

    // Envia campanha
    async sendCampaign(subject, content, template = 'default') {
        try {
            const response = await fetch(this.functionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': this.supabaseAnonKey,
                    'Authorization': `Bearer ${this.supabaseAnonKey}`
                },
                body: JSON.stringify({
                    action: 'send_campaign',
                    campaign: {
                        subject,
                        content,
                        template
                    }
                })
            });

            const data = await response.json();

            if (data.success) {
                return {
                    success: true,
                    sent: data.sent,
                    failed: data.failed,
                    total: data.total,
                    campaign_id: data.campaign_id
                };
            } else {
                return { success: false, error: data.error || 'Erro ao enviar campanha' };
            }
        } catch (error) {
            console.error('Erro ao enviar campanha:', error);
            return { success: false, error: 'Erro de conexão. Tente novamente.' };
        }
    }

    // Busca estatísticas
    async getStats() {
        try {
            const response = await fetch(`${this.functionUrl}?action=get_stats`, {
                method: 'GET',
                headers: {
                    'apikey': this.supabaseAnonKey,
                    'Authorization': `Bearer ${this.supabaseAnonKey}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    return data.stats;
                }
            }
        } catch (error) {
            console.warn('Erro ao buscar estatísticas:', error);
        }

        // Fallback: calcula do localStorage
        const subscribers = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const today = new Date().toISOString().split('T')[0];
        
        return {
            total: subscribers.length,
            active: subscribers.filter(s => s.status === 'active').length,
            inactive: subscribers.filter(s => s.status !== 'active').length,
            todaySubscriptions: subscribers.filter(s => 
                s.subscribedAt?.split('T')[0] === today
            ).length,
            campaigns: 0
        };
    }

    // Busca todos os inscritos
    async getSubscribers() {
        try {
            const response = await fetch(`${this.functionUrl}?action=get_subscribers`, {
                method: 'GET',
                headers: {
                    'apikey': this.supabaseAnonKey,
                    'Authorization': `Bearer ${this.supabaseAnonKey}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    return data.subscribers;
                }
            }
        } catch (error) {
            console.warn('Erro ao buscar inscritos:', error);
        }

        // Fallback: retorna do localStorage
        return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }

    // Descadastrar
    async unsubscribe(email) {
        try {
            const response = await fetch(this.functionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': this.supabaseAnonKey,
                    'Authorization': `Bearer ${this.supabaseAnonKey}`
                },
                body: JSON.stringify({
                    action: 'unsubscribe',
                    email: email
                })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao descadastrar:', error);
            return { success: false, error: 'Erro ao processar descadastro' };
        }
    }

    // Funções auxiliares
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    trackSubscription(email, source) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'newsletter_signup', {
                'event_category': 'Engagement',
                'event_label': source,
                'value': 1
            });
        }
    }
}

// Inicializa sistema (aguarda configuração)
let emailMarketingResend;

document.addEventListener('DOMContentLoaded', function() {
    // Verifica se há configuração do Supabase
    const supabaseConfig = window.SUPABASE_CONFIG || {
        url: 'https://your-project.supabase.co',
        anonKey: 'your-anon-key'
    };

    if (supabaseConfig.url && supabaseConfig.anonKey && 
        supabaseConfig.url !== 'https://your-project.supabase.co') {
        emailMarketingResend = new EmailMarketingResend();
        emailMarketingResend.supabaseUrl = supabaseConfig.url;
        emailMarketingResend.supabaseAnonKey = supabaseConfig.anonKey;
        emailMarketingResend.functionUrl = `${supabaseConfig.url}/functions/v1/blog-newsletter`;
        
        // Disponibiliza globalmente
        window.emailMarketing = emailMarketingResend;
    } else {
        console.warn('Configuração do Supabase não encontrada. Usando sistema local.');
        // Usa sistema local como fallback
        if (typeof EmailMarketing !== 'undefined') {
            emailMarketing = new EmailMarketing();
            window.emailMarketing = emailMarketing;
        }
    }
});
