const SPREADSHEET_ID =
    "1k4BFHPCYUkgvibtPAX24QbFynGFa-2tITJ_jZHp2A2U";


/* =====================================================
   CONFIGURAÇÃO DA PLANILHA
===================================================== */

const CONFIG = {

    ranking: {
        sheet: "RANKING",
        range: "A2:L",
    },

    rankingSemana: {
        sheet: "RANKINGSEMANA",
        range: "A2:L2",
    },

    rankingContratos: {
        sheet: "RANKINGCONTRATOS",
        range: "A2:L2",
    },

    producao: {
        sheet: "PRODUCAO",
        range: "B2:I3",
    }

};


/* =====================================================
   URL GOOGLE SHEETS
===================================================== */

function getSheetUrl(sheet, range) {

    const query = `
        select *
        where A is not null
    `;

    return `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq` +
        `?sheet=${encodeURIComponent(sheet)}` +
        `&range=${encodeURIComponent(range)}` +
        `&tqx=out:json` +
        `&tq=${encodeURIComponent(query)}`;
}


/* =====================================================
   BUSCAR DADOS
===================================================== */

async function fetchSheet(sheet, range) {

    const url = getSheetUrl(sheet, range);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Erro ao acessar a aba ${sheet}`
        );
    }

    const text = await response.text();

    /*
       O Google retorna algo parecido com:

       google.visualization.Query.setResponse({...});

       Precisamos retirar essa parte.
    */

    const jsonText = text
        .replace(/^[^(]*\(/, "")
        .replace(/\);?\s*$/, "");

    const json = JSON.parse(jsonText);

    return json.table;
}


/* =====================================================
   CONVERTER LINHAS
===================================================== */

function getCellValue(row, index) {

    if (!row.c[index]) {
        return "";
    }

    return row.c[index].v ?? "";
}


/* =====================================================
   FORMATAR MOEDA
===================================================== */

function formatCurrency(value) {

    const number = Number(value) || 0;

    return number.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


/* =====================================================
   CONVERTER VALOR
===================================================== */

function parseNumber(value) {

    if (typeof value === "number") {
        return value;
    }

    if (!value) {
        return 0;
    }

    return Number(
        String(value)
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim()
    ) || 0;
}


/* =====================================================
   BUSCAR RANKING
===================================================== */

async function carregarRanking() {

    const tabela = await fetchSheet(
        CONFIG.ranking.sheet,
        CONFIG.ranking.range
    );

    const ranking = tabela.rows
        .map(row => {

            return {

                nome:
                    getCellValue(row, 0),

                producao:
                    parseNumber(
                        getCellValue(row, 5)
                    ),

                foto:
                    getCellValue(row, 11)

            };

        })
        .filter(item =>
            item.nome &&
            item.producao > 0
        )
        .sort(
            (a, b) =>
                b.producao - a.producao
        );

    return ranking;
}


/* =====================================================
   RENDERIZAR TOP 10
===================================================== */

function renderRanking(ranking) {

    const lista =
        document.getElementById(
            "rankingList"
        );

    lista.innerHTML = "";

    ranking
        .slice(0, 10)
        .forEach((consultor, index) => {

            const row =
                document.createElement("div");

            row.className =
                "ranking-row";

            row.innerHTML = `

                <span class="position">
                    ${index + 1}
                </span>

                <span class="ranking-name">
                    ${consultor.nome}
                </span>

                <span class="ranking-value">
                    ${formatCurrency(
                        consultor.producao
                    )}
                </span>

            `;

            lista.appendChild(row);

        });
}


/* =====================================================
   RENDERIZAR PÓDIO
===================================================== */

function renderPodium(ranking) {

    const top3 =
        ranking.slice(0, 3);

    top3.forEach((consultor, index) => {

        const posicao = index + 1;

        document.getElementById(
            `nome${posicao}`
        ).textContent =
            consultor.nome;

        document.getElementById(
            `valor${posicao}`
        ).textContent =
            formatCurrency(
                consultor.producao
            );

        const foto =
            document.getElementById(
                `foto${posicao}`
            );

        if (consultor.foto) {

            foto.src =
                converterFotoGoogleDrive(
                    consultor.foto
                );

        }

    });
}


/* =====================================================
   CONVERTER FOTO GOOGLE DRIVE
===================================================== */

function converterFotoGoogleDrive(url) {

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

    const fileId = match[1];

    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w500`;
}


/* =====================================================
   BUSCAR PRODUÇÃO
===================================================== */

