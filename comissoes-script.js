document.addEventListener('DOMContentLoaded', () => {
    configurarMarcadoresDeNovidade();

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

const NOVOS_TRABALHOS_STORAGE_KEY = 'veditor-novos-trabalhos-v1';
const NOVO_TRABALHO_DURACAO_MS = 24 * 60 * 60 * 1000;

function configurarMarcadoresDeNovidade() {
    const trabalhos = Array.from(document.querySelectorAll('.portfolio-item'));
    if (trabalhos.length === 0) return;

    const estado = lerEstadoDosTrabalhos();
    const idsAtuais = new Set(trabalhos.map(obterIdDoTrabalho));
    const primeiroAcesso = Object.keys(estado).length === 0;
    const agora = Date.now();

    trabalhos.forEach(trabalho => {
        const id = obterIdDoTrabalho(trabalho);
        const dataInformada = Date.parse(trabalho.dataset.addedAt || '');

        if (Number.isFinite(dataInformada)) {
            estado[id] = dataInformada;
        } else if (!(id in estado) && !primeiroAcesso) {
            estado[id] = agora;
        }

        atualizarMarcadorDeNovidade(trabalho, estado[id], agora);
    });

    Object.keys(estado).forEach(id => {
        if (!idsAtuais.has(id) || agora - estado[id] >= NOVO_TRABALHO_DURACAO_MS) {
            delete estado[id];
        }
    });

    salvarEstadoDosTrabalhos(estado);
    window.setInterval(() => atualizarMarcadoresAtivos(estado), 60 * 1000);
}

function obterIdDoTrabalho(trabalho) {
    if (trabalho.dataset.workId) return trabalho.dataset.workId;

    const imagem = trabalho.querySelector('.portfolio-image')?.getAttribute('src') || '';
    const titulo = trabalho.querySelector('h3')?.textContent.trim() || '';
    return `${imagem}|${titulo}`;
}

function atualizarMarcadoresAtivos(estado) {
    const agora = Date.now();

    document.querySelectorAll('.portfolio-item').forEach(trabalho => {
        atualizarMarcadorDeNovidade(trabalho, estado[obterIdDoTrabalho(trabalho)], agora);
    });

    Object.keys(estado).forEach(id => {
        if (agora - estado[id] >= NOVO_TRABALHO_DURACAO_MS) {
            delete estado[id];
        }
    });

    salvarEstadoDosTrabalhos(estado);
}

function atualizarMarcadorDeNovidade(trabalho, adicionadoEm, agora) {
    const marcadorAtual = trabalho.querySelector('.novo-trabalho-badge');
    const dentroDoPrazo = Number.isFinite(adicionadoEm)
        && agora - adicionadoEm >= 0
        && agora - adicionadoEm < NOVO_TRABALHO_DURACAO_MS;

    if (!dentroDoPrazo) {
        marcadorAtual?.remove();
        return;
    }

    const tempoRestante = formatarTempoRestante(adicionadoEm + NOVO_TRABALHO_DURACAO_MS - agora);
    const marcador = marcadorAtual || document.createElement('span');
    marcador.className = 'novo-trabalho-badge';
    marcador.textContent = 'NOVO';
    marcador.dataset.timeLeft = `Fica por mais ${tempoRestante}`;
    marcador.setAttribute('aria-label', `Novo trabalho. Fica por mais ${tempoRestante}`);

    if (!marcadorAtual) {
        trabalho.appendChild(marcador);
    }
}

function formatarTempoRestante(milissegundos) {
    const horas = Math.ceil(milissegundos / (60 * 60 * 1000));
    if (horas >= 24) return '1 dia';
    if (horas === 1) return '1 hora';
    return `${horas} horas`;
}

function lerEstadoDosTrabalhos() {
    try {
        const estadoSalvo = JSON.parse(localStorage.getItem(NOVOS_TRABALHOS_STORAGE_KEY) || '{}');
        return estadoSalvo && typeof estadoSalvo === 'object' && !Array.isArray(estadoSalvo)
            ? estadoSalvo
            : {};
    } catch (error) {
        console.warn('Não foi possível ler o estado dos novos trabalhos:', error);
        return {};
    }
}

function salvarEstadoDosTrabalhos(estado) {
    try {
        localStorage.setItem(NOVOS_TRABALHOS_STORAGE_KEY, JSON.stringify(estado));
    } catch (error) {
        console.warn('Não foi possível salvar o estado dos novos trabalhos:', error);
    }
}

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
