// =========================================================
// RANKING ADEMICON
// APP.JS — VERSÃO COMPLETA
// =========================================================


// =========================================================
// CONFIGURAÇÃO DA API
// =========================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbwhrz4NYBkZhO11hxauYPyiEtAHMprAwh5yLff4Jx3rP4Fc5HRZ8X7suAtH-SMwVPvj_w/exec";


// =========================================================
// INICIALIZAÇÃO
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("=================================");
    console.log("RANKING ADEMICON");
    console.log("APP.JS CARREGADO");
    console.log("=================================");

    carregarRanking();

});


// =========================================================
// BUSCAR DADOS DA API
// =========================================================

async function carregarRanking() {

    try {

        atualizarStatus(
            "Conectando...",
            false
        );

        console.log("Chamando API...");


        const resposta = await fetch(
            API_URL,
            {
                method: "GET",
                cache: "no-cache"
            }
        );


        console.log(
            "Status API:",
            resposta.status
        );


        if (!resposta.ok) {

            throw new Error(
                "Erro HTTP: " +
                resposta.status
            );

        }


        const dados =
            await resposta.json();


        // =================================================
        // MOSTRAR RESPOSTA COMPLETA NO CONSOLE
        // =================================================

        console.log("=================================");
        console.log("DADOS RECEBIDOS DA API");
        console.log(dados);
        console.log(
            JSON.stringify(
                dados,
                null,
                2
            )
        );
        console.log("=================================");


        if (!dados) {

            throw new Error(
                "API retornou dados vazios."
            );

        }


        // =================================================
        // STATUS
        // =================================================

        atualizarStatus(
            "Dados atualizados",
            true
        );


        // =================================================
        // METAS
        // =================================================

        if (dados.metas) {

            console.log(
                "OBJETO METAS RECEBIDO:"
            );

            console.log(
                dados.metas
            );


            atualizarMetas(
                dados.metas
            );

        } else {

            console.warn(
                "ATENÇÃO: dados.metas não encontrado."
            );

        }


        // =================================================
        // RANKING GERAL
        // =================================================

        if (
            Array.isArray(
                dados.ranking
            )
        ) {

            console.log(
                "Ranking recebido:",
                dados.ranking
            );


            atualizarRanking(
                dados.ranking
            );

        } else {

            console.warn(
                "Ranking não encontrado ou formato inválido."
            );

        }


        // =================================================
        // DATA DE ATUALIZAÇÃO
        // =================================================

        if (
            dados.atualizadoEm
        ) {

            atualizarData(
                dados.atualizadoEm
            );

        }


        console.log(
            "Ranking atualizado com sucesso."
        );

    }

    catch (erro) {

        console.error(
            "================================="
        );

        console.error(
            "ERRO AO CARREGAR API:"
        );

        console.error(
            erro
        );

        console.error(
            "================================="
        );


        atualizarStatus(
            "Erro na conexão",
            false
        );

    }

}


// =========================================================
// STATUS
// =========================================================

function atualizarStatus(
    texto,
    conectado
) {

    const elemento =
        document.getElementById(
            "status"
        );


    if (elemento) {

        elemento.textContent =
            texto;

    }


    const bolinha =
        document.querySelector(
            ".status-dot"
        );


    if (!bolinha) {
        return;
    }


    if (conectado) {

        bolinha.style.background =
            "#00ff66";

        bolinha.style.boxShadow =
            "0 0 10px #00ff66";

    } else {

        bolinha.style.background =
            "#ff0000";

        bolinha.style.boxShadow =
            "0 0 10px #ff0000";

    }

}


// =========================================================
// METAS
// =========================================================

