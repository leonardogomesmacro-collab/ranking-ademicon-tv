const API = "https://script.google.com/macros/s/AKfycbwaalJAsUK8H6pVkXTc6mctclYW97_z73xW9ge6GkQvYz_IMv5X3jMEG6ECqEzZGfes/exec";

function moeda(valor){

  return Number(valor).toLocaleString(
    "pt-BR",
    {
      style:"currency",
      currency:"BRL"
    }
  );

}

function atualizarHorario(){

  const agora = new Date();

  document.getElementById(
    "lastUpdate"
  ).innerHTML =
    agora.toLocaleString("pt-BR");

}

function nomeCurto(nome){

  if(!nome) return "";

  const especiais = [
    "KFR",
    "GRF",
    "DCARDOSO"
  ];

  for(const item of especiais){

    if(
      nome.toUpperCase()
      .includes(item)
    ){
      return item;
    }

  }

  return nome
    .split(" ")[0]
    .toUpperCase();

}

/* ==========================
   CARREGAR DADOS
========================== */

async function carregarRanking(){

  try{

    const response =
      await fetch(
        API +
        "?nocache=" +
        Date.now()
      );

    const retorno =
      await response.json();

    const ranking =
      retorno.ranking || [];

    const config =
      retorno.config || {};

renderPodium(ranking);
renderTabela(ranking);
renderVolumeTotal(ranking);

renderMeta(ranking, config);

atualizarHorario();

  }
  catch(e){

    console.error(
      "Erro ao carregar ranking:",
      e
    );

  }

}

/* ==========================
   VOLUME TOTAL
========================== */

function renderVolumeTotal(ranking){

  const total =
    ranking.reduce(
      (acc,item)=>
        acc +
        Number(item.producao),
      0
    );

  document.getElementById(
    "unitTotal"
  ).innerHTML =
    moeda(total);

}

/* ==========================
   META DO MÊS
========================== */

function renderMeta(
  ranking,
  config
){

  const volumeTotal =
    ranking.reduce(
      (acc,item)=>
        acc +
        Number(item.producao),
      0
    );

  const metaMes =
    Number(
      config.metaMes || 0
    );

  const percentual =
    metaMes > 0
      ? (
          volumeTotal /
          metaMes
        ) * 100
      : 0;

  const faltante =
    Math.max(
      metaMes -
      volumeTotal,
      0
    );

  document.getElementById(
    "metaAtual"
  ).innerHTML =
    moeda(volumeTotal);

  document.getElementById(
    "metaMes"
  ).innerHTML =
    moeda(metaMes);

  document.getElementById(
    "percentualMeta"
  ).innerHTML =
    percentual.toFixed(1) +
    "%";

  document.getElementById(
    "faltanteMeta"
  ).innerHTML =
    "Faltam " +
    moeda(faltante);

  document.getElementById(
    "progressFill"
  ).style.width =
    Math.min(
      percentual,
      100
    ) + "%";

}


/* ==========================
   PODIUM
========================== */

function renderPodium(ranking){

  if(
    !ranking ||
    ranking.length < 3
  ) return;

  const primeiro =
    ranking[0];

  const segundo =
    ranking[1];

  const terceiro =
    ranking[2];

  document.getElementById(
    "firstPlace"
  ).innerHTML = `
    <img src="${primeiro.foto}" alt="">
    <div class="podium-base">
      <div class="medal medal-gold">1º</div>
      <p>${nomeCurto(primeiro.consultor)}</p>
      <h3>${moeda(primeiro.producao)}</h3>
    </div>
  `;

  document.getElementById(
    "secondPlace"
  ).innerHTML = `
    <img src="${segundo.foto}" alt="">
    <div class="podium-base">
      <div class="medal medal-silver">2º</div>
      <p>${nomeCurto(segundo.consultor)}</p>
      <h3>${moeda(segundo.producao)}</h3>
    </div>
  `;

  document.getElementById(
    "thirdPlace"
  ).innerHTML = `
    <img src="${terceiro.foto}" alt="">
    <div class="podium-base">
      <div class="medal medal-bronze">3º</div>
      <p>${nomeCurto(terceiro.consultor)}</p>
      <h3>${moeda(terceiro.producao)}</h3>
    </div>
  `;

}

/* ==========================
   TABELA TOP 10
========================== */

function renderTabela(
  ranking
){

  const tabela =
    document.getElementById(
      "rankingTable"
    );

  tabela.innerHTML = "";

  ranking
    .slice(0,10)
    .forEach(item=>{

      tabela.innerHTML += `
        <tr>
          <td>${item.posicao}</td>
          <td>${item.consultor.toUpperCase()}</td>
          <td>${moeda(item.producao)}</td>
        </tr>
      `;

    });

}


document.addEventListener(
    "click",
    () => {

        document.documentElement
        .requestFullscreen()
        .catch(()=>{});

    },
    { once:true }
);

/* ==========================
   AUTO REFRESH
========================== */

// CARREGA IMEDIATAMENTE
carregarRanking();

// Atualiza a cada 60 segundos
setInterval(() => {

    carregarRanking();

}, 60000);

// Recarrega a página a cada 30 minutos
setInterval(() => {

    location.reload();

}, 1800000);