async function carregarProducao() {

    /*
       IMPORTANTE:

       B2 = meta mês
       C2 = meta semana
       D2 = meta dia
       E2 = vendido mês
       H2 = vendido semana
       I3 = vendido dia
    */

    const tabela =
        await fetchSheet(
            CONFIG.producao.sheet,
            CONFIG.producao.range
        );

    /*
       Como estamos usando B2:I3:

       índice 0 = B
       índice 1 = C
       índice 2 = D
       índice 3 = E
       índice 4 = F
       índice 5 = G
       índice 6 = H
       índice 7 = I
    */

    const linha2 =
        tabela.rows[0];

    const linha3 =
        tabela.rows[1];

    const dados = {

        metaMes:
            parseNumber(
                getCellValue(
                    linha2,
                    0
                )
            ),

        metaSemana:
            parseNumber(
                getCellValue(
                    linha2,
                    1
                )
            ),

        metaDia:
            parseNumber(
                getCellValue(
                    linha2,
                    2
                )
            ),

        vendidoMes:
            parseNumber(
                getCellValue(
                    linha2,
                    3
                )
            ),

        vendidoSemana:
            parseNumber(
                getCellValue(
                    linha2,
                    6
                )
            ),

        /*
           I3 — EXATAMENTE COMO VOCÊ DEFINIU
        */

        vendidoDia:
            parseNumber(
                getCellValue(
                    linha3,
                    7
                )
            )

    };

    return dados;
}


/* =====================================================
   ATUALIZAR METAS
===================================================== */

function renderProducao(dados) {

    document.getElementById(
        "metaMes"
    ).textContent =
        formatCurrency(
            dados.metaMes
        );

    document.getElementById(
        "metaMes2"
    ).textContent =
        formatCurrency(
            dados.metaMes
        );

    document.getElementById(
        "metaSemana"
    ).textContent =
        formatCurrency(
            dados.metaSemana
        );

    document.getElementById(
        "metaDia"
    ).textContent =
        formatCurrency(
            dados.metaDia
        );

    document.getElementById(
        "vendidoMes"
    ).textContent =
        formatCurrency(
            dados.vendidoMes
        );

    document.getElementById(
        "vendidoSemana"
    ).textContent =
        formatCurrency(
            dados.vendidoSemana
        );

    document.getElementById(
        "vendidoDia"
    ).textContent =
        formatCurrency(
            dados.vendidoDia
        );


    const percentualMes =
        calcularPercentual(
            dados.vendidoMes,
            dados.metaMes
        );

    const percentualSemana =
        calcularPercentual(
            dados.vendidoSemana,
            dados.metaSemana
        );

    const percentualDia =
        calcularPercentual(
            dados.vendidoDia,
            dados.metaDia
        );


    atualizarProgress(
        "progressMes",
        "percentMes",
        percentualMes
    );

    atualizarProgress(
        "progressSemana",
        "percentSemana",
        percentualSemana
    );

    atualizarProgress(
        "progressDia",
        "percentDia",
        percentualDia
    );


    document.getElementById(
        "volumeTotal"
    ).textContent =
        formatCurrency(
            dados.vendidoMes
        );
}


/* =====================================================
   PERCENTUAL
===================================================== */

function calcularPercentual(
    realizado,
    meta
) {

    if (!meta) {
        return 0;
    }

    return Math.min(
        (realizado / meta) * 100,
        100
    );
}


/* =====================================================
   PROGRESS BAR
===================================================== */

function atualizarProgress(
    progressId,
    percentId,
    percentual
) {

    document.getElementById(
        progressId
    ).style.width =
        `${percentual}%`;

    document.getElementById(
        percentId
    ).textContent =
        `${percentual.toFixed(1)}%`;
}


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

async function iniciarDashboard() {

    try {

        document.getElementById(
            "status"
        ).textContent =
            "Carregando dados...";


        /*
           RANKING
        */

        const ranking =
            await carregarRanking();

        renderRanking(ranking);

        renderPodium(ranking);


        /*
           PRODUÇÃO
        */

        const producao =
            await carregarProducao();

        renderProducao(producao);


        /*
           STATUS
        */

        document.getElementById(
            "status"
        ).textContent =
            "Dados atualizados";


        document.getElementById(
            "ultimaAtualizacao"
        ).textContent =
            "Última atualização: " +
            new Date().toLocaleString(
                "pt-BR"
            );


    } catch (erro) {

        console.error(
            "Erro no dashboard:",
            erro
        );

        document.getElementById(
            "status"
        ).textContent =
            "Erro ao carregar dados";

    }

}


/* =====================================================
   INICIAR
===================================================== */

iniciarDashboard();
