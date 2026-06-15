const API = "https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnSS25FN1X-8TacEC-uufmvExEJalfrykTVr0lTS6UUhqzkM_kfSKBufhvx-reF6J92gJY06sLtBIYyP8DfeYyhhuA0kHIGIVkxcABxV_z1XU9W40PJmG9Jpz7ypArvB472GfiyT8ghM2Ubff9k3YmqwK0tWCAwU0UA1GNKoD8shozrP5p0pJR6XeeFDekiiZXRy8bNp6DN4OEpxjG9c8My1J18QjkHters3UdkgCjUqecgulf5ysEXQuZAHI_ZSjSbZKRS9vyiTBXboymNBw2Dks6yyuw&lib=MgTdPYGUPrZnH6zMWb77KTExsl7XT8uTg";

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
