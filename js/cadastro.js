/*
==========================================================
PetSamas
Arquivo: cadastro.js

Responsável por:

✔ Novo cadastro
✔ Editar cadastro existente
✔ Salvar foto do pet
✔ Salvar no LocalStorage
==========================================================
*/


// ======================================================
// Seleciona o formulário
// ======================================================

const formulario = document.getElementById("formCadastro");

const campoFoto = document.getElementById("foto");


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
// Foto atual
// ======================================================

let fotoBase64 = "";


// ======================================================
// Converte imagem para Base64
// ======================================================

campoFoto.addEventListener("change", function () {

    const arquivo = campoFoto.files[0];

    if (!arquivo) {

        return;

    }

    const leitor = new FileReader();

    leitor.onload = function (evento) {

        fotoBase64 = evento.target.result;

    };

    leitor.readAsDataURL(arquivo);

});


// ======================================================
// Se estiver editando,
// preenche os campos automaticamente
// ======================================================

if (idEdicao) {

    const pet = pets.find(function (item) {

        return item.id == idEdicao;

    });

    if (pet) {

        document.getElementById("nomePet").value = pet.nomePet;

        document.getElementById("nomeTutor").value = pet.nomeTutor;

        document.getElementById("cidade").value = pet.cidade;

        document.getElementById("telefone").value = pet.telefone;

        fotoBase64 = pet.foto || "";

    }

}


// ======================================================
// Salvar formulário
// ======================================================

formulario.addEventListener("submit", function (event) {

    event.preventDefault();


    // ==============================================
    // EDITAR PET
    // ==============================================

    if (idEdicao) {

        const indice = pets.findIndex(function (item) {

            return item.id == idEdicao;

        });

        pets[indice].nomePet = document.getElementById("nomePet").value;

        pets[indice].nomeTutor = document.getElementById("nomeTutor").value;

        pets[indice].cidade = document.getElementById("cidade").value;

        pets[indice].telefone = document.getElementById("telefone").value;

        pets[indice].foto = fotoBase64;

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

        telefone: document.getElementById("telefone").value,

        foto: fotoBase64

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