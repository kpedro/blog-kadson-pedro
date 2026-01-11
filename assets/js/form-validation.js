// Validação de Formulários
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const commentForm = document.getElementById('comment-form');

    // Validação do formulário de contato
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            if (!validateContactForm()) {
                e.preventDefault();
                return false;
            }
        });

        // Validação em tempo real
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(input);
            });
        });
    }

    // Validação do formulário de comentários
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            if (!validateCommentForm()) {
                e.preventDefault();
                return false;
            }
        });
    }
});

function validateContactForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');

    let isValid = true;

    // Validar nome
    if (!name || name.value.trim().length < 3) {
        showFieldError(name, 'Nome deve ter pelo menos 3 caracteres');
        isValid = false;
    } else {
        clearFieldError(name);
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.value)) {
        showFieldError(email, 'Email inválido');
        isValid = false;
    } else {
        clearFieldError(email);
    }

    // Validar telefone (formato brasileiro)
    const phoneRegex = /^[\d\s\(\)\-\+]+$/;
    if (!phone || phone.value.trim().length < 10 || !phoneRegex.test(phone.value)) {
        showFieldError(phone, 'Telefone inválido');
        isValid = false;
    } else {
        clearFieldError(phone);
    }

    // Validar assunto
    if (!subject || !subject.value) {
        showFieldError(subject, 'Selecione um assunto');
        isValid = false;
    } else {
        clearFieldError(subject);
    }

    // Validar mensagem
    if (!message || message.value.trim().length < 10) {
        showFieldError(message, 'Mensagem deve ter pelo menos 10 caracteres');
        isValid = false;
    } else {
        clearFieldError(message);
    }

    return isValid;
}

function validateCommentForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    let isValid = true;

    if (name && name.value.trim().length < 3) {
        showFieldError(name, 'Nome deve ter pelo menos 3 caracteres');
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email.value)) {
        showFieldError(email, 'Email inválido');
        isValid = false;
    }

    if (message && message.value.trim().length < 10) {
        showFieldError(message, 'Comentário deve ter pelo menos 10 caracteres');
        isValid = false;
    }

    return isValid;
}

function validateField(field) {
    if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            showFieldError(field, 'Email inválido');
            return false;
        }
    } else if (field.required && !field.value.trim()) {
        showFieldError(field, 'Este campo é obrigatório');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    if (!field) return;
    
    clearFieldError(field);
    
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    if (!field) return;
    
    field.classList.remove('error');
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}
