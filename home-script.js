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

function openMyPurchases() {
    const userData = JSON.parse(localStorage.getItem('discord_user') || '{}');
    
    if (!userData.id) {
        showNotification('Por favor, faça login primeiro!', 'error');
        return;
    }

    // Criar modal de compras
    const purchasesModal = document.createElement('div');
    purchasesModal.id = 'purchases-modal';
    purchasesModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 6000;
        animation: fadeIn 0.3s ease;
    `;

    purchasesModal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #1a0a2e 0%, #2d0a47 100%);
            border: 2px solid #9d4edd;
            border-radius: 20px;
            padding: 40px;
            width: 90%;
            max-width: 600px;
            max-height: 70vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(157, 78, 221, 0.3);
            animation: slideUp 0.3s ease;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <h2 style="color: #fff; font-size: 24px; margin: 0;">Minhas Compras</h2>
                <button onclick="document.getElementById('purchases-modal').remove()" style="
                    background: none;
                    border: none;
                    color: #fff;
                    font-size: 24px;
                    cursor: pointer;
                    transition: color 0.3s ease;
                " onmouseover="this.style.color='#c77dff'" onmouseout="this.style.color='#fff'">
                    ✕
                </button>
            </div>

            <div style="
                background: rgba(157, 78, 221, 0.1);
                border: 1px solid rgba(157, 78, 221, 0.3);
                border-radius: 15px;
                padding: 30px;
                text-align: center;
                min-height: 200px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            ">
                <i class="fas fa-shopping-bag" style="font-size: 48px; color: #c77dff; margin-bottom: 20px;"></i>
                <h3 style="color: #fff; font-size: 18px; margin: 0 0 10px 0;">Nenhuma Compra Registrada</h3>
                <p style="color: #c0c0c0; margin: 0; font-size: 14px;">
                    Você ainda não tem nenhuma compra registrada. Visite a seção de comissões para fazer seu pedido!
                </p>
                <a href="comissoes.html" onclick="document.getElementById('purchases-modal').remove()" style="
                    margin-top: 20px;
                    display: inline-block;
                    background: linear-gradient(135deg, #9d4edd 0%, #c77dff 100%);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 25px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                    font-size: 14px;
                " onmouseover="this.style.boxShadow='0 12px 35px rgba(157, 78, 221, 0.5)'; this.style.transform='translateY(-3px)'" 
                   onmouseout="this.style.boxShadow='none'; this.style.transform='translateY(0)'">
                    <i class="fas fa-star"></i> Ver Comissões
                </a>
            </div>
        </div>
    `;

    document.body.appendChild(purchasesModal);

    // Fechar ao clicar fora do modal
    purchasesModal.addEventListener('click', (e) => {
        if (e.target === purchasesModal) {
            purchasesModal.remove();
        }
    });

    // Fechar ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('purchases-modal')) {
            document.getElementById('purchases-modal').remove();
        }
    });
}
