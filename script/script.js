listaDeTarefas = [];
carregarLocalStorage();

function adicionarTarefa() {
    var lblTarefa = document.getElementById("lblTarefa");
    var tarefa = lblTarefa.value;
    var chkTarefa = false;

    if (tarefa) {
        if (adicionarTarefaDuplicada(tarefa)) {
            // adiciona no localstorage & na lista global (listaDeTarefas)
            adicionarNoLocalStorage(tarefa, chkTarefa);
            
            // adiciona um list-item no HTML
            adicionarNaPagina(tarefa, chkTarefa);
        }
        lblTarefa.value = ""; // limpa input p/ nova insercao
    } else {
        alert("Insira a tarefa a ser adicionada!"); // alerta p/ campo vazio
    }
}

function adicionarTarefaDuplicada(tarefa) {
    var resposta = true;
    for (var i = 0; i < listaDeTarefas.length; i++) { // busca duplicata da tarefa na lista
        if (tarefa === listaDeTarefas[ i ][0]) {
            resposta = confirm("A tarefa \"" + tarefa + "\" já existe na lista. " +
                                    "Deseja adicionar mesmo assim?");
            break; // retorna c/ opcao p/ nao inserir duplicata
        }
    }
    return resposta;
}

function adicionarNoLocalStorage(tarefa, chkTarefa) {
    listaDeTarefas.push( [tarefa, chkTarefa ]); // primeiro insere na lista global
    atualizarLocalStorage();                        // dps atualiza o localstorage
}

// carrega p/ lista global e HTML a lista salva no localstorage
function carregarLocalStorage() {
    if (localStorage.length > 0) {
        listaLocalStorage = JSON.parse(localStorage.getItem("Lista De Tarefas"));

        // busca e inclui apenas itens ñ excluidos anteriormente
        for (var i = 0; i < listaLocalStorage.length; i++) {
            if (listaLocalStorage[i] !== "") { // se item nao foi exluido antes
                var item = listaLocalStorage[i];
                
                // adiciona na lista global & na pag HTML
                listaDeTarefas.push( item );
                adicionarNaPagina( item[0], item[1] ); // 0 == tarefa, 1 == checkbox
            }
        }
        atualizarLocalStorage();
    }
}

function atualizarLocalStorage() {
    localStorage.setItem("Lista De Tarefas", JSON.stringify(listaDeTarefas));
}

function marcarTarefa(chkTarefa) { // marca/desmarca tarefa c/ base no estado atual do checkbox
    var label = document.getElementById( chkTarefa.id ).labels[0];
    var indiceNaLista = chkTarefa.id.split("_")[1]; // id = "tarefa_XX", pega só o nº (XX) após "_"

    listaDeTarefas[ indiceNaLista ][1] = chkTarefa.checked;

    if (chkTarefa.checked) {
        label.style.textDecoration = "line-through";
        chkTarefa.setAttribute("title", "Desmarcar Tarefa");
    } else {
        label.style.textDecoration = "";
        chkTarefa.setAttribute("title", "Marcar Tarefa");
    }

    atualizarLocalStorage();
}

function excluirTarefa(idButton) {
    var id = idButton.split("_")[1]; // id = "btn-excluir_XX", pega só o nº (XX) após "_"
    var tarefa = document.getElementById( "tarefa_" + id ).labels[0].textContent;

    var resposta = confirm("Tem certeza de que deseja excluir a tarefa:" +
                                    "\"" + tarefa + "\" ?");
    if (resposta === true) {
        document.getElementById("list-item_" + id).remove(); // remove o list-item da pag html
        removerDoLocalStorage(id);

        // se a pag html nao tiver mais itens, apaga a lista de tarefas e localstorage
        if (document.getElementById("ul-lista").hasChildNodes() === false) {
            listaDeTarefas = [];
            localStorage.clear();
        }
    }
}

function removerDoLocalStorage(idTarefa) {
    listaDeTarefas[ idTarefa ] = "";
    atualizarLocalStorage();
}

function editarTarefa(idButton) {
    var id = idButton.split("_")[1]; // id = "btn-editar_XX", pega só o nº (XX) após "_"
    var lblTarefa = document.getElementById( "tarefa_" + id ).labels[0];

    var resposta = prompt("Insira a nova descrição da tarefa:", lblTarefa.textContent);

    if (resposta !== null) {
        if (adicionarTarefaDuplicada(resposta)) {
            lblTarefa.textContent = resposta;

            listaDeTarefas[ id ][0] = resposta;
            atualizarLocalStorage();
        }
    }
}

function apagarTudo() {
    if (listaDeTarefas.length > 0) {
        var resposta = confirm("Tem certeza de que deseja apagar definitivamente " +
                        "todas as tarefas?\n(Obs: Essa ação não pode ser desfeita!)");
        
        if (resposta === true) {
            document.getElementById("ul-lista").innerHTML = "";
            listaDeTarefas = [];
            localStorage.clear();
        }
    } else {
        alert("Não há tarefas a serem apagadas.");
    }
}

function adicionarNaPagina(tarefa, chkTarefa) {
    var idTarefa = listaDeTarefas.length-1;
    
    var listItem = document.createElement("li");
    listItem.setAttribute("class", "list-item");
    listItem.setAttribute("id", "list-item_" + idTarefa);

    var checkbox = document.createElement("input");
    checkbox.setAttribute("class", "chkbx-tarefa");
    checkbox.setAttribute("id", "tarefa_" + idTarefa);
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("onclick", "marcarTarefa(this)");
    checkbox.checked = chkTarefa;
    
    var label = document.createElement("label");
    label.setAttribute("class", "lbl-tarefa");
    label.setAttribute("for", "tarefa_" + idTarefa);
    label.appendChild(document.createTextNode(tarefa));
    
    var btnEditar = document.createElement("button");
    btnEditar.setAttribute("class", "btn-tarefa btn-editar");
    btnEditar.setAttribute("id", "btn-editar_" + idTarefa);
    btnEditar.setAttribute("title", "Editar");
    btnEditar.setAttribute("onclick", "editarTarefa(this.id)");

    var btnExcluir = document.createElement("button");
    btnExcluir.setAttribute("class", "btn-tarefa btn-excluir")
    btnExcluir.setAttribute("id", "btn-excluir_" + idTarefa);
    btnExcluir.setAttribute("title", "Excluir");
    btnExcluir.setAttribute("onclick", "excluirTarefa(this.id)");
    
    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(btnEditar);
    listItem.appendChild(btnExcluir);

    document.getElementById("ul-lista").appendChild(listItem);
    marcarTarefa(checkbox); // marca/desmarca a tarefa na pag html & lista global
}
