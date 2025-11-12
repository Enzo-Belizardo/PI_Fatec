// NAVBAR - USUARIO
 
document.addEventListener('DOMContentLoaded', function() {
    var usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    var popup = document.querySelector('.perfil_popup');
    var nomeEl = document.getElementById('perfilNome');
    var emailEl = document.getElementById('perfilEmail');
    var btnSair = document.getElementById('btnSair');
    var perfilIcone = document.querySelector('.perfil_icone');
    
    var container = document.getElementById('notificacoes');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificacoes';
        document.body.appendChild(container);
    }

    // Função para mostrar toasts
    function mostrarToast(mensagem, tipo) {
        if (!tipo) tipo = 'aviso';
        var toast = document.createElement('div');
        toast.classList.add('toast', tipo);

        var icone = '💬';
        if (tipo === 'sucesso') icone = '✅';
        if (tipo === 'erro') icone = '❌';
        if (tipo === 'aviso') icone = '⚠️';

        toast.innerHTML = '<span class="icone">' + icone + '</span><span>' + mensagem + '</span>';
        container.appendChild(toast);

        setTimeout(function() {
            toast.remove();
        }, 3500);
    }

    // Usuário logado 
    if (usuarioLogado) {
        nomeEl.textContent = 'Usuário: ' + usuarioLogado.nome;
        emailEl.textContent = 'Email: ' + usuarioLogado.email;

        perfilIcone.style.cursor = 'pointer';
        perfilIcone.addEventListener('click', function(e) {
            e.preventDefault();
        });

        btnSair.addEventListener('click', function() {
            localStorage.removeItem('usuarioLogado');
            popup.style.display = 'none';
            mostrarToast('Você saiu da sua conta.', 'aviso');
            setTimeout(function() {
                window.location.reload();
            }, 1200);
        });
    } else {
        
        perfilIcone.style.cursor = 'pointer';
        perfilIcone.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }
});

//CALCULADORA

document.addEventListener('DOMContentLoaded', function() {
        
    const inputPeso = document.getElementById('input_peso');
    const inputTemperatura = document.getElementById('input_temperatura');
    const btnCalcular = document.getElementById('btn_calcular');
    const btnReiniciar = document.getElementById('btn_reiniciar');
    const canvasGrafico = document.getElementById('grafico_agua');
    const mensagemInicialGrafico = document.getElementById('mensagem_inicial_grafico');
          
    const ctx = canvasGrafico.getContext('2d');     

    Chart.defaults.font.family = 'Poppins';
    let meuGrafico = null;

    btnCalcular.addEventListener('click', executarCalculo);
    btnReiniciar.addEventListener('click', reiniciarTudo);

    function executarCalculo() {
        const peso = parseFloat(inputPeso.value);
        const temperatura = parseFloat(inputTemperatura.value);

        if (isNaN(peso) || peso <= 0 || isNaN(temperatura)) {
            alert('❌ ERRO: Por favor, insira valores válidos para peso (positivo) e temperatura.'); 
            return;
        }

        const recomendacaoBaseML = peso * 35;
        const recomendacaoBaseLitros = (recomendacaoBaseML / 1000).toFixed(2);
        const recomendacaoFinalML = (peso * 35) + ((temperatura - 20) * 10);
        const minimoML = peso * 30; 
        const recomendacaoFinalAjustadaML = Math.max(recomendacaoFinalML, minimoML);
        const recomendacaoFinalLitros = (recomendacaoFinalAjustadaML / 1000).toFixed(2);     
        criarOuAtualizarGrafico(recomendacaoBaseLitros, recomendacaoFinalLitros);
                
        alert('✅ SUCESSO: Gráfico calculado com sucesso!');
    }

    function criarOuAtualizarGrafico(base, final) {
        mensagemInicialGrafico.style.display = 'none';

        if (meuGrafico) {
            meuGrafico.destroy();
        }

        meuGrafico = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [
                    `Base (Apenas Peso): ${base} L`, 
                    `Ajustada (Peso + Temp.): ${final} L`
                ],
                datasets: [{
                    label: 'Litros de Água',
                    data: [base, final],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.7)', 
                        '#06a806ff' 
                    ],
                    
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        '#06a806ff'
                    ],
                    
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Recomendação da Quantidade Diária de Água',
                        font: {
                            size: 16,
                        },
                        padding: {
                            top: 10,
                            bottom: 20
                        }
                    }
                }
            }
        });
    }

    function reiniciarTudo() {
        inputPeso.value = '';
        inputTemperatura.value = '';

        if (meuGrafico) {
            meuGrafico.destroy();
            meuGrafico = null;
        }

        mensagemInicialGrafico.style.display = 'block';

        alert('⚠️ AVISO: Campos e gráfico reiniciados.');
    }
});

