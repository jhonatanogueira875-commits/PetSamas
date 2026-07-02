/*
==========================================================
PetSamas
Arquivo: pet.js

Responsável por:

✔ Ler o pet salvo no localStorage
✔ Mostrar as informações na página
✔ Criar o link do WhatsApp
==========================================================
*/


// ======================================================
// Lê o último pet salvo
// ======================================================

const pet = JSON.parse(localStorage.getItem("petAtual"));


// ======================================================
// Verifica se existe cadastro
// ======================================================

if (!pet) {

    alert("Nenhum pet foi cadastrado.");

    window.location.href = "cadastro.html";

}


// ======================================================
// Preenche a página
// ======================================================

document.getElementById("nomePet").textContent = pet.nomePet;

document.getElementById("nomeTutor").textContent = pet.nomeTutor;

document.getElementById("cidadePet").textContent = pet.cidade;


// ======================================================
// Cria o link do WhatsApp
// ======================================================

const mensagem = `Olá! Encontrei o pet ${pet.nomePet}.`;

document.getElementById("linkWhatsapp").href =
`https://wa.me/55${pet.telefone}?text=${encodeURIComponent(mensagem)}`;