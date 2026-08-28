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

    // 1. Busca os itens/pets do usuário
    const { data: listaPetsBanco, error: errorPets } = await banco
        .from("pets")
        .select("*")
        .eq("user_id", user.id);

    if (errorPets) {
        console.error("Erro ao buscar cadastros:", errorPets);
        listaPets.innerHTML = "<p>Erro ao carregar os cadastros.</p>";
        return;
    }

    // 2. Busca todos os QRs
    const { data: listaQR, error: errorQR } = await banco
        .from("qrcodes")
        .select("*");

    if (errorQR) {
        console.error("Erro ao buscar QRs:", errorQR);
    }

    // 3. Vincula o QR no front-end
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
            <p>Você ainda não possui nenhum item ou pet cadastrado.</p>
            <br>
            <a href="cadastro.html"><button>➕ Cadastrar novo item/pet</button></a>
        `;

        return;
    }

    if (botaoNovoPet) botaoNovoPet.style.display = "inline-block";

    pets.forEach((pet) => {

        // ==================================================
        // SUPABASE STORAGE — FOTO DO CARD
        // ==================================================

        let foto = "assets/images/escudo.png";

        if (pet.foto && pet.foto !== "") {

            const valorFoto = String(pet.foto).trim();

            // Base64 antigo
            if (valorFoto.startsWith("data:image/")) {

                foto = valorFoto;

            }

            // URL completa
            else if (
                valorFoto.startsWith("http://") ||
                valorFoto.startsWith("https://")
            ) {

                foto = valorFoto;

            }

            // Caminho do Supabase Storage
            else if (
                typeof banco !== "undefined" &&
                banco &&
                banco.storage
            ) {

                const caminhoStorage =
                    valorFoto
                        .replace(/^\/+/, "")
                        .replace(/^pet-images\/+/i, "");

                const resultadoFoto = banco
                    .storage
                    .from("pet-images")
                    .getPublicUrl(caminhoStorage);

                if (
                    resultadoFoto &&
                    resultadoFoto.data &&
                    resultadoFoto.data.publicUrl
                ) {

                    foto =
                        resultadoFoto.data.publicUrl;

                    console.log(
                        "MEUS-PETS -> URL pública da foto:",
                        foto
                    );

                } else {

                    console.warn(
                        "MEUS-PETS -> Não foi possível gerar URL da foto:",
                        caminhoStorage
                    );
                }
            }
        }

        // ==================================================
        // IDENTIFICAÇÃO DINÂMICA
        // ==================================================

        const isItem = pet.tipo === "item";
        const icone = isItem ? "📦" : "🐶";
        const rotuloTutor = isItem ? "Proprietário" : "Tutor";

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

            botaoQRCode = `
                <a href="liberar-qr.html?id=${pet.id}">
                    <button>🔓 Liberar QR Code</button>
                </a>
            `;
        }

        listaPets.innerHTML += `
            <div class="card-pet">

                <img
                    src="${foto}"
                    class="foto-card"
                    alt="${pet.nome_pet}"
                    onerror="this.onerror=null; this.src='assets/images/escudo.png';"
                >

                <h2>${icone} ${pet.nome_pet}</h2>

                <p>
                    <strong>👤 ${rotuloTutor}:</strong>
                    ${pet.nome_tutor}
                </p>

                <p>
                    <strong>📍 Cidade:</strong>
                    ${pet.cidade}
                </p>

                <br>

                <a href="pet.html?id=${pet.id}">
                    <button>👁 Ver Perfil</button>
                </a>

                ${botaoQRCode}

                <button onclick="editarPet(${pet.id})">
                    ✏ Editar
                </button>

                <button onclick="excluirPet(${pet.id})">
                    🗑 Excluir
                </button>

                <hr>

            </div>
        `;
    });
}

function editarPet(id) {
    window.location.href = `cadastro.html?id=${id}`;
}

async function excluirPet(id) {
    const confirmar = confirm(
        "Deseja realmente excluir este cadastro? Esta ação é irreversível."
    );

    if (!confirmar) return;

    const resultadoQR = await banco
        .from("qrcodes")
        .update({
            pet_id: null,
            status: "disponivel",
            qr_liberado: false
        })
        .eq("pet_id", id);

    if (resultadoQR.error) {
        alert("Erro ao liberar o QR Code.");
        return;
    }

    const { error: erroPet } = await banco
        .from("pets")
        .delete()
        .eq("id", id);

    if (erroPet) {
        alert("Erro ao excluir o registro.");
        return;
    }

    alert(
        "Excluído com sucesso!\nQR Code liberado novamente."
    );

    carregarPets();
}

async function vincularQRCode(idPet) {

    if (!qrPendente) {
        alert("QR Code não informado.");
        return;
    }

    const confirmar = confirm(
        "Deseja vincular este QR Code a este cadastro?"
    );

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
        alert(
            "Erro ao vincular: " +
            error.message
        );

        return;
    }

    sessionStorage.removeItem("codigoQR");

    qrPendente = null;

    alert(
        "✅ QR Code ativado com sucesso!"
    );

    window.location.href =
        `qr-code.html?id=${idPet}`;
}

(async function () {

    const admin =
        await verificarAdministrador();

    if (admin) return;

    await carregarPets();

})();