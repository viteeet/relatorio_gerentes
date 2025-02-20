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

    function formatarValor(coluna, valor) {
        if (colunasData.includes(coluna)) {
            return new Date(valor).toLocaleDateString("pt-BR");
        }
        if (colunasMoeda.includes(coluna)) {
            return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
        }
        return valor || "-";
    }

    function carregarTabela() {
        tabelaContainer.innerHTML = "";
        if (!Array.isArray(dados) || dados.length === 0) {
            tabelaContainer.innerHTML = "<p>Nenhum dado disponível.</p>";
            return;
        }
        
        const colunas = colunasVisiveis[guiaAtual] || Object.keys(dados[0]);
        let tabela = `<table class='table full-width'><thead><tr>`;
        colunas.forEach(coluna => tabela += `<th>${coluna}</th>`);
        tabela += "</tr></thead><tbody>";
        dados.forEach((linha, index) => {
            const classeLinha = index % 2 === 0 ? "linha-clara" : "linha-escura";
            tabela += `<tr class='${classeLinha}'>`;
            colunas.forEach(coluna => tabela += `<td>${formatarValor(coluna, linha[coluna])}</td>`);
            tabela += "</tr>";
        });
        tabela += "</tbody></table>";
        tabelaContainer.innerHTML = tabela;
    }

    carregarTabela();
});
