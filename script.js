document.addEventListener('DOMContentLoaded', () => {
    // Menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Configuração inicial dos vídeos
    const videos = document.querySelectorAll('.video-container');
    videos[0].setAttribute('data-type', 'longo');
    videos[1].setAttribute('data-type', 'longo');
    videos[2].setAttribute('data-type', 'curto');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

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
        const scrolled = window.pageYOffset;
        hero.style.transform = `translateY(${scrolled * 0.4}px)`;
    });
});

// Funções do Modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Previne rolagem
}

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
