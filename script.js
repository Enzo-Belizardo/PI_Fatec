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
    'AGUA RASA': { esgoto: 90, residuos: 95, agua: 100 },
    'ALTO DE PINHEIROS': { esgoto: 100, residuos: 100, agua: 100 },
    'ANHANGUERA': { esgoto: 75, residuos: 80, agua: 90 },
    'ARICANDUVA': { esgoto: 70, residuos: 75, agua: 85 },
    'ARTUR ALVIM': { esgoto: 65, residuos: 70, agua: 83 },
    'BARRA FUNDA': { esgoto: 100, residuos: 95, agua: 100 },
    'BELA VISTA': { esgoto: 100, residuos: 97, agua: 100 },
    'BELEM': { esgoto: 95, residuos: 90, agua: 100 },
    'BOM RETIRO': { esgoto: 100, residuos: 93, agua: 100 },
    'BRAS': { esgoto: 97, residuos: 93, agua: 100 },
    'BRASILANDIA': { esgoto: 55, residuos: 65, agua: 75 },
    'BUTANTA': { esgoto: 100, residuos: 95, agua: 100 },
    'CACHOEIRINHA': { esgoto: 70, residuos: 75, agua: 83 },
    'CAMBUCI': { esgoto: 95, residuos: 90, agua: 100 },
    'CAMPO BELO': { esgoto: 100, residuos: 100, agua: 100 },
    'CAMPO GRANDE': { esgoto: 65, residuos: 70, agua: 80 },
    'CAMPO LIMPO': { esgoto: 60, residuos: 65, agua: 73 },
    'CANGAIBA': { esgoto: 65, residuos: 70, agua: 80 },
    'CAPAO REDONDO': { esgoto: 45, residuos: 55, agua: 60 },
    'CARRAO': { esgoto: 75, residuos: 80, agua: 85 },
    'CASA VERDE': { esgoto: 90, residuos: 95, agua: 97 },
    'CIDADE ADEMAR': { esgoto: 60, residuos: 65, agua: 70 },
    'CIDADE DUTRA': { esgoto: 65, residuos: 70, agua: 75 },
    'CIDADE LIDER': { esgoto: 55, residuos: 60, agua: 65 },
    'CIDADE TIRADENTES': { esgoto: 35, residuos: 45, agua: 50 },
    'CONSOLACAO': { esgoto: 100, residuos: 100, agua: 100 },
    'CURSINO': { esgoto: 95, residuos: 93, agua: 100 },
    'ERMELINO MATARAZZO': { esgoto: 50, residuos: 55, agua: 60 },
    'FREGUESIA DO O': { esgoto: 55, residuos: 60, agua: 65 },
    'GRAJAU': { esgoto: 40, residuos: 45, agua: 50 },
    'GUAIANASES': { esgoto: 45, residuos: 50, agua: 55 },
    'IGUATEMI': { esgoto: 60, residuos: 65, agua: 70 },
    'IPIRANGA': { esgoto: 100, residuos: 95, agua: 100 },
    'ITAIM BIBI': { esgoto: 100, residuos: 100, agua: 100 },
    'ITAIM PAULISTA': { esgoto: 55, residuos: 60, agua: 65 },
    'ITAQUERA': { esgoto: 85, residuos: 89, agua: 93 },
    'JABAQUARA': { esgoto: 97, residuos: 95, agua: 100 },
    'JACANA': { esgoto: 50, residuos: 55, agua: 60 },
    'JAGUARA': { esgoto: 100, residuos: 100, agua: 100 },
    'JAGUARE': { esgoto: 65, residuos: 70, agua: 75 },
    'JARAGUA': { esgoto: 100, residuos: 95, agua: 100 },
    'JARDIM ANGELA': { esgoto: 30, residuos: 35, agua: 40 },
    'JARDIM HELENA': { esgoto: 50, residuos: 55, agua: 60 },
    'JARDIM PAULISTA': { esgoto: 100, residuos: 100, agua: 100 },
    'JARDIM SAO LUIS': { esgoto: 55, residuos: 60, agua: 65 },
    'JOSE BONIFACIO': { esgoto: 65, residuos: 70, agua: 75 },
    'LAPA': { esgoto: 100, residuos: 95, agua: 100 },
    'LAJEADO': { esgoto: 45, residuos: 55, agua: 60 },
    'LIBERDADE': { esgoto: 100, residuos: 100, agua: 100 },
    'LIMAO': { esgoto: 70, residuos: 75, agua: 80 },
    'MANDAQUI': { esgoto: 80, residuos: 85, agua: 90 },
    'MARSILAC': { esgoto: 69, residuos: 71, agua: 77 },
    'MOEMA': { esgoto: 100, residuos: 100, agua: 100 },
    'MOOCA': { esgoto: 93, residuos: 90, agua: 100 },
    'MORUMBI': { esgoto: 100, residuos: 95, agua: 100 },
    'PARELHEIROS': { esgoto: 73, residuos: 30, agua: 35 },
    'PARI': { esgoto: 95, residuos: 90, agua: 100 },
    'PARQUE DO CARMO': { esgoto: 92, residuos: 89, agua: 96 },
    'PEDREIRA': { esgoto: 65, residuos: 70, agua: 75 },
    'PENHA': { esgoto: 75, residuos: 80, agua: 85 },
    'PERDIZES': { esgoto: 100, residuos: 100, agua: 100 },
    'PERUS': { esgoto: 50, residuos: 55, agua: 60 },
    'PINHEIROS': { esgoto: 100, residuos: 100, agua: 100 },
    'PIRITUBA': { esgoto: 75, residuos: 80, agua: 85 },
    'PONTE RASA': { esgoto: 55, residuos: 60, agua: 65 },
    'RAPOSO TAVARES': { esgoto: 74, residuos: 83, agua: 85 },
    'REPUBLICA': { esgoto: 100, residuos: 100, agua: 100 },
    'RIO PEQUENO': { esgoto: 60, residuos: 65, agua: 70 },
    'SACOMA': { esgoto: 55, residuos: 60, agua: 65 },
    'SANTA CECILIA': { esgoto: 100, residuos: 95, agua: 100 },
    'SANTANA': { esgoto: 97, residuos: 93, agua: 100 },
    'SANTO AMARO': { esgoto: 95, residuos: 90, agua: 100 },
    'SAO DOMINGOS': { esgoto: 75, residuos: 80, agua: 85 },
    'SAO LUCAS': { esgoto: 70, residuos: 75, agua: 80 },
    'SAO MATEUS': { esgoto: 75, residuos: 70, agua: 65 },
    'SAO MIGUEL': { esgoto: 60, residuos: 65, agua: 70 },
    'SAO RAFAEL': { esgoto: 65, residuos: 70, agua: 75 },
    'SAPOPEMBA': { esgoto: 40, residuos: 45, agua: 50 },
    'SAUDE': { esgoto: 100, residuos: 100, agua: 100 },
    'SE': { esgoto: 100, residuos: 100, agua: 100 },
    'SOCORRO': { esgoto: 75, residuos: 80, agua: 85 },
    'TATUAPE': { esgoto: 80, residuos: 83, agua: 90 },
    'TREMEMBE': { esgoto: 65, residuos: 70, agua: 75 },
    'TUCURUVI': { esgoto: 85, residuos: 90, agua: 95 },
    'VILA ANDRADE': { esgoto: 90, residuos: 93, agua: 97 },
    'VILA CURUCA': { esgoto: 50, residuos: 55, agua: 60 },
    'VILA FORMOSA': { esgoto: 65, residuos: 70, agua: 75 },
    'VILA GUILHERME': { esgoto: 75, residuos: 80, agua: 85 },
    'VILA JACUI': { esgoto: 55, residuos: 60, agua: 65 },
    'VILA LEOPOLDINA': { esgoto: 100, residuos: 95, agua: 100 },
    'VILA MARIA': { esgoto: 70, residuos: 75, agua: 80 },
    'VILA MARIANA': { esgoto: 100, residuos: 100, agua: 100 },
    'VILA MATILDE': { esgoto: 82, residuos: 88, agua: 85 },
    'VILA MEDEIROS': { esgoto: 75, residuos: 80, agua: 85 },
    'VILA PRUDENTE': { esgoto: 85, residuos: 90, agua: 95 },
    'VILA SONIA': { esgoto: 45, residuos: 50, agua: 55 }

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

