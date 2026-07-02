/*
==========================================================
PetSamas
Arquivo: cadastro.js

Responsável por:

✔ Novo cadastro
✔ Editar cadastro existente
✔ Salvar no LocalStorage
✔ Criar ID automático
==========================================================
*/


// ======================================================
// Seleciona o formulário
// ======================================================

const formulario = document.getElementById("formCadastro");


// ======================================================
// Lê o ID da URL
// ======================================================

const parametros = new URLSearchParams(window.location.search);

const idEdicao = parametros.get("id");


// ======================================================
// Lê todos os pets
// ======================================================

let pets = JSON.parse(localStorage.getItem("pets")) || [];


// ======================================================
// Se estiver editando,
// preenche os campos automaticamente
// ======================================================

if(idEdicao){

    const pet = pets.find(function(item){

        return item.id == idEdicao;

    });

    if(pet){

        document.getElementById("nomePet").value = pet.nomePet;

        document.getElementById("nomeTutor").value = pet.nomeTutor;

        document.getElementById("cidade").value = pet.cidade;

        document.getElementById("telefone").value = pet.telefone;

    }

}


// ======================================================
// Salvar formulário
// ======================================================

formulario.addEventListener("submit", function(event){

    event.preventDefault();


    // ==============================================
    // EDITAR PET
    // ==============================================

    if(idEdicao){

        const indice = pets.findIndex(function(item){

            return item.id == idEdicao;

        });

        pets[indice].nomePet = document.getElementById("nomePet").value;

        pets[indice].nomeTutor = document.getElementById("nomeTutor").value;

        pets[indice].cidade = document.getElementById("cidade").value;

        pets[indice].telefone = document.getElementById("telefone").value;

        localStorage.setItem(

            "pets",

            JSON.stringify(pets)

        );

        window.location.href = "meus-pets.html";

        return;

    }


    // ==============================================
    // NOVO CADASTRO
    // ==============================================

    const id = Date.now();

    const novoPet = {

        id: id,

        nomePet: document.getElementById("nomePet").value,

        nomeTutor: document.getElementById("nomeTutor").value,

        cidade: document.getElementById("cidade").value,

        telefone: document.getElementById("telefone").value

    };

    pets.push(novoPet);

    localStorage.setItem(

        "pets",

        JSON.stringify(pets)

    );

    localStorage.setItem(

        "ultimoPet",

        id

    );

    window.location.href = "cadastro-sucesso.html";

});