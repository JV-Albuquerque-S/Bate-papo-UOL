//Requisição e comparação do nome de usuário
const userName = prompt("Diga-me seu lindo nome :)");
if(userName === "" || userName.length > 15){
    window.location.reload();
    alert("Por favor, digite um nome válido (Entre 1 e 15 caracteres)");
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

//Leitura, filtragem e escritura das mensagens
let todasMensagens = [];

function intervalo(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promise.then(lerMensagens);

    function colocarMensagemNaTela(mensagem) {
        const pagina = document.querySelector("main");
        let comparador = 0;
        
        //Filtragem de mensagens já escritas na página 
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

            else if(mensagem.type === 'private_message' && (mensagem.from === userName || mensagem.to === userName || mensagem.to === "Todos" || mensagem.to === "todos")){
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

//Envio de mensagens
function enviarMensagem(){
    const mensagem = document.querySelector('input').value;
    const mensagemPadronizada = {
        from: userName,
        to: "Todos",
        text: mensagem,
        type: "message"
    }
    const envio = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", mensagemPadronizada);
    envio.then(intervalo());
    document.querySelector("input").value = "";
}

let message_area = document.querySelector("#message")

message_area.addEventListener("keypress", (e)=>{
    if(e.key === "Enter"){
        enviarMensagem()
    }
})

//JS da barra lateral
function aparecerBarra() {
    const barra = document.querySelector(".side-bar");
    barra.classList.remove("hidden");
}

function esconderBarra() {
    const barra = document.querySelector(".side-bar");
    barra.classList.add("hidden");
}