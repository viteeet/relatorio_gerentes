document.addEventListener("DOMContentLoaded", () => {
    const tabelaContainer = document.getElementById("tabela-container");

    const jsonMap = {
        "BORDEROS OPERADOS": "https://viteeet.github.io/relatorio_gerentes/borderos_operados.json",
        "CARTEIRAS EM ABERTO": "https://viteeet.github.io/relatorio_gerentes/carteiras_em_aberto.json",
        "TITULOS QUITADOS": "https://viteeet.github.io/relatorio_gerentes/titulos_quitados.json",
        "RISCO CEDENTE": "https://viteeet.github.io/relatorio_gerentes/risco_cedente.json",
        "TITULOS VENCIDOS": "https://viteeet.github.io/relatorio_gerentes/titulos_vencidos.json"
    };

    async function carregarTodosJSONs() {
        tabelaContainer.innerHTML = ""; // Limpa antes de carregar

        for (const [titulo, url] of Object.entries(jsonMap)) {
            try {
                console.log(`🔄 Carregando: ${url}`);
                const response = await fetch(url);
                
                if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

                let jsonData = await response.json();
                let dados = jsonData[titulo] || []; // Garante que estamos pegando o array correto

                console.log(`✅ JSON carregado (${titulo}):`, dados);

                // Criar e exibir a tabela
                exibirTabela(titulo, dados);
            } catch (error) {
                console.error(`❌ Erro ao carregar ${titulo}:`, error);
                tabelaContainer.innerHTML += `<p>Erro ao carregar os dados de <strong>${titulo}</strong>.</p>`;
            }
        }
    }

    function exibirTabela(titulo, dados) {
        if (!dados.length) {
            tabelaContainer.innerHTML += `<h2>${titulo}</h2><p>Nenhum dado disponível.</p>`;
            return;
        }

        const colunas = Object.keys(dados[0]);

        let tabelaHTML = `
            <h2>${titulo}</h2>
            <table class="table fade-in">
                <thead>
                    <tr>${colunas.map(coluna => `<th>${coluna}</th>`).join("")}</tr>
                </thead>
                <tbody>
                    ${dados.map(linha =>
                        `<tr>${colunas.map(coluna => `<td>${linha[coluna] || "-"}</td>`).join("")}</tr>`
                    ).join("")}
                </tbody>
            </table>
        `;

        tabelaContainer.innerHTML += tabelaHTML;
    }

    carregarTodosJSONs();
});
