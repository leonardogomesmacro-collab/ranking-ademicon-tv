const API =
"https://script.google.com/macros/s/AKfycbzKzm7xjNdPLjCfKLro39FCy6S1f9UEmR-t2sXFPdlo4GWysUawT1VtF7ahQfjUytVl/exec";

function moeda(valor){

return valor.toLocaleString(
'pt-BR',
{
style:'currency',
currency:'BRL'
}
);

}

async function carregarRanking(){

const response = await fetch(API);

const dados = await response.json();

renderPodium(dados);

renderTabela(dados);

}

function renderPodium(dados){

  console.log(dados);
  
const primeiro = dados[0];
const segundo = dados[1];
const terceiro = dados[2];

document.getElementById("firstPlace").innerHTML = `
<img src="${primeiro.foto || 'https://via.placeholder.com/180'}">
<div class="podium-base">
<h2>🥇</h2>
<p>${primeiro.consultor}</p>
<h3>${moeda(primeiro.producao)}</h3>
</div>
`;

document.getElementById("secondPlace").innerHTML = `
<img src="${segundo.foto || 'https://via.placeholder.com/180'}">
<div class="podium-base">
<h2>🥈</h2>
<p>${segundo.consultor}</p>
<h3>${moeda(segundo.producao)}</h3>
</div>
`;

document.getElementById("thirdPlace").innerHTML = `
<img src="${terceiro.foto || 'https://via.placeholder.com/180'}">
<div class="podium-base">
<h2>🥉</h2>
<p>${terceiro.consultor}</p>
<h3>${moeda(terceiro.producao)}</h3>
</div>
`;

}

function renderTabela(dados){

const tabela =
document.getElementById("rankingTable");

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

setInterval(
carregarRanking,
10000
);
