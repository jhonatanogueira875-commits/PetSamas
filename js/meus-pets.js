/*
==========================================================
Arquivo: meus-pets.js
==========================================================
*/

verificarLogin();

const EMAIL_ADMIN = "nogueira100988@outlook.com";
const listaPets = document.getElementById("listaPets");
const botaoNovoPet = document.getElementById("botaoNovoPet");

let pets = [];

// Gerenciamento de QR pendente
const params = new URLSearchParams(window.location.search);
let qrPendente = params.get("codigo") || sessionStorage.getItem("codigoQR");

if (params.get("codigo")) {
    sessionStorage.setItem("codigoQR", params.get("codigo"));
}

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

    // 1. Busca os pets do usuário
    const { data: listaPetsBanco, error: errorPets } = await banco
        .from("pets")
        .select("*")
        .eq("user_id", user.id);

    if (errorPets) {
        console.error("Erro ao buscar pets:", errorPets);
        listaPets.innerHTML = "<p>Erro ao carregar os pets.</p>";
        return;
    }

    // 2. Busca todos os QRs
    const { data: listaQR, error: errorQR } = await banco
        .from("qrcodes")
        .select("*");

    if (errorQR) {
        console.error("Erro ao buscar QRs:", errorQR);
    }

    // 3. Vincula o QR ao Pet no front-end
    pets = (listaPetsBanco || []).map((pet) => {
        const qrEncontrado = (listaQR || []).find((qr) => {
            return String(qr.pet_id) === String(pet.id);
        });
        
        pet.qr = qrEncontrado;
        return pet;
    });

    renderizarPets();
}

function renderizarPets() {
    listaPets.innerHTML = "";
    
    if (!pets || pets.length === 0) {
        if (botaoNovoPet) botaoNovoPet.style.display = "none";
        listaPets.innerHTML = `
            <p>Você ainda não possui nenhum pet cadastrado.</p>
            <br>
            <a href="cadastro.html"><button>➕ Cadastrar meu primeiro pet</button></a>
        `;
        return;
    }

    if (botaoNovoPet) botaoNovoPet.style.display = "inline-block";

    pets.forEach((pet) => {
        const foto = pet.foto && pet.foto !== "" ? pet.foto : "assets/images/logo.jpg";
        let botaoQRCode = "";

        if (pet.qr) {
            botaoQRCode = `
                <a href="qr-code.html?id=${pet.id}">
                    <button>📱 Meu QR Code</button>
                </a>
            `;
        } else if (qrPendente) {
            botaoQRCode = `
                <button onclick="vincularQRCode('${pet.id}')">
                    🔗 Vincular este QR Code
                </button>
            `;
        } else {
            const mensagem = encodeURIComponent(`Olá! Gostaria de ativar um QR Code para o pet: 🐶 ${pet.nome_pet}`);
            botaoQRCode = `
                <a href="https://wa.me/5542984097827?text=${mensagem}" target="_blank">
                    <button>🟡 Solicitar QR Code</button>
                </a>
            `;
        }

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
    console.log(">>> NOVA FUNÇÃO EXCLUIR PET EXECUTANDO <<<");
    
    const confirmar = confirm("Deseja realmente excluir este pet? Esta ação é irreversível.");
    if (!confirmar) return;

    // --------------------------------------------------
    // 1. Libera o QR vinculado ao pet
    // --------------------------------------------------
    const resultadoQR = await banco
        .from("qrcodes")
        .update({
            pet_id: null,
            status: "disponivel",
            qr_liberado: false
        })
        .eq("pet_id", id)
        .select();

    console.log("Resultado UPDATE QR:", resultadoQR);

    if (resultadoQR.error) {
        console.error("Erro ao liberar QR:", resultadoQR.error);
        alert("Erro ao liberar o QR Code.");
        return;
    }

    // --------------------------------------------------
    // 2. Agora exclui o pet
    // --------------------------------------------------
    const { error: erroPet } = await banco
        .from("pets")
        .delete()
        .eq("id", id);

    if (erroPet) {
        console.error("Erro ao excluir pet:", erroPet);
        alert("Erro ao excluir o pet.");
        return;
    }

    alert("Pet excluído com sucesso!\nQR Code liberado novamente.");
    carregarPets();
}

async function vincularQRCode(idPet) {
    if (!qrPendente) {
        alert("QR Code não informado.");
        return;
    }

    const confirmar = confirm("Deseja vincular este QR Code a este pet?");
    if (!confirmar) return;

    const { error } = await banco
        .from("qrcodes")
        .update({
            status: "ativado",
            pet_id: idPet,
            activated_at: new Date().toISOString()
        })
        .eq("codigo", qrPendente);

    if (error) {
        console.error("ERRO:", error);
        alert("Erro ao vincular: " + error.message);
        return;
    }

    sessionStorage.removeItem("codigoQR");
    qrPendente = null;
    alert("✅ QR Code ativado com sucesso!");
    window.location.href = `qr-code.html?id=${idPet}`;
}

(async function () {
    const admin = await verificarAdministrador();
    if (admin) return;
    await carregarPets();
})();