// MAPA SP

let camadaGeoJSON;
let mapa; 

const nomesAcentuados = {
    'AGUA RASA': 'Água Rasa', 'ALTO DE PINHEIROS': 'Alto de Pinheiros', 'ANHANGUERA': 'Anhanguera',
    'ARICANDUVA': 'Aricanduva', 'ARTUR ALVIM': 'Artur Alvim', 'BARRA FUNDA': 'Barra Funda',
    'BELA VISTA': 'Bela Vista', 'BELEM': 'Belém', 'BOM RETIRO': 'Bom Retiro', 'BRAS': 'Brás',
    'BRASILANDIA': 'Brasilândia', 'BUTANTA': 'Butantã', 'CACHOEIRINHA': 'Cachoeirinha', 'CAMBUCI': 'Cambuci',
    'CAMPO BELO': 'Campo Belo', 'CAMPO GRANDE': 'Campo Grande', 'CAMPO LIMPO': 'Campo Limpo',
    'CANGAIBA': 'Cangaíba', 'CAPAO REDONDO': 'Capão Redondo', 'CARRAO': 'Carrão', 'CASA VERDE': 'Casa Verde',
    'CIDADE ADEMAR': 'Cidade Ademar', 'CIDADE DUTRA': 'Cidade Dutra', 'CIDADE LIDER': 'Cidade Líder',
    'CIDADE TIRADENTES': 'Cidade Tiradentes', 'CONSOLACAO': 'Consolação', 'CURSINO': 'Cursino',
    'ERMELINO MATARAZZO': 'Ermelino Matarazzo', 'FREGUESIA DO O': 'Freguesia do Ó', 'GRAJAU': 'Grajaú',
    'GUAIANASES': 'Guaianases', 'IGUATEMI': 'Iguatemi', 'IPIRANGA': 'Ipiranga', 'ITAIM BIBI': 'Itaim Bibi',
    'ITAIM PAULISTA': 'Itaim Paulista', 'ITAQUERA': 'Itaquera', 'JABAQUARA': 'Jabaquara',
    'JACANA': 'Jaçanã', 'JAGUARA': 'Jaguara', 'JAGUARE': 'Jaguaré', 'JARAGUA': 'Jaraguá',
    'JARDIM ANGELA': 'Jardim Ângela', 'JARDIM HELENA': 'Jardim Helena', 'JARDIM PAULISTA': 'Jardim Paulista',
    'JARDIM SAO LUIS': 'Jardim São Luís', 'JOSE BONIFACIO': 'José Bonifácio', 'LAPA': 'Lapa',
    'LAJEADO': 'Lajeado', 'LIBERDADE': 'Liberdade', 'LIMAO': 'Limão', 'MANDAQUI': 'Mandaqui',
    'MARSILAC': 'Marsilac', 'MOEMA': 'Moema', 'MOOCA': 'Mooca', 'MORUMBI': 'Morumbi',
    'PARELHEIROS': 'Parelheiros', 'PARI': 'Pari', 'PARQUE DO CARMO': 'Parque do Carmo',
    'PEDREIRA': 'Pedreira', 'PENHA': 'Penha', 'PERDIZES': 'Perdizes', 'PERUS': 'Perus',
    'PINHEIROS': 'Pinheiros', 'PIRITUBA': 'Pirituba', 'PONTE RASA': 'Ponte Rasa',
    'RAPOSO TAVARES': 'Raposo Tavares', 'REPUBLICA': 'República', 'RIO PEQUENO': 'Rio Pequeno',
    'SACOMA': 'Sacomã', 'SANTA CECILIA': 'Santa Cecília', 'SANTANA': 'Santana', 'SANTO AMARO': 'Santo Amaro',
    'SAO DOMINGOS': 'São Domingos', 'SAO LUCAS': 'São Lucas', 'SAO MATEUS': 'São Mateus',
    'SAO MIGUEL': 'São Miguel', 'SAO RAFAEL': 'São Rafael', 'SAPOPEMBA': 'Sapopemba',
    'SAUDE': 'Saúde', 'SE': 'Sé', 'SOCORRO': 'Socorro', 'TATUAPE': 'Tatuapé', 'TREMEMBE': 'Tremembé',
    'TUCURUVI': 'Tucuruvi', 'VILA ANDRADE': 'Vila Andrade', 'VILA CURUCA': 'Vila Curuçá',
    'VILA FORMOSA': 'Vila Formosa', 'VILA GUILHERME': 'Vila Guilherme', 'VILA JACUI': 'Vila Jacuí',
    'VILA LEOPOLDINA': 'Vila Leopoldina', 'VILA MARIA': 'Vila Maria', 'VILA MARIANA': 'Vila Mariana',
    'VILA MATILDE': 'Vila Matilde', 'VILA MEDEIROS': 'Vila Medeiros', 'VILA PRUDENTE': 'Vila Prudente',
    'VILA SONIA': 'Vila Sônia'
};
        
