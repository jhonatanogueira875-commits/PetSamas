/*
==========================================================
PetSamas
Arquivo: pet.js

Responsável por:

✔ Ler o ID da URL
✔ Procurar o pet correspondente
✔ Exibir as informações
✔ Exibir a foto do pet
✔ Criar o link do WhatsApp
==========================================================
*/


// ======================================================
// Lê os parâmetros da URL
// ======================================================

const parametros = new URLSearchParams(window.location.search);

const idPet = parametros.get("id");


// ======================================================
// Lê todos os pets cadastrados
// ======================================================

const pets = JSON.parse(localStorage.getItem("pets")) || [];


// ======================================================
// Procura o pet pelo ID
// ======================================================

const pet = pets.find(function(item){

    return item.id == idPet;

});


// ======================================================
// Caso não encontre
// ======================================================

if(!pet){

    alert("Pet não encontrado.");

    window.location.href = "index.html";

}


// ======================================================
// Foto do pet
// ======================================================

document.getElementById("foto1").src =

    pet.foto && pet.foto !== ""

    ? pet.foto

    : "assets/images/logo.png";


// ======================================================
// Preenche a página
// ======================================================

document.getElementById("nomePet").textContent = pet.nomePet;

document.getElementById("nomeTutor").textContent = pet.nomeTutor;

document.getElementById("cidadePet").textContent = pet.cidade;


// ======================================================
// Link do WhatsApp
// ======================================================

const mensagem = `Olá! Encontrei o pet ${pet.nomePet}.`;

document.getElementById("linkWhatsapp").href =
`https://wa.me/55${pet.telefone}?text=${encodeURIComponent(mensagem)}`;