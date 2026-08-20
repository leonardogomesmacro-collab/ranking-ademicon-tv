// =========================================================
// RANKING ADEMICON
// APP.JS
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
// BUSCAR API
// =========================================================

async function carregarRanking() {

    try {

        atualizarStatus("Conectando...", false);

        console.log("Chamando API...");

        const resposta = await fetch(API_URL + "?t=" + Date.now(), {
            method: "GET",
            cache: "no-store"
        });

        console.log("Status API:", resposta.status);

        if (!resposta.ok) {

            throw new Error(
                "Erro HTTP: " + resposta.status
            );

        }

        const dados = await resposta.json();

        console.log("=================================");
        console.log("DADOS RECEBIDOS DA API");
        console.log(dados);
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

        console.log(
            "OBJETO METAS:",
            dados.metas
        );

        if (dados.metas) {

            atualizarMetas(
                dados.metas
            );

        } else {

            console.error(
                "ERRO: objeto 'metas' não encontrado na API."
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
                "RANKING GERAL:",
                dados.ranking
            );

            atualizarRanking(
                dados.ranking
            );

        }


        // =================================================
        // RANKING SEMANA
        // =================================================

        if (
            dados.rankingSemana
        ) {

            console.log(
                "RANKING SEMANA:",
                dados.rankingSemana
            );

        }


        // =================================================
        // RANKING CONTRATOS
        // =================================================

        if (
            dados.rankingContratos
        ) {

            console.log(
                "RANKING CONTRATOS:",
                dados.rankingContratos
            );

        }


        // =================================================
        // DATA
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

function atualizarMetas(
    metas
) {

    console.log(
        "========== METAS =========="
    );

    console.log(
        "metaMes:",
        metas.metaMes
    );

    console.log(
        "metaSemana:",
        metas.metaSemana
    );

    console.log(
        "metaDia:",
        metas.metaDia
    );

    console.log(
        "vendidoMes:",
        metas.vendidoMes
    );

    console.log(
        "vendidoSemana:",
        metas.vendidoSemana
    );

    console.log(
        "vendidoDia:",
        metas.vendidoDia
    );


    // =====================================================
    // VALORES
    // =====================================================

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

}


// =========================================================
// RANKING GERAL
// =========================================================

function atualizarRanking(
    ranking
) {

    // =====================================================
    // VOLUME TOTAL
    // =====================================================

    const volumeGeral =
        ranking.reduce(
            (total, item) => {

                return total +
                    numero(
                        item.producao
                    );

            },
            0
        );


    colocarTexto(
        "volumeTotal",
        moeda(volumeGeral)
    );


    // =====================================================
    // FILTRAR SOMENTE PRODUÇÃO > 0
    // =====================================================

    const rankingValido =
        ranking
            .filter(
                item =>
                    numero(
                        item.producao
                    ) > 0
            )
            .sort(
                (a, b) =>
                    numero(b.producao) -
                    numero(a.producao)
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


    // =====================================================
    // NOME
    // =====================================================

    if (nome) {

        nome.textContent =
            pessoa.nome || "-";

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

        const url =
            converterFotoDrive(
                pessoa.foto
            );

        if (url) {

            foto.style.display =
                "block";

            foto.src =
                url;

        } else {

            foto.removeAttribute(
                "src"
            );

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
            "#rankingList não encontrado."
        );

        return;

    }


    lista.innerHTML = "";


    ranking.forEach(
        (item, index) => {

            const linha =
                document.createElement(
                    "div"
                );

            linha.className =
                "ranking-row";


            // POSIÇÃO

            const posicao =
                document.createElement(
                    "span"
                );

            posicao.className =
                "position";

            posicao.textContent =
                index + 1;


            // NOME

            const nome =
                document.createElement(
                    "span"
                );

            nome.className =
                "ranking-name";

            nome.textContent =
                item.nome || "-";


            // VALOR

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
// FOTO GOOGLE DRIVE
// =========================================================

function converterFotoDrive(
    url
) {

    if (!url) {
        return "";
    }


    url =
        String(url).trim();


    // Já é thumbnail

    if (
        url.includes(
            "drive.google.com/thumbnail"
        )
    ) {

        return url;

    }


    // URL:
    // drive.google.com/file/d/ID/view

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


    // URL com ?id=ID

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
// PROGRESSO
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
        meta > 0
    ) {

        porcentagem =
            (
                realizado /
                meta
            ) * 100;

    }


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
// MOEDA
// =========================================================

function moeda(
    valor
) {

    return numero(
        valor
    ).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// =========================================================
// NÚMERO
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


    // Número nativo

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


    // Remove R$

    texto =
        texto.replace(
            /R\$/gi,
            ""
        )
        .trim();


    // Número brasileiro

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

    return valor.toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }
    ) + "%";

}


// =========================================================
// INSERIR TEXTO
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
// DATA
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


// =========================================================
// ATUALIZAÇÃO AUTOMÁTICA
// =========================================================

setInterval(
    carregarRanking,
    60000
);