const infoDistritos = {
    'AGUA RASA': { esgoto: 85, residuos: 90, agua: 95 }, 'ALTO DE PINHEIROS': { esgoto: 98, residuos: 95, agua: 99 },
    'ANHANGUERA': { esgoto: 70, residuos: 75, agua: 85 }, 'ARICANDUVA': { esgoto: 65, residuos: 70, agua: 80 },
    'ARTUR ALVIM': { esgoto: 60, residuos: 65, agua: 78 }, 'BARRA FUNDA': { esgoto: 95, residuos: 90, agua: 98 },
    'BELA VISTA': { esgoto: 97, residuos: 92, agua: 99 }, 'BELEM': { esgoto: 90, residuos: 85, agua: 95 },
    'BOM RETIRO': { esgoto: 96, residuos: 88, agua: 98 }, 'BRAS': { esgoto: 92, residuos: 88, agua: 97 },
    'BRASILANDIA': { esgoto: 50, residuos: 60, agua: 70 }, 'BUTANTA': { esgoto: 95, residuos: 90, agua: 99 },
    'CACHOEIRINHA': { esgoto: 65, residuos: 70, agua: 78 }, 'CAMBUCI': { esgoto: 90, residuos: 85, agua: 95 },
    'CAMPO BELO': { esgoto: 98, residuos: 95, agua: 99 }, 'CAMPO GRANDE': { esgoto: 60, residuos: 65, agua: 75 },
    'CAMPO LIMPO': { esgoto: 55, residuos: 60, agua: 68 }, 'CANGAIBA': { esgoto: 60, residuos: 65, agua: 75 },
    'CAPAO REDONDO': { esgoto: 40, residuos: 50, agua: 55 }, 'CARRAO': { esgoto: 70, residuos: 75, agua: 80 },
    'CASA VERDE': { esgoto: 85, residuos: 90, agua: 92 }, 'CIDADE ADEMAR': { esgoto: 55, residuos: 60, agua: 65 },
    'CIDADE DUTRA': { esgoto: 60, residuos: 65, agua: 70 }, 'CIDADE LIDER': { esgoto: 50, residuos: 55, agua: 60 },
    'CIDADE TIRADENTES': { esgoto: 30, residuos: 40, agua: 45 }, 'CONSOLACAO': { esgoto: 98, residuos: 95, agua: 99 },
    'CURSINO': { esgoto: 90, residuos: 88, agua: 95 }, 'ERMELINO MATARAZZO': { esgoto: 45, residuos: 50, agua: 55 },
    'FREGUESIA DO O': { esgoto: 50, residuos: 55, agua: 60 }, 'GRAJAU': { esgoto: 35, residuos: 40, agua: 45 },
    'GUAIANASES': { esgoto: 40, residuos: 45, agua: 50 }, 'IGUATEMI': { esgoto: 55, residuos: 60, agua: 65 },
    'IPIRANGA': { esgoto: 95, residuos: 90, agua: 98 }, 'ITAIM BIBI': { esgoto: 99, residuos: 95, agua: 99 },
    'ITAIM PAULISTA': { esgoto: 50, residuos: 55, agua: 60 }, 'ITAQUERA': { esgoto: 55, residuos: 60, agua: 65 },
    'JABAQUARA': { esgoto: 92, residuos: 90, agua: 97 }, 'JACANA': { esgoto: 45, residuos: 50, agua: 55 },
    'JAGUARA': { esgoto: 98, residuos: 95, agua: 99 }, 'JAGUARE': { esgoto: 60, residuos: 65, agua: 70 },
    'JARAGUA': { esgoto: 95, residuos: 90, agua: 98 }, 'JARDIM ANGELA': { esgoto: 25, residuos: 30, agua: 35 },
    'JARDIM HELENA': { esgoto: 45, residuos: 50, agua: 55 }, 'JARDIM PAULISTA': { esgoto: 99, residuos: 95, agua: 99 },
    'JARDIM SAO LUIS': { esgoto: 50, residuos: 55, agua: 60 }, 'JOSE BONIFACIO': { esgoto: 60, residuos: 65, agua: 70 },
    'LAPA': { esgoto: 95, residuos: 90, agua: 98 }, 'LAJEADO': { esgoto: 40, residuos: 50, agua: 55 },
    'LIBERDADE': { esgoto: 98, residuos: 95, agua: 99 }, 'LIMAO': { esgoto: 65, residuos: 70, agua: 75 },
    'MANDAQUI': { esgoto: 75, residuos: 80, agua: 85 }, 'MARSILAC': { esgoto: 20, residuos: 25, agua: 30 },
    'MOEMA': { esgoto: 99, residuos: 95, agua: 99 }, 'MOOCA': { esgoto: 88, residuos: 85, agua: 95 },
    'MORUMBI': { esgoto: 95, residuos: 90, agua: 98 }, 'PARELHEIROS': { esgoto: 20, residuos: 25, agua: 30 },
    'PARI': { esgoto: 90, residuos: 85, agua: 95 }, 'PARQUE DO CARMO': { esgoto: 50, residuos: 55, agua: 60 },
    'PEDREIRA': { esgoto: 60, residuos: 65, agua: 70 }, 'PENHA': { esgoto: 70, residuos: 75, agua: 80 },
    'PERDIZES': { esgoto: 98, residuos: 95, agua: 99 }, 'PERUS': { esgoto: 45, residuos: 50, agua: 55 },
    'PINHEIROS': { esgoto: 99, residuos: 95, agua: 99 }, 'PIRITUBA': { esgoto: 70, residuos: 75, agua: 80 },
    'PONTE RASA': { esgoto: 50, residuos: 55, agua: 60 }, 'RAPOSO TAVARES': { esgoto: 45, residuos: 50, agua: 55 },
    'REPUBLICA': { esgoto: 98, residuos: 95, agua: 99 }, 'RIO PEQUENO': { esgoto: 55, residuos: 60, agua: 65 },
    'SACOMA': { esgoto: 50, residuos: 55, agua: 60 }, 'SANTA CECILIA': { esgoto: 95, residuos: 90, agua: 98 },
    'SANTANA': { esgoto: 92, residuos: 88, agua: 97 }, 'SANTO AMARO': { esgoto: 90, residuos: 85, agua: 95 },
    'SAO DOMINGOS': { esgoto: 70, residuos: 75, agua: 80 }, 'SAO LUCAS': { esgoto: 65, residuos: 70, agua: 75 },
    'SAO MATEUS': { esgoto: 50, residuos: 55, agua: 60 }, 'SAO MIGUEL': { esgoto: 55, residuos: 60, agua: 65 },
    'SAO RAFAEL': { esgoto: 60, residuos: 65, agua: 70 }, 'SAPOPEMBA': { esgoto: 35, residuos: 40, agua: 45 },
    'SAUDE': { esgoto: 98, residuos: 95, agua: 99 }, 'SE': { esgoto: 99, residuos: 98, agua: 99 },
    'SOCORRO': { esgoto: 70, residuos: 75, agua: 80 }, 'TATUAPE': { esgoto: 75, residuos: 78, agua: 85 },
    'TREMEMBE': { esgoto: 60, residuos: 65, agua: 70 }, 'TUCURUVI': { esgoto: 80, residuos: 85, agua: 90 },
    'VILA ANDRADE': { esgoto: 85, residuos: 88, agua: 92 }, 'VILA CURUCA': { esgoto: 45, residuos: 50, agua: 55 },
    'VILA FORMOSA': { esgoto: 60, residuos: 65, agua: 70 }, 'VILA GUILHERME': { esgoto: 70, residuos: 75, agua: 80 },
    'VILA JACUI': { esgoto: 50, residuos: 55, agua: 60 }, 'VILA LEOPOLDINA': { esgoto: 95, residuos: 90, agua: 98 },
    'VILA MARIA': { esgoto: 65, residuos: 70, agua: 75 }, 'VILA MARIANA': { esgoto: 98, residuos: 95, agua: 99 },
    'VILA MATILDE': { esgoto: 55, residuos: 60, agua: 65 }, 'VILA MEDEIROS': { esgoto: 70, residuos: 75, agua: 80 },
    'VILA PRUDENTE': { esgoto: 80, residuos: 85, agua: 90 }, 'VILA SONIA': { esgoto: 40, residuos: 45, agua: 50 }
};

