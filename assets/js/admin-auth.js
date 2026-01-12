/**
 * Sistema de Autenticação Administrativa
 * Protege páginas administrativas (editor, newsletter) com senha
 */

class AdminAuth {
    constructor() {
        // Senha padrão - ALTERE ESTA SENHA!
        this.ADMIN_PASSWORD = 'admin2025';
        this.SESSION_KEY = 'blog_admin_authenticated';
        this.SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 horas em milissegundos
    }

    /**
     * Verifica se o usuário está autenticado
     */
    isAuthenticated() {
        const authData = sessionStorage.getItem(this.SESSION_KEY);
        if (!authData) return false;

        try {
            const { timestamp } = JSON.parse(authData);
            const now = Date.now();
            
            // Verifica se a sessão expirou
            if (now - timestamp > this.SESSION_TIMEOUT) {
                this.logout();
                return false;
            }
            
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Autentica o usuário com senha
     */
    login(password) {
        if (password === this.ADMIN_PASSWORD) {
            const authData = {
                timestamp: Date.now(),
                authenticated: true
            };
            sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(authData));
            return true;
        }
        return false;
    }

    /**
     * Faz logout do usuário
     */
    logout() {
        sessionStorage.removeItem(this.SESSION_KEY);
    }

    /**
     * Protege uma página - redireciona para login se não autenticado
     */
    protectPage() {
        if (!this.isAuthenticated()) {
            // Salva a URL atual para redirecionar após login
            const currentUrl = window.location.href;
            sessionStorage.setItem('blog_redirect_after_login', currentUrl);
            
            // Redireciona para página de login
            window.location.href = 'admin.html';
        }
    }

    /**
     * Obtém URL para redirecionar após login
     */
    getRedirectUrl() {
        const redirectUrl = sessionStorage.getItem('blog_redirect_after_login');
        if (redirectUrl) {
            sessionStorage.removeItem('blog_redirect_after_login');
            return redirectUrl;
        }
        return 'admin.html'; // Dashboard admin padrão
    }
}

// Instância global
window.adminAuth = new AdminAuth();
