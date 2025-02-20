document.addEventListener("DOMContentLoaded", () => {
    const tabelaContainer = document.getElementById("tabela-container");
    const menu = document.getElementById("menu");
    const modoEscuroBotao = document.getElementById("modo-escuro");
    const filtro = document.getElementById("filtro");
    const exportarBotao = document.getElementById("exportar-excel");
    const paginaContainer = document.getElementById("pagina-container");

    let guiaAtual = "BORDEROS OPERADOS";
    let dados = [];
    
    const colunasVisiveis = {
        "BORDEROS OPERADOS": ["data_oper", "bordero", "cedente", "empresa", "Valor Total", "Valor Liq. do", "Resultado Liquido", "tdesc", "pmpx", "Data Cadastro", "ntitulos", "gerente", "Semana mês", "DEPARA - GERENTE"],
        "CARTEIRAS EM ABERTO": ["Vencimento", "Titulo", "sacado", "cedente", "Empresa", "situacao_titulo", "valor_face", "nr_bordero", "tipo_cobranca", "valor_titulo", "gerente"],
        "TITULOS QUITADOS": ["Gerente", "cedente", "Titulos", "venc0", "vencutil0", "quitacao", "valor", "mora", "total"],
        "RISCO CEDENTE": ["gerente", "Cedente", "Limite", "Risco", "Tranche", "saldocc", "DEPARA - GERENTE", "Vencidos", "Valor corrigido", "Saldo p/ Operar", "A vencer"],
        "TITULOS VENCIDOS": ["GERENTE", "Cedente", "vencutil", "Vencimento", "Titulos", "SACADO_EMITENTE", "total", "VALOR_FACE", "VALOR_ATUAL", "VALOR_CORRIGIDO", "BANCO_COB", "DIAS_QTD"]
    };

    const colunasData = ["data_oper", "Data Cadastro", "Vencimento", "venc0", "vencutil0", "quitacao", "vencutil"];
    const colunasMoeda = ["Valor Total", "Valor Liq. do", "Resultado Liquido", "valor_face", "valor_titulo", "valor", "mora", "total", "Limite", "Risco", "Tranche", "Saldo p/ Operar", "Valor corrigido", "VALOR_FACE", "VALOR_ATUAL", "VALOR_CORRIGIDO"];

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
        let tabela = `<table class='table table-striped table-bordered custom-table'><thead><tr>`;
        colunas.forEach(coluna => tabela += `<th>${coluna}</th>`);
        tabela += "</tr></thead><tbody>";
        dados.forEach(linha => {
            tabela += "<tr>";
            colunas.forEach(coluna => {
                let valor = linha[coluna] || "-";
                tabela += `<td>${valor}</td>`;
            });
            tabela += "</tr>";
        });
        tabela += "</tbody></table>";
        tabelaContainer.innerHTML = tabela;
        ativarFiltro();
    }

    function ativarFiltro() {
        filtro.addEventListener("input", () => {
            const termo = filtro.value.toLowerCase();
            const linhas = tabelaContainer.querySelectorAll("tbody tr");
            
            linhas.forEach(linha => {
                const textoLinha = linha.textContent.toLowerCase();
                linha.style.display = textoLinha.includes(termo) ? "" : "none";
            });
        });
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
