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
        window.location.href = "../login.html";
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

        // Lógica de Status
        let statusPet = "🛡️ Protegido";
        if (pet.status === "perdido") {
            statusPet = "🔴 Perdido";
        }
        if (pet.status === "recuperado") {
            statusPet = "🟢 Recuperado";
        }

        // Lógica do Botão de Status
        let botaoStatus = "";
        if (pet.status === "protegido") {
            botaoStatus = `
                <button onclick="alterarStatusPet('${pet.id}','perdido')">
                    🚨 Marcar como Perdido
                </button>
            `;
        } else if (pet.status === "perdido") {
            botaoStatus = `
                <button onclick="alterarStatusPet('${pet.id}','recuperado')">
                    ✅ Marcar como Recuperado
                </button>
            `;
        } else {
            botaoStatus = `
                <button onclick="alterarStatusPet('${pet.id}','protegido')">
                    🛡️ Voltar para Protegido
                </button>
            `;
        }

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
                <p><strong>Status:</strong> ${statusPet}</p>
                <p><strong>👤 Tutor:</strong> ${pet.nome_tutor}</p>
                <p><strong>📍 Cidade:</strong> ${pet.cidade}</p>
                <br>
                <a href="pet.html?id=${pet.id}"><button>👁 Ver Perfil</button></a>
                ${botaoQRCode}${botaoStatus}
                <button onclick="editarPet(${pet.id})">✏️ Editar</button>
                <button onclick="excluirPet