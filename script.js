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

    tabelaContainer.before(menuContainer);

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

                if (index === 0) exibirTabela(titulo, jsonData[titulo]);
            });

        } catch (error) {
            console.error("❌ Erro ao carregar JSON:", error);
            tabelaContainer.innerHTML = `<p>Erro ao carregar os dados.</p>`;
        }
    }

    function exibirTabela(titulo, dados) {
        tabelaContainer.innerHTML = `<h2>${titulo}</h2>`;

        if (!Array.isArray(dados) || dados.length === 0) {
            tabelaContainer.innerHTML += `<p>Nenhum dado disponível.</p>`;
            return;
        }

        const colunas = colunasVisiveis[titulo] || Object.keys(dados[0]);

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

    // 🔥 Função de busca otimizada para evitar travamento!
    function filtrarTabela() {
        if (!window.requestAnimationFrame) return; // Se requestAnimationFrame não existir, ignora

        requestAnimationFrame(() => {
            const input = document.getElementById("filtro");
            if (!input) return;

            const filtro = input.value.toLowerCase().trim();
            const tabela = document.getElementById("dadosTabela");

            if (!tabela) return;

            const linhas = tabela.getElementsByTagName("tr");

            if (filtro === "") {
                // 🔹 Se o campo de busca estiver vazio, mostra todas as linhas
                for (let i = 1; i < linhas.length; i++) {
                    linhas[i].style.display = "";
                }
                return;
            }

            for (let i = 1; i < linhas.length; i++) { 
                let celulas = linhas[i].getElementsByTagName("td");
                let encontrou = false;

                for (let j = 0; j < celulas.length; j++) {
                    if (celulas[j].innerText.toLowerCase().includes(filtro)) {
                        encontrou = true;
                        break;
                    }
                }

                if (encontrou) {
                    linhas[i].style.display = "";
                } else {
                    linhas[i].style.display = "none";
                }
            }
        });
    }

    const filtroInput = document.getElementById("filtro");
    if (filtroInput) {
        filtroInput.addEventListener("input", filtrarTabela); // 🔥 Troquei de 'keyup' para 'input' para menos delay
    } else {
        console.error("🚨 Campo de busca não encontrado!");
    }

    carregarJSON();
});
