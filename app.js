// =========================================================
// RANKING ADEMICON
// APP.JS — VERSÃO COMPLETA
// =========================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbwhrz4NYBkZhO11hxauYPyiEtAHMprAwh5yLff4Jx3rP4Fc5HRZ8X7suAtH-SMwVPvj_w/exec";


// =========================================================
// INICIALIZAÇÃO
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

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

        atualizarStatus("Conectando...", false);

        console.log("Chamando API...");

        const resposta = await fetch(API_URL, {
            method: "GET",
            cache: "no-cache"
        });

        console.log("Status API:", resposta.status);

        if (!resposta.ok) {
            throw new Error(
                "Erro HTTP: " + resposta.status
            );
        }

        const dados = await resposta.json();

        console.log("DADOS RECEBIDOS:");
        console.log(dados);

        // Verificação básica
        if (!dados) {
            throw new Error("API retornou dados vazios.");
        }


        // =================================================
        // ATUALIZAR STATUS
        // =================================================

        atualizarStatus("Dados atualizados", true);


        // =================================================
        // METAS
        // =================================================

        if (dados.metas) {

            console.log("METAS:", dados.metas);

            atualizarMetas(dados.metas);

        } else {

            console.warn(
                "Objeto 'metas' não encontrado."
            );

        }


        // =================================================
        // RANKING GERAL
        // =================================================

        if (Array.isArray(dados.ranking)) {

            console.log(
                "Ranking recebido:",
                dados.ranking
            );

            atualizarRanking(dados.ranking);

        } else {

            console.warn(
                "Ranking não encontrado ou formato inválido."
            );

        }


        // =================================================
        // DATA DA ATUALIZAÇÃO
        // =================================================

        if (dados.atualizadoEm) {

            atualizarData(
                dados.atualizadoEm
            );

        }


        console.log("Ranking atualizado com sucesso.");

    }

    catch (erro) {

        console.error(
            "ERRO AO CARREGAR API:",
            erro
        );

        atualizarStatus(
            "Erro na conexão",
            false
        );

    }

}


// =========================================================
// STATUS DA API
// =========================================================

