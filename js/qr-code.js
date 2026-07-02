/*
==========================================================
PetSamas
Arquivo: qr-code.js

Responsável por:

✔ Ler o ID da URL
✔ Buscar o pet
✔ Mostrar o nome
✔ Gerar o QR Code
==========================================================
*/


// ======================================
// Lê o ID da URL
// ======================================

const parametros = new URLSearchParams(window.location.search);

const idPet = parametros.get("id");


// ======================================
// Lê os pets cadastrados
// ======================================

const pets = JSON.parse(localStorage.getItem("pets")) || [];


// ======================================
// Procura o pet
// ======================================

const pet = pets.find(item => item.id == idPet);


// ======================================
// Caso não exista
// ======================================

if(!pet){

    alert("Pet não encontrado.");

    window.location.href = "index.html";

}


// ======================================
// Mostra o nome
// ======================================

document.getElementById("nomePet").textContent = pet.nomePet;


// ======================================
// Link da página do pet
// ======================================

const linkPet =

window.location.origin +

"/pet.html?id=" +

pet.id;


// ======================================
// Gera QR Code
// ======================================

new QRCode(

    document.getElementById("qrcode"),

    {

        text: linkPet,

        width: 250,

        height: 250

    }

);