/*
==========================================================
PetSamas
Arquivo: cadastro.js

Responsável por:

✔ Ler os dados do formulário
✔ Salvar vários pets no localStorage
✔ Criar um ID automático
✔ Redirecionar para a tela de sucesso
==========================================================
*/


// ======================================================
// Seleciona o formulário
// ======================================================

const formulario = document.getElementById("formCadastro");


// ======================================================
// Cadastro
// ======================================================

formulario.addEventListener("submit", function(event){

    event.preventDefault();


    // ==================================================
    // Lê os pets já cadastrados
    // ==================================================

    let pets = JSON.parse(localStorage.getItem("pets")) || [];


    // ==================================================
    // Cria um ID automático
    // ==================================================

    const id = Date.now();


    // ==================================================
    // Cria o novo pet
    // ==================================================

    const novoPet = {

        id: id,

        nomePet: document.getElementById("nomePet").value,

        nomeTutor: document.getElementById("nomeTutor").value,

        cidade: document.getElementById("cidade").value,

        telefone: document.getElementById("telefone").value

    };


    // ==================================================
    // Adiciona na lista
    // ==================================================

    pets.push(novoPet);


    // ==================================================
    // Salva novamente
    // ==================================================

    localStorage.setItem(

        "pets",

        JSON.stringify(pets)

    );


    // ==================================================
    // Guarda qual foi o último cadastro
    // (vamos usar na próxima Sprint)
    // ==================================================

    localStorage.setItem(

        "ultimoPet",

        id

    );


    // ==================================================
    // Tela de sucesso
    // ==================================================

    window.location.href = "cadastro-sucesso.html";

});