const removerAcentos = (texto) => {
    if (!texto) return '';
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
};

const labelsIndicadores = {
    esgoto: 'Tratamento de Esgoto',
    residuos: 'Gestão de Resíduos',
    agua: 'Abastecimento de Água'
};

function obterPopupPadrao(nomeChave, dadosDistrito) {
    const nomeExibicao = nomesAcentuados[nomeChave] || nomeChave; 
    const dados = dadosDistrito || { esgoto: '-', residuos: '-', agua: '-' }; 

    return `
        <h3>${nomeExibicao}</h3>
        <p>${labelsIndicadores.esgoto}: <span>${dados.esgoto}%</span></p>
        <p>${labelsIndicadores.residuos}: <span>${dados.residuos}%</span></p>
        <p>${labelsIndicadores.agua}: <span>${dados.agua}%</span></p>
    `;
}

function obterPopupFiltrado(nomeChave, dadosDistrito, indicador, rotulo) {
    const nomeExibicao = nomesAcentuados[nomeChave] || nomeChave; 
    const valor = dadosDistrito ? dadosDistrito[indicador] : '-';

    return `
        <h3>${nomeExibicao}</h3>
        <p>${rotulo}: <span>${valor}%</span></p>
    `;
}

function obterEstiloPadrao() {
    return {
        color: '#007bff', 
        fillColor: '#aadeff', 
        fillOpacity: 0.4,
        weight: 2 
    };
}

