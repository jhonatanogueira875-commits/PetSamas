/*
==========================================================
PetSamas
Arquivo: meus-pets.js

Responsável por:

✔ Ler todos os pets cadastrados
✔ Criar um card para cada pet
✔ Mostrar os botões de ação
==========================================================
*/

// Busca todos os pets
const pets = JSON.parse(localStorage.getItem("pets")) || [];

const listaPets = document.getElementById("listaPets");

// Nenhum pet cadastrado
if (pets.length === 0) {

    listaPets.innerHTML = "<p>Nenhum pet cadastrado.</p>";

} else {

    pets.forEach(pet => {

        listaPets.innerHTML += `
            <div class="card-pet">

                <h2>🐶 ${pet.nomePet}</h2>

                <p><strong>Tutor:</strong> ${pet.nomeTutor}</p>

                <p><strong>Cidade:</strong> ${pet.cidade}</p>

                <br>

                <a href="pet.html?id=${pet.id}">
                    <button>👁 Ver Perfil</button>
                </a>

                <a href="qr-code.html?id=${pet.id}">
                    <button>📱 QR Code</button>
                </a>

                <button onclick="editarPet('${pet.id}')">
                    ✏️ Editar
                </button>

                <button onclick="excluirPet('${pet.id}')">
                    🗑 Excluir
                </button>

                <hr>

            </div>
        `;

    });

}

// Editar
function editarPet(id) {

    alert("Esta função será implementada em uma próxima Sprint.");

}

// Excluir
function excluirPet(id) {

    const confirmar = confirm("Deseja realmente excluir este pet?");

    if (!confirmar) return;

    const novaLista = pets.filter(pet => pet.id != id);

    localStorage.setItem("pets", JSON.stringify(novaLista));

    location.reload();

}