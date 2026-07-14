/*
==========================================================
PetSamas
Arquivo: pet.js
==========================================================
*/


const parametros = new URLSearchParams(window.location.search);
const idPet = parametros.get("id");

async function carregarPet() {

    const { data: pet, error } = await banco
        .from("pets")
        .select("*")
        .eq("id", idPet)
        .single();

    console.log("PET:", pet);

    if (error || !pet) {

        alert("Pet não encontrado.");
        window.location.href = "index.html";
        return;
    }

    // =========================
    // FOTO (ROBUSTA)
    // =========================

    const fotoElement = document.getElementById("foto1");

    if (pet.foto && pet.foto.trim() !== "") {

        fotoElement.src = pet.foto;

    } else {

        fotoElement.src = "assets/images/logo.jpg";
    }

    // =========================
    // DADOS
    // =========================

    document.getElementById("nomePet").textContent = pet.nome_pet || "";
    document.getElementById("nomeTutor").textContent = pet.nome_tutor || "";
    document.getElementById("cidadePet").textContent = pet.cidade || "";

    // =========================
    // WHATSAPP (100% SEGURO)
    // =========================

    let telefone = "";

    if (pet.telefone) {
        telefone = String(pet.telefone).replace(/\D/g, "");
    }

    console.log("TEL:", telefone);

    const botao = document.getElementById("linkWhatsapp");

    if (telefone.length >= 10) {

        const mensagem = `Olá! Encontrei o pet ${pet.nome_pet || ""}.`;

        botao.href =
            `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;

    } else {

        botao.href = "#";
        console.warn("Telefone inválido");
    }
}

carregarPet();