window.aplicarFiltros = function() {
    
    const inputBairro = document.getElementById('bairro_input').value.trim();
    const indicadorSelecionado = document.getElementById('indicador_select').value;
    const rotuloSelecionado = labelsIndicadores[indicadorSelecionado]; 
    
    const chaveBairroFiltrado = removerAcentos(inputBairro);
    let camadaParaDestacar = null;
    let encontrado = false;

    if (!camadaGeoJSON) return; 

    camadaGeoJSON.eachLayer(function(camada) {
        const elemento = camada.feature; 
        const nomeElemento = elemento.properties.ds_nome || elemento.properties.NOME || elemento.properties.nome || elemento.properties.name;
        const nomeChave = removerAcentos(nomeElemento);
        const dadosDistrito = infoDistritos[nomeChave];
        
        camada.setStyle(obterEstiloPadrao());
        const popupPadrao = obterPopupPadrao(nomeChave, dadosDistrito);
        camada.setPopupContent(popupPadrao);

        if (chaveBairroFiltrado && nomeChave === chaveBairroFiltrado) {
            encontrado = true;
            camadaParaDestacar = camada;
            
            camada.setStyle({
                color: '#06a806ff',
                weight: 4,
                fillColor: '#aadeff', 
                fillOpacity: 0.7,
            });
            camada.bringToFront();
            
            const popupFiltrado = obterPopupFiltrado(nomeChave, dadosDistrito, indicadorSelecionado, rotuloSelecionado);
            camada.setPopupContent(popupFiltrado);
        }
    });

    if (camadaParaDestacar) {
        const limites = camadaParaDestacar.getBounds();
        mapa.fitBounds(limites, { padding: [50, 50] });
        camadaParaDestacar.openPopup();
    } else if (chaveBairroFiltrado && !encontrado) {
         alert(`O distrito "${inputBairro}" não foi encontrado no mapa. Digite novamente.`);
    }
}

