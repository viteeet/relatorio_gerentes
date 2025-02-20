// script.js
document.addEventListener("DOMContentLoaded", () => {
    const tabelaContainer = document.getElementById("tabela-container");
    const menu = document.getElementById("menu");
    const filtro = document.getElementById("filtro");
    const modoEscuroBotao = document.getElementById("modo-escuro");

    let guiaAtual = "BORDEROS OPERADOS";
    let dados = {};
    const guias = {
        "BASE CEDENTES": "base_cedentes.json",
        "BORDEROS OPERADOS": "borderos_operados.json",
        "CARTEIRAS EM ABERTO": "carteiras_em_aberto.json",
        "TITULOS QUITADOS": "titulos_quitados.json",
        "RISCO CEDENTE": "risco_cedente.json",
        "TITULOS VENCIDOS": "titulos_vencidos.json"
    };

    function carregarMenu() {
        menu.innerHTML = "";
        Object.keys(guias).forEach(guia => {
            const item = document.createElement("li");
            item.textContent = guia;
            item.addEventListener("click", () => carregarDados(guia));
            menu.appendChild(item);
        });
    }

    function carregarDados(guia) {
        guiaAtual = guia;
        fetch(guias[guia])
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao carregar JSON: ${response.status}`);
                }
                return response.json();
            })
            .then(json => {
                console.log(`JSON carregado: ${guia}`, json);
                dados = json[guia];
                carregarTabela();
            })
            .catch(error => {
                console.error("Erro ao carregar JSON:", error);
            });
    }

    function carregarTabela() {
        tabelaContainer.innerHTML = "";

        if (!dados || dados.length === 0) {
            tabelaContainer.innerHTML = "<p>Nenhum dado disponível para esta guia.</p>";
            return;
        }

        const tabela = document.createElement("table");
        tabela.border = "1";

        const cabecalho = tabela.createTHead();
        const linhaCabecalho = cabecalho.insertRow();

        const colunas = Object.keys(dados[0]);
        colunas.forEach(coluna => {
            const th = document.createElement("th");
            th.textContent = coluna;
            linhaCabecalho.appendChild(th);
        });

        const corpo = tabela.createTBody();
        dados.forEach(linha => {
            const tr = corpo.insertRow();
            colunas.forEach(coluna => {
                const td = tr.insertCell();
                td.textContent = linha[coluna] !== null ? linha[coluna] : "-";
            });
        });

        tabelaContainer.appendChild(tabela);
        console.log(`Tabela '${guiaAtual}' carregada com sucesso!`);
    }

    filtro.addEventListener("input", () => {
        const termo = filtro.value.toLowerCase();
        const linhas = tabelaContainer.querySelectorAll("tbody tr");
        
        linhas.forEach(linha => {
            const textoLinha = linha.textContent.toLowerCase();
            linha.style.display = textoLinha.includes(termo) ? "" : "none";
        });
    });

    modoEscuroBotao.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    carregarMenu();
    carregarDados(guiaAtual);
});
