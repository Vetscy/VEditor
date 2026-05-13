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
    // Usar apenas APIs de IP, sem pedir permissão de localização
    buscarPaisComAPI();
}

function buscarPaisComAPI() {
    // Tentar múltiplas APIs confiáveis que funcionam com CORS
    const apis = [
        {
            url: 'https://ipapi.co/json/',
            parseCountry: (data) => data.country_code
        },
        {
            url: 'https://ip-api.com/json/',
            parseCountry: (data) => data.countryCode
        },
        {
            url: 'https://ipwhois.app/json/',
            parseCountry: (data) => data.country_code
        },
        {
            url: 'https://geolocation-db.com/json/',
            parseCountry: (data) => data.country_code
        },
        {
            url: 'https://geoip.json-ip.com/api/json/ip/count',
            parseCountry: (data) => data.countryCode
        }
    ];
    
    const tentarAPI = (index = 0) => {
        if (index >= apis.length) {
            console.log('Nenhuma API disponível, usando Brasil');
            converterPrecos('BR');
            return;
        }
        
        const api = apis[index];
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        fetch(api.url, { signal: controller.signal })
            .then(response => response.json())
            .then(data => {
                clearTimeout(timeoutId);
                console.log(`API ${index + 1} resposta:`, data);
                
                let pais = api.parseCountry(data);
                if (!pais) {
                    pais = data.country_code || data.countryCode || data.country || 'BR';
                }
                
                if (pais && pais.length === 2) {
                    console.log(`✅ Detectado via API ${index + 1}: ${pais}`);
                    converterPrecos(pais);
                } else {
                    throw new Error('Código de país inválido');
                }
            })
            .catch(error => {
                clearTimeout(timeoutId);
                console.log(`API ${index + 1} falhou:`, error.message);
                tentarAPI(index + 1);
            });
    };
    
    tentarAPI();
}

function converterPrecos(countryCode) {
    const precoBase = 150; // R$ 150,00 no Brasil
    
    // Normalizar código de país (remover espaços, maiúsculas)
    const paisNormalizado = (countryCode || 'BR').trim().toUpperCase();
    
    // Taxas de conversão aproximadas (em relação ao Real)
    const conversoes = {
        'BR': { simbolo: 'R$', taxa: 1, formato: (v) => `R$ ${v.toFixed(2)}` },
        'PT': { simbolo: '€', taxa: 0.20, formato: (v) => `€ ${v.toFixed(2)}` }, // ~1 EUR = 5 BRL
        'US': { simbolo: '$', taxa: 0.20, formato: (v) => `$ ${v.toFixed(2)}` },  // ~1 USD = 5 BRL
        'GB': { simbolo: '£', taxa: 0.17, formato: (v) => `£ ${v.toFixed(2)}` },  // ~1 GBP = 6 BRL
        'CA': { simbolo: 'C$', taxa: 0.15, formato: (v) => `C$ ${v.toFixed(2)}` }, // ~1 CAD = 3.7 BRL
        'AU': { simbolo: 'A$', taxa: 0.13, formato: (v) => `A$ ${v.toFixed(2)}` }, // ~1 AUD = 3.5 BRL
    };
    
    const conversao = conversoes[paisNormalizado] || conversoes['BR'];
    const precoConvertido = precoBase * conversao.taxa;
    
    console.log(`✅ País detectado: ${paisNormalizado} | Moeda: ${conversao.simbolo} | Preço: ${conversao.formato(precoConvertido)}`);
    
    // Atualizar todos os preços no portfólio
    const elementos = document.querySelectorAll('.portfolio-price');
    console.log(`Atualizando ${elementos.length} preços...`);
    
    elementos.forEach(elemento => {
        elemento.textContent = conversao.formato(precoConvertido);
        console.log(`Atualizado: ${elemento.textContent}`);
    });
}