window.limparFiltros = function() {
    if (!camadaGeoJSON || !mapa) return;

    document.getElementById('bairro_input').value = '';
    document.getElementById('indicador_select').selectedIndex = 0; 

    camadaGeoJSON.eachLayer(function(camada) {
        const elemento = camada.feature;
        const nomeElemento = elemento.properties.ds_nome || elemento.properties.NOME || elemento.properties.nome || elemento.properties.name;
        const nomeChave = removerAcentos(nomeElemento);
        const dadosDistrito = infoDistritos[nomeChave];
        
        camada.setStyle(obterEstiloPadrao());
        
        const popupPadrao = obterPopupPadrao(nomeChave, dadosDistrito);
        camada.setPopupContent(popupPadrao);
    });

    mapa.fitBounds(camadaGeoJSON.getBounds());
}

document.addEventListener('DOMContentLoaded', function() {
    mapa = L.map('map').setView([-23.5505, -46.6333], 11); 
        
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    fetch('https://raw.githubusercontent.com/codigourbano/distritos-sp/master/distritos-sp.geojson')
        .then(resposta => resposta.json()) 
        .then(dados => { 
            camadaGeoJSON = L.geoJSON(dados, {
                style: obterEstiloPadrao, 
                onEachFeature: function(elemento, camada) { 
                    const nomeElemento = elemento.properties.ds_nome || elemento.properties.NOME || elemento.properties.nome || elemento.properties.name;
                        
                    const nomeChave = removerAcentos(nomeElemento);
                    const dadosDistrito = infoDistritos[nomeChave];
                    
                    const popupContent = obterPopupPadrao(nomeChave, dadosDistrito);
                    
                    camada.bindPopup(popupContent);
                        
                    camada.on({
                        mouseover: function(e) {
                            var camadaAlvo = e.target; 
                            camadaAlvo.setStyle({
                                weight: 4,
                                color: '#0056b3', 
                                fillOpacity: 0.7
                            });
                            camadaAlvo.bringToFront();
                        },
                        mouseout: function(e) {
                            camadaGeoJSON.resetStyle(e.target);
                        },
                        click: function(e) {
                            e.target.openPopup();
                        }
                    });
                }
            }).addTo(mapa);

            if (camadaGeoJSON.getBounds().isValid()) {
                mapa.fitBounds(camadaGeoJSON.getBounds());
            }
        })
        .catch(erro => { 
            console.error('Erro ao carregar o GeoJSON:', erro);
            alert('Não foi possível carregar os dados dos distritos. Verifique a URL ou a conexão.');
        });
});

