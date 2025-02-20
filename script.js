document.addEventListener("DOMContentLoaded", () => {
    const tabelaContainer = document.getElementById("tabela-container");
    const menu = document.getElementById("menu");
    const modoEscuroBotao = document.getElementById("modo-escuro");
    const filtro = document.getElementById("filtro");
    const exportarBotao = document.getElementById("exportar-excel");

    let guiaAtual = "BORDEROS OPERADOS";
    let dados = [];
    
    const colunasVisiveis = {
        "BORDEROS OPERADOS": ["data_oper", "bordero", "cedente", "empresa", "Valor Total", "Valor Liq. do", "Resultado Liquido", "tdesc", "pmpx", "Data Cadastro", "ntitulos", "gerente", "Semana mês", "DEPARA - GERENTE"],
        "CARTEIRAS EM ABERTO": ["Vencimento", "Titulo", "sacado", "cedente", "Empresa", "situacao_titulo", "valor_face", "nr_bordero", "tipo_cobranca", "valor_titulo", "gerente"],
        "TITULOS QUITADOS": ["Gerente", "cedente", "Titulos", "venc0", "vencutil0", "quitacao", "valor", "mora", "total"],
        "RISCO CEDENTE": ["gerente", "Cedente", "Limite", "Risco", "Tranche", "saldocc", "DEPARA - GERENTE", "Vencidos", "Valor corrigido", "Saldo p/ Operar", "A vencer"],
        "TITULOS VENCIDOS": ["GERENTE", "Cedente", "vencutil", "Vencimento", "Titulos", "SACADO_EMITENTE", "total", "VALOR_FACE", "VALOR_ATUAL", "VALOR_CORRIGIDO", "BANCO_COB", "DIAS_QTD"]
    };

    const guias = {
        "BORDEROS OPERADOS": "borderos_operados.json",
        "CARTEIRAS EM ABERTO": "carteiras_em_aberto.json",
        "TITULOS QUITADOS": "titulos_quitados.json",
        "RISCO CEDENTE": "risco_cedente.json",
        "TITULOS VENCIDOS": "titulos_vencidos.json"
    };

    function carregarMenu() {
        menu.innerHTML = "<select id='menu-suspenso' class='menu-dropdown'></select>";
        const menuSuspenso = document.getElementById("menu-suspenso");
        Object.keys(guias).forEach(guia => {
            const option = document.createElement("option");
            option.value = guia;
            option.textContent = guia;
            menuSuspenso.appendChild(option);
        });
        menuSuspenso.addEventListener("change", () => carregarDados(menuSuspenso.value));
    }

    function carregarDados(guia) {
        guiaAtual = guia;
        fetch(guias[guia])
            .then(response => response.json())
            .then(json => {
                dados = json[guia] || [];
                carregarTabela();
            })
            .catch(error => console.error("Erro ao carregar JSON:", error));
    }

    function carregarTabela() {
        tabelaContainer.innerHTML = "";
        if (!Array.isArray(dados) || dados.length === 0) {
            tabelaContainer.innerHTML = "<p>Nenhum dado disponível.</p>";
            return;
        }
        
        const colunas = colunasVisiveis[guiaAtual] || Object.keys(dados[0]);
        let tabela = `<table class='table'><thead><tr>`;
        colunas.forEach(coluna => tabela += `<th>${coluna}</th>`);
        tabela += "</tr></thead><tbody>";
        dados.forEach(linha => {
            tabela += "<tr>";
            colunas.forEach(coluna => tabela += `<td>${linha[coluna] || "-"}</td>`);
            tabela += "</tr>";
        });
        tabela += "</tbody></table>";
        tabelaContainer.innerHTML = tabela;
    }

    filtro.addEventListener("input", () => {
        const termo = filtro.value.toLowerCase();
        document.querySelectorAll("tbody tr").forEach(linha => {
            linha.style.display = linha.textContent.toLowerCase().includes(termo) ? "" : "none";
        });
    });

    modoEscuroBotao.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });
    
    exportarBotao.addEventListener("click", () => {
        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.json_to_sheet(dados);
        XLSX.utils.book_append_sheet(wb, ws, "Dados");
        XLSX.writeFile(wb, `${guiaAtual}.xlsx`);
    });

    carregarMenu();
    carregarDados(guiaAtual);
});
