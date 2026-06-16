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

  document.getElementById("lastUpdate").innerHTML =
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

    if(nome.toUpperCase().includes(item)){
      return item;
    }

  }

  return nome.split(" ")[0].toUpperCase();

}

async function carregarRanking(){

  try{

    const response =
      await fetch(
        API + "?nocache=" + Date.now()
      );

    const dados =
      await response.json();

    renderPodium(dados);
    renderTabela(dados);
    renderVolumeTotal(dados);

    atualizarHorario();

  }
  catch(e){

    console.error(e);

  }

}

function renderVolumeTotal(dados){

  const total =
    dados.reduce(
      (acc,item)=>
        acc + Number(item.producao),
      0
    );

  document.getElementById(
    "unitTotal"
  ).innerHTML = moeda(total);

}

function renderPodium(dados){

  const primeiro = dados[0];
  const segundo = dados[1];
  const terceiro = dados[2];

  document.getElementById(
    "firstPlace"
  ).innerHTML = `
    <img src="${primeiro.foto}" />
    <div class="podium-base">
      <div class="medal medal-gold">1º</div>
      <p>${nomeCurto(primeiro.consultor)}</p>
      <h3>${moeda(primeiro.producao)}</h3>
    </div>
  `;

  document.getElementById(
    "secondPlace"
  ).innerHTML = `
    <img src="${segundo.foto || ''}" />
    <div class="podium-base">
      <div class="medal medal-silver">2º</div>
      <p>${nomeCurto(segundo.consultor)}</p>
      <h3>${moeda(segundo.producao)}</h3>
    </div>
  `;

  document.getElementById(
    "thirdPlace"
  ).innerHTML = `
    <img src="${terceiro.foto}" />
    <div class="podium-base">
      <div class="medal medal-bronze">3º</div>
      <p>${nomeCurto(terceiro.consultor)}</p>
      <h3>${moeda(terceiro.producao)}</h3>
    </div>
  `;

}

function renderTabela(dados){

  const tabela =
    document.getElementById(
      "rankingTable"
    );

  tabela.innerHTML = "";

  dados.forEach(item=>{

    tabela.innerHTML += `
      <tr>
        <td>${item.posicao}</td>
        <td>${item.consultor.toUpperCase()}</td>
        <td>${moeda(item.producao)}</td>
      </tr>
    `;

  });

}

carregarRanking();

/* Atualização a cada 30 segundos */

setInterval(
  carregarRanking,
  30000
);