function atualizarMetas(
    metas
) {

    console.log("=================================");
    console.log("LENDO METAS");
    console.log("OBJETO METAS:");
    console.log(metas);
    console.log("=================================");


    // =====================================================
    // META DO MÊS
    // =====================================================

    const metaMes =
        numero(
            metas.metaMes
        );


    // =====================================================
    // META DA SEMANA
    // =====================================================

    const metaSemana =
        numero(
            metas.metaSemana
        );


    // =====================================================
    // META DO DIA
    // =====================================================

    const metaDia =
        numero(
            metas.metaDia
        );


    // =====================================================
    // VENDIDO NO MÊS
    // =====================================================

    const vendidoMes =
        numero(
            metas.vendidoMes
        );


    // =====================================================
    // VENDIDO NA SEMANA
    // =====================================================

    const vendidoSemana =
        numero(
            metas.vendidoSemana
        );


    // =====================================================
    // VENDIDO NO DIA
    //
    // IMPORTANTE:
    // O Apps Script deve buscar este valor
    // EXCLUSIVAMENTE da célula I3.
    // =====================================================

    const vendidoDia =
        numero(
            metas.vendidoDia
        );


    // =====================================================
    // LOG DOS VALORES
    // =====================================================

    console.log("=================================");
    console.log("VALORES DAS METAS");
    console.log("=================================");

    console.log(
        "Meta mês:",
        metaMes
    );

    console.log(
        "Meta semana:",
        metaSemana
    );

    console.log(
        "Meta dia:",
        metaDia
    );

    console.log(
        "Vendido mês:",
        vendidoMes
    );

    console.log(
        "Vendido semana:",
        vendidoSemana
    );

    console.log(
        "Vendido dia - I3:",
        vendidoDia
    );

    console.log("=================================");


    // =====================================================
    // VOLUME TOTAL DA UNIDADE
    // =====================================================

    colocarTexto(
        "volumeTotal",
        moeda(
            vendidoMes
        )
    );


    // =====================================================
    // META DO MÊS
    // =====================================================

    colocarTexto(
        "metaMes",
        moeda(
            metaMes
        )
    );


    // =====================================================
    // META DIÁRIA
    // =====================================================

    colocarTexto(
        "metaDia",
        moeda(
            metaDia
        )
    );


    colocarTexto(
        "vendidoDia",
        moeda(
            vendidoDia
        )
    );


    atualizarProgresso(
        "progressDia",
        "percentDia",
        vendidoDia,
        metaDia
    );


    // =====================================================
    // META SEMANAL
    // =====================================================

    colocarTexto(
        "metaSemana",
        moeda(
            metaSemana
        )
    );


    colocarTexto(
        "vendidoSemana",
        moeda(
            vendidoSemana
        )
    );


    atualizarProgresso(
        "progressSemana",
        "percentSemana",
        vendidoSemana,
        metaSemana
    );


    // =====================================================
    // META MENSAL
    // =====================================================

    colocarTexto(
        "metaMes2",
        moeda(
            metaMes
        )
    );


    colocarTexto(
        "vendidoMes",
        moeda(
            vendidoMes
        )
    );


    atualizarProgresso(
        "progressMes",
        "percentMes",
        vendidoMes,
        metaMes
    );


    console.log(
        "METAS APLICADAS NO DASHBOARD."
    );

}


// =========================================================
// RANKING GERAL
// =========================================================

function atualizarRanking(
    ranking
) {

    // =====================================================
    // SOMENTE CONSULTORES COM PRODUÇÃO > 0
    // =====================================================

    const rankingValido =
        ranking
            .filter(
                function (item) {

                    const producao =
                        numero(
                            item.producao
                        );

                    return (
                        producao > 0
                    );

                }
            )
            .sort(
                function (a, b) {

                    return (
                        numero(
                            b.producao
                        ) -
                        numero(
                            a.producao
                        )
                    );

                }
            )
            .slice(
                0,
                10
            );


    console.log(
        "RANKING VÁLIDO:",
        rankingValido
    );


    // =====================================================
    // VOLUME GERAL
    //
    // Soma TODOS os consultores.
    // =====================================================

    const volumeGeral =
        ranking.reduce(
            function (
                total,
                item
            ) {

                return (
                    total +
                    numero(
                        item.producao
                    )
                );

            },
            0
        );


    colocarTexto(
        "volumeTotal",
        moeda(
            volumeGeral
        )
    );


    // =====================================================
    // PÓDIO
    // =====================================================

    atualizarPodium(
        rankingValido
    );


    // =====================================================
    // TOP 10
    // =====================================================

    atualizarTabela(
        rankingValido
    );

}


// =========================================================
// PÓDIO
// =========================================================

function atualizarPodium(
    ranking
) {

    const primeiro =
        ranking[0];

    const segundo =
        ranking[1];

    const terceiro =
        ranking[2];


    preencherPodium(
        1,
        primeiro
    );


    preencherPodium(
        2,
        segundo
    );


    preencherPodium(
        3,
        terceiro
    );

}


// =========================================================
// PREENCHER PÓDIO
// =========================================================

