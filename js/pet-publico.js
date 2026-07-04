/*
==========================================================
PetSamas
Arquivo: pet-publico.js

Responsável por:

✔ Ler o ID da URL
✔ Buscar o pet no Supabase
✔ Exibir informações públicas
✔ Exibir a foto
✔ Criar o link do WhatsApp
==========================================================
*/


// ======================================================
// LÊ O ID DA URL
// ======================================================

const parametros = new URLSearchParams(window.location.search);

const idPet = parametros.get("id");


// ======================================================
// CARREGA O PET
// ======================================================

async function carregarPet() {

    const { data: pet, error } = await banco

        .from("pets")

        .select("*")

        .eq("id", Number(idPet))

        .single();


    if (error || !pet) {

        alert("Pet não encontrado.");

        window.location.href = "index.html";

        return;

    }


    // ==================================================
    // FOTO
    // ==================================================

    document.getElementById("foto1").src =

        pet.foto && pet.foto.trim() !== ""

        ? pet.foto

        : "assets/images/logo.png";


    // ==================================================
    // DADOS
    // ==================================================

    document.getElementById("nomePet").textContent = pet.nome_pet;

    document.getElementById("nomeTutor").textContent = pet.nome_tutor;

    document.getElementById("cidadePet").textContent = pet.cidade;


    // ==================================================
    // WHATSAPP
    // ==================================================

    const telefone = String(pet.telefone || "").replace(/\D/g, "");

    const mensagem = `Olá! Encontrei o pet ${pet.nome_pet}.`;

    const botaoWhatsapp = document.getElementById("linkWhatsapp");

    if (telefone.length >= 10) {

        botaoWhatsapp.href =
            `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;

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