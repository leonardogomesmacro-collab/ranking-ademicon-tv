const API_URL = "https://script.google.com/macros/s/AKfycbwhrz4NYBkZhO11hxauYPyiEtAHMprAwh5yLff4Jx3rP4Fc5HRZ8X7suAtH-SMwVPvj_w/exec";

console.log("APP.JS CARREGADO");


/* =========================================================
   FORMATAÇÃO DE MOEDA
   ========================================================= */

function formatarMoeda(valor) {

    const numero = Number(valor) || 0;

    return numero.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


/* =========================================================
   FORMATAÇÃO DE PERCENTUAL
   ========================================================= */

function calcularPercentual(realizado, meta) {

    const valorRealizado = Number(realizado) || 0;
    const valorMeta = Number(meta) || 0;

    if (valorMeta <= 0) {
        return 0;
    }

    return (valorRealizado / valorMeta) * 100;
}


/* =========================================================
   ATUALIZA BARRA DE PROGRESSO
   ========================================================= */

function atualizarProgresso(elementoId, percentual) {

    const elemento = document.getElementById(elementoId);

    if (!elemento) {
        return;
    }

    /*
     * A barra visual fica limitada a 100%.
     * O percentual exibido pode passar de 100%.
     */

    const largura = Math.min(percentual, 100);

    elemento.style.width = `${largura}%`;
}


/* =========================================================
   ATUALIZA PERCENTUAL
   ========================================================= */

function atualizarPercentual(elementoId, percentual) {

    const elemento = document.getElementById(elementoId);

    if (!elemento) {
        return;
    }

    elemento.textContent =
        `${percentual.toFixed(1).replace(".", ",")}%`;
}


/* =========================================================
   ATUALIZA STATUS
   ========================================================= */

function atualizarStatus(texto, erro = false) {

    const elemento = document.getElementById("status");

    if (!elemento) {
        return;
    }

    elemento.textContent = texto;

    if (erro) {
        elemento.style.color = "#ff3333";
    } else {
        elemento.style.color = "#aaa";
    }
}


/* =========================================================
   ATUALIZA INDICADORES
   ========================================================= */

function atualizarMetricas(dados) {

    const metas = dados.metas || {};

    /*
     * Valores vindos da aba PRODUCAO
     */

    const metaMes = Number(metas.metaMes) || 0;
    const metaSemana = Number(metas.metaSemana) || 0;
    const metaDia = Number(metas.metaDia) || 0;

    const vendidoMes = Number(metas.vendidoMes) || 0;
    const vendidoSemana = Number(metas.vendidoSemana) || 0;
    const vendidoDia = Number(metas.vendidoDia) || 0;


    /* =====================================================
       VOLUME TOTAL DA UNIDADE
       ===================================================== */

    const volumeTotal =
        document.getElementById("volumeTotal");

    if (volumeTotal) {

        volumeTotal.textContent =
            formatarMoeda(vendidoMes);
    }


    /* =====================================================
       META DO MÊS
       ===================================================== */

    const elementoMetaMes =
        document.getElementById("metaMes");

    if (elementoMetaMes) {

        elementoMetaMes.textContent =
            formatarMoeda(metaMes);
    }


    /* =====================================================
       META DIÁRIA
       ===================================================== */

    const elementoMetaDia =
        document.getElementById("metaDia");

    const elementoVendidoDia =
        document.getElementById("vendidoDia");

    if (elementoMetaDia) {

        elementoMetaDia.textContent =
            formatarMoeda(metaDia);
    }

    if (elementoVendidoDia) {

        elementoVendidoDia.textContent =
            formatarMoeda(vendidoDia);
    }


    const percentualDia =
        calcularPercentual(
            vendidoDia,
            metaDia
        );

    atualizarProgresso(
        "progressDia",
        percentualDia
    );

    atualizarPercentual(
        "percentDia",
        percentualDia
    );


    /* =====================================================
       META SEMANAL
       ===================================================== */

    const elementoMetaSemana =
        document.getElementById("metaSemana");

    const elementoVendidoSemana =
        document.getElementById("vendidoSemana");

    if (elementoMetaSemana) {

        elementoMetaSemana.textContent =
            formatarMoeda(metaSemana);
    }

    if (elementoVendidoSemana) {

        elementoVendidoSemana.textContent =
            formatarMoeda(vendidoSemana);
    }


    const percentualSemana =
        calcularPercentual(
            vendidoSemana,
            metaSemana
        );

    atualizarProgresso(
        "progressSemana",
        percentualSemana
    );

    atualizarPercentual(
        "percentSemana",
        percentualSemana
    );


    /* =====================================================
       META MENSAL
       ===================================================== */

    const elementoMetaMes2 =
        document.getElementById("metaMes2");

    const elementoVendidoMes =
        document.getElementById("vendidoMes");

    if (elementoMetaMes2) {

        elementoMetaMes2.textContent =
            formatarMoeda(metaMes);
    }

    if (elementoVendidoMes) {

        elementoVendidoMes.textContent =
            formatarMoeda(vendidoMes);
    }


    const percentualMes =
        calcularPercentual(
            vendidoMes,
            metaMes
        );

    atualizarProgresso(
        "progressMes",
        percentualMes
    );

    atualizarPercentual(
        "percentMes",
        percentualMes
    );
}


/* =========================================================
   ATUALIZA PÓDIO
   ========================================================= */

function atualizarPodio(ranking) {

    if (!ranking || ranking.length === 0) {
        return;
    }


    /*
     * TOP 1
     */

    if (ranking[0]) {

        const item = ranking[0];

        document.getElementById("nome1").textContent =
            item.nome || "-";

        document.getElementById("valor1").textContent =
            formatarMoeda(item.producao);

        const foto1 =
            document.getElementById("foto1");

        if (foto1) {

            if (item.foto) {

                foto1.src = item.foto;

                foto1.style.display = "block";

            } else {

                foto1.removeAttribute("src");

                foto1.style.display = "block";
            }
        }
    }


    /*
     * TOP 2
     */

    if (ranking[1]) {

        const item = ranking[1];

        document.getElementById("nome2").textContent =
            item.nome || "-";

        document.getElementById("valor2").textContent =
            formatarMoeda(item.producao);

        const foto2 =
            document.getElementById("foto2");

        if (foto2) {

            if (item.foto) {

                foto2.src = item.foto;

                foto2.style.display = "block";

            } else {

                foto2.removeAttribute("src");

                foto2.style.display = "block";
            }
        }

    } else {

        document.getElementById("nome2").textContent =
            "-";

        document.getElementById("valor2").textContent =
            "R$ -";
    }


    /*
     * TOP 3
     */

    if (ranking[2]) {

        const item = ranking[2];

        document.getElementById("nome3").textContent =
            item.nome || "-";

        document.getElementById("valor3").textContent =
            formatarMoeda(item.producao);

        const foto3 =
            document.getElementById("foto3");

        if (foto3) {

            if (item.foto) {

                foto3.src = item.foto;

                foto3.style.display = "block";

            } else {

                foto3.removeAttribute("src");

                foto3.style.display = "block";
            }
        }

    } else {

        document.getElementById("nome3").textContent =
            "-";

        document.getElementById("valor3").textContent =
            "R$ -";
    }
}


/* =========================================================
   ATUALIZA TOP 10
   ========================================================= */

function atualizarRanking(ranking) {

    const rankingList =
        document.getElementById("rankingList");

    if (!rankingList) {
        return;
    }


    /*
     * LIMPA A TABELA
     */

    rankingList.innerHTML = "";


    /*
     * IMPORTANTE:
     *
     * Só entram consultores com produção maior
     * que zero.
     *
     * Depois limitamos aos 10 primeiros.
     */

    const rankingValido = (ranking || [])
        .filter(item => Number(item.producao) > 0)
        .slice(0, 10);


    /*
     * CRIA AS LINHAS
     */

    rankingValido.forEach((item, index) => {

        const row =
            document.createElement("div");

        row.className =
            "ranking-row";


        row.innerHTML = `

            <span class="position">
                ${index + 1}
            </span>

            <span class="ranking-name">
                ${item.nome || "-"}
            </span>

            <span class="ranking-value">
                ${formatarMoeda(item.producao)}
            </span>

        `;


        rankingList.appendChild(row);

    });


    /*
     * CASO NÃO TENHA NENHUM CONSULTOR
     */

    if (rankingValido.length === 0) {

        const row =
            document.createElement("div");

        row.className =
            "ranking-row";

        row.innerHTML = `

            <span class="position">
                -
            </span>

            <span class="ranking-name">
                Nenhum consultor com produção
            </span>

            <span class="ranking-value">
                R$ 0,00
            </span>

        `;

        rankingList.appendChild(row);
    }
}


/* =========================================================
   ATUALIZA DATA/HORA
   ========================================================= */

function atualizarDataHora(data) {

    const elemento =
        document.getElementById(
            "ultimaAtualizacao"
        );

    if (!elemento) {
        return;
    }


    if (!data) {

        elemento.textContent =
            "Última atualização: --";

        return;
    }


    const dataObj =
        new Date(data);


    if (isNaN(dataObj.getTime())) {

        elemento.textContent =
            "Última atualização: --";

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
                minute: "2-digit",
                second: "2-digit"
            }
        );


    elemento.textContent =
        `Última atualização: ${dataFormatada}`;
}


