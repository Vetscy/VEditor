document.addEventListener('DOMContentLoaded', () => {
    // Detecção de país e conversão de moedas
    detectarPaisEConverteMoedas();

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

    document.querySelectorAll('.service-card, .portfolio-item, .process-step').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

function detectarPaisEConverteMoedas() {
    // Usar geolocalização do navegador como fallback
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                // Se conseguir localizar, usar coordenadas (fallback Brasil)
                converterPrecos('BR');
            },
            error => {
                // Fallback: tentar com fetch
                buscarPaisComAPI();
            }
        );
    } else {
        buscarPaisComAPI();
    }
}

function buscarPaisComAPI() {
    // Usar fetch com timeout curto
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    fetch('https://ipapi.co/json/', { signal: controller.signal })
        .then(response => response.json())
        .then(data => {
            clearTimeout(timeoutId);
            let pais = data.country_code || 'BR';
            console.log('País detectado pela API:', pais);
            converterPrecos(pais);
        })
        .catch(error => {
            clearTimeout(timeoutId);
            console.log('API indisponível, usando Brasil como padrão');
            converterPrecos('BR');
        });
}

function converterPrecos(countryCode) {
    const precoBase = 150; // R$ 150,00 no Brasil
    
    // Taxas de conversão aproximadas (em relação ao Real)
    const conversoes = {
        'BR': { simbolo: 'R$', taxa: 1, formato: (v) => `R$ ${v.toFixed(2)}` },
        'PT': { simbolo: '€', taxa: 0.20, formato: (v) => `€ ${v.toFixed(2)}` }, // ~1 EUR = 5 BRL
        'US': { simbolo: '$', taxa: 0.20, formato: (v) => `$ ${v.toFixed(2)}` },  // ~1 USD = 5 BRL
        'GB': { simbolo: '£', taxa: 0.17, formato: (v) => `£ ${v.toFixed(2)}` },  // ~1 GBP = 6 BRL
        'CA': { simbolo: 'C$', taxa: 0.15, formato: (v) => `C$ ${v.toFixed(2)}` }, // ~1 CAD = 3.7 BRL
        'AU': { simbolo: 'A$', taxa: 0.13, formato: (v) => `A$ ${v.toFixed(2)}` }, // ~1 AUD = 3.5 BRL
    };
    
    const conversao = conversoes[countryCode] || conversoes['BR'];
    const precoConvertido = precoBase * conversao.taxa;
    
    console.log(`✅ Script ativo! País: ${countryCode} | Preço convertido: ${conversao.formato(precoConvertido)}`);
    
    // Atualizar todos os preços no portfólio
    const elementos = document.querySelectorAll('.portfolio-price');
    console.log(`Encontrados ${elementos.length} elementos com classe .portfolio-price`);
    
    elementos.forEach(elemento => {
        elemento.textContent = conversao.formato(precoConvertido);
        console.log(`Atualizado: ${elemento.textContent}`);
    });
}
