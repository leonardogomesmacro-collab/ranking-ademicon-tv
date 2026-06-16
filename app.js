const API = "https://script.google.com/macros/s/AKfycbwaalJAsUK8H6pVkXTc6mctclYW97_z73xW9ge6GkQvYz_IMv5X3jMEG6ECqEzZGfes/exec";

function moeda(valor){
  return Number(valor).toLocaleString("pt-BR",{
    style:"currency",
    currency:"BRL"
  });
}

/* =====================================
   NOME CURTO PARA O PÓDIO
===================================== */

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

/* =====================================
   CARREGAR DADOS
===================================== */

async function carregarRanking(){

  try{

    const response = await fetch(
      API + "?nocache=" + Date.now()
    );

    const dados = await response.json();

    console.clear();
    console.log("DADOS NOVOS:", dados);

    renderPodium(dados);
    renderTabela(dados);

  }catch(e){

    console.error("ERRO:", e);

  }

}

/* =====================================
   PÓDIO
===================================== */

function renderPodium(dados){

  if(!dados || dados.length < 3) return;

  const primeiro = dados[0];
  const segundo = dados[1];
  const terceiro = dados[2];

  document.getElementById("firstPlace").innerHTML = `
    <img src="${primeiro.foto}" alt="">
    <div class="podium-base">
      <div class="medal medal-gold">1º</div>
      <p>${nomeCurto(primeiro.consultor)}</p>
      <h3>${moeda(primeiro.producao)}</h3>
    </div>
  `;

  document.getElementById("secondPlace").innerHTML = `
    <img src="${segundo.foto || ''}" alt="">
    <div class="podium-base">
      <div class="medal medal-silver">2º</div>
      <p>${nomeCurto(segundo.consultor)}</p>
      <h3>${moeda(segundo.producao)}</h3>
    </div>
  `;

  document.getElementById("thirdPlace").innerHTML = `
    <img src="${terceiro.foto}" alt="">
    <div class="podium-base">
      <div class="medal medal-bronze">3º</div>
      <p>${nomeCurto(terceiro.consultor)}</p>
      <h3>${moeda(terceiro.producao)}</h3>
    </div>
  `;

}

/* =====================================
   TABELA TOP 10
===================================== */

function renderTabela(dados){

  const tabela =
    document.getElementById("rankingTable");

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

/* =====================================
   INICIALIZAÇÃO
===================================== */

carregarRanking();

/* Atualiza a cada 10 segundos */
setInterval(carregarRanking,10000);
