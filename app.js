const API_URL = "https://script.google.com/macros/s/AKfycbwhrz4NYBkZhO11hxauYPyiEtAHMprAwh5yLff4Jx3rP4Fc5HRZ8X7suAtH-SMwVPvj_w/exec";

async function carregarDados() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const dados = await response.json();

        console.log("Dados recebidos:", dados);

        if (dados.status !== "ok") {
            throw new Error(dados.mensagem);
        }

        renderizarRanking(dados.ranking);
        renderizarProducao(dados.producao);

        document.getElementById("status").textContent =
            "Dados atualizados";

        document.querySelector(".status-dot").style.background =
            "#00ff66";

        document.getElementById("ultimaAtualizacao").textContent =
            "Última atualização: " +
            new Date(dados.atualizadoEm).toLocaleString("pt-BR");

    } catch (erro) {

        console.error("Erro:", erro);

        document.getElementById("status").textContent =
            "Erro ao carregar dados";

        document.querySelector(".status-dot").style.background =
            "#ff0000";
    }
}


// =====================================================
// RANKING
// =====================================================

function renderizarRanking(ranking) {

    const lista =
        document.getElementById("rankingList");

    lista.innerHTML = "";

    ranking
        .slice(0, 10)
        .forEach((consultor, index) => {

            const linha =
                document.createElement("div");

            linha.className = "ranking-row";

            linha.innerHTML = `
                <span class="position">
                    ${index + 1}
                </span>

                <span class="ranking-name">
                    ${consultor.nome}
                </span>

                <span class="ranking-value">
                    ${formatarMoeda(consultor.producao)}
                </span>
            `;

            lista.appendChild(linha);
        });


    // TOP 3

    ranking.slice(0, 3).forEach((consultor, index) => {

        const posicao = index + 1;

        document.getElementById(
            `nome${posicao}`
        ).textContent = consultor.nome;

        document.getElementById(
            `valor${posicao}`
        ).textContent =
            formatarMoeda(consultor.producao);

        const imagem =
            document.getElementById(
                `foto${posicao}`
            );

        if (consultor.foto) {
            imagem.src =
                converterFoto(consultor.foto);
        }
    });
}


// =====================================================
// PRODUÇÃO
// =====================================================

function renderizarProducao(producao) {

    // Meta mensal
    document.getElementById("metaMes").textContent =
        formatarMoeda(producao.metaMes);

    document.getElementById("metaMes2").textContent =
        formatarMoeda(producao.metaMes);


    // Meta semanal
    document.getElementById("metaSemana").textContent =
        formatarMoeda(producao.metaSemana);


    // Meta diária
    document.getElementById("metaDia").textContent =
        formatarMoeda(producao.metaDia);


    // Realizado mensal
    document.getElementById("vendidoMes").textContent =
        formatarMoeda(producao.vendidoMes);


    // Realizado semanal
    document.getElementById("vendidoSemana").textContent =
        formatarMoeda(producao.vendidoSemana);


    // REALIZADO DIÁRIO
    // IMPORTANTE: vem exclusivamente de I3
    document.getElementById("vendidoDia").textContent =
        formatarMoeda(producao.vendidoDia);


    // Volume total
    document.getElementById("volumeTotal").textContent =
        formatarMoeda(producao.vendidoMes);


    // Percentuais
    atualizarMeta(
        "progressDia",
        "percentDia",
        producao.vendidoDia,
        producao.metaDia
    );

    atualizarMeta(
        "progressSemana",
        "percentSemana",
        producao.vendidoSemana,
        producao.metaSemana
    );

    atualizarMeta(
        "progressMes",
        "percentMes",
        producao.vendidoMes,
        producao.metaMes
    );
}


// =====================================================
// METAS
// =====================================================

function atualizarMeta(
    barraId,
    percentualId,
    realizado,
    meta
) {

    if (!meta) {
        return;
    }

    const percentual =
        (Number(realizado) / Number(meta)) * 100;

    const percentualVisual =
        Math.min(Math.max(percentual, 0), 100);


    document.getElementById(barraId).style.width =
        `${percentualVisual}%`;

    document.getElementById(percentualId).textContent =
        `${percentual.toFixed(1)}%`;
}


// =====================================================
// MOEDA
// =====================================================

function formatarMoeda(valor) {

    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


// =====================================================
// GOOGLE DRIVE
// =====================================================

function converterFoto(url) {

    if (!url) {
        return "";
    }

    const match =
        url.match(/\/d\/([^/]+)/);

    if (!match) {
        return url;
    }

    const id = match[1];

    return `https://drive.google.com/thumbnail?id=${id}&sz=w500`;
}


// =====================================================
// INICIAR
// =====================================================

carregarDados();