function preencherPodium(
    posicao,
    pessoa
) {

    const nome =
        document.getElementById(
            "nome" + posicao
        );


    const valor =
        document.getElementById(
            "valor" + posicao
        );


    const foto =
        document.getElementById(
            "foto" + posicao
        );


    // =====================================================
    // CASO NÃO EXISTA CONSULTOR
    // =====================================================

    if (!pessoa) {

        if (nome) {

            nome.textContent =
                "-";

        }


        if (valor) {

            valor.textContent =
                "R$ -";

        }


        if (foto) {

            foto.removeAttribute(
                "src"
            );

            foto.style.display =
                "none";

        }

        return;

    }


    // =====================================================
    // MOSTRAR FOTO
    // =====================================================

    if (foto) {

        foto.style.display =
            "block";

    }


    // =====================================================
    // NOME
    // =====================================================

    if (nome) {

        nome.textContent =
            pessoa.nome ||
            "-";

    }


    // =====================================================
    // PRODUÇÃO
    // =====================================================

    if (valor) {

        valor.textContent =
            moeda(
                pessoa.producao
            );

    }


    // =====================================================
    // FOTO
    // =====================================================

    if (foto) {

        const urlFoto =
            converterFotoDrive(
                pessoa.foto
            );


        if (urlFoto) {

            foto.src =
                urlFoto;


            foto.onerror =
                function () {

                    console.warn(
                        "Erro ao carregar foto:",
                        pessoa.foto
                    );

                    this.style.display =
                        "none";

                };


        } else {

            foto.removeAttribute(
                "src"
            );

            foto.style.display =
                "none";

        }

    }

}


// =========================================================
// TOP 10
// =========================================================

function atualizarTabela(
    ranking
) {

    const lista =
        document.getElementById(
            "rankingList"
        );


    if (!lista) {

        console.error(
            "Elemento #rankingList não encontrado."
        );

        return;

    }


    // =====================================================
    // LIMPAR
    // =====================================================

    lista.innerHTML =
        "";


    // =====================================================
    // CRIAR LINHAS
    // =====================================================

    ranking.forEach(
        function (
            item,
            index
        ) {

            // ---------------------------------------------
            // SEGURANÇA:
            // NÃO CRIAR LINHA COM PRODUÇÃO ZERO
            // ---------------------------------------------

            const producao =
                numero(
                    item.producao
                );


            if (
                producao <= 0
            ) {

                return;

            }


            const linha =
                document.createElement(
                    "div"
                );


            linha.className =
                "ranking-row";


            // ---------------------------------------------
            // POSIÇÃO
            // ---------------------------------------------

            const posicao =
                document.createElement(
                    "span"
                );


            posicao.className =
                "position";


            posicao.textContent =
                index + 1;


            // ---------------------------------------------
            // NOME
            // ---------------------------------------------

            const nome =
                document.createElement(
                    "span"
                );


            nome.className =
                "ranking-name";


            nome.textContent =
                item.nome ||
                "-";


            // ---------------------------------------------
            // VALOR
            // ---------------------------------------------

            const valor =
                document.createElement(
                    "span"
                );


            valor.className =
                "ranking-value";


            valor.textContent =
                moeda(
                    producao
                );


            // ---------------------------------------------
            // MONTAR LINHA
            // ---------------------------------------------

            linha.appendChild(
                posicao
            );


            linha.appendChild(
                nome
            );


            linha.appendChild(
                valor
            );


            lista.appendChild(
                linha
            );

        }
    );

}


// =========================================================
// GOOGLE DRIVE — CONVERTER FOTO
// =========================================================

function converterFotoDrive(
    url
) {

    if (!url) {

        return "";

    }


    url =
        String(
            url
        ).trim();


    // =====================================================
    // JÁ É THUMBNAIL
    // =====================================================

    if (
        url.includes(
            "drive.google.com/thumbnail"
        )
    ) {

        return url;

    }


    // =====================================================
    // FORMATO:
    //
    // https://drive.google.com/file/d/ID/view
    // =====================================================

    const match =
        url.match(
            /\/file\/d\/([^/]+)/
        );


    if (
        match &&
        match[1]
    ) {

        const id =
            match[1];


        return (
            "https://drive.google.com/thumbnail?id=" +
            encodeURIComponent(
                id
            ) +
            "&sz=w600"
        );

    }


    // =====================================================
    // FORMATO:
    //
    // ?id=ID
    // =====================================================

    const idMatch =
        url.match(
            /[?&]id=([^&]+)/
        );


    if (
        idMatch &&
        idMatch[1]
    ) {

        return (
            "https://drive.google.com/thumbnail?id=" +
            encodeURIComponent(
                idMatch[1]
            ) +
            "&sz=w600"
        );

    }


    // =====================================================
    // RETORNAR URL ORIGINAL
    // =====================================================

    return url;

}


// =========================================================
// PROGRESSO DAS METAS
// =========================================================

