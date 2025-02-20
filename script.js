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

    async function carregarJSON() {
        try {
            console.log(`🔄 Carregando JSON de: ${jsonURL}`);
            const response = await fetch(jsonURL);
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

            let jsonData = await response.json();
            console.log("✅ JSON carregado com sucesso:", jsonData);

            // Criar botões de navegação para cada conjunto de dados
            Object.keys(jsonData).forEach((titulo, index) => {
                const btn = document.createElement("button");
                btn.textContent = titulo;
                btn.classList.add("tab-button");
                btn.onclick = () => exibirTabela(titulo, jsonData[titulo]);
                menuContainer.appendChild(btn);

                // Exibe a primeira guia por padrão
                if (index === 0) exibirTabela(titulo, jsonData[titulo]);
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

        const colunas = Object.keys(dados[0]);
        let tabelaHTML = `
            <table class="table fade-in">
                <thead>
                    <tr>${colunas.map(coluna => `<th>${coluna}</th>`).join("")}</tr>
                </thead>
                <tbody>
                    ${dados.map(linha =>
                        `<tr>${colunas.map(coluna => `<td>${formatarValor(coluna, linha[coluna])}</td>`).join("")}</tr>`
                    ).join("")}
                </tbody>
            </table>
        `;

        tabelaContainer.innerHTML += tabelaHTML;
    }

    // Aplicar modo escuro
    function aplicarModoEscuro() {
        if (localStorage.getItem("modoEscuro") === "true") {
            document.body.classList.add("dark-mode");
        }
    }

    aplicarModoEscuro();
    carregarJSON();
});
