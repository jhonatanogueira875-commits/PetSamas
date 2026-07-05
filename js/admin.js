/*
==========================================================
PetSamas
Arquivo: admin.js

Responsável por:

✔ Listar todos os pets
✔ Mostrar status do QR
✔ Liberar QR Code
==========================================================


*/// ======================================================
// ADMINISTRADOR
// ======================================================

const EMAIL_ADMIN = "jhonatanogueira875@gmail.com";

// ======================================================
// ELEMENTO
// ======================================================

const listaPets = document.getElementById("listaPets");

// ======================================================
// CARREGAR PETS
// ======================================================

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

    if (user.email !== EMAIL_ADMIN) {

        alert("Acesso restrito ao administrador.");

        window.location.href = "index.html";

        return false;

    }

    return true;

}
async function carregarPets() {

    const { data: pets, error } = await banco
        .from("pets")
        .select("*")
        .order("id", { ascending: false });

    if (error) {

        listaPets.innerHTML = "<p>Erro ao carregar os pets.</p>";
        return;

    }

    if (pets.length === 0) {

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
                    !pet.qr_liberado
                    ?

                    `<button onclick="liberarQR(${pet.id})">

                        ✅ Liberar QR

                    </button>`

                    :

                    `<button disabled>

                        ✔ Já Liberado

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

    const confirmar = confirm("Deseja liberar este QR Code?");

    if (!confirmar) return;

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

    alert("QR Code liberado com sucesso!");

    carregarPets();

}

// ======================================================
// INICIAR
// ======================================================

(async function () {

    const permitido = await verificarAdministrador();

    if (!permitido) return;

    carregarPets();

})();