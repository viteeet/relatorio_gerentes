document.addEventListener("DOMContentLoaded", () => {
    const tabelaContainer = document.getElementById("tabela-container");
    const menu = document.getElementById("menu");
    const modoEscuroBotao = document.getElementById("modo-escuro");
    const filtro = document.getElementById("filtro");
    const exportarBotao = document.getElementById("exportar-excel");

    let guiaAtual = "BORDEROS OPERADOS";
    let dados = [];

    const jsonMap = {
        "BORDEROS OPERADOS": "borderos_operados.json",
        "CARTEIRAS EM ABERTO": "carteiras_em_aberto.json",
        "TITULOS QUITADOS": "titulos_quitados.json",
        "RISCO CEDENTE": "risco_cedente.json",
        "TITULOS VENCIDOS": "titulos_vencidos.json"
    };

    async function carregarJSON() {
        const arquivo = jsonMap[guiaAtual];

        if (!arquivo) {
            tabelaContainer.innerHTML = "<p>Arquivo JSON não encontrado.</p>";
            return;
        }

        try {
            const response = await fetch(arquivo);
            if (!response.ok) throw new Error(`Erro ao carregar JSON: ${response.status}`);

            dados = await response.json();
            carregarTabela();
        } catch (error) {
            console.error("Erro ao carregar JSON:", error);
            tabelaContainer.innerHTML = "<p>Erro ao carregar os dados.</p>";
        }
    }

    function carregarTabela() {
        tabelaContainer.innerHTML = "";
        if (!dados.length) {
            tabelaContainer.innerHTML = "<p>Nenhum dado disponível.</p>";
            return;
        }

        const colunas = Object.keys(dados[0]);
        let tabela = `<table class="table"><thead><tr>` +
            colunas.map(coluna => `<th>${coluna}</th>`).join("") +
            `</tr></thead><tbody>` +
            dados.map(linha =>
                `<tr class="fade-in">` +
                colunas.map(coluna => `<td>${linha[coluna] || "-"}</td>`).join("") +
                `</tr>`).join("") +
            `</tbody></table>`;

        tabelaContainer.innerHTML = tabela;
    }

    menu.addEventListener("click", (e) => {
        if (e.target.classList.contains("nav-link")) {
            guiaAtual = e.target.textContent.trim().toUpperCase();
            carregarJSON();
        }
    });

    modoEscuroBotao.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("modoEscuro", document.body.classList.contains("dark-mode"));
    });

    if (localStorage.getItem("modoEscuro") === "true") {
        document.body.classList.add("dark-mode");
    }

    filtro.addEventListener("input", () => {
        const termo = filtro.value.toLowerCase();
        const dadosFiltrados = dados.filter(linha =>
            Object.values(linha).some(valor => String(valor).toLowerCase().includes(termo))
        );
        dados = dadosFiltrados;
        carregarTabela();
    });

    carregarJSON();
});
