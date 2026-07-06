/*
==========================================================
PetSamas
Arquivo: admin.js

Responsável por:

✔ Permitir acesso apenas ao administrador
✔ Listar todos os pets
✔ Liberar QR Code
✔ Bloquear QR Code
==========================================================
*/

// ======================================================
// ADMINISTRADOR
// ======================================================

const EMAIL_ADMIN = "nogueira100988@outlook.com";


// ======================================================
// ELEMENTOS
// ======================================================

const listaPets = document.getElementById("listaPets");


// ======================================================
// VERIFICAR ADMINISTRADOR
// ======================================================

async function verificarAdministrador() {

    const { data } = await banco.auth.getUser();

    const user = data.user;

    if (!user) {

        window.location.href = "login.html";

        return false;

    }

    if (

        !user.email ||

        user.email.toLowerCase() !== EMAIL_ADMIN.toLowerCase()

    ) {

        alert("Acesso restrito ao administrador.");

        window.location.href = "index.html";

        return false;

    }

    return true;

}


// ======================================================
// CARREGAR PETS
// ======================================================

async function carregarPets() {

    const { data: pets, error } = await banco
        .from("pets")
        .select("*")
        .order("id", { ascending: false });

    if (error) {

        listaPets.innerHTML = "<p>Erro ao carregar os pets.</p>";

        return;

    }

    if (!pets || pets.length === 0) {

        listaPets.innerHTML = "<p>Nenhum pet cadastrado.</p>";

        return;

    }

    listaPets.innerHTML = "";

    pets.forEach(function (pet) {

        listaPets.innerHTML += `

            <div class="card-pet">

                <h2>🐶 ${pet.nome_pet}</h2>

                <p><strong>👤 Tutor:</strong> ${pet.nome_tutor}</p>

                <p><strong>📍 Cidade:</strong> ${pet.cidade}</p>

                <p><strong>📞 Telefone:</strong> ${pet.telefone}</p>

                <p>

                    <strong>Status:</strong>

                    ${
                        pet.qr_liberado

                        ? "🟢 QR LIBERADO"

                        : "🔴 QR BLOQUEADO"
                    }

                </p>

                ${
                    pet.qr_liberado

                    ?

                    `<button onclick="bloquearQR(${pet.id})">

                        🔒 Bloquear QR

                    </button>`

                    :

                    `<button onclick="liberarQR(${pet.id})">

                        ✅ Liberar QR

                    </button>`
                }

                <hr>

            </div>

        `;

    });

}


// ======================================================
// LIBERAR QR
// ======================================================

async function liberarQR(id) {

    if (!confirm("Deseja liberar este QR Code?")) return;

    const { error } = await banco
        .from("pets")
        .update({

            qr_liberado: true

        })
        .eq("id", id);

    if (error) {

        alert("Erro ao liberar o QR Code.");

        return;

    }

    carregarPets();

}


// ======================================================
// BLOQUEAR QR
// ======================================================

async function bloquearQR(id) {

    if (!confirm("Deseja bloquear este QR Code?")) return;

    const { error } = await banco
        .from("pets")
        .update({

            qr_liberado: false

        })
        .eq("id", id);

    if (error) {

        alert("Erro ao bloquear o QR Code.");

        return;

    }

    carregarPets();

}


// ======================================================
// INICIALIZAÇÃO
// ======================================================

(async function () {

    const permitido = await verificarAdministrador();

    if (!permitido) return;

    await carregarPets();

})();