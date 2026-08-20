const API_URL = "https://script.google.com/macros/s/AKfycbwhrz4NYBkZhO11hxauYPyiEtAHMprAwh5yLff4Jx3rP4Fc5HRZ8X7suAtH-SMwVPvj_w/exec";

console.log("APP.JS CARREGADO");

async function testarAPI() {
    try {

        console.log("Chamando API...");

        const resposta = await fetch(API_URL);

        console.log("Status:", resposta.status);

        const dados = await resposta.json();

        console.log("DADOS RECEBIDOS:", dados);

        const status = document.getElementById("status");

        if (status) {
            status.textContent = "API conectada!";
        }

    } catch (erro) {

        console.error("ERRO:", erro);

        const status = document.getElementById("status");

        if (status) {
            status.textContent = "Erro na conexão";
        }
    }
}

testarAPI();
