document.addEventListener("DOMContentLoaded", () => {
    const tabelaContainer = document.getElementById("tabela-container");
    const menu = document.getElementById("menu");
    const modoEscuroBotao = document.getElementById("modo-escuro");
    const filtro = document.getElementById("filtro");
    const exportarBotao = document.getElementById("exportar-excel");
    const BASE_URL = window.location.origin + "/relatorio_gerentes/";

const jsonMap = {
    "BORDEROS OPERADOS": BASE_URL + "borderos_operados.json",
    "CARTEIRAS EM ABERTO": BASE_URL + "carteiras_aberto.json",
    "TITULOS QUITADOS": BASE_URL + "titulos_quitados.json",
    "RISCO CEDENTE": BASE_URL + "risco_cedente.json",
    "TITULOS VENCIDOS": BASE_URL + "titulos_vencidos.json"
};


    let guiaAtual = "BORDEROS OPERADOS";
    let dados = [];

    const colunasVisiveis = {
        "BORDEROS OPERADOS": ["data_oper", "bordero", "cedente", "empresa", "Valor Total", "Valor Liq. do", "Resultado Liquido", "gerente"],
        "CARTEIRAS EM ABERTO": ["Vencimento", "Titulo", "sacado", "cedente", "Empresa", "valor_face", "nr_bordero", "tipo_cobranca", "gerente"],
        "TITULOS QUITADOS": ["Gerente", "cedente", "Titulos", "quitacao", "valor", "mora", "total"],
        "RISCO CEDENTE": ["gerente", "Cedente", "Limite", "Risco", "Tranche", "Saldo p/ Operar", "Valor corrigido"],
        "TITULOS VENCIDOS": ["GERENTE", "Cedente", "Vencimento", "Titulos", "total", "VALOR_FACE", "VALOR_ATUAL"]
    };

    // Mapear JSON por categoria
    const jsonMap = {
        "BORDEROS OPERADOS": "borderos_operados.json",
        "CARTEIRAS EM ABERTO": "carteiras_aberto.json",
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
            if (!response.ok) throw new Error("Erro ao carregar JSON");

            dados = await response.json();
            carregarTabela();
        } catch (error) {
            console.error("Erro ao carregar JSON:", error);
            tabelaContainer.innerHTML = "<p>Erro ao carregar dados.</p>";
        }
    }

    function carregarTabela() {
        tabelaContainer.innerHTML = "";
        if (!dados.length) {
            tabelaContainer.innerHTML = "<p>Nenhum dado disponível.</p>";
            return;
        }

        const colunas = colunasVisiveis[guiaAtual] || Object.keys(dados[0]);
        let tabela = `<table class="table"><thead><tr>` + 
            colunas.map(coluna => `<th>${coluna}</th>`).join("") + 
            `</tr></thead><tbody>` +
            dados.map((linha, index) => 
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
