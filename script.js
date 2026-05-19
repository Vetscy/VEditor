document.addEventListener('DOMContentLoaded', () => {
    // Menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Configuração inicial dos vídeos
    const videos = document.querySelectorAll('.video-container');
    if (videos.length >= 3) {
        videos[0].setAttribute('data-type', 'longo');
        videos[1].setAttribute('data-type', 'longo');
        videos[2].setAttribute('data-type', 'curto');
    }

    // Remover código do botão Surpreenda-me

    // Animação suave do scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Adicionar animações ao scroll
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .step, .footer-section').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Efeito de parallax suave no hero
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('#hero');
        if (hero) {
            const scrolled = window.pageYOffset;
            hero.style.transform = `translateY(${scrolled * 0.4}px)`;
        }
    });
});

// Funções do Modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Previne rolagem
}

// Nenhuma função customizada necessária para o iframe do Google Drive

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaura rolagem
}

// Fechar modal clicando fora
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Função para filtrar vídeos
function filterVideos(type) {
    const videos = document.querySelectorAll('.video-container');
    const buttons = document.querySelectorAll('.filter-button');

    // Atualizar estado ativo dos botões
    buttons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('onclick').includes(type)) {
            button.classList.add('active');
        }
    });

    // Mostrar/ocultar vídeos baseado no tipo
    videos.forEach(video => {
        if (type === 'todos' || video.getAttribute('data-type') === type) {
            video.style.display = 'block';
        } else {
            video.style.display = 'none';
        }
    });
}

// ============ Discord Login Functions ============
function openDiscordLogin() {
    const modal = document.getElementById('discord-login');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeDiscordLogin() {
    const modal = document.getElementById('discord-login');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Discord OAuth Handling
window.addEventListener('load', () => {
    // Verificar se o usuário já tem um token salvado
    const savedToken = localStorage.getItem('discord_access_token');
    const savedUser = localStorage.getItem('discord_user');

    if (savedToken && savedUser) {
        displayUserProfile(JSON.parse(savedUser));
    } else {
        // Verificar se o Discord retornou um token na URL
        const fragment = new URLSearchParams(window.location.hash.slice(1));
        const accessToken = fragment.get('access_token');
        const tokenType = fragment.get('token_type');

        if (accessToken) {
            // Salvar token e buscar dados do usuário
            localStorage.setItem('discord_access_token', accessToken);
            localStorage.setItem('discord_token_type', tokenType || 'Bearer');

            // Buscar informações do usuário
            fetch('https://discord.com/api/users/@me', {
                headers: {
                    authorization: `${tokenType || 'Bearer'} ${accessToken}`
                }
            })
            .then(result => result.json())
            .then(response => {
                if (response.id) {
                    // Salvar dados do usuário
                    localStorage.setItem('discord_user', JSON.stringify(response));
                    displayUserProfile(response);
                    // Abrir modal automaticamente
                    openDiscordLogin();
                    // Limpar URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                } else {
                    console.error('Erro ao buscar dados do usuário:', response);
                }
            })
            .catch(error => {
                console.error('Erro na autenticação Discord:', error);
            });
        }
    }
});

function displayUserProfile(userData) {
    // Mostrar seção de perfil
    document.getElementById('login-area').style.display = 'none';
    document.getElementById('profile-area').style.display = 'block';

    // Preencher dados do usuário
    document.getElementById('username').innerText = userData.username || 'Usuário';
    document.getElementById('user-id').innerText = `ID: ${userData.id}`;

    // Construir URL da imagem de perfil
    if (userData.avatar) {
        const avatarUrl = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`;
        document.getElementById('avatar').src = avatarUrl;
    }
}

// Logout
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Limpar localStorage
            localStorage.removeItem('discord_access_token');
            localStorage.removeItem('discord_token_type');
            localStorage.removeItem('discord_user');

            // Mostrar login novamente
            document.getElementById('login-area').style.display = 'block';
            document.getElementById('profile-area').style.display = 'none';

            // Mostrar mensagem de logout
            showNotification('Você foi desconectado!', 'success');
        });
    }
});

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerText = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
