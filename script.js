let nomeUsuario;
//setupChatUol();
CarregarMensagens();
function BotaoEntrarUol(){
    const objUsuario = {
        name: document.querySelector(".TelaInicial input").value
    }
    nomeUsuario = objUsuario.name;
    axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", objUsuario)
    .then(PodeEntrarChat)
    .catch(PerguntarNovamente)
}
/*
Só funciona sem o bonus
function setupChatUol(){
    const objUsuario = {
        name: prompt("Insira seu nome:")
    }
    nomeUsuario = objUsuario.name;
    axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", objUsuario)
    .then(PodeEntrarChat)
    .catch(PerguntarNovamente)
}*/

function PodeEntrarChat(response){
    document.querySelector(".TelaInicial").classList.add("DESAPARECA");
    setInterval(ManterUsuarioOnline, 5000);
    setInterval(CarregarMensagens, 3000)
    CarregarMensagens();
    BotaoEnter();
}

function PerguntarNovamente(error){
    alert("Esse usuário já existe, insira um outro nome");
    /*
    Só funciona sem bonus
    const objUsuario = {
        name: document.querySelector(".TelaInicial input").value
    }
    nomeUsuario = objUsuario.name;
    axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nomeUsuario)
    .then(PodeEntrarChat)
    .catch(PerguntarNovamente)*/
}

function ManterUsuarioOnline(){
    const objUsuario = {
        name: nomeUsuario
    }
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", objUsuario)
    .then()
    .catch();
}

function MandarMensagem(){ 
    const mensagemObject ={
        from: nomeUsuario,
	    to: "Todos",
	    text: document.querySelector(".BotaoMandarMensagem").value,
	    type: "message"}
    axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagemObject)
    .then(CarregarMensagens)
    .catch(RecarregarPagina);
    document.querySelector(".BotaoMandarMensagem").value = "";
}
function CarregarMensagens(){
    axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    .then(MensagensServidorRecebidas)
    .catch(MensagensServidorError);
}

function MensagensServidorRecebidas(response){
    const batepapo = document.querySelector(".Batepapo");
    for(let i = 70; i < response.data.length; i++){
        if(response.data[i].type == "message"){
            batepapo.innerHTML += `<div class="Mensagem message">
            <div class="HoraMensagem">
                (${response.data[i].time})
            </div>
            <div class="QuemEscreveuPraQuemMensagem">
                <span>${response.data[i].from}</span> para <span>Todos</span>: 
            </div>
            <div class="TextoMensagem">
             ${response.data[i].text}
            </div>
        </div>`
        }
        else if(response.data[i].type == "status"){
            batepapo.innerHTML += `<div class="Mensagem status">
            <div class="HoraMensagem">
                (${response.data[i].time})
            </div>
            <div class="QuemEscreveuPraQuemMensagem">
                <span>${response.data[i].from}</span>
            </div>
            <div class="TextoMensagem">
            ${response.data[i].text}
            </div>
        </div>`
        }
        else if(response.data[i].type == "private_message" && response.data[i].to == nomeUsuario){
            batepapo.innerHTML += `<div class="Mensagem private_message">
            <div class="HoraMensagem">
                (${response.data[i].time})
            </div>
            <div class="QuemEscreveuPraQuemMensagem">
                <span>${response.data[i].from}</span> para <span>${response.data[i].to}</span>:
            </div>
            <div class="TextoMensagem">
             ${response.data[i].text}
            </div>
        </div>`
        }
    }
    document.querySelector(".Batepapo").lastChild.scrollIntoView();
}

function RecarregarPagina(error){
    alert(error + "recarregando pagina");
    window.location.reload();
}
function MensagensServidorError(error){
    alert("Mensagens não puderam ser carregadas...");
}
function BotaoEnter(){
    let input = document.querySelector(".BotaoMandarMensagem");
    input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.querySelector(".BotaoEnter").click();
    }
    }
    );
}