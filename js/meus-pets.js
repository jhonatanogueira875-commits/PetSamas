/*
==========================================================
PetSamas
Arquivo: meus-pets.js

Responsável por:

✔ Verificar login
✔ Buscar pets do Supabase
✔ Filtrar pets por usuário logado
✔ Criar cards
✔ Ver perfil
✔ QR Code
✔ Editar
✔ Excluir
✔ Backup dos pets
==========================================================
*/


// ======================================================
// PROTEÇÃO
// ======================================================

verificarLogin();


// ======================================================
// ELEMENTOS
// ======================================================

const listaPets = document.getElementById("listaPets");

const btnBackup = document.getElementById("btnBackup");

let pets = [];


// ======================================================
// PEGAR USUÁRIO LOGADO
// ======================================================

async function getUser() {

    const { data } = await banco.auth.getUser();

    return data.user;
}


// ======================================================
// CARREGAR PETS
// ======================================================

async function carregarPets() {

    const user = await getUser();

    if (!user) {

        window.location.href = "login.html";
        return;
    }

    const { data, error } = await banco
        .from("pets")
        .select("*")
        .eq("user_id", user.id);

    if (error) {

        listaPets.innerHTML = "<p>Erro ao carregar pets.</p>";
        return;
    }

    pets = data;

    renderizarPets();
}


// ======================================================
// RENDERIZAÇÃO
// ======================================================

function renderizarPets() {

    listaPets.innerHTML = "";

    if (pets.length === 0) {

        listaPets.innerHTML = "<p>Nenhum pet cadastrado.</p>";
        return;
    }

    pets.forEach(function (pet) {

        const foto = pet.foto && pet.foto !== ""
            ? pet.foto
            : "assets/images/logo.png";

        listaPets.innerHTML += `

            <div class="card-pet">

                <img src="${foto}" class="foto-card" alt="${pet.nome_pet}">

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

    const confirmar = confirm("Deseja realmente excluir este pet?");

    if (!confirmar) return;

    const { error } = await banco
        .from("pets")
        .delete()
        .eq("id", id);

    if (error) {

        alert("Erro ao excluir pet.");
        return;
    }

    carregarPets();
}


// ======================================================
// BACKUP
// ======================================================

btnBackup.addEventListener("click", function () {

    if (pets.length === 0) {

        alert("Nenhum pet cadastrado para fazer backup.");
        return;

    }

    const dados = JSON.stringify(pets, null, 4);

    const blob = new Blob([dados], {

        type: "application/json"

    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    const dataAtual = new Date().toISOString().slice(0, 10);

    link.href = url;

    link.download = `backup-petsamas-${dataAtual}.json`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

});


// ======================================================
// INICIALIZAÇÃO
// ======================================================

carregarPets();