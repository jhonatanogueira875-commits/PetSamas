/*
==========================================================
Arquivo: meus-pets.js
Responsável por: Listar, renderizar e gerenciar os cadastros
==========================================================
*/

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
    if (typeof banco === "undefined" || !banco.auth) return null;
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

    console.log("ID do Usuário logado:", user.id);

    // 1. Busca os registros do usuário logado
    const { data: listaPetsBanco, error: errorPets } = await banco
        .from("pets")
        .select("*")
        .eq("user_id", user.id);

    if (errorPets) {
        console.error("Erro ao buscar cadastros:", errorPets);
        listaPets.innerHTML = `<p style="color: red;">Erro ao carregar os cadastros: ${errorPets.message}</p>`;
        return;
    }

    console.log("Registros encontrados no banco:", listaPetsBanco);

    // 2. Busca todos os QRs com tratamento de erro seguro
    let listaQR = [];
    const { data: qrData, error: errorQR } = await banco
        .from("qrcodes")
        .select("*");

    if (errorQR) {
        console.warn("Aviso ao buscar QRs:", errorQR.message);
    } else {
        listaQR = qrData || [];
    }

    // 3. Vincula o QR no front-end
    pets = (listaPetsBanco || []).map((pet) => {
        const qrEncontrado = listaQR.find((qr) => {
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
        if (botaoNovoPet) botaoNovoPet.style.display = "inline-block";
        listaPets.innerHTML = `
            <p>Você ainda não possui nenhum item, pet ou veículo cadastrado.</p>
            <br>
            <a href="cadastro.html"><button class="btn-samas">➕ Cadastrar novo item/pet</button></a>
        `;
        return;
    }

    if (botaoNovoPet) botaoNovoPet.style.display = "inline-block";

    pets.forEach((pet) => {
        const foto = pet.foto && pet.foto !== ""
            ? pet.foto
            : "assets/images/escudo.png";
        
        // Identificação dinâmica por tipo (Pet, Item ou Veículo)
        let icone = "🐾";
        let rotuloTutor = "Tutor";

        if (pet.tipo === "item") {
            icone = "📦";
            rotuloTutor = "Proprietário";
        } else if (pet.tipo === "veiculo") {
            icone = "🚗";
            rotuloTutor = "Proprietário";
        }
        
        // Exibição de título inteligente (Nome do Pet ou Marca/Modelo do Veículo)
        let tituloCard = pet.nome_pet || `${pet.marca || ''} ${pet.modelo || ''}`.trim() || "Cadastro sem nome";

        let botaoQRCode = "";

        if (pet.qr) {
            botaoQRCode = `
                <a href="qr-code.html?id=${pet.id}">
                    <button class="btn-samas">📱 Meu QR Code</button>
                </a>
            `;
        } else if (qrPendente) {
            botaoQRCode = `
                <button class="btn-samas" onclick="vincularQRCode('${pet.id}')">
                    🔗 Vincular este QR Code
                </button>
            `;
        } else {
            botaoQRCode = `
                <a href="liberar-qr.html?id=${pet.id}">
                    <button class="btn-samas">🔓 Liberar QR Code</button>
                </a>
            `;
        }

        listaPets.innerHTML += `
            <div class="card-pet" style="background: #fff; padding: 15px; margin-bottom: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <img src="${foto}" class="foto-card" alt="Foto" style="width: 80px; height: 80px; object-fit: cover; border-radius: 50%; display: block; margin: 0 auto 10px auto;">
                <h2 style="text-align: center; font-size: 1.2rem;">${icone} ${tituloCard}</h2>
                <p><strong>👤 ${rotuloTutor}:</strong> ${pet.nome_tutor || 'Não informado'}</p>
                <p><strong>📍 Cidade:</strong> ${pet.cidade || 'Não informada'}</p>
                ${pet.placa ? `<p><strong>🚗 Placa:</strong> ${pet.placa}</p>` : ''}
                <br>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <a href="pet.html?id=${pet.id}"><button class="btn-samas">👁 Ver Perfil</button></a>
                    ${botaoQRCode}
                    <button class="btn-samas" onclick="editarPet(${pet.id})">✏️ Editar</button>
                    <button class="btn-samas btn-danger" onclick="excluirPet(${pet.id})">🗑 Excluir</button>
                </div>
                <hr style="margin-top: 15px;">
            </div>
        `;
    });
}

function editarPet(id) { 
    window.location.href = `cadastro.html?id=${id}`; 
}

async function excluirPet(id) {
    const confirmar = confirm("Deseja realmente excluir este cadastro? Esta ação é irreversível.");
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

    alert("Excluído com sucesso!\nQR Code liberado novamente.");
    carregarPets();
}

async function vincularQRCode(idPet) {
    if (!qrPendente) {
        alert("QR Code não informado.");
        return;
    }

    const confirmar = confirm("Deseja vincular este QR Code a este cadastro?");
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
        alert("Erro ao vincular: " + error.message);
        return;
    }

    sessionStorage.removeItem("codigoQR");
    qrPendente = null;
    alert("✅ QR Code ativado com sucesso!");
    window.location.href = `qr-code.html?id=${idPet}`;
}

// Inicialização segura tratada com Try/Catch
(async function () {
    try {
        if (typeof banco === "undefined") {
            throw new Error("O objeto 'banco' do Supabase não foi inicializado. Verifique a ordem dos scripts no HTML.");
        }

        const admin = await verificarAdministrador();
        if (admin) return;
        
        await carregarPets();
    } catch (erro) {
        console.error("Erro crítico na inicialização da página:", erro);
        if (listaPets) {
            listaPets.innerHTML = `<p style="color: red; font-weight: bold;">Erro ao carregar sistema: ${erro.message}</p>`;
        }
    }
})();