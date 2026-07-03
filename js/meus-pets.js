/*
==========================================================
PetSamas
Arquivo: meus-pets.js

Responsável por:

✔ Ler todos os pets do Supabase
✔ Mostrar foto do pet
✔ Criar cards
✔ Ver Perfil
✔ QR Code
✔ Editar
✔ Excluir
==========================================================
*/


// ======================================================
// ELEMENTO DA PÁGINA
// ======================================================

const listaPets = document.getElementById("listaPets");


// ======================================================
// CARREGA TODOS OS PETS
// ======================================================

async function carregarPets() {

    listaPets.innerHTML = "<p>Carregando...</p>";

    const { data, error } = await banco

        .from("pets")

        .select("*")

        .order("id", { ascending: false });


    if (error) {

        console.error(error);

        listaPets.innerHTML = "<p>Erro ao carregar os pets.</p>";

        return;

    }


    if (data.length === 0) {

        listaPets.innerHTML = "<p>Nenhum pet cadastrado.</p>";

        return;

    }


    listaPets.innerHTML = "";


    data.forEach(function (pet) {

        const foto = pet.foto && pet.foto !== ""

            ? pet.foto

            : "assets/images/logo.png";


        listaPets.innerHTML += `

            <div class="card-pet">

                <img
                    src="${foto}"
                    alt="${pet.nome_pet}"
                    class="foto-card">

                <h2>🐶 ${pet.nome_pet}</h2>

                <p><strong>👤 Tutor:</strong> ${pet.nome_tutor}</p>

                <p><strong>📍 Cidade:</strong> ${pet.cidade}</p>

                <br>

                <a href="pet.html?id=${pet.id}">
                    <button>👁 Ver Perfil</button>
                </a>

                <a href="qr-code.html?id=${pet.id}">
                    <button>📱 QR Code</button>
                </a>

                <button onclick="editarPet(${pet.id})">
                    ✏️ Editar
                </button>

                <button onclick="excluirPet(${pet.id})">
                    🗑 Excluir
                </button>

                <hr>

            </div>

        `;

    });

}


// ======================================================
// EDITAR
// ======================================================

function editarPet(id) {

    window.location.href = `cadastro.html?id=${id}`;

}


// ======================================================
// EXCLUIR
// ======================================================

async function excluirPet(id) {

    const confirmar = confirm(

        "Deseja realmente excluir este pet?"

    );

    if (!confirmar) {

        return;

    }


    const { error } = await banco

        .from("pets")

        .delete()

        .eq("id", id);


    if (error) {

        console.error(error);

        alert("Erro ao excluir o pet.");

        return;

    }


    carregarPets();

}


// ======================================================
// INICIAR PÁGINA
// ======================================================

carregarPets();