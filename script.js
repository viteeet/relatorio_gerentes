// script.js
document.addEventListener("DOMContentLoaded", () => {
    const tabelaContainer = document.getElementById("tabela-container");
    const menu = document.getElementById("menu");
    const filtro = document.getElementById("filtro");
    const modoEscuroBotao = document.getElementById("modo-escuro");

    let dados = {};
    let guiaAtual = "";

    // Carregar JSON
    fetch("dados.json")
        .then(response => response.json())
        .then(json => {
            dados = json;
            carregarMenu();
            carregarTabela(Object.keys(dados)[0]);
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

        const tabela = document.createElement("table");
        tabela.border = "1";

        const cabecalho = tabela.createTHead();
        const linhaCabecalho = cabecalho.insertRow();

        Object.keys(dados[guia][0]).forEach(coluna => {
            const th = document.createElement("th");
            th.textContent = coluna;
            linhaCabecalho.appendChild(th);
        });

        const corpo = tabela.createTBody();
        dados[guia].forEach(linha => {
            const tr = corpo.insertRow();
            Object.values(linha).forEach(valor => {
                const td = tr.insertCell();
                td.textContent = valor;
            });
        });

        tabelaContainer.appendChild(tabela);
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
