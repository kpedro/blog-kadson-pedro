// Admin Newsletter - Funcionalidades
document.addEventListener('DOMContentLoaded', function() {
    // Aguarda sistema carregar (pode ser local ou Resend)
    setTimeout(() => {
        if (typeof emailMarketing === 'undefined') {
            console.error('Sistema de email marketing não está carregado!');
            return;
        }
        initializeAdmin();
    }, 500);
});

function initializeAdmin() {
    loadStats();
    loadSubscribers();
    loadCampaigns();
    setupEventListeners();
}

// Carrega estatísticas
async function loadStats() {
    let stats;
    
    // Tenta carregar do Supabase se disponível
    if (emailMarketing && typeof emailMarketing.getStats === 'function') {
        stats = await emailMarketing.getStats();
    } else if (emailMarketing && typeof emailMarketing.getStats === 'function') {
        stats = emailMarketing.getStats();
    } else {
        stats = { total: 0, active: 0, todaySubscriptions: 0, campaigns: 0 };
    }
    
    document.getElementById('stat-total').textContent = stats.total || 0;
    document.getElementById('stat-active').textContent = stats.active || 0;
    document.getElementById('stat-today').textContent = stats.todaySubscriptions || 0;
    document.getElementById('stat-campaigns').textContent = stats.campaigns || 0;
}