function atualizarStatus(texto, conectado) {

    const elemento =
        document.getElementById("status");

    if (elemento) {
        elemento.textContent = texto;
    }

    const bolinha =
        document.querySelector(".status-dot");

    if (bolinha) {

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

}


// =========================================================
// METAS
// =========================================================

function atualizarMetas(metas) {

    // -----------------------------------------------------
    // VALORES
    // -----------------------------------------------------

    const metaMes =
        numero(metas.metaMes);

    const metaSemana =
        numero(metas.metaSemana);

    const metaDia =
        numero(metas.metaDia);

    const vendidoMes =
        numero(metas.vendidoMes);

    const vendidoSemana =
        numero(metas.vendidoSemana);

    const vendidoDia =
        numero(metas.vendidoDia);


    console.log("Meta mês:", metaMes);
    console.log("Meta semana:", metaSemana);
    console.log("Meta dia:", metaDia);

    console.log("Vendido mês:", vendidoMes);
    console.log("Vendido semana:", vendidoSemana);
    console.log("Vendido dia:", vendidoDia);


    // -----------------------------------------------------
    // VOLUME TOTAL DA UNIDADE
    // -----------------------------------------------------

    colocarTexto(
        "volumeTotal",
        moeda(vendidoMes)
    );


    // -----------------------------------------------------
    // META DO MÊS
    // -----------------------------------------------------

    colocarTexto(
        "metaMes",
        moeda(metaMes)
    );


    // -----------------------------------------------------
    // META DIÁRIA
    // -----------------------------------------------------

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


    // -----------------------------------------------------
    // META SEMANAL
    // -----------------------------------------------------

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


    // -----------------------------------------------------
    // META MENSAL
    // -----------------------------------------------------

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

}


// =========================================================
// RANKING
// =========================================================

function atualizarRanking(ranking) {

    // -----------------------------------------------------
    // IMPORTANTE:
    // Mostrar somente quem possui produção > 0
    // -----------------------------------------------------

    const rankingValido =
        ranking
            .filter(item => {

                const producao =
                    numero(item.producao);

                return producao > 0;

            })
            .sort((a, b) => {

                return numero(b.producao)
                    -
                    numero(a.producao);

            })
            .slice(0, 10);


    console.log(
        "Ranking válido:",
        rankingValido
    );


    // -----------------------------------------------------
    // VOLUME TOTAL
    // -----------------------------------------------------

    const volumeTotal =
        rankingValido.reduce(
            (total, item) => {

                return total +
                    numero(item.producao);

            },
            0
        );


    // IMPORTANTE:
    // O volume total deve considerar TODOS os
    // consultores, inclusive os que não estão no TOP 10.
    // -----------------------------------------------------

    const volumeGeral =
        ranking.reduce(
            (total, item) => {

                return total +
                    numero(item.producao);

            },
            0
        );


    colocarTexto(
        "volumeTotal",
        moeda(volumeGeral)
    );


    // -----------------------------------------------------
    // PÓDIO
    // -----------------------------------------------------

    atualizarPodium(
        rankingValido
    );


    // -----------------------------------------------------
    // TOP 10
    // -----------------------------------------------------

    atualizarTabela(
        rankingValido
    );

}


// =========================================================
// PÓDIO
// =========================================================

function atualizarPodium(ranking) {

    const primeiro =
        ranking[0];

    const segundo =
        ranking[1];

    const terceiro =
        ranking[2];


    // -----------------------------------------------------
    // 1º LUGAR
    // -----------------------------------------------------

    preencherPodium(
        1,
        primeiro
    );


    // -----------------------------------------------------
    // 2º LUGAR
    // -----------------------------------------------------

    preencherPodium(
        2,
        segundo
    );


    // -----------------------------------------------------
    // 3º LUGAR
    // -----------------------------------------------------

    preencherPodium(
        3,
        terceiro
    );

}


// =========================================================
// PREENCHER PÓDIO
// =========================================================

function preencherPodium(posicao, pessoa) {

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


    // -----------------------------------------------------
    // SEM CONSULTOR
    // -----------------------------------------------------

    if (!pessoa) {

        if (nome) {
            nome.textContent = "-";
        }

        if (valor) {
            valor.textContent = "R$ -";
        }

        if (foto) {

            foto.removeAttribute(
                "src"
            );

        }

        return;

    }


    // -----------------------------------------------------
    // NOME
    // -----------------------------------------------------

    if (nome) {

        nome.textContent =
            pessoa.nome || "-";

    }


    // -----------------------------------------------------
    // PRODUÇÃO
    // -----------------------------------------------------

    if (valor) {

        valor.textContent =
            moeda(
                pessoa.producao
            );

    }


    // -----------------------------------------------------
    // FOTO
    // -----------------------------------------------------

    if (foto) {

        const urlFoto =
            converterFotoDrive(
                pessoa.foto
            );

        if (urlFoto) {

            foto.src =
                urlFoto;

            foto.onerror = function () {

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

        }

    }

}


// =========================================================
// TOP 10 — TABELA
// =========================================================

function atualizarTabela(ranking) {

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


    // Limpar tabela
    lista.innerHTML = "";


    ranking.forEach(
        (item, index) => {

            const linha =
                document.createElement(
                    "div"
                );


            linha.className =
                "ranking-row";


            // ------------------------------------------------
            // POSIÇÃO
            // ------------------------------------------------

            const posicao =
                document.createElement(
                    "span"
                );

            posicao.className =
                "position";

            posicao.textContent =
                index + 1;


            // ------------------------------------------------
            // NOME
            // ------------------------------------------------

            const nome =
                document.createElement(
                    "span"
                );

            nome.className =
                "ranking-name";

            nome.textContent =
                item.nome || "-";


            // ------------------------------------------------
            // VALOR
            // ------------------------------------------------

            const valor =
                document.createElement(
                    "span"
                );

            valor.className =
                "ranking-value";

            valor.textContent =
                moeda(
                    item.producao
                );


            // ------------------------------------------------
            // MONTAR LINHA
            // ------------------------------------------------

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
// CONVERTER FOTO GOOGLE DRIVE
// =========================================================

function converterFotoDrive(url) {

    if (!url) {
        return "";
    }


    url =
        String(url).trim();


    // -----------------------------------------------------
    // Já é thumbnail
    // -----------------------------------------------------

    if (
        url.includes(
            "drive.google.com/thumbnail"
        )
    ) {

        return url;

    }


    // -----------------------------------------------------
    // Extrair ID de:
    //
    // https://drive.google.com/file/d/ID/view
    // -----------------------------------------------------

    const match =
        url.match(
            /\/file\/d\/([^/]+)/
        );


    if (match && match[1]) {

        const id =
            match[1];

        return (
            "https://drive.google.com/thumbnail?id=" +
            encodeURIComponent(id) +
            "&sz=w600"
        );

    }


    // -----------------------------------------------------
    // Caso a URL já seja outro formato do Drive
    // -----------------------------------------------------

    const idMatch =
        url.match(
            /[?&]id=([^&]+)/
        );


    if (idMatch && idMatch[1]) {

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


    let porcentagem = 0;


    if (
        meta > 0 &&
        realizado >= 0
    ) {

        porcentagem =
            (realizado / meta) * 100;

    }


    // Limitar visualmente a barra a 100%
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


    if (percentual) {

        percentual.textContent =
            formatarPercentual(
                porcentagem
            );

    }

}


// =========================================================
// FORMATAÇÃO DE MOEDA
// =========================================================

function moeda(valor) {

    valor =
        numero(valor);


    return valor.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// =========================================================
// CONVERTER NÚMERO
// =========================================================

function numero(valor) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return 0;

    }


    // Se já for número
    if (
        typeof valor ===
        "number"
    ) {

        return isNaN(valor)
            ? 0
            : valor;

    }


    let texto =
        String(valor)
            .trim();


    // Remover R$
    texto =
        texto.replace(
            /R\$/gi,
            ""
        )
        .trim();


    // Formato brasileiro:
    // 1.234.567,89
    if (
        texto.includes(",")
    ) {

        texto =
            texto
                .replace(
                    /\./g,
                    ""
                )
                .replace(
                    ",",
                    "."
                );

    }


    texto =
        texto.replace(
            /[^\d.-]/g,
            ""
        );


    const resultado =
        parseFloat(texto);


    return isNaN(resultado)
        ? 0
        : resultado;

}


// =========================================================
// PERCENTUAL
// =========================================================

function formatarPercentual(
    valor
) {

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
            new Date(data);


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
