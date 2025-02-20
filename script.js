document.addEventListener("DOMContentLoaded", () => {
    const tabelaContainer = document.getElementById("tabela-container");

    const jsonURL = "https://viteeet.github.io/relatorio_gerentes/dados.json"; // Único arquivo JSON

    async function carregarJSON() {
    try {
        console.log(`🔄 Carregando JSON de: ${jsonURL}`);
        const response = await fetch(jsonURL);

        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        let jsonData = await response.text(); // Pegamos como texto primeiro

        try {
            jsonData = JSON.parse(jsonData); // Tentamos converter para JSON
        } catch (jsonError) {
            throw new Error("JSON inválido ou mal formatado!");
        }

        console.log("✅ JSON carregado com sucesso:", jsonData);

        Object.entries(jsonData).forEach(([titulo, dados]) => {
            if (Array.isArray(dados)) {
                // Filtramos `NaN` antes de exibir a tabela
                dados = dados.map(linha => {
                    return Object.fromEntries(
                        Object.entries(linha).map(([key, value]) => [key, isNaN(value) ? null : value])
                    );
                });
                exibirTabela(titulo, dados);
            }
        });

    } catch (error) {
        console.error("❌ Erro ao carregar JSON:", error);
        tabelaContainer.innerHTML = `<p>Erro ao carregar os dados: ${error.message}</p>`;
    }
}


    function exibirTabela(titulo, dados) {
        if (!Array.isArray(dados) || dados.length === 0) {
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

    carregarJSON();
});
