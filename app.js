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


        console.log("=================================");
        console.log("DADOS RECEBIDOS DA API");
        console.log(dados);
        console.log("=================================");


        if (!dados) {

            throw new Error(
                "API retornou dados vazios."
            );

        }


        if (dados.status === "erro") {

            throw new Error(
                dados.mensagem ||
                "Erro retornado pelo Google Apps Script."
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
        //
        // Compatibilidade:
        // - dados.metas
        // - dados.producao
        // =================================================

        const metas =
            dados.metas ||
            dados.producao ||
            null;


        if (metas) {

            console.log(
                "OBJETO DE METAS:",
                metas
            );

            atualizarMetas(
                metas
            );

        } else {

            console.warn(
                "Nenhum objeto de metas encontrado."
            );

        }


        // =================================================
        // RANKING
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
    console.log("ATUALIZANDO METAS");
    console.log(metas);
    console.log("=================================");


    const metaMes =
        numero(
            metas.metaMes
        );


    const metaSemana =
        numero(
            metas.metaSemana
        );


    const metaDia =
        numero(
            metas.metaDia
        );


    const vendidoMes =
        numero(
            metas.vendidoMes
        );


    const vendidoSemana =
        numero(
            metas.vendidoSemana
        );


    const vendidoDia =
        numero(
            metas.vendidoDia
        );


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
        "Vendido dia:",
        vendidoDia
    );


    // =====================================================
    // VOLUME TOTAL DA UNIDADE
    // =====================================================

    colocarTexto(
        "volumeTotal",
        moeda(vendidoMes)
    );


    // =====================================================
    // META DO MÊS
    // =====================================================

    colocarTexto(
        "metaMes",
        moeda(metaMes)
    );


    // =====================================================
    // META DIÁRIA
    // =====================================================

    colocarTexto(
        "metaDia",
        moeda(metaDia)
    );


    colocarTexto(
        "vendidoDia",
        moeda(vendidoDia)
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
        moeda(metaSemana)
    );


    colocarTexto(
        "vendidoSemana",
        moeda(vendidoSemana)
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
        moeda(metaMes)
    );


    colocarTexto(
        "vendidoMes",
        moeda(vendidoMes)
    );


    atualizarProgresso(
        "progressMes",
        "percentMes",
        vendidoMes,
        metaMes
    );


    // =====================================================
    // PERCENTUAL DA META MENSAL
    // =====================================================

    const percentualMensal =
        calcularPercentual(
            vendidoMes,
            metaMes
        );


    atualizarElementosPercentualMensal(
        percentualMensal
    );


    // =====================================================
    // ATUALIZAR CÍRCULOS
    // =====================================================

    atualizarCirculosMeta(
        "dia",
        vendidoDia,
        metaDia
    );


    atualizarCirculosMeta(
        "semana",
        vendidoSemana,
        metaSemana
    );


    atualizarCirculosMeta(
        "mes",
        vendidoMes,
        metaMes
    );


    console.log(
        "Metas aplicadas no dashboard."
    );

}


// =========================================================
// RANKING
// =========================================================