// RANKING SP

const dados = {
    abastecimento: [
        { bairro: "Pinheiros", valor: "99.8%" },
        { bairro: "Moema", valor: "99.5%" },
        { bairro: "Vila Mariana", valor: "99.2%" },
        { bairro: "Itaim Bibi", valor: "99.1%" },
        { bairro: "Perdizes", valor: "98.9%" },
        { bairro: "Santana", valor: "98.5%" },
        { bairro: "Butantã", valor: "98.1%" },
        { bairro: "Liberdade", valor: "97.9%" },
        { bairro: "Tatuapé", valor: "97.6%" },
        { bairro: "Consolação", valor: "97.2%" },
        { bairro: "Sé", valor: "97.0%" },
        { bairro: "Bela Vista", valor: "96.8%" },
        { bairro: "Aclimação", valor: "96.5%" },
        { bairro: "Saúde", valor: "96.3%" },
        { bairro: "Ipiranga", valor: "96.0%" },
        { bairro: "Cambuci", valor: "95.9%" },
        { bairro: "Pirituba", valor: "95.6%" },
        { bairro: "Freguesia do Ó", valor: "95.4%" },
        { bairro: "Morumbi", valor: "95.2%" },
        { bairro: "Jabaquara", valor: "95.0%" },
        { bairro: "Campo Belo", valor: "94.8%" },
        { bairro: "Casa Verde", valor: "94.5%" },
        { bairro: "Vila Prudente", valor: "94.3%" },
        { bairro: "Lapa", valor: "94.0%" },
        { bairro: "Santo Amaro", valor: "93.8%" },
        { bairro: "Brooklin", valor: "93.5%" },
        { bairro: "Mooca", valor: "93.2%" },
        { bairro: "Anália Franco", valor: "93.0%" },
        { bairro: "Penha", valor: "92.8%" },
        { bairro: "Carrão", valor: "92.6%" }
    ],

    esgoto: [
        { bairro: "Moema", valor: "98.7%" },
        { bairro: "Pinheiros", valor: "98.4%" },
        { bairro: "Vila Mariana", valor: "98.0%" },
        { bairro: "Tatuapé", valor: "97.5%" },
        { bairro: "Liberdade", valor: "97.1%" },
        { bairro: "Consolação", valor: "96.9%" },
        { bairro: "Perdizes", valor: "96.5%" },
        { bairro: "Itaim Bibi", valor: "96.2%" },
        { bairro: "Santana", valor: "95.8%" },
        { bairro: "Sé", valor: "95.1%" },
        { bairro: "Santo Amaro", valor: "94.8%" },
        { bairro: "Lapa", valor: "94.5%" },
        { bairro: "Campo Belo", valor: "94.2%" },
        { bairro: "Vila Prudente", valor: "94.0%" },
        { bairro: "Casa Verde", valor: "93.8%" },
        { bairro: "Ipiranga", valor: "93.5%" },
        { bairro: "Brooklin", valor: "93.2%" },
        { bairro: "Pirituba", valor: "93.0%" },
        { bairro: "Cambuci", valor: "92.8%" },
        { bairro: "Morumbi", valor: "92.5%" },
        { bairro: "Freguesia do Ó", valor: "92.3%" },
        { bairro: "Carrão", valor: "92.1%" },
        { bairro: "Anália Franco", valor: "91.9%" },
        { bairro: "Penha", valor: "91.6%" },
        { bairro: "Saúde", valor: "91.3%" },
        { bairro: "Aclimação", valor: "91.0%" },
        { bairro: "Jabaquara", valor: "90.8%" },
        { bairro: "Bela Vista", valor: "90.5%" },
        { bairro: "Mooca", valor: "90.2%" },
        { bairro: "Vila Guilherme", valor: "90.0%" }
    ],

    residuos: [
        { bairro: "Vila Mariana", valor: "85.4%" },
        { bairro: "Pinheiros", valor: "84.9%" },
        { bairro: "Santo Amaro", valor: "84.3%" },
        { bairro: "Lapa", valor: "83.8%" },
        { bairro: "Tatuapé", valor: "82.7%" },
        { bairro: "Moema", valor: "81.9%" },
        { bairro: "Perdizes", valor: "80.5%" },
        { bairro: "Itaim Bibi", valor: "79.8%" },
        { bairro: "Sé", valor: "78.9%" },
        { bairro: "Butantã", valor: "78.2%" },
        { bairro: "Liberdade", valor: "77.6%" },
        { bairro: "Santana", valor: "77.0%" },
        { bairro: "Campo Belo", valor: "76.5%" },
        { bairro: "Brooklin", valor: "76.0%" },
        { bairro: "Morumbi", valor: "75.6%" },
        { bairro: "Ipiranga", valor: "75.2%" },
        { bairro: "Casa Verde", valor: "74.8%" },
        { bairro: "Saúde", valor: "74.3%" },
        { bairro: "Vila Prudente", valor: "73.9%" },
        { bairro: "Mooca", valor: "73.5%" },
        { bairro: "Carrão", valor: "73.1%" },
        { bairro: "Penha", valor: "72.8%" },
        { bairro: "Jabaquara", valor: "72.5%" },
        { bairro: "Freguesia do Ó", valor: "72.1%" },
        { bairro: "Pirituba", valor: "71.9%" },
        { bairro: "Aclimação", valor: "71.5%" },
        { bairro: "Anália Franco", valor: "71.1%" },
        { bairro: "Bela Vista", valor: "70.9%" },
        { bairro: "Cambuci", valor: "70.6%" },
        { bairro: "Vila Guilherme", valor: "70.3%" }
    ]
};