const seletorFiltro = document.getElementById("seletor_filtro");
const seletorOrdem  = document.getElementById("seletor_ordem");
const corpoTabela   = document.getElementById("corpo_tabela");
const divPaginacao  = document.getElementById("paginacao");

const itensPorPagina = 10;
let paginaAtual = 1;
let listaFinal = [];

function getNomeAcentuado(bairro) {
    return nomesAcentuados[bairro] || bairro;
}

function gerarLista(filtro, ordem) {
    const lista = Object.entries(infoDistritos).map(([bairro, dados]) => ({
        bairro: getNomeAcentuado(bairro),
        valor: dados[filtro]
    }));

    if (ordem === "top") {
        listaFinal = lista
            .sort((a, b) => b.valor - a.valor)
            .slice(0, 30);
    } else {
        listaFinal = lista
            .sort((a, b) => a.valor - b.valor)
            .slice(0, 30);
    }

    mostrarTabela(1);
}

function mostrarTabela(pagina) {
    paginaAtual = pagina;
    corpoTabela.innerHTML = "";

    const inicio = (pagina - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;

    const dadosPagina = listaFinal.slice(inicio, fim);

    dadosPagina.forEach((item, i) => {
        const tr = document.createElement("tr");

        const pos = document.createElement("td");
        pos.textContent = inicio + i + 1;

        const nome = document.createElement("td");
        nome.textContent = item.bairro;

        const val = document.createElement("td");
        val.textContent = item.valor + "%";

        tr.appendChild(pos);
        tr.appendChild(nome);
        tr.appendChild(val);

        corpoTabela.appendChild(tr);
    });

    mostrarPaginacao();
}

function mostrarPaginacao() {
    divPaginacao.innerHTML = "";
    const totalPaginas = Math.ceil(listaFinal.length / itensPorPagina);

    for (let i = 1; i <= totalPaginas; i++) {
        const botao = document.createElement("button");
        botao.textContent = i;
        botao.className = (i === paginaAtual) ? "ativo" : "";
        botao.addEventListener("click", () => mostrarTabela(i));
        divPaginacao.appendChild(botao);
    }
}

seletorFiltro.addEventListener("change", () => {
    gerarLista(seletorFiltro.value, seletorOrdem.value);
});

seletorOrdem.addEventListener("change", () => {
    gerarLista(seletorFiltro.value, seletorOrdem.value);
});

gerarLista(seletorFiltro.value, seletorOrdem.value);


//Menu Burguer

function menuoculto() {
    const MenuOculto = document.querySelector('.oculto');
    const BtnOculto = document.getElementById('btnoct');
    MenuOculto.classList.toggle('open');
    BtnOculto.classList.toggle('ativo');
}