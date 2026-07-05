/*
==========================================================
PetSamas
Arquivo: meus-pets.js

Responsável por:

✔ Verificar login
✔ Buscar pets do usuário
✔ Exibir cards
✔ Liberar QR Code após ativação
✔ Exibir Painel Administrativo para o administrador
==========================================================
*/

// ======================================================
// PROTEÇÃO
// ======================================================

verificarLogin();


// ======================================================
// ADMINISTRADOR
// ======================================================

const EMAIL_ADMIN = "nogueira100988@outlook.com";

// ======================================================
// ELEMENTOS
// ======================================================

const listaPets = document.getElementById("listaPets");

const adminArea = document.getElementById("adminArea");

let pets = [];


// ======================================================
// PEGAR USUÁRIO LOGADO
// ======================================================

async function getUser() {

    const { data } = await banco.auth.getUser();

    return data.user;

}


// ======================================================
// VERIFICAR ADMINISTRADOR
// ======================================================

async function verificarAdministrador() {

    const user = await getUser();

    if (!user) return;

    if (
        user.email &&
        user.email.toLowerCase() === EMAIL_ADMIN.toLowerCase()
    ) {

        adminArea.style.display = "block";

    }

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

        listaPets.innerHTML = "<p>Erro ao carregar os pets.</p>";

        return;

    }

    pets = data || [];

    renderizarPets();

}


// ======================================================
// RENDERIZAÇÃO
// ======================================================

function renderizarPets() {

    listaPets.innerHTML = "";

    if (pets.length === 0) {

        listaPets.innerHTML = `

            <p>Você ainda não possui nenhum pet cadastrado.</p>

            <br>

            <a href="cadastro.html">

                <button>

                    ➕ Cadastrar meu primeiro pet

                </button>

            </a>

        `;

        return;

    }

    pets.forEach(function (pet) {

        const foto = pet.foto && pet.foto !== ""

            ? pet.foto

            : "assets/images/logo.jpg";

        let botaoQRCode = "";

        if (pet.qr_liberado) {

            botaoQRCode = `

                <a href="qr-code.html?id=${pet.id}">

                    <button>

                        📱 QR Code

                    </button>

                </a>

            `;

        } else {

            const mensagem = encodeURIComponent(
`Olá!

Acabei de cadastrar meu pet no PetSamas e gostaria de ativar meu QR Code.

🐶 Pet: ${pet.nome_pet}

Obrigado!`
            );

            botaoQRCode = `

                <a href="https://wa.me/5542984097827?text=${mensagem}" target="_blank">

                    <button>

                        🟡 Ativar QR Code

                    </button>

                </a>

            `;

        }

        listaPets.innerHTML += `

            <div class="card-pet">

                <img
                    src="${foto}"
                    class="foto-card"
                    alt="${pet.nome_pet}">

                <h2>🐶 ${pet.nome_pet}</h2>

                <p><strong>👤 Tutor:</strong> ${pet.nome_tutor}</p>

                <p><strong>📍 Cidade:</strong> ${pet.cidade}</p>

                <br>

                <a href="pet.html?id=${pet.id}">

                    <button>

                        👁 Ver Perfil

                    </button>

                </a>

                ${botaoQRCode}

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

        alert("Erro ao excluir o pet.");

        return;

    }

    carregarPets();

}


// ======================================================
// INICIALIZAÇÃO
// ======================================================

(async function () {

    await verificarAdministrador();

    await carregarPets();

})();