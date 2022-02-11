function aparecerBarra() {
    const barra = document.querySelector(".side-bar");
    barra.classList.remove("hidden");
}

function esconderBarra() {
    const barra = document.querySelector(".side-bar");
    barra.classList.add("hidden");
}

const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
promise.then(printarData);

function printarData(resposta){
    console.log(resposta.data[74]);
}