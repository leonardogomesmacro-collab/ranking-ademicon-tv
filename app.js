const API = "https://script.google.com/macros/s/AKfycbwaalJAsUK8H6pVkXTc6mctclYW97_z73xW9ge6GkQvYz_IMv5X3jMEG6ECqEzZGfes/exec";

async function carregarRanking() {

  try {

    const response = await fetch(API + "?t=" + Date.now());

    const dados = await response.json();

    console.clear();

    console.log("JSON COMPLETO RECEBIDO:");

    console.log(JSON.stringify(dados, null, 2));

  } catch (erro) {

    console.error("ERRO:", erro);

  }

}

carregarRanking();
