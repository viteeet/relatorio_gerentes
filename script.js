// script.js
document.addEventListener("DOMContentLoaded", () => {
    const tabelaContainer = document.getElementById("tabela-container");
    const menu = document.getElementById("menu");
    const filtro = document.getElementById("filtro");
    const modoEscuroBotao = document.getElementById("modo-escuro");

    let dados = {};
    let guiaAtual = "";

    // Carregar JSON com tratamento de erro
    fetch("dados.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao carregar JSON: ${response.status}`);
            }
            return response.json();
        })
        .then(json => {
            console.log("JSON carregado com sucesso", json);
            dados = json;
            carregarMenu();
            carregarTabela(Object.keys(dados)[0]);
        })
        .catch(error => {
            console.error("Erro ao carregar JSON:", error);
        });

    function carregarMenu() {
        menu.innerHTML = "";
        Object.keys(dados).forEach(guia => {
            const item = document.createElement("li");
            item.textContent = guia;
            item.addEventListener("click", () => carregarTabela(guia));
            menu.appendChild(item);
        });
    }

    function carregarTabela(guia) {
        guiaAtual = guia;
        tabelaContainer.innerHTML = "";

        if (!dados[guia] || dados[guia].length === 0) {
            tabelaContainer.innerHTML = "<p>Nenhum dado disponível para esta guia.</p>";
            return;
        }

        const tabela = document.createElement("table");
        tabela.border = "1";

        const cabecalho = tabela.createTHead();
        const linhaCabecalho = cabecalho.insertRow();

        const colunas = Object.keys(dados[guia][0]);
        colunas.forEach(coluna => {
            const th = document.createElement("th");
            th.textContent = coluna;
            linhaCabecalho.appendChild(th);
        });

        const corpo = tabela.createTBody();
        dados[guia].forEach(linha => {
            const tr = corpo.insertRow();
            colunas.forEach(coluna => {
                const td = tr.insertCell();
                td.textContent = linha[coluna] !== null ? linha[coluna] : "-";
            });
        });

        tabelaContainer.appendChild(tabela);
        console.log(`Tabela '${guia}' carregada com sucesso!`);
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
});
