// Sistema de Captura de Leads
document.addEventListener('DOMContentLoaded', function() {
    // Configuração do EmailJS para captura de leads
    if (typeof emailjs === 'undefined') {
        console.warn('EmailJS não está carregado. Captura de leads pode não funcionar.');
        return;
    }

    // Inicializa EmailJS
    emailjs.init({
        publicKey: "639peYCntwvgbJXOH",
        blockHeadless: false,
        limitRate: {
            throttle: 10000
        }
    });

    // Processa formulários de captura de leads
    const leadForms = document.querySelectorAll('.lead-capture-form');
    
    leadForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]')?.value;
            const name = form.querySelector('input[name="name"]')?.value || 'Leitor do Blog';
            const source = form.getAttribute('data-source') || window.location.pathname;
            
            if (!email) {
                showLeadFeedback(form, 'Por favor, insira um email válido.', 'error');
                return;
            }

            // Validação de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showLeadFeedback(form, 'Email inválido. Tente novamente.', 'error');
                return;
            }

            // Salva no localStorage (backup)
            saveLeadToLocalStorage(email, name, source);

            // Envia para EmailJS
            const templateParams = {
                to_name: 'Kadson Pedro',
                from_name: name,
                from_email: email,
                message: `Novo lead capturado do blog!\n\nNome: ${name}\nEmail: ${email}\nFonte: ${source}\nPágina: ${window.location.href}`,
                subject: 'Novo Lead - Blog Kadson Pedro'
            };

            emailjs.send(
                'service_sfcgswc',
                'template_um5hyie', // Use um template específico para leads
                templateParams,
                '639peYCntwvgbJXOH'
            )
            .then(function(response) {
                console.log('Lead capturado com sucesso!', response);
                showLeadFeedback(form, 'Obrigado! Você receberá conteúdo exclusivo em breve.', 'success');
                form.reset();
                
                // Tracking
                trackLeadCapture(email, source);
            })
            .catch(function(error) {
                console.error('Erro ao capturar lead:', error);
                // Mesmo com erro, salva localmente
                showLeadFeedback(form, 'Obrigado! Seus dados foram salvos.', 'success');
                form.reset();
            });
        });
    });

    // Função para mostrar feedback
    function showLeadFeedback(form, message, type) {
        let feedback = form.querySelector('.lead-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'lead-feedback';
            form.appendChild(feedback);
        }
        
        feedback.textContent = message;
        feedback.className = `lead-feedback ${type}`;
        feedback.style.display = 'block';
        
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 5000);
    }

    // Salva lead no localStorage (backup)
    function saveLeadToLocalStorage(email, name, source) {
        try {
            const leads = JSON.parse(localStorage.getItem('blog_leads') || '[]');
            leads.push({
                email,
                name,
                source,
                timestamp: new Date().toISOString(),
                page: window.location.href
            });
            localStorage.setItem('blog_leads', JSON.stringify(leads));
        } catch (e) {
            console.error('Erro ao salvar lead no localStorage:', e);
        }
    }

    // Tracking de captura de leads
    function trackLeadCapture(email, source) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'lead_capture', {
                'event_category': 'Engagement',
                'event_label': source,
                'value': 1
            });
        }

        console.log('Lead capturado:', { email, source, timestamp: new Date().toISOString() });
    }
});

// Função para criar pop-up de captura de leads (opcional)
function showLeadCapturePopup(delay = 30000) {
    setTimeout(() => {
        const popup = document.getElementById('lead-capture-popup');
        if (popup && !localStorage.getItem('lead_popup_shown')) {
            popup.style.display = 'flex';
            localStorage.setItem('lead_popup_shown', 'true');
        }
    }, delay);
}

// Fecha pop-up
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('popup-close') || e.target.classList.contains('popup-overlay')) {
        const popup = document.getElementById('lead-capture-popup');
        if (popup) {
            popup.style.display = 'none';
        }
    }
});
