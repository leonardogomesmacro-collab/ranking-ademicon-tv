const API = "https://script.google.com/macros/s/AKfycbwaalJAsUK8H6pVkXTc6mctclYW97_z73xW9ge6GkQvYz_IMv5X3jMEG6ECqEzZGfes/exec";

function moeda(valor){
  return Number(valor).toLocaleString("pt-BR",{
    style:"currency",
    currency:"BRL"
  });
}

async function carregarRanking(){

  try{

    const response = await fetch(API + "?nocache=" + Date.now());

    const dados = await response.json();

    console.clear();
    console.log("DADOS NOVOS:", dados);

    renderPodium(dados);
    renderTabela(dados);

  }catch(e){

    console.error(e);

  }

}

function renderPodium(dados){

  const primeiro = dados[0];
  const segundo = dados[1];
  const terceiro = dados[2];

  document.getElementById("firstPlace").innerHTML = `
    <img src="${primeiro.foto}" />
    <div class="podium-base">
      <h2>🥇</h2>
      <p>${primeiro.consultor}</p>
      <h3>${moeda(primeiro.producao)}</h3>
    </div>
  `;

  document.getElementById("secondPlace").innerHTML = `
    <img src="${segundo.foto || ''}" />
    <div class="podium-base">
      <h2>🥈</h2>
      <p>${segundo.consultor}</p>
      <h3>${moeda(segundo.producao)}</h3>
    </div>
  `;

  document.getElementById("thirdPlace").innerHTML = `
    <img src="${terceiro.foto}" />
    <div class="podium-base">
      <h2>🥉</h2>
      <p>${terceiro.consultor}</p>
      <h3>${moeda(terceiro.producao)}</h3>
    </div>
  `;

}

function renderTabela(dados){

  const tabela = document.getElementById("rankingTable");

  tabela.innerHTML = "";

  dados.forEach(item=>{

    tabela.innerHTML += `
      <tr>
        <td>${item.posicao}</td>
        <td>${item.consultor}</td>
        <td>${moeda(item.producao)}</td>
      </tr>
    `;

  });

}

carregarRanking();

setInterval(carregarRanking,10000);