const seletorFiltro = document.getElementById("seletor-filtro");
const corpoTabela = document.getElementById("corpo-tabela");
const divPaginacao = document.getElementById("paginacao");

const itensPorPagina = 10;
let paginaAtual = 1;

function mostrarTabela(filtro, pagina = 1) {
    const lista = dados[filtro];
    corpoTabela.innerHTML = "";

    const inicio = (pagina - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const dadosPagina = lista.slice(inicio, fim);

    dadosPagina.forEach((item, indice) => {
        const linha = document.createElement("tr");

        const celulaPosicao = document.createElement("td");
        celulaPosicao.textContent = inicio + indice + 1;

        const celulaBairro = document.createElement("td");
        celulaBairro.textContent = item.bairro;

        const celulaValor = document.createElement("td");
        celulaValor.textContent = item.valor;

        linha.appendChild(celulaPosicao);
        linha.appendChild(celulaBairro);
        linha.appendChild(celulaValor);

        corpoTabela.appendChild(linha);
    });

        mostrarPaginacao(filtro);
}

    function mostrarPaginacao(filtro) {
        const totalPaginas = Math.ceil(dados[filtro].length / itensPorPagina);
        divPaginacao.innerHTML = "";

        for (let i = 1; i <= totalPaginas; i++) {
            const botao = document.createElement("button");
            botao.textContent = i;
            botao.className = (i === paginaAtual) ? "ativo" : "";
            botao.addEventListener("click", () => {
                paginaAtual = i;
                mostrarTabela(filtro, i);
            });
        divPaginacao.appendChild(botao);
        }
    }

    seletorFiltro.addEventListener("change", () => {
        paginaAtual = 1;
        mostrarTabela(seletorFiltro.value, paginaAtual);
    });

mostrarTabela(seletorFiltro.value, paginaAtual);