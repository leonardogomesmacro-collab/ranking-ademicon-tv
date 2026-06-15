const API = "https://script.google.com/macros/s/AKfycbzKzm7xjNdPLjCfKLro39FCy6S1f9UEmR-t2sXFPdlo4GWysUawT1VtF7ahQfjUytVl/exec";

function moeda(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function fotoValida(url) {

  if (url === null || url === undefined) {
    return "";
  }

  // força virar string
  url = String(url);

  if (url.trim() === "") {
    return "";
  }

  return url;
}

async function carregarRanking() {

  try {

    const response = await fetch(API);
    const dados = await response.json();

    console.log("DADOS API:", dados);
    console.log("1º FOTO:", dados[0]?.foto);
    console.log("TIPO FOTO:", typeof dados[0]?.foto);

    renderPodium(dados);
    renderTabela(dados);

  } catch (erro) {

    console.error("Erro ao carregar ranking:", erro);

  }

}

function renderPodium(dados) {

  if (!dados || dados.length < 3) return;

  const primeiro = dados[0];
  const segundo = dados[1];
  const terceiro = dados[2];

  document.getElementById("firstPlace").innerHTML = `
    <img src="${fotoValida(primeiro.foto)}">
    <div class="podium-base">
      <h2>🥇</h2>
      <p>${primeiro.consultor}</p>
      <h3>${moeda(primeiro.producao)}</h3>
    </div>
  `;

  document.getElementById("secondPlace").innerHTML = `
    <img src="${fotoValida(segundo.foto)}">
    <div class="podium-base">
      <h2>🥈</h2>
      <p>${segundo.consultor}</p>
      <h3>${moeda(segundo.producao)}</h3>
    </div>
  `;

  document.getElementById("thirdPlace").innerHTML = `
    <img src="${fotoValida(terceiro.foto)}">
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
