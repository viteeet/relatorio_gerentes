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
        console.error(`🚨 JSON não encontrado para ${guiaAtual}`);
        tabelaContainer.innerHTML = "<p>Arquivo JSON não encontrado.</p>";
        return;
    }

    try {
        console.log(`🔄 Tentando carregar: ${arquivo}`);
        const response = await fetch(arquivo);

        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        let jsonData = await response.json();
        
        // Se os dados vierem dentro de um objeto, pegamos o array correto
        dados = jsonData[guiaAtual] || [];
        
        console.log("✅ JSON carregado e extraído:", dados);

        carregarTabela();
    } catch (error) {
        console.error("❌ Erro ao carregar JSON:", error);
        tabelaContainer.innerHTML = `<p>Erro ao carregar os dados: ${error.message}</p>`;
    }
}


    function carregarTabela() {
        tabelaContainer.innerHTML = "";
        if (!dados.length) {
            tabelaContainer.innerHTML = "<p>Nenhum dado disponível.</p>";
            return;
        }
    
        // Pegamos dinamicamente as colunas do primeiro item
        const colunas = Object.keys(dados[0]);
    
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
