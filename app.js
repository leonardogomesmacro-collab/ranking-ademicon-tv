const API = "https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnSS25FN1X-8TacEC-uufmvExEJalfrykTVr0lTS6UUhqzkM_kfSKBufhvx-reF6J92gJY06sLtBIYyP8DfeYyhhuA0kHIGIVkxcABxV_z1XU9W40PJmG9Jpz7ypArvB472GfiyT8ghM2Ubff9k3YmqwK0tWCAwU0UA1GNKoD8shozrP5p0pJR6XeeFDekiiZXRy8bNp6DN4OEpxjG9c8My1J18QjkHters3UdkgCjUqecgulf5ysEXQuZAHI_ZSjSbZKRS9vyiTBXboymNBw2Dks6yyuw&lib=MgTdPYGUPrZnH6zMWb77KTExsl7XT8uTg";

function moeda(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

async function carregarRanking() {

  try {

    const response = await fetch(API + "?t=" + Date.now());

    const dados = await response.json();

    console.log("API:", dados);

    renderPodium(dados);
    renderTabela(dados);

  } catch (erro) {

    console.error("Erro:", erro);

  }

}

function renderPodium(dados) {

  if (!dados || dados.length < 3) return;

  const primeiro = dados[0];
  const segundo = dados[1];
  const terceiro = dados[2];

  document.getElementById("firstPlace").innerHTML = `
    <img src="${primeiro.foto}">
    <div class="podium-base">
      <h2>🥇</h2>
      <p>${primeiro.consultor}</p>
      <h3>${moeda(primeiro.producao)}</h3>
    </div>
  `;

  document.getElementById("secondPlace").innerHTML = `
    <img src="${segundo.foto || ''}">
    <div class="podium-base">
      <h2>🥈</h2>
      <p>${segundo.consultor}</p>
      <h3>${moeda(segundo.producao)}</h3>
    </div>
  `;

  document.getElementById("thirdPlace").innerHTML = `
    <img src="${terceiro.foto}">
    <div class="podium-base">
      <h2>🥉</h2>
      <p>${terceiro.consultor}</p>
      <h3>${moeda(terceiro.producao)}</h3>
    </div>
  `;

}

function renderTabela(dados) {

  const tabela = document.getElementById("rankingTable");

  tabela.innerHTML = "";

  dados.forEach(item => {

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

setInterval(carregarRanking, 10000);