function atualizarProgresso(
    barraId,
    percentualId,
    realizado,
    meta
) {

    const barra =
        document.getElementById(
            barraId
        );


    const percentual =
        document.getElementById(
            percentualId
        );


    let porcentagem = 0;


    // =====================================================
    // CALCULAR PERCENTUAL
    // =====================================================

    if (
        meta > 0 &&
        realizado >= 0
    ) {

        porcentagem =
            (realizado / meta) * 100;

    }


    // =====================================================
    // BARRA LIMITADA A 100%
    // =====================================================

    const largura =
        Math.min(
            Math.max(
                porcentagem,
                0
            ),
            100
        );


    // =====================================================
    // ATUALIZAR BARRA
    // =====================================================

    if (barra) {

        barra.style.width =
            largura + "%";

    }


    // =====================================================
    // ATUALIZAR TEXTO
    // =====================================================

    if (percentual) {

        percentual.textContent =
            formatarPercentual(
                porcentagem
            );

    }


    // =====================================================
    // CONVERTER % PARA GRAUS
    //
    // 100% = 360 graus
    // =====================================================

    const graus =
        Math.min(
            Math.max(
                porcentagem * 3.6,
                0
            ),
            360
        );


    // =====================================================
    // META DIÁRIA
    // =====================================================

    if (
        barraId === "progressDia"
    ) {

        const circulo =
            document
                .getElementById(
                    "percentDia"
                )
                ?.closest(
                    ".goal-card"
                )
                ?.querySelector(
                    ".circle-progress"
                );


        if (circulo) {

            circulo.style.setProperty(
                "--progress",
                graus + "deg"
            );

        }

    }


    // =====================================================
    // META SEMANAL
    // =====================================================

    if (
        barraId === "progressSemana"
    ) {

        const circulo =
            document
                .getElementById(
                    "percentSemana"
                )
                ?.closest(
                    ".goal-card"
                )
                ?.querySelector(
                    ".circle-progress"
                );


        if (circulo) {

            circulo.style.setProperty(
                "--progress",
                graus + "deg"
            );

        }

    }


    // =====================================================
    // META MENSAL
    // =====================================================

    if (
        barraId === "progressMes"
    ) {

        const circulo =
            document
                .getElementById(
                    "percentMesCircle"
                )
                ?.closest(
                    ".goal-card"
                )
                ?.querySelector(
                    ".circle-progress"
                );


        if (circulo) {

            circulo.style.setProperty(
                "--progress",
                graus + "deg"
            );

        }


        // =================================================
        // PERCENTUAL NO CARD SUPERIOR
        // =================================================

        const percentualTopo =
            document.getElementById(
                "percentMesTop"
            );


        if (percentualTopo) {

            percentualTopo.textContent =
                formatarPercentual(
                    porcentagem
                );

        }


        // =================================================
        // PERCENTUAL DENTRO DO CÍRCULO
        // =================================================

        const percentualCirculo =
            document.getElementById(
                "percentMesCircle"
            );


        if (percentualCirculo) {

            percentualCirculo.textContent =
                formatarPercentual(
                    porcentagem
                );

        }


        // =================================================
        // QUANTO FALTA
        // =================================================

        const faltam =
            document.getElementById(
                "faltamMes"
            );


        if (faltam) {

            const restante =
                Math.max(
                    meta - realizado,
                    0
                );


            faltam.textContent =
                moeda(
                    restante
                );

        }

    }

}

// =========================================================
// COLOCAR TEXTO NA PÁGINA
// =========================================================

function colocarTexto(
    id,
    texto
) {

    const elemento =
        document.getElementById(
            id
        );


    if (elemento) {

        elemento.textContent =
            texto;

    } else {

        console.warn(
            "Elemento não encontrado:",
            id
        );

    }

}


// =========================================================
// DATA DE ATUALIZAÇÃO
// =========================================================

function atualizarData(
    data
) {

    const elemento =
        document.getElementById(
            "ultimaAtualizacao"
        );


    if (!elemento) {

        return;

    }


    try {

        const dataObj =
            new Date(
                data
            );


        if (
            isNaN(
                dataObj.getTime()
            )
        ) {

            elemento.textContent =
                "Última atualização: " +
                data;

            return;

        }


        const dataFormatada =
            dataObj.toLocaleString(
                "pt-BR",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );


        elemento.textContent =
            "Última atualização: " +
            dataFormatada;

    }

    catch (erro) {

        console.warn(
            "Erro ao formatar data:",
            erro
        );

    }

}


// =========================================================
// ATUALIZAÇÃO AUTOMÁTICA
// =========================================================
//
// Atualiza a cada 60 segundos.
// =========================================================

setInterval(
    carregarRanking,
    60000
);