function atualizarRanking(
    ranking
) {

    if (
        !Array.isArray(
            ranking
        )
    ) {

        return;

    }


    // =====================================================
    // SOMENTE PRODUÇÃO MAIOR QUE ZERO
    // =====================================================

    const rankingValido =
        ranking
            .filter(
                function (item) {

                    return (
                        numero(
                            item.producao
                        ) > 0
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
    // Soma todos os consultores.
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
        moeda(volumeGeral)
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

    preencherPodium(
        1,
        ranking[0]
    );


    preencherPodium(
        2,
        ranking[1]
    );


    preencherPodium(
        3,
        ranking[2]
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
    // SEM CONSULTOR
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
    // NOME
    // =====================================================

    if (nome) {

        nome.textContent =
            pessoa.nome ||
            "-";

    }


    // =====================================================
    // VALOR
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

            foto.style.display =
                "block";


            foto.src =
                urlFoto;


            foto.onerror =
                function () {

                    console.warn(
                        "Não foi possível carregar a foto:",
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


    lista.innerHTML =
        "";


    ranking.forEach(
        function (
            item,
            index
        ) {

            const producao =
                numero(
                    item.producao
                );


            // =================================================
            // SEGURANÇA
            // Nunca mostrar produção zero.
            // =================================================

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


            // =================================================
            // POSIÇÃO
            // =================================================

            const posicao =
                document.createElement(
                    "span"
                );


            posicao.className =
                "position";


            posicao.textContent =
                index + 1;


            // =================================================
            // NOME
            // =================================================

            const nome =
                document.createElement(
                    "span"
                );


            nome.className =
                "ranking-name";


            nome.textContent =
                item.nome ||
                "-";


            // =================================================
            // VALOR
            // =================================================

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


            // =================================================
            // MONTAR
            // =================================================

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
    // THUMBNAIL
    // =====================================================

    if (
        url.includes(
            "drive.google.com/thumbnail"
        )
    ) {

        return url;

    }


    // =====================================================
    // FILE/D/ID/VIEW
    // =====================================================

    const match =
        url.match(
            /\/file\/d\/([^/]+)/
        );


    if (
        match &&
        match[1]
    ) {

        return (
            "https://drive.google.com/thumbnail?id=" +
            encodeURIComponent(
                match[1]
            ) +
            "&sz=w600"
        );

    }


    // =====================================================
    // ?ID=ID
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


    const porcentagem =
        calcularPercentual(
            realizado,
            meta
        );


    // =====================================================
    // BARRA
    // =====================================================

    const largura =
        Math.min(
            Math.max(
                porcentagem,
                0
            ),
            100
        );


    if (barra) {

        barra.style.width =
            largura + "%";

    }


    // =====================================================
    // TEXTO
    // =====================================================

    if (percentual) {

        percentual.textContent =
            formatarPercentual(
                porcentagem
            );

    }

}


// =========================================================
// ATUALIZAR CÍRCULOS
// =========================================================

function atualizarCirculosMeta(
    tipo,
    realizado,
    meta
) {

    const porcentagem =
        calcularPercentual(
            realizado,
            meta
        );


    const graus =
        Math.min(
            Math.max(
                porcentagem * 3.6,
                0
            ),
            360
        );


    const seletores =
        [
            `.circle-progress[data-meta="${tipo}"]`,
            `.circle-progress[data-type="${tipo}"]`,
            `.circle-progress[data-tipo="${tipo}"]`
        ];


    let circulos = [];


    seletores.forEach(
        function (seletor) {

            document
                .querySelectorAll(
                    seletor
                )
                .forEach(
                    function (elemento) {

                        if (
                            !circulos.includes(
                                elemento
                            )
                        ) {

                            circulos.push(
                                elemento
                            );

                        }

                    }
                );

        }
    );


    // =====================================================
    // FALLBACK POR ID
    // =====================================================

    const ids =
        {
            dia: [
                "circleDia",
                "progressCircleDia"
            ],

            semana: [
                "circleSemana",
                "progressCircleSemana"
            ],

            mes: [
                "circleMes",
                "progressCircleMes"
            ]
        };


    if (
        ids[tipo]
    ) {

        ids[tipo].forEach(
            function (id) {

                const elemento =
                    document.getElementById(
                        id
                    );


                if (
                    elemento &&
                    !circulos.includes(
                        elemento
                    )
                ) {

                    circulos.push(
                        elemento
                    );

                }

            }
        );

    }


    circulos.forEach(
        function (circulo) {

            circulo.style.setProperty(
                "--progress",
                graus + "deg"
            );


            circulo.style.setProperty(
                "--progress-percent",
                porcentagem + "%"
            );


            circulo.setAttribute(
                "data-percent",
                formatarPercentual(
                    porcentagem
                )
            );

        }
    );


    // =====================================================
    // TEXTOS DOS CÍRCULOS
    // =====================================================

    const idsPercentual =
        {
            dia: [
                "percentDiaCircle",
                "percentDiaCircular"
            ],

            semana: [
                "percentSemanaCircle",
                "percentSemanaCircular"
            ],

            mes: [
                "percentMesCircle",
                "percentMesCircular"
            ]
        };


    if (
        idsPercentual[tipo]
    ) {

        idsPercentual[tipo].forEach(
            function (id) {

                colocarTexto(
                    id,
                    formatarPercentual(
                        porcentagem
                    )
                );

            }
        );

    }


    // =====================================================
    // COMPATIBILIDADE COM ELEMENTO DENTRO DO CÍRCULO
    // =====================================================

    circulos.forEach(
        function (circulo) {

            const texto =
                circulo.querySelector(
                    ".circle-inner span, .circle-value, .circle-percent"
                );


            if (texto) {

                texto.textContent =
                    formatarPercentual(
                        porcentagem
                    );

            }

        }
    );

}


// =========================================================
// PERCENTUAL MENSAL
// =========================================================

function atualizarElementosPercentualMensal(
    porcentagem
) {

    const texto =
        formatarPercentual(
            porcentagem
        );


    const elementos =
        [
            "percentMesTop",
            "percentMesCircle",
            "percentMesCircular",
            "percentualMes"
        ];


    elementos.forEach(
        function (id) {

            colocarTexto(
                id,
                texto
            );

        }
    );


    // =====================================================
    // FALLBACK:
    // procura elementos relacionados à meta mensal
    // =====================================================

    document
        .querySelectorAll(
            "[data-percent-mes]"
        )
        .forEach(
            function (elemento) {

                elemento.textContent =
                    texto;

            }
        );

}


// =========================================================
// CALCULAR PERCENTUAL
// =========================================================

function calcularPercentual(
    realizado,
    meta
) {

    realizado =
        numero(
            realizado
        );


    meta =
        numero(
            meta
        );


    if (
        meta <= 0
    ) {

        return 0;

    }


    return (
        realizado /
        meta
    ) * 100;

}


// =========================================================
// FORMATAÇÃO DE MOEDA
// =========================================================

function moeda(
    valor
) {

    valor =
        numero(
            valor
        );


    return valor.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// =========================================================
// CONVERTER PARA NÚMERO
// =========================================================

function numero(
    valor
) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return 0;

    }


    if (
        typeof valor ===
        "number"
    ) {

        return isNaN(
            valor
        )
            ? 0
            : valor;

    }


    let texto =
        String(
            valor
        ).trim();


    // =====================================================
    // REMOVER R$
    // =====================================================

    texto =
        texto.replace(
            /R\$/gi,
            ""
        ).trim();


    // =====================================================
    // FORMATO BRASILEIRO
    // 1.234.567,89
    // =====================================================

    if (
        texto.includes(",")
    ) {

        texto =
            texto.replace(
                /\./g,
                ""
            );


        texto =
            texto.replace(
                ",",
                "."
            );

    }


    // =====================================================
    // LIMPAR
    // =====================================================

    texto =
        texto.replace(
            /[^\d.-]/g,
            ""
        );


    const resultado =
        parseFloat(
            texto
        );


    return isNaN(
        resultado
    )
        ? 0
        : resultado;

}


// =========================================================
// PERCENTUAL
// =========================================================

function formatarPercentual(
    valor
) {

    valor =
        numero(
            valor
        );


    return valor.toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }
    ) + "%";

}


// =========================================================
// COLOCAR TEXTO
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

setInterval(
    carregarRanking,
    60000
);
