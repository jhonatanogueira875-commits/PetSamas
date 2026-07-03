/*
==========================================================
PetSamas
Arquivo: pet.js

Responsável por:

✔ Ler o ID da URL
✔ Buscar o pet no Supabase
✔ Exibir as informações
✔ Exibir a foto
✔ Criar o link do WhatsApp
==========================================================
*/


// ======================================================
// ID DA URL
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


    // FOTO

    document.getElementById("foto1").src =

        pet.foto && pet.foto !== ""

        ? pet.foto

        : "assets/images/logo.png";


    // DADOS

    document.getElementById("nomePet").textContent = pet.nome_pet;

    document.getElementById("nomeTutor").textContent = pet.nome_tutor;

    document.getElementById("cidadePet").textContent = pet.cidade;


    // WHATSAPP

    const mensagem = `Olá! Encontrei o pet ${pet.nome_pet}.`;

    document.getElementById("linkWhatsapp").href =

        `https://wa.me/55${pet.telefone}?text=${encodeURIComponent(mensagem)}`;

}


// ======================================================

carregarPet();/*
==========================================================
PetSamas
Arquivo: qr-code.js

Responsável por:

✔ Ler o ID da URL
✔ Buscar o pet no Supabase
✔ Mostrar o nome
✔ Gerar o QR Code
✔ Permitir baixar o QR Code
==========================================================
*/


// ======================================================
// ID DA URL
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
    // NOME DO PET
    // ==================================================

    document.getElementById("nomePet").textContent = pet.nome_pet;


    // ==================================================
    // LINK DO PET
    // ==================================================

    const baseURL =

        window.location.origin +

        window.location.pathname.replace("qr-code.html", "");


    const linkPet =

        baseURL +

        "pet.html?id=" +

        pet.id;


    // ==================================================
    // GERA O QR CODE
    // ==================================================

    new QRCode(

        document.getElementById("qrcode"),

        {

            text: linkPet,

            width: 250,

            height: 250

        }

    );


    // ==================================================
    // BOTÃO BAIXAR
    // ==================================================

    document.getElementById("btnBaixar").addEventListener(

        "click",

        function () {

            const imagem = document.querySelector("#qrcode img");

            if (!imagem) {

                return;

            }

            const link = document.createElement("a");

            link.href = imagem.src;

            link.download = "QRCode-" + pet.nome_pet + ".png";

            link.click();

        }

    );

}


// ======================================================

carregarPet();