// Carrega lista de inscritos
async function loadSubscribers() {
    let subscribers;
    
    // Tenta carregar do Supabase se disponível
    if (emailMarketing && typeof emailMarketing.getSubscribers === 'function') {
        subscribers = await emailMarketing.getSubscribers();
    } else if (emailMarketing && typeof emailMarketing.loadSubscribers === 'function') {
        subscribers = emailMarketing.loadSubscribers();
    } else {
        subscribers = [];
    }
    
    const tbody = document.getElementById('subscribers-tbody');
    
    if (subscribers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>Nenhum inscrito ainda</h3>
                    <p>Os inscritos aparecerão aqui quando alguém se cadastrar na newsletter.</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = subscribers.map(subscriber => `
        <tr>
            <td><strong>${subscriber.email}</strong></td>
            <td>${subscriber.name}</td>
            <td>${formatDate(subscriber.subscribedAt)}</td>
            <td><span class="post-tag">${subscriber.source}</span></td>
            <td>
                <span class="status-badge ${subscriber.status}">
                    ${subscriber.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>
                <div class="table-actions">
                    <button class="table-btn" onclick="toggleSubscriberStatus('${subscriber.email}')" title="Alternar status">
                        <i class="fas fa-toggle-${subscriber.status === 'active' ? 'on' : 'off'}"></i>
                    </button>
                    <button class="table-btn danger" onclick="removeSubscriber('${subscriber.email}')" title="Remover">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Carrega campanhas
async function loadCampaigns() {
    let campaigns = [];
    
    // Tenta carregar do Supabase se disponível
    if (emailMarketing && typeof emailMarketing.loadCampaigns === 'function') {
        campaigns = emailMarketing.loadCampaigns();
    } else {
        // Fallback: busca do localStorage ou vazio
        const stored = localStorage.getItem('blog_campaigns');
        campaigns = stored ? JSON.parse(stored) : [];
    }
    
    const container = document.getElementById('campaigns-list');
    
    if (campaigns.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-paper-plane"></i>
                <h3>Nenhuma campanha enviada</h3>
                <p>Clique em "Nova Campanha" para começar a enviar emails.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = campaigns.reverse().map(campaign => `
        <div class="campaign-card">
            <h3>${campaign.subject}</h3>
            <p style="color: var(--gray-dark); margin: 0.5rem 0;">${campaign.content.substring(0, 150)}...</p>
            <div class="campaign-meta">
                <span><i class="far fa-calendar"></i> ${formatDate(campaign.sentAt)}</span>
                <span><i class="fas fa-check-circle"></i> ${campaign.totalSent} enviados</span>
                <span><i class="fas fa-times-circle"></i> ${campaign.totalFailed} falhas</span>
                <span><i class="fas fa-users"></i> ${campaign.recipients} destinatários</span>
            </div>
        </div>
    `).join('');
}

// Configura event listeners
function setupEventListeners() {
    // Botões de ação
    document.getElementById('btn-new-campaign').addEventListener('click', openCampaignModal);
    document.getElementById('btn-export').addEventListener('click', async () => {
        if (emailMarketing && typeof emailMarketing.exportSubscribers === 'function') {
            emailMarketing.exportSubscribers();
        } else {
            // Fallback: exporta do localStorage
            const subscribers = await loadSubscribers();
            exportToCSV(subscribers);
        }
    });
    document.getElementById('btn-refresh').addEventListener('click', async () => {
        await loadStats();
        await loadSubscribers();
        await loadCampaigns();
        showNotification('Dados atualizados!', 'success');
    });

    // Modal de campanha
    const campaignModal = document.getElementById('campaign-modal');
    const campaignForm = document.getElementById('campaign-form');
    
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    document.getElementById('btn-cancel-campaign').addEventListener('click', closeModals);
    document.getElementById('btn-close-preview').addEventListener('click', closeModals);

    document.getElementById('btn-preview-campaign').addEventListener('click', previewCampaign);
    
    campaignForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await sendCampaign();
    });

    // Busca
    document.getElementById('search-subscribers').addEventListener('input', filterSubscribers);
}

// Abre modal de campanha
function openCampaignModal() {
    document.getElementById('campaign-modal').classList.add('show');
}

// Fecha modais
function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
    });
}

// Preview da campanha
function previewCampaign() {
    const subject = document.getElementById('campaign-subject').value;
    const content = document.getElementById('campaign-content').value;

    if (!subject || !content) {
        alert('Preencha o assunto e o conteúdo antes de visualizar.');
        return;
    }

    document.getElementById('preview-subject').textContent = subject;
    document.getElementById('preview-content').textContent = content;
    document.getElementById('preview-modal').classList.add('show');
}

// Envia campanha
async function sendCampaign() {
    const subject = document.getElementById('campaign-subject').value;
    const content = document.getElementById('campaign-content').value;
    const sendPreview = document.getElementById('campaign-preview').checked;

    if (!subject || !content) {
        alert('Preencha todos os campos!');
        return;
    }

    const btn = document.getElementById('btn-send-campaign');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    try {
        if (sendPreview) {
            // Envia email de teste primeiro
            const testEmail = prompt('Digite um email para teste:');
            if (testEmail && emailMarketing.isValidEmail(testEmail)) {
                await emailMarketing.sendEmailToSubscriber(
                    { email: testEmail, name: 'Teste' },
                    `[TESTE] ${subject}`,
                    content
                );
                alert('Email de teste enviado! Verifique sua caixa de entrada.');
            }
        }

        // Confirma envio em massa
        const confirm = window.confirm(
            `Tem certeza que deseja enviar esta campanha para ${emailMarketing.getStats().active} inscritos ativos?`
        );

        if (!confirm) {
            btn.disabled = false;
            btn.innerHTML = originalText;
            return;
        }

        // Envia campanha (usa Resend se disponível, senão fallback)
        let result;
        if (emailMarketing && typeof emailMarketing.sendCampaign === 'function') {
            result = await emailMarketing.sendCampaign(subject, content);
        } else {
            // Fallback para sistema local
            result = { success: false, error: 'Sistema de envio não disponível. Configure Resend + Supabase.' };
        }

        if (result.success) {
            showNotification(
                `Campanha enviada! ${result.sent} emails enviados com sucesso.`,
                'success'
            );
            campaignForm.reset();
            closeModals();
            loadStats();
            loadCampaigns();
        } else {
            showNotification(result.error || 'Erro ao enviar campanha', 'error');
        }
    } catch (error) {
        console.error('Erro ao enviar campanha:', error);
        showNotification('Erro ao enviar campanha. Tente novamente.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

// Filtra inscritos
function filterSubscribers() {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('#subscribers-tbody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Toggle status do inscrito
window.toggleSubscriberStatus = async function(email) {
    if (confirm('Deseja alterar o status deste inscrito?')) {
        if (emailMarketing && typeof emailMarketing.toggleSubscriberStatus === 'function') {
            emailMarketing.toggleSubscriberStatus(email);
        } else {
            // Fallback: atualiza localStorage
            const subscribers = JSON.parse(localStorage.getItem('blog_subscribers') || '[]');
            const updated = subscribers.map(sub => {
                if (sub.email === email.toLowerCase()) {
                    return { ...sub, status: sub.status === 'active' ? 'inactive' : 'active' };
                }
                return sub;
            });
            localStorage.setItem('blog_subscribers', JSON.stringify(updated));
        }
        await loadSubscribers();
        await loadStats();
        showNotification('Status atualizado!', 'success');
    }
};

// Remove inscrito
window.removeSubscriber = async function(email) {
    if (confirm(`Tem certeza que deseja remover ${email} da lista?`)) {
        if (emailMarketing && typeof emailMarketing.removeSubscriber === 'function') {
            emailMarketing.removeSubscriber(email);
        } else {
            // Fallback: remove do localStorage
            const subscribers = JSON.parse(localStorage.getItem('blog_subscribers') || '[]');
            const updated = subscribers.filter(sub => sub.email !== email.toLowerCase());
            localStorage.setItem('blog_subscribers', JSON.stringify(updated));
        }
        await loadSubscribers();
        await loadStats();
        showNotification('Inscrito removido!', 'success');
    }
};

// Funções auxiliares
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Exporta para CSV (fallback)
function exportToCSV(subscribers) {
    const headers = ['Email', 'Nome', 'Data de Inscrição', 'Fonte', 'Status'];
    const rows = subscribers.map(sub => [
        sub.email,
        sub.name || 'N/A',
        formatDate(sub.subscribed_at || sub.subscribedAt),
        sub.source || 'newsletter',
        sub.status || 'active'
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

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Adiciona animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
