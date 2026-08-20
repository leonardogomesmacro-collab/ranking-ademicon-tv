const API_URL = "https://script.google.com/macros/s/AKfycbwhrz4NYBkZhO11hxauYPyiEtAHMprAwh5yLff4Jx3rP4Fc5HRZ8X7suAtH-SMwVPvj_w/exec";


// =====================================================
// INICIAR
// =====================================================

async function carregarDashboard() {

    try {

        console.log("Buscando dados...");

        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error(
                `Erro HTTP ${resposta.status}`
            );
        }

        const dados = await resposta.json();

        console.log("DADOS RECEBIDOS:", dados);


        if (dados.status !== "ok") {
            throw new Error(
                dados.mensagem || "Erro na API"
            );
        }


        // =================================================
        // RANKING
        // =================================================

        renderizarRanking(
            dados.ranking
        );


        // =================================================
        // PRODUÇÃO
        // =================================================

        renderizarProducao(
            dados.producao
        );


        // =================================================
        // STATUS
        // =================================================

        const status =
            document.getElementById("status");

        if (status) {
            status.textContent =
                "Dados atualizados";
        }


        const indicador =
            document.querySelector(".status-dot");

        if (indicador) {
            indicador.style.background =
                "#00ff66";
        }


        // =================================================
        // DATA
        // =================================================

        const ultimaAtualizacao =
            document.getElementById(
                "ultimaAtualizacao"
            );

        if (ultimaAtualizacao) {

            const data =
                new Date(
                    dados.atualizadoEm
                );

            ultimaAtualizacao.textContent =
                "Última atualização: " +
                data.toLocaleString("pt-BR");
        }


    } catch (erro) {

        console.error(
            "ERRO NO DASHBOARD:",
            erro
        );


        const status =
            document.getElementById("status");

        if (status) {
            status.textContent =
                "Erro ao carregar dados";
        }

    }

}


// =====================================================
// RANKING
// =====================================================

function renderizarRanking(ranking) {

    const lista =
        document.getElementById(
            "rankingList"
        );


    if (!lista) {
        console.error(
            "Elemento rankingList não encontrado"
        );

        return;
    }


    lista.innerHTML = "";


    // ===================================================
    // TOP 10
    // ===================================================

    ranking
        .slice(0, 10)
        .forEach(
            (consultor, index) => {

                const linha =
                    document.createElement(
                        "div"
                    );


                linha.className =
                    "ranking-row";


                linha.innerHTML = `

                    <span class="position">
                        ${index + 1}
                    </span>

                    <span class="ranking-name">
                        ${consultor.nome}
                    </span>

                    <span class="ranking-value">
                        ${formatarMoeda(
                            consultor.producao
                        )}
                    </span>

                `;


                lista.appendChild(linha);

            }
        );


    // ===================================================
    // TOP 3
    // ===================================================

    ranking
        .slice(0, 3)
        .forEach(
            (consultor, index) => {

                const posicao =
                    index + 1;


                const nome =
                    document.getElementById(
                        `nome${posicao}`
                    );


                const valor =
                    document.getElementById(
                        `valor${posicao}`
                    );


                const foto =
                    document.getElementById(
                        `foto${posicao}`
                    );


                if (nome) {

                    nome.textContent =
                        consultor.nome;

                }


                if (valor) {

                    valor.textContent =
                        formatarMoeda(
                            consultor.producao
                        );

                }


                if (
                    foto &&
                    consultor.foto
                ) {

                    foto.src =
                        converterFotoDrive(
                            consultor.foto
                        );

                }

            }
        );

}


// =====================================================
// PRODUÇÃO
// =====================================================

function renderizarProducao(producao) {

    console.log(
        "PRODUÇÃO:",
        producao
    );


    // ===================================================
    // VOLUME TOTAL
    // ===================================================

    definirTexto(
        "volumeTotal",
        formatarMoeda(
            producao.vendidoMes
        )
    );


    // ===================================================
    // META MÊS
    // ===================================================

    definirTexto(
        "metaMes",
        formatarMoeda(
            producao.metaMes
        )
    );


    definirTexto(
        "metaMes2",
        formatarMoeda(
            producao.metaMes
        )
    );


    // ===================================================
    // META SEMANAL
    // ===================================================

    definirTexto(
        "metaSemana",
        formatarMoeda(
            producao.metaSemana
        )
    );


    // ===================================================
    // META DIÁRIA
    // ===================================================

    definirTexto(
        "metaDia",
        formatarMoeda(
            producao.metaDia
        )
    );


    // ===================================================
    // REALIZADO MÊS
    // ===================================================

    definirTexto(
        "vendidoMes",
        formatarMoeda(
            producao.vendidoMes
        )
    );


    // ===================================================
    // REALIZADO SEMANA
    // ===================================================

    definirTexto(
        "vendidoSemana",
        formatarMoeda(
            producao.vendidoSemana
        )
    );


    // ===================================================
    // REALIZADO DIA
    //
    // EXCLUSIVAMENTE I3
    // ===================================================

    definirTexto(
        "vendidoDia",
        formatarMoeda(
            producao.vendidoDia
        )
    );


    // ===================================================
    // BARRA DIÁRIA
    // ===================================================

    atualizarMeta(
        "progressDia",
        "percentDia",
        producao.vendidoDia,
        producao.metaDia
    );


    // ===================================================
    // BARRA SEMANAL
    // ===================================================

    atualizarMeta(
        "progressSemana",
        "percentSemana",
        producao.vendidoSemana,
        producao.metaSemana
    );


    // ===================================================
    // BARRA MENSAL
    // ===================================================

    atualizarMeta(
        "progressMes",
        "percentMes",
        producao.vendidoMes,
        producao.metaMes
    );

}


// =====================================================
// DEFINIR TEXTO
// =====================================================

function definirTexto(id, valor) {

    const elemento =
        document.getElementById(id);


    if (!elemento) {

        console.warn(
            `Elemento "${id}" não encontrado`
        );

        return;
    }


    elemento.textContent =
        valor;
}


// =====================================================
// META / PROGRESSO
// =====================================================

function atualizarMeta(
    barraId,
    percentualId,
    realizado,
    meta
) {

    const valorRealizado =
        Number(realizado) || 0;

    const valorMeta =
        Number(meta) || 0;


    if (valorMeta <= 0) {
        return;
    }


    const percentual =
        (valorRealizado / valorMeta) * 100;


    const percentualVisual =
        Math.min(
            Math.max(
                percentual,
                0
            ),
            100
        );


    const barra =
        document.getElementById(
            barraId
        );


    const texto =
        document.getElementById(
            percentualId
        );


    if (barra) {

        barra.style.width =
            `${percentualVisual}%`;

    }


    if (texto) {

        texto.textContent =
            `${percentual.toFixed(1)}%`;

    }

}


// =====================================================
// MOEDA
// =====================================================

function formatarMoeda(valor) {

    return Number(
        valor || 0
    ).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// =====================================================
// FOTO GOOGLE DRIVE
// =====================================================

function converterFotoDrive(url) {

    if (!url) {
        return "";
    }


    const match =
        url.match(
            /\/d\/([^/]+)/
        );


    if (!match) {
        return url;
    }


    const fileId =
        match[1];


    return (
        `https://drive.google.com/thumbnail` +
        `?id=${fileId}&sz=w500`
    );

}


// =====================================================
// EXECUTAR
// =====================================================

console.log(
    "APP.JS CARREGADO"
);


carregarDashboard();