/* =========================================================
   BUSCAR API
   ========================================================= */

async function carregarDados() {

    try {

        console.log("Chamando API...");


        const resposta =
            await fetch(
                API_URL,
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        console.log(
            "Status:",
            resposta.status
        );


        if (!resposta.ok) {

            throw new Error(
                `HTTP ${resposta.status}`
            );
        }


        const dados =
            await resposta.json();


        console.log(
            "DADOS RECEBIDOS:",
            dados
        );


        /*
         * VERIFICA API
         */

        if (dados.status !== "ok") {

            throw new Error(
                dados.mensagem ||
                "API retornou erro"
            );
        }


        /* =================================================
           ATUALIZA STATUS
           ================================================= */

        atualizarStatus(
            "Dados atualizados"
        );


        /* =================================================
           ATUALIZA MÉTRICAS
           ================================================= */

        atualizarMetricas(
            dados
        );


        /* =================================================
           ATUALIZA PÓDIO
           ================================================= */

        atualizarPodio(
            dados.ranking
        );


        /* =================================================
           ATUALIZA TOP 10
           ================================================= */

        atualizarRanking(
            dados.ranking
        );


        /* =================================================
           ATUALIZA DATA
           ================================================= */

        atualizarDataHora(
            dados.atualizadoEm
        );


        console.log(
            "Dashboard atualizado com sucesso."
        );


    } catch (erro) {

        console.error(
            "ERRO AO CARREGAR API:",
            erro
        );


        atualizarStatus(
            "Erro na conexão",
            true
        );
    }
}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

carregarDados();


/* =========================================================
   ATUALIZAÇÃO AUTOMÁTICA
   =========================================================

   Atualiza os dados a cada 60 segundos.
   ========================================================= */

setInterval(
    carregarDados,
    60000
);
