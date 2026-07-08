/*
==========================================================
PetSamas
Arquivo: meus-pets.js
==========================================================
*/

verificarLogin();

const EMAIL_ADMIN = "nogueira100988@outlook.com";

const listaPets = document.getElementById("listaPets");
const adminArea = document.getElementById("adminArea");
const botaoNovoPet = document.getElementById("botaoNovoPet");

let pets = [];

// ======================================================
// QR PENDENTE DE ATIVAÇÃO
// ======================================================

const params = new URLSearchParams(window.location.search);
let qrPendente = params.get("codigo") || sessionStorage.getItem("codigoQR");

if (params.get("codigo")) {
    sessionStorage.setItem("codigoQR", params.get("codigo"));
}

console.log("QR PENDENTE DETECTADO:", qrPendente);

// ======================================================
// PEGAR USUÁRIO LOGADO
// ======================================================

async function getUser() {
    const { data } = await banco.auth.getUser();
    return data.user;
}

async function verificarAdministrador() {
    const user = await getUser();
    if (!user) return false;
    if (user.email && user.email.toLowerCase() === EMAIL_ADMIN.toLowerCase()) {
        window.location.href = "admin.html";
        return true;
    }
    return false;
}

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

function renderizarPets() {
    listaPets.innerHTML = "";
    if (pets.length === 0) {
        if (botaoNovoPet) botaoNovoPet.style.display = "none";
        listaPets.innerHTML = `
            <p>Você ainda não possui nenhum pet cadastrado.</p>
            <br>
            <a href="cadastro.html"><button>➕ Cadastrar meu primeiro pet</button></a>
        `;
        return;
    }

    if (botaoNovoPet) botaoNovoPet.style.display = "inline-block";

    pets.forEach(function (pet) {
        const foto = pet.foto && pet.foto !== "" ? pet.foto : "assets/images/logo.jpg";
        
        // ADIÇÃO PARA DIAGNÓSTICO
        console.log("PET COMPLETO:", pet);
        
        let botaoQRCode = qrPendente ? 
            `<button onclick="vincularQRCode('${pet.id}')">🔗 Vincular este QR Code</button>` : 
            `<a href="qr-code.html?id=${pet.id}"><button>📱 QR Code</button></a>`;

        listaPets.innerHTML += `
            <div class="card-pet">
                <img src="${foto}" class="foto-card" alt="${pet.nome_pet}">
                <h2>🐶 ${pet.nome_pet}</h2>
                <p><strong>👤 Tutor:</strong> ${pet.nome_tutor}</p>
                <p><strong>📍 Cidade:</strong> ${pet.cidade}</p>
                <br>
                <a href="pet.html?id=${pet.id}"><button>👁 Ver Perfil</button></a>
                ${botaoQRCode}
                <button onclick="editarPet(${pet.id})">✏️ Editar</button>
                <button onclick="excluirPet(${pet.id})">🗑 Excluir</button>
                <hr>
            </div>
        `;
    });
}

function editarPet(id) { window.location.href = `cadastro.html?id=${id}`; }

async function excluirPet(id) {
    const confirmar = confirm("Deseja realmente excluir este pet?");
    if (!confirmar) return;
    const { error } = await banco.from("pets").delete().eq("id", id);
    if (error) { alert("Erro ao excluir o pet."); return; }
    carregarPets();
}

// ======================================================
// VINCULAR QR CODE (DIAGNÓSTICO COMPLETO)
// ======================================================

async function vincularQRCode(idPet) {
    if (!qrPendente) {
        alert("QR Code não informado.");
        return;
    }

    const confirmar = confirm("Deseja vincular este QR Code a este pet?");
    if (!confirmar) return;

    const { data, error } = await banco
        .from("qrcodes")
        .update({
            status: "ativado",
            pet_id: idPet,
            activated_at: new Date().toISOString()
        })
        .eq("codigo", qrPendente)
        .select();

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
        alert(error.message);
        return;
    }

    alert("QR Code ativado com sucesso!");
    window.location.href = `qr-code.html?id=${idPet}`;
}

(async function () {
    const admin = await verificarAdministrador();
    if (admin) return;
    await carregarPets();
})();