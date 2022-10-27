let nomeUsuario;
let isPrivate = false;

//setupChatUol();
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
    CarregarMensagens();
    setInterval(CarregarMensagens, 3000)
    BotaoEnter();
    ListaParticipantesPedido();
    //setInterval(ListaParticipantesPedido(), 10000); não consegui implementar
    ultimocontatoSelecionado = document.querySelector(".Sidebar .Contatos .check");
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
    if(isPrivate){
        
        const mensagemObject ={
            from: nomeUsuario,
            to: document.querySelector(".Sidebar .Contatos .isChecked").getElementsByTagName("p")[0].innerHTML,
            text: document.querySelector(".BotaoMandarMensagem").value,
            type: "private_message"}
        mandarMensagemServidor(mensagemObject)
    }
    else{
        const mensagemObject ={
            from: nomeUsuario,
            to: "Todos",
            text: document.querySelector(".BotaoMandarMensagem").value,
            type: "message"}
        mandarMensagemServidor(mensagemObject)
    }
}

function CarregarMensagens(){
    axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    .then(MensagensServidorRecebidas)
    .catch(MensagensServidorError);
}

function mandarMensagemServidor(mensagemObject){
    axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagemObject)
    .then(CarregarMensagens)
    .catch(RecarregarPagina);
    document.querySelector(".BotaoMandarMensagem").value = "";
    CarregarMensagens();
}
    
function MensagensServidorRecebidas(response){
    const batepapo = document.querySelector(".Batepapo");
    batepapo.innerHTML = "";
    for(let i = 80; i < response.data.length; i++){
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
        else if(response.data[i].type == "private_message" && response.data[i].to == nomeUsuario || response.data[i].from == nomeUsuario){
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
function ToggleSidebar(){
    document.querySelector(".Sidebar").classList.toggle("DESAPARECA");
}
function ListaParticipantesPedido(){
    axios.get("https://mock-api.driven.com.br/api/v6/uol/participants")
    .then(CarregarListaParticipantes)
    .catch();
}
function CarregarListaParticipantes(response){
    const listaContatos = document.querySelector(" .Sidebar .Contatos");
    for(let i = 0; i < 10; i++){
        listaContatos.innerHTML += `<div data-identifier="participant" onclick="CheckContact(this)" class="Contato">
        <ion-icon name="people"></ion-icon>
        <p>${response.data[i].name}</p>
        <div class="check">
            <ion-icon name="checkmark-outline"></ion-icon>
        </div>
    </div>`
    }
}

function CheckContact(element){
    const ultimocontatoSelecionado = document.querySelector(".Sidebar .Contatos .isChecked")
    ultimocontatoSelecionado.classList.remove("isChecked");
    element.classList.add("isChecked");
}
function CheckVisibility(element){
    const ultimocontatoSelecionado = document.querySelector(".Sidebar .Visibilidade .isChecked")
    ultimocontatoSelecionado.classList.remove("isChecked");
    element.classList.add("isChecked");
}
function PrivateMessage(bool){
    isPrivate = bool;
}