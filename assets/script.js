//Requisição e comparação do nome de usuário
const userName = prompt("Diga-me seu lindo nome :)");
if(userName === ""){
    window.location.reload();
    alert("Por favor, digite um nome válido");
}

let dados = {name: userName};
const requisicao = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", dados);
requisicao.catch(envioErro);

function envioErro(){
    window.location.reload();
    alert("Este nome já está sendo utilizado! Por favor, escolha outro.")
}

//Manutençao de conexão
function manterConexao(){
    const permanencia = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", dados);
}

setInterval(manterConexao, 5000);

let todasMensagens = [];
function aparecerBarra() {
    const barra = document.querySelector(".side-bar");
    barra.classList.remove("hidden");
}

function esconderBarra() {
    const barra = document.querySelector(".side-bar");
    barra.classList.add("hidden");
}

function intervalo(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promise.then(lerMensagens);

    function colocarMensagemNaTela(mensagem) {
        //console.log(mensagem);
        const pagina = document.querySelector("main");
        let comparador = 0;
        //let classeScroll = 0;
        //classeScroll++;
        
        for(let j = 0; j < todasMensagens.length; j++){
            if(mensagem.time === todasMensagens[j].time && mensagem.text === todasMensagens[j].text && mensagem.type === todasMensagens[j].type && mensagem.from === todasMensagens[j].from && mensagem.to === todasMensagens[j].to){
                comparador++;
            }
        }

        if(comparador == 0){
            if(mensagem.type === 'status'){
                pagina.innerHTML += `
                <article class="status article" data-identifier="message">
                    <time>[${mensagem.time}]</time>
                    <p>${mensagem.from} ${mensagem.text}</p>
                </article>
                `;
                window.scrollTo(0,document.body.scrollHeight);
            }

            else if(mensagem.type === 'message'){
                pagina.innerHTML += `
                <article class="message article" data-identifier="message">
                    <time>[${mensagem.time}]</time>
                    <p>${mensagem.from} para ${mensagem.to}: ${mensagem.text}</p>
                </article>
                `;
                window.scrollTo(0,document.body.scrollHeight);
            }

            else if(mensagem.type === 'private_message' && (mensagem.to === userName || mensagem.to === "Todos" || mensagem.to === "todos")){
                pagina.innerHTML += `
                <article class="private_message article" data-identifier="message">
                    <time>[${mensagem.time}]</time>
                    <p>${mensagem.from} para ${mensagem.to}: ${mensagem.text}</p>
                </article>
                `;
                window.scrollTo(0,document.body.scrollHeight);
            }
        }
        comparador = 0;
    }

    function lerMensagens(resposta){
        resposta.data.forEach(colocarMensagemNaTela);
        for(let i = 0; i<resposta.data.length; i++){
            todasMensagens.push(resposta.data[i]);
        }
    }
}

setInterval(intervalo, 3000);