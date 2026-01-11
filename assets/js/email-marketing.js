// Sistema de Email Marketing - Gerenciamento de Leads e Campanhas
class EmailMarketing {
    constructor() {
        this.storageKey = 'blog_subscribers';
        this.campaignsKey = 'blog_campaigns';
        this.init();
    }

    init() {
        this.loadSubscribers();
        this.setupNewsletterForms();
    }

    // Carrega lista de inscritos
    loadSubscribers() {
        const stored = localStorage.getItem(this.storageKey);
        this.subscribers = stored ? JSON.parse(stored) : [];
        return this.subscribers;
    }

    // Salva lista de inscritos
    saveSubscribers() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.subscribers));
    }

    // Adiciona novo inscrito
    addSubscriber(email, name = '', source = 'newsletter', metadata = {}) {
        // Valida email
        if (!this.isValidEmail(email)) {
            return { success: false, error: 'Email inválido' };
        }

        // Verifica se já existe
        if (this.subscriberExists(email)) {
            return { success: false, error: 'Email já cadastrado' };
        }

        const subscriber = {
            id: this.generateId(),
            email: email.toLowerCase().trim(),
            name: name.trim() || 'Leitor do Blog',
            source: source,
            subscribedAt: new Date().toISOString(),
            status: 'active',
            tags: metadata.tags || [],
            metadata: metadata,
            lastEmailSent: null,
            totalEmailsReceived: 0
        };

        this.subscribers.push(subscriber);
        this.saveSubscribers();

        // Envia notificação para você
        this.notifyNewSubscriber(subscriber);

        // Envia email de boas-vindas
        this.sendWelcomeEmail(subscriber);

        return { success: true, subscriber };
    }

    // Verifica se email já existe
    subscriberExists(email) {
        return this.subscribers.some(sub => sub.email === email.toLowerCase().trim());
    }

    // Valida email
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Gera ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Configura formulários de newsletter
    setupNewsletterForms() {
        document.querySelectorAll('.newsletter-form, .lead-capture-form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmit(form);
            });
        });
    }

    // Processa submissão do formulário
    handleNewsletterSubmit(form) {
        const emailInput = form.querySelector('input[type="email"]');
        const nameInput = form.querySelector('input[name="name"], input[type="text"]');
        const source = form.getAttribute('data-source') || 'newsletter';

        if (!emailInput) return;

        const email = emailInput.value.trim();
        const name = nameInput ? nameInput.value.trim() : '';

        if (!email) {
            this.showFeedback(form, 'Por favor, insira um email válido.', 'error');
            return;
        }

        const result = this.addSubscriber(email, name, source, {
            page: window.location.pathname,
            referrer: document.referrer
        });

        if (result.success) {
            this.showFeedback(form, 'Obrigado! Você receberá nosso conteúdo exclusivo em breve.', 'success');
            form.reset();
            
            // Tracking
            this.trackSubscription(email, source);
        } else {
            this.showFeedback(form, result.error, 'error');
        }
    }

    // Mostra feedback ao usuário
    showFeedback(form, message, type) {
        let feedback = form.querySelector('.newsletter-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'newsletter-feedback';
            form.appendChild(feedback);
        }

        feedback.textContent = message;
        feedback.className = `newsletter-feedback ${type}`;
        feedback.style.display = 'block';

        setTimeout(() => {
            feedback.style.display = 'none';
        }, 5000);
    }

    // Notifica novo inscrito (via EmailJS)
    notifyNewSubscriber(subscriber) {
        if (typeof emailjs === 'undefined') return;

        const templateParams = {
            to_name: 'Kadson Pedro',
            from_name: 'Sistema de Newsletter',
            from_email: 'newsletter@kadsonpedro.com.br',
            message: `Novo inscrito na newsletter!\n\nEmail: ${subscriber.email}\nNome: ${subscriber.name}\nFonte: ${subscriber.source}\nData: ${new Date(subscriber.subscribedAt).toLocaleString('pt-BR')}\nPágina: ${subscriber.metadata.page || 'N/A'}`,
            subject: 'Novo Inscrito - Newsletter Blog'
        };

        emailjs.send(
            'service_sfcgswc',
            'template_um5hyie',
            templateParams,
            '639peYCntwvgbJXOH'
        ).catch(err => console.error('Erro ao notificar novo inscrito:', err));
    }

    // Envia email de boas-vindas
    sendWelcomeEmail(subscriber) {
        if (typeof emailjs === 'undefined') return;

        const templateParams = {
            to_name: subscriber.name,
            from_name: 'Kadson Pedro',
            from_email: 'kadson.pedro@gmail.com',
            message: `Olá ${subscriber.name}!\n\nObrigado por se inscrever na nossa newsletter!\n\nVocê receberá:\n- Dicas semanais sobre saúde e bem-estar\n- Conteúdo exclusivo sobre empreendedorismo\n- Novidades e ofertas especiais\n\nFique de olho na sua caixa de entrada!\n\nGrande abraço,\nKadson Pedro`,
            subject: 'Bem-vindo à Newsletter - Kadson Pedro'
        };

        // Nota: Você precisará criar um template específico para emails de boas-vindas no EmailJS
        emailjs.send(
            'service_sfcgswc',
            'template_um5hyie', // Substitua por um template de boas-vindas
            templateParams,
            '639peYCntwvgbJXOH'
        ).then(() => {
            // Atualiza estatísticas
            subscriber.lastEmailSent = new Date().toISOString();
            subscriber.totalEmailsReceived = 1;
            this.saveSubscribers();
        }).catch(err => console.error('Erro ao enviar email de boas-vindas:', err));
    }

    // Envia campanha para todos os inscritos
    async sendCampaign(subject, content, template = 'default') {
        const activeSubscribers = this.subscribers.filter(sub => sub.status === 'active');
        
        if (activeSubscribers.length === 0) {
            return { success: false, error: 'Nenhum inscrito ativo' };
        }

        let sent = 0;
        let failed = 0;

        for (const subscriber of activeSubscribers) {
            try {
                await this.sendEmailToSubscriber(subscriber, subject, content, template);
                subscriber.lastEmailSent = new Date().toISOString();
                subscriber.totalEmailsReceived++;
                sent++;
            } catch (error) {
                console.error(`Erro ao enviar para ${subscriber.email}:`, error);
                failed++;
            }
        }

        this.saveSubscribers();

        // Salva campanha
        this.saveCampaign({
            id: this.generateId(),
            subject,
            content,
            template,
            sentAt: new Date().toISOString(),
            totalSent: sent,
            totalFailed: failed,
            recipients: activeSubscribers.length
        });

        return { success: true, sent, failed, total: activeSubscribers.length };
    }

    // Envia email para um inscrito específico
    sendEmailToSubscriber(subscriber, subject, content, template = 'default') {
        return new Promise((resolve, reject) => {
            if (typeof emailjs === 'undefined') {
                reject(new Error('EmailJS não está disponível'));
                return;
            }

            const templateParams = {
                to_name: subscriber.name,
                from_name: 'Kadson Pedro',
                from_email: 'kadson.pedro@gmail.com',
                message: content,
                subject: subject
            };

            emailjs.send(
                'service_sfcgswc',
                'template_um5hyie',
                templateParams,
                '639peYCntwvgbJXOH'
            ).then(() => {
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    }

    // Salva campanha
    saveCampaign(campaign) {
        const campaigns = JSON.parse(localStorage.getItem(this.campaignsKey) || '[]');
        campaigns.push(campaign);
        localStorage.setItem(this.campaignsKey, JSON.stringify(campaigns));
    }

    // Carrega campanhas
    loadCampaigns() {
        return JSON.parse(localStorage.getItem(this.campaignsKey) || '[]');
    }

    // Estatísticas
    getStats() {
        const total = this.subscribers.length;
        const active = this.subscribers.filter(s => s.status === 'active').length;
        const inactive = total - active;
        const today = new Date().toISOString().split('T')[0];
        const todaySubscriptions = this.subscribers.filter(s => 
            s.subscribedAt.split('T')[0] === today
        ).length;

        return {
            total,
            active,
            inactive,
            todaySubscriptions,
            campaigns: this.loadCampaigns().length
        };
    }

    // Exporta lista de inscritos (CSV)
    exportSubscribers() {
        const headers = ['Email', 'Nome', 'Data de Inscrição', 'Fonte', 'Status'];
        const rows = this.subscribers.map(sub => [
            sub.email,
            sub.name,
            new Date(sub.subscribedAt).toLocaleDateString('pt-BR'),
            sub.source,
            sub.status
        ]);

        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `inscritos-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    }

    // Remove inscrito
    removeSubscriber(email) {
        this.subscribers = this.subscribers.filter(sub => sub.email !== email.toLowerCase());
        this.saveSubscribers();
    }

    // Desativa/Ativa inscrito
    toggleSubscriberStatus(email) {
        const subscriber = this.subscribers.find(sub => sub.email === email.toLowerCase());
        if (subscriber) {
            subscriber.status = subscriber.status === 'active' ? 'inactive' : 'active';
            this.saveSubscribers();
            return true;
        }
        return false;
    }

    // Tracking
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

// Inicializa sistema de email marketing
let emailMarketing;

document.addEventListener('DOMContentLoaded', function() {
    emailMarketing = new EmailMarketing();
    
    // Disponibiliza globalmente para uso em outras páginas
    window.emailMarketing = emailMarketing;
});
