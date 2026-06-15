const API = "https://script.google.com/macros/s/AKfycbzKzm7xjNdPLjCfKLro39FCy6S1f9UEmR-t2sXFPdlo4GWysUawT1VtF7ahQfjUytVl/exec";

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
