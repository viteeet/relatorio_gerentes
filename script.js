document.addEventListener("DOMContentLoaded", () => {
    const tabelaContainer = document.getElementById("tabela-container");
    const menu = document.getElementById("menu");
    const modoEscuroBotao = document.getElementById("modo-escuro");
    const filtro = document.getElementById("filtro");
    const exportarBotao = document.getElementById("exportar-excel");
    
    let guiaAtual = "BORDEROS OPERADOS";
    let dados = {};
    const colunasVisiveis = {
        "BORDEROS OPERADOS": [ "gerente", "cedente", "data_oper", "bordero",  "empresa", "Valor Total", "Valor Liq. do", "Resultado Liquido", "tdesc", "pmpx", "Data Cadastro", "ntitulos", "Semana mês"],
        "CARTEIRAS EM ABERTO": [ "gerente","cedente","Vencimento", "Titulo", "sacado",  "Empresa", "situacao_titulo", "valor_face", "nr_bordero", "tipo_cobranca", "valor_titulo"],
        "TITULOS QUITADOS": ["Gerente", "cedente", "Titulos", "venc0", "vencutil0", "quitacao", "valor", "mora", "total"],
        "RISCO CEDENTE": ["gerente", "Cedente", "Limite", "Risco", "Tranche", "saldocc", "Vencidos", "Valor corrigido", "Saldo p/ Operar", "A vencer"],
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
        menu.innerHTML = "";
        Object.keys(guias).forEach(guia => {
            const item = document.createElement("li");
            item.classList.add("nav-item");
            item.innerHTML = `<a class='nav-link' href='#'>${guia}</a>`;
            item.addEventListener("click", function() {
                document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));
                this.querySelector("a").classList.add("active");
                carregarDados(guia);
            });
            menu.appendChild(item);
        });
    }

    function carregarDados(guia) {
        guiaAtual = guia;
        fetch(guias[guia])
            .then(response => response.json())
            .then(json => {
                dados = json[guia];
                carregarTabela();
            })
            .catch(error => console.error("Erro ao carregar JSON:", error));
    }

    function carregarTabela() {
        tabelaContainer.innerHTML = "";
        if (!dados || dados.length === 0) {
            tabelaContainer.innerHTML = "<p>Nenhum dado disponível.</p>";
            return;
        }
        
        const colunas = colunasVisiveis[guiaAtual] || Object.keys(dados[0]);
        let tabela = `<table class='table table-striped table-bordered sticky-header'><thead><tr>`;
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
