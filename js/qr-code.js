/*
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
    // LINK OFICIAL DO PET
    // ==================================================

    const linkPet =

        "https://jhonatanogueira875-commits.github.io/PetSamas/pet.html?id=" +

        pet.id;


    // ==================================================
    // GERA O QR CODE
    // ==================================================

    document.getElementById("qrcode").innerHTML = "";

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