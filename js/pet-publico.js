/*
==========================================================
PetSamas
Arquivo: pet-publico.js
==========================================================
Responsável por:
✔ Ler o QR Code da URL
✔ Buscar e validar o status do QR no Supabase
✔ Descobrir qual pet pertence ao QR
✔ Exibir o perfil público de forma otimizada
==========================================================
*/

// ======================================================
// LÊ O CÓDIGO DO QR
// ======================================================

const parametros = new URLSearchParams(window.location.search);
const codigo = parametros.get("codigo");

// ======================================================
// CARREGAR PET
// ======================================================

async function carregarPet() {
    if (!codigo) {
        alert("QR Code inválido.");
        window.location.href = "index.html";
        return;
    }

    // ==================================================
    // PROCURA O QR (OTIMIZADO: Busca apenas o necessário)
    // ==================================================

    const { data: qr, error: erroQR } = await banco
        .from("qrcodes")
        .select("pet_id, status")
        .eq("codigo", codigo)
        .single();

    if (erroQR || !qr) {
        alert("QR Code não encontrado.");
        window.location.href = "index.html";
        return;
    }

    // ==================================================
    // VALIDAÇÃO DE STATUS (SEGURANÇA PARA O FUTURO)
    // ==================================================

    if (qr.status !== "ativado") {
        alert("Este QR Code não está ativado ou está bloqueado.");
        window.location.href = "index.html";
        return;
    }

    if (!qr.pet_id) {
        alert("Este QR Code não está vinculado a nenhum pet.");
        window.location.href = "index.html";
        return;
    }

    // ==================================================
    // PROCURA O PET
    // ==================================================

    const { data: pet, error } = await banco
        .from("pets")
        .select("*")
        .eq("id", qr.pet_id)
        .single();

    if (error || !pet) {
        alert("Pet não encontrado.");
        window.location.href = "index.html";
        return;
    }

    // ==================================================
    // PREENCHIMENTO DO PERFIL
    // ==================================================

    document.getElementById("foto1").src =
        pet.foto && pet.foto.trim() !== ""
            ? pet.foto
            : "assets/images/logo.jpg";

    document.getElementById("nomePet").textContent = pet.nome_pet;
    document.getElementById("nomeTutor").textContent = pet.nome_tutor;
    document.getElementById("cidadePet").textContent = pet.cidade;

    // ==================================================
    // WHATSAPP (LÓGICA DO BOTÃO)
    // ==================================================

    const telefone = String(pet.telefone || "").replace(/\D/g, "");
    const mensagem = `Olá! Encontrei o pet ${pet.nome_pet}.`;
    const botaoWhatsapp = document.getElementById("linkWhatsapp");

    if (telefone.length >= 10) {
        botaoWhatsapp.href = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
    } else {
        botaoWhatsapp.href = "#";
        botaoWhatsapp.onclick = function (e) {
            e.preventDefault();
            alert("Telefone do tutor indisponível.");
        };
    }
}

// ======================================================
// INICIALIZAÇÃO
// ======================================================

carregarPet();