document.addEventListener("DOMContentLoaded", () => {
    const tabelaContainer = document.getElementById("tabela-container");
    const menuContainer = document.createElement("div");
    menuContainer.id = "menu-tabs";
    menuContainer.classList.add("tabs-container");

    // Remover os botões antigos
    const oldMenu = document.getElementById("menu");
    if (oldMenu) {
        oldMenu.remove();
    }

    tabelaContainer.before(menuContainer); // Adiciona os botões antes das tabelas

    const jsonURL = "https://viteeet.github.io/relatorio_gerentes/dados.json";

    const colunasVisiveis = {
        "BASE CEDENTES": ["apelido", "cnpj", "nome"],
        "BORDEROS OPERADOS": ["data_oper", "bordero", "cedente", "empresa", "Valor Total", "Valor Liq. do", "Resultado Liquido", "Data Cadastro", "ntitulos", "gerente"],
        "CARTEIRAS EM ABERTO": ["Vencimento", "Titulo", "sacado", "cedente", "Empresa", "situacao_titulo", "valor_titulo", "gerente"],
        "TITULOS QUITADOS": ["Gerente", "cedente", "Titulos", "venc0", "quitacao", "valor", "mora", "total"],
        "RISCO CEDENTE": ["gerente", "Cedente", "Limite", "Risco", "Tranche", "saldocc", "cnpj_cedente", "Vencidos", "Valor corrigido", "A vencer"],
        "TITULOS VENCIDOS": ["GERENTE", "Cedente", "vencutil", "Vencimento", "Titulos", "SACADO_EMITENTE", "total", "VALOR_FACE", "VALOR_ATUAL", "VALOR_CORRIGIDO"]
    };

    async function carregarJSON() {
        try {
            console.log(`🔄 Carregando JSON de: ${jsonURL}`);
            const response = await fetch(jsonURL);
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

            let jsonData = await response.json();
            console.log("✅ JSON carregado com sucesso:", jsonData);

            Object.keys(jsonData).forEach((titulo, index) => {
                const btn = document.createElement("button");
                btn.textContent = titulo;
                btn.classList.add("tab-button");
                btn.onclick = () => exibirTabela(titulo, jsonData[titulo]);
                menuContainer.appendChild(btn);

                if (index === 0) exibirTabela(titulo, jsonData[titulo]); // Exibe a primeira tabela automaticamente
            });

        } catch (error) {
            console.error("❌ Erro ao carregar JSON:", error);
            tabelaContainer.innerHTML = `<p>Erro ao carregar os dados.</p>`;
        }
    }

    function formatarValor(coluna, valor) {
        if (!valor) return "-";

        if (coluna.toLowerCase().includes("data")) {
            return new Date(valor).toLocaleDateString("pt-BR");
        }
        if (coluna.toLowerCase().includes("valor") || coluna.toLowerCase().includes("total")) {
            return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
        }
        return valor;
    }

    function exibirTabela(titulo, dados) {
        tabelaContainer.innerHTML = `<h2>${titulo}</h2>`;

        if (!Array.isArray(dados) || dados.length === 0) {
            tabelaContainer.innerHTML += `<p>Nenhum dado disponível.</p>`;
            return;
        }

        const colunas = colunasVisiveis[titulo] || Object.keys(dados[0]);

        // Adiciona o campo de busca
        tabelaContainer.innerHTML += `
            <input type="text" id="filtro" placeholder="Buscar..." class="search-box">
        `;

        let tabelaHTML = `
            <div class="table-container">
                <table class="table fade-in" id="dadosTabela">
                    <thead>
                        <tr>${colunas.map(coluna => `<th>${coluna}</th>`).join("")}</tr>
                    </thead>
                    <tbody>
                        ${dados.map(linha =>
                            `<tr>${colunas.map(coluna => `<td>${formatarValor(coluna, linha[coluna])}</td>`).join("")}</tr>`
                        ).join("")}
                    </tbody>
                </table>
            </div>
        `;

        tabelaContainer.innerHTML += tabelaHTML;

        // Adiciona o evento de busca após a tabela ser gerada
        const filtroInput = document.getElementById("filtro");
        if (filtroInput) {
            filtroInput.addEventListener("keyup", filtrarTabela);
        }
    }

    function filtrarTabela() {
        const input = document.getElementById("filtro");
        if (!input) return;

        const filtro = input.value.toLowerCase();
        const tabela = document.getElementById("dadosTabela");

        if (!tabela) return;

        const linhas = tabela.getElementsByTagName("tr");

        for (let i = 1; i < linhas.length; i++) { // Ignora o cabeçalho (i = 1)
            let celulas = linhas[i].getElementsByTagName("td");
            let encontrou = false;

            for (let j = 0; j < celulas.length; j++) {
                if (celulas[j].innerText.toLowerCase().includes(filtro)) {
                    encontrou = true;
                    break;
                }
            }

            linhas[i].style.display = encontrou ? "" : "none";
        }
    }

    function aplicarModoEscuro() {
        if (localStorage.getItem("modoEscuro") === "true") {
            document.body.classList.add("dark-mode");
        }
    }

    function alternarModoEscuro() {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("modoEscuro", document.body.classList.contains("dark-mode"));
    }

    const botaoModoEscuro = document.getElementById("modo-escuro");
    if (botaoModoEscuro) {
        botaoModoEscuro.addEventListener("click", alternarModoEscuro);
    }

    aplicarModoEscuro();
    carregarJSON();

    // Adicionar CSS para ajuste de tabela responsiva e quebra de página
    const style = document.createElement("style");
    style.innerHTML = `
        .table-container {
            overflow-x: auto;
            max-width: 100%;
        }
        .table {
            font-size: 12px;
            white-space: nowrap;
            width: 100%;
            border-collapse: collapse;
        }
        .table th, .table td {
            padding: 8px;
            text-align: left;
            border: 1px solid #ddd;
        }
        .table th {
            background-color: #007bff;
            color: white;
        }
        @media print {
            .table-container {
                page-break-before: always;
            }
        }
    `;
    document.head.appendChild(style);
});
