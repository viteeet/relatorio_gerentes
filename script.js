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

    const colunasData = ["data_oper", "Data Cadastro", "Vencimento", "venc0", "vencutil0", "quitacao", "vencutil"];
    const colunasMoeda = ["Valor Total", "Valor Liq. do", "Resultado Liquido", "valor_face", "valor_titulo", "valor", "mora", "total", "Limite", "Risco", "Tranche", "Saldo p/ Operar", "Valor corrigido", "VALOR_FACE", "VALOR_ATUAL", "VALOR_CORRIGIDO"];

    // Formatação dinâmica de valores
    function formatarValor(coluna, valor) {
        if (colunasData.includes(coluna) && valor) {
            return new Date(valor).toLocaleDateString("pt-BR");
        }
        if (colunasMoeda.includes(coluna) && valor) {
            return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
        }
        return valor || "-";
    }

    // Renderizar tabela
    function carregarTabela() {
        tabelaContainer.innerHTML = "";
        if (!dados.length) {
            tabelaContainer.innerHTML = "<p>Nenhum dado disponível.</p>";
            return;
        }

        const colunas = colunasVisiveis[guiaAtual] || Object.keys(dados[0]);
        let tabela = `<table class='table table-striped'><thead><tr>` + 
            colunas.map(coluna => `<th>${coluna}</th>`).join("") + 
            `</tr></thead><tbody>` +
            dados.map((linha, index) => 
                `<tr class='${index % 2 === 0 ? "linha-clara" : "linha-escura"}'>` +
                colunas.map(coluna => `<td>${formatarValor(coluna, linha[coluna])}</td>`).join("") +
                `</tr>`).join("") + 
            `</tbody></table>`;

        tabelaContainer.innerHTML = tabela;
    }

    // Filtrar dados dinamicamente
    filtro.addEventListener("input", () => {
        const termo = filtro.value.toLowerCase();
        const dadosFiltrados = dados.filter(linha => 
            Object.values(linha).some(valor => 
                String(valor).toLowerCase().includes(termo)
            )
        );
        dados = dadosFiltrados;
        carregarTabela();
    });

    // Trocar guia/menu
    menu.addEventListener("click", (e) => {
        if (e.target.classList.contains("nav-link")) {
            guiaAtual = e.target.textContent.trim().toUpperCase();
            carregarTabela();
        }
    });

    // Ativar/desativar modo escuro
    modoEscuroBotao.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("modoEscuro", document.body.classList.contains("dark-mode"));
    });

    // Carregar modo escuro salvo
    if (localStorage.getItem("modoEscuro") === "true") {
        document.body.classList.add("dark-mode");
    }

    // Exportar dados para Excel
    exportarBotao.addEventListener("click", () => {
        if (!dados.length) {
            alert("Não há dados para exportar!");
            return;
        }

        const colunas = colunasVisiveis[guiaAtual] || Object.keys(dados[0]);
        const worksheet = XLSX.utils.json_to_sheet(dados.map(linha => {
            let novaLinha = {};
            colunas.forEach(coluna => novaLinha[coluna] = formatarValor(coluna, linha[coluna]));
            return novaLinha;
        }));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");
        XLSX.writeFile(workbook, `${guiaAtual.replace(/\s+/g, "_")}.xlsx`);
    });

    // Simular carregamento de dados (Remova e substitua por um AJAX real se necessário)
    function carregarDadosSimulados() {
        dados = [
            { "data_oper": "2025-01-10", "bordero": 123, "cedente": "Empresa A", "empresa": "XYZ", "Valor Total": 5000, "Valor Liq. do": 4500, "Resultado Liquido": 300, "gerente": "Ana" },
            { "data_oper": "2025-01-15", "bordero": 456, "cedente": "Empresa B", "empresa": "ABC", "Valor Total": 8000, "Valor Liq. do": 7500, "Resultado Liquido": 500, "gerente": "Carlos" }
        ];
        carregarTabela();
    }

    carregarDadosSimulados(); // Simula carregamento inicial
});
