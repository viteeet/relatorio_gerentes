document.addEventListener("DOMContentLoaded", () => {
    const tabelaContainer = document.getElementById("tabela-container");
    const menuContainer = document.createElement("div");
    menuContainer.id = "menu-tabs";
    menuContainer.classList.add("tabs-container");

    // Remover os botões antigos
    const oldMenu = document.getElementById("menu");
    if (oldMenu) {
        oldMenu.remove();
    }

    tabelaContainer.before(menuContainer);

    const jsonURL = "https://viteeet.github.io/relatorio_gerentes/dados.json";

    let dadosTabelaAtual = []; // 🔹 Mantém os dados da tabela carregada

    const colunasVisiveis = {
        "BASE CEDENTES": ["apelido", "cnpj", "nome"],
        "BORDEROS OPERADOS": ["data_oper", "bordero", "cedente", "empresa", "Valor Total", "Valor Liq. do", "Resultado Liquido", "Data Cadastro", "ntitulos", "gerente"],
        "CARTEIRAS EM ABERTO": ["Vencimento", "Titulo", "sacado", "cedente", "Empresa", "situacao_titulo", "valor_titulo", "gerente"],
        "TITULOS QUITADOS": ["Gerente", "cedente", "Titulos", "venc0", "quitacao", "valor", "mora", "total"],
        "RISCO CEDENTE": ["gerente", "Cedente", "Limite", "Risco", "Tranche", "saldocc", "cnpj_cedente", "Vencidos", "Valor corrigido", "A vencer"],
        "TITULOS VENCIDOS": ["GERENTE", "Cedente", "vencutil", "Vencimento", "Titulos", "SACADO_EMITENTE", "total", "VALOR_FACE", "VALOR_ATUAL", "VALOR_CORRIGIDO"]
    };

    async function carregarJSON() {
        try {
            console.log(`🔄 Carregando JSON de: ${jsonURL}`);
            const response = await fetch(jsonURL);
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

            let jsonData = await response.json();
            console.log("✅ JSON carregado com sucesso:", jsonData);

            Object.keys(jsonData).forEach((titulo, index) => {
                const btn = document.createElement("button");
                btn.textContent = titulo;
                btn.classList.add("tab-button");
                btn.onclick = () => exibirTabela(titulo, jsonData[titulo]);
                menuContainer.appendChild(btn);

                if (index === 0) exibirTabela(titulo, jsonData[titulo]);
            });

        } catch (error) {
            console.error("❌ Erro ao carregar JSON:", error);
            tabelaContainer.innerHTML = `<p>Erro ao carregar os dados.</p>`;
        }
    }

    function exibirTabela(titulo, dados) {
        tabelaContainer.innerHTML = `<h2>${titulo}</h2>`;

        if (!Array.isArray(dados) || dados.length === 0) {
            tabelaContainer.innerHTML += `<p>Nenhum dado disponível.</p>`;
            return;
        }

        const colunas = colunasVisiveis[titulo] || Object.keys(dados[0]);

        let tabelaHTML = `
            <div class="table-container">
                <table class="table fade-in" id="dadosTabela">
                    <thead>
                        <tr>${colunas.map(coluna => `<th>${coluna}</th>`).join("")}</tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        `;

        tabelaContainer.innerHTML += tabelaHTML;

        // 🔹 Salva os dados carregados para otimizar busca
        dadosTabelaAtual = dados.map(linha => ({
            original: linha,
            texto: colunas.map(coluna => linha[coluna]?.toString().toLowerCase() || "").join(" ")
        }));

        renderizarTabela(dadosTabelaAtual); // 🔥 Renderiza a tabela inicial
    }

    function renderizarTabela(dados) {
        const tabela = document.getElementById("dadosTabela").querySelector("tbody");
        tabela.innerHTML = ""; // 🔹 Limpa antes de adicionar os novos dados

        const fragmento = document.createDocumentFragment();
        dados.forEach(item => {
            const linha = document.createElement("tr");
            linha.innerHTML = Object.values(item.original).map(valor => `<td>${formatarValor(valor)}</td>`).join("");
            fragmento.appendChild(linha);
        });

        tabela.appendChild(fragmento); // 🔥 Insere tudo de uma vez no DOM (muito mais rápido!)
    }

    function formatarValor(valor) {
        if (!valor) return "-";
        if (typeof valor === "number") {
            return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
        }
        return valor;
    }

    // 🔥 Busca otimizada (sem manipulação excessiva do DOM)
    function filtrarTabela() {
        const input = document.getElementById("filtro");
        if (!input || !dadosTabelaAtual.length) return;

        const filtro = input.value.toLowerCase().trim();
        if (filtro === "") {
            renderizarTabela(dadosTabelaAtual); // 🔹 Se vazio, mostra todos os dados
            return;
        }

        const filtrados = dadosTabelaAtual.filter(item => item.texto.includes(filtro));
        renderizarTabela(filtrados);
    }

    // 🔥 Vincula o evento de busca ao campo de filtro
    const filtroInput = document.getElementById("filtro");
    if (filtroInput) {
        filtroInput.addEventListener("input", filtrarTabela);
    } else {
        console.error("🚨 Campo de busca não encontrado!");
    }

    carregarJSON();
});
