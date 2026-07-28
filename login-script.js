window.onload = () => {
    // O Discord retorna os dados na URL após o símbolo "#" (fragmento)
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get('access_token');
    const tokenType = fragment.get('token_type');

    if (accessToken) {
        // Se o token existe, o usuário fez login com sucesso
        // Salva o token no localStorage para uso posterior
        localStorage.setItem('discord_token', accessToken);
        localStorage.setItem('discord_token_type', tokenType);

        // Mostra a área de perfil e busca dados do usuário
        showProfile(accessToken, tokenType);
    } else {
        // Se não há token, mostra a área de login
        showLogin();
    }

    // Verifica se há um token salvo no localStorage
    const savedToken = localStorage.getItem('discord_token');
    const savedTokenType = localStorage.getItem('discord_token_type');

    if (savedToken && !accessToken) {
        // Se há um token salvo, tenta usá-lo
        showProfile(savedToken, savedTokenType);
    }
};

// Função para mostrar a área de login
function showLogin() {
    document.getElementById('login-area').style.display = 'block';
    document.getElementById('profile-area').style.display = 'none';
}

// Função para mostrar a área de perfil (preenche dados, mas NÃO abre o modal automaticamente)
function showProfile(accessToken, tokenType) {
    const loginArea = document.getElementById('login-area');
    if (loginArea) loginArea.style.display = 'none';

    // Busca as informações do usuário no Discord
    fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${tokenType} ${accessToken}`
        }
    })
    .then(result => {
        if (!result.ok) {
            throw new Error('Token inválido ou expirado');
        }
        return result.json();
    })
    .then(response => {
        // Preenche o HTML com o nome e a foto do usuário
        document.getElementById('username').innerText = response.username;
        document.getElementById('user-id').innerText = `@${response.id}`;
        
        // Constrói a URL da imagem de perfil do Discord
        if (response.avatar) {
            const avatarUrl = `https://cdn.discordapp.com/avatars/${response.id}/${response.avatar}.png`;
            document.getElementById('avatar').src = avatarUrl;
        } else {
            // Se o usuário não tem avatar customizado, usa o avatar padrão
            const avatarUrl = `https://cdn.discordapp.com/embed/avatars/${response.discriminator % 5}.png`;
            document.getElementById('avatar').src = avatarUrl;
        }
    })
    .catch(error => {
        console.error('Erro ao buscar dados do usuário:', error);
        // Se houver erro, limpa o token e mostra login novamente
        localStorage.removeItem('discord_token');
        localStorage.removeItem('discord_token_type');
        showLogin();
    });
}

// Função para logout
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Remove o token do localStorage
            localStorage.removeItem('discord_token');
            localStorage.removeItem('discord_token_type');
            
            // Limpa a URL de hash
            window.location.hash = '';
            
            // Mostra a área de login novamente
            showLogin();
        });
    }
});
