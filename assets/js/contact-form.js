// Formulário de Contato com EmailJS
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init({
            publicKey: "639peYCntwvgbJXOH",
            blockHeadless: false,
            limitRate: {
                throttle: 10000
            }
        });
    }

    const contactForm = document.getElementById("contact-form");
    if (!contactForm) return;

    contactForm.addEventListener("submit", function(e) {
        e.preventDefault();

        // Validar formulário antes de enviar
        if (!validateContactForm()) {
            return;
        }

        // Atualiza estado do botão
        const button = this.querySelector('.submit-button');
        const buttonText = button.querySelector('.button-text');
        const buttonLoader = button.querySelector('.button-loader');
        const feedback = document.getElementById('form-feedback');

        buttonText.style.display = 'none';
        buttonLoader.style.display = 'inline-block';
        button.disabled = true;
        feedback.style.display = 'none';

        // Prepara os dados do template
        const templateParams = {
            from_name: document.getElementById('name').value,
            from_email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            contact_type: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Envia o email
        emailjs.send(
            'service_sfcgswc',
            'template_um5hyie',
            templateParams,
            '639peYCntwvgbJXOH'
        )
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            feedback.textContent = 'Mensagem enviada com sucesso! Retornarei em breve.';
            feedback.className = 'form-feedback success';
            feedback.style.display = 'block';
            contactForm.reset();
        })
        .catch(function(error) {
            console.error('FAILED...', error);
            feedback.textContent = `Erro ao enviar: ${error.text || 'Erro desconhecido. Tente novamente.'}`;
            feedback.className = 'form-feedback error';
            feedback.style.display = 'block';
        })
        .finally(function() {
            buttonText.style.display = 'inline-block';
            buttonLoader.style.display = 'none';
            button.disabled = false;
        });
    });
});
