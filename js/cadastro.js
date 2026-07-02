/*
==========================================================
PetSamas
Arquivo: cadastro.js

Responsável por:

✔ Ler os dados do formulário
✔ Salvar no navegador (localStorage)
✔ Redirecionar para a tela de sucesso
==========================================================
*/


// ======================================================
// Seleciona o formulário
// ======================================================

const formulario = document.getElementById("formCadastro");


// ======================================================
// Aguarda o clique no botão "Cadastrar"
// ======================================================

formulario.addEventListener("submit", function(event){

    // Impede o comportamento padrão do formulário

    event.preventDefault();


    // ==================================================
    // Captura os dados digitados
    // ==================================================

    const pet = {

        nomePet: document.getElementById("nomePet").value,

        nomeTutor: document.getElementById("nomeTutor").value,

        cidade: document.getElementById("cidade").value,

        telefone: document.getElementById("telefone").value

    };


    // ==================================================
    // Salva no navegador
    // ==================================================

    localStorage.setItem(

        "petAtual",

        JSON.stringify(pet)

    );


    // ==================================================
    // Vai para a tela de sucesso
    // ==================================================

    window.location.href = "cadastro-sucesso.html";

});