let nomeUsuario;
setupChatUol();
function setupChatUol(){
    const objUsuario = {
        name: prompt("Insira seu nome:")
    }
    nomeUsuario = objUsuario.name;
    axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", objUsuario)
    .then(PodeEntrarChat)
    .catch(PerguntarNovamente)
}

function PodeEntrarChat(response){
    setInterval(ManterUsuarioOnline, 5000);
    CarregarMensagens();
}

function PerguntarNovamente(error){
    const objUsuario = {
        name: prompt("Esse usuário já existe, insira um novo nome:")
    }
    nomeUsuario = objUsuario.name;
    axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nomeUsuario)
    .then(PodeEntrarChat)
    .catch(PerguntarNovamente)
}

function ManterUsuarioOnline(){
    const objUsuario = {
        name: nomeUsuario
    }
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", objUsuario)
    .then()
    .catch();
}
function meavisa(){
    alert("status sendo atualizado");
}
function CarregarMensagens(){
    axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    .then(MensagensServidorRecebidas)
    .catch(MensagensServidorError);
}

function MensagensServidorRecebidas(response){
    const batepapo = document.querySelector(".Batepapo");
    for(let i = 0; i < response.data.length; i++){
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
        else if(response.data[i].type == "private_message"){
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
        else {
            alert("não deu certo o type")
        }
    }
}

function MensagensServidorError(error){
    alert("Mensagens não puderam ser carregadas...");
}