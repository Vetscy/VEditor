document.addEventListener('DOMContentLoaded', () => {
    // Animação suave do scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href').startsWith('#') && !this.hasAttribute('onclick')) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            }
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

    document.querySelectorAll('.service-card, .cta-btn').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Efeito parallax suave no hero
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero-section');
        if (hero) {
            const scrolled = window.pageYOffset;
            hero.style.transform = `translateY(${scrolled * 0.4}px)`;
        }
    });

    // ============ Discord Login Initialization ============
    checkDiscordLogin();

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

// ============ Discord Login Functions ============
function openDiscordLogin() {
    const modal = document.getElementById('discord-login');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeDiscordLogin() {
    const modal = document.getElementById('discord-login');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function checkDiscordLogin() {
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
                    console.log('Response:', response);
                }
            })
            .catch(error => {
                console.error('Erro na autenticação Discord:', error);
            });
        }
    }
}

function displayUserProfile(userData) {
    console.log('Exibindo perfil do usuário:', userData);

    // Mostrar no modal
    const loginArea = document.getElementById('login-area');
    const profileArea = document.getElementById('profile-area');
    
    if (loginArea && profileArea) {
        loginArea.style.display = 'none';
        profileArea.style.display = 'block';
    }

    // Preencher dados no modal
    const usernameSpan = document.getElementById('username');
    const userIdP = document.getElementById('user-id');
    const avatarImg = document.getElementById('avatar');
    
    if (usernameSpan) usernameSpan.innerText = userData.username || 'Usuário';
    if (userIdP) userIdP.innerText = `ID: ${userData.id}`;

    // Construir URL da imagem de perfil
    if (userData.avatar && avatarImg) {
        const avatarUrl = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`;
        avatarImg.src = avatarUrl;
    }

    // MOSTRAR NO NAVBAR - Nome e Avatar
    const discordNavBtn = document.getElementById('discord-nav-btn');
    const userProfileNav = document.getElementById('user-profile-nav');
    const navAvatar = document.getElementById('nav-avatar');
    const navUsername = document.getElementById('nav-username');

    if (discordNavBtn) discordNavBtn.style.display = 'none';
    if (userProfileNav) {
        userProfileNav.style.display = 'flex';
        if (userData.avatar && navAvatar) {
            navAvatar.src = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`;
        }
        if (navUsername) navUsername.innerText = userData.username || 'Usuário';
        userProfileNav.onclick = openDiscordLogin;
    }
}

function handleLogout() {
    console.log('Saindo...');
    
    // Limpar localStorage
    localStorage.removeItem('discord_access_token');
    localStorage.removeItem('discord_token_type');
    localStorage.removeItem('discord_user');

    // Mostrar login novamente no modal
    const loginArea = document.getElementById('login-area');
    const profileArea = document.getElementById('profile-area');
    if (loginArea) loginArea.style.display = 'block';
    if (profileArea) profileArea.style.display = 'none';

    // Esconder perfil no navbar
    const discordNavBtn = document.getElementById('discord-nav-btn');
    const userProfileNav = document.getElementById('user-profile-nav');
    if (discordNavBtn) discordNavBtn.style.display = 'block';
    if (userProfileNav) userProfileNav.style.display = 'none';

    // Mostrar mensagem de logout
    showNotification('Você foi desconectado!', 'success');
    
    // Fechar modal
    closeDiscordLogin();
}

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
