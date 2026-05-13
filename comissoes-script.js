document.addEventListener('DOMContentLoaded', () => {
    // Bloquear clique direito em TUDO
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });

    // Bloquear F12, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J, Ctrl+Shift+K, Ctrl+S
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J' || e.key === 'K')) ||
            (e.ctrlKey && e.key === 's')) {
            e.preventDefault();
            return false;
        }
    });

    // Bloquear seleção de texto
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.msUserSelect = 'none';

    // Bloquear drag and drop de imagens
    document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    // Detectar DevTools aberto
    setInterval(() => {
        const start = performance.now();
        debugger;
        const end = performance.now();
        if (end - start > 100) {
            document.body.innerHTML = '';
            alert('DevTools detectado! Acesso negado.');
            window.location.href = 'about:blank';
        }
    }, 1000);

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
    // Usar apenas APIs de IP, sem pedir permissão de localização
    buscarPaisComAPI();
}

function buscarPaisComAPI() {
    // Tentar múltiplas APIs confiáveis que funcionam com CORS
    const apis = [
        'https://ipapi.co/json/',
        'https://ip-api.com/json/',
        'https://ipwhois.app/json/',
        'https://geolocation-db.com/json/'
    ];
    
    const tentarAPI = (index = 0) => {
        if (index >= apis.length) {
            console.log('Nenhuma API disponível, usando Brasil');
            converterPrecos('BR');
            return;
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        fetch(apis[index], { signal: controller.signal })
            .then(response => response.json())
            .then(data => {
                clearTimeout(timeoutId);
                // Diferentes APIs retornam o código de país em campos diferentes
                let pais = data.country_code || data.countryCode || data.country || 'BR';
                console.log(`✅ Detectado via API: ${pais}`);
                converterPrecos(pais);
            })
            .catch(error => {
                clearTimeout(timeoutId);
                console.log(`API ${index + 1} falhou, tentando próxima...`);
                tentarAPI(index + 1);
            });
    };
    
    tentarAPI();
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
