/*
==========================================================
Safe Samas
Arquivo: qr-code.js
==========================================================

Responsável por:

✔ Buscar o pet
✔ Verificar se existe QR Code ativado
✔ Gerar imagem do QR
==========================================================
*/

const parametros = new URLSearchParams(window.location.search);

const idPet = Number(parametros.get("id"));

window.onload = async function () {

    //--------------------------------------------------
    // Validação
    //--------------------------------------------------

    if (!idPet) {

        window.location.href = "meus-pets.html";
        return;

    }

    //--------------------------------------------------
    // Busca o pet
    //--------------------------------------------------

    const { data: pet, error: erroPet } = await banco

        .from("pets")

        .select("id, nome_pet")

        .eq("id", idPet)

        .single();

    if (erroPet || !pet) {

        alert("Item/Pet não encontrado.");

        window.location.href = "meus-pets.html";

        return;

    }

    //--------------------------------------------------
    // Procura QR existente
    //--------------------------------------------------

    let { data: qr } = await banco

        .from("qrcodes")

        .select("*")

        .eq("pet_id", idPet)

        .eq("status", "ativado")

        .maybeSingle();

    //--------------------------------------------------
    // NÃO POSSUI QR
    //--------------------------------------------------

    if (!qr) {

        window.location.href = `liberar-qr.html?id=${idPet}`;

        return;

    }

    //--------------------------------------------------
    // Exibe tela
    //--------------------------------------------------

    document.getElementById("bloqueioPagamento").style.display = "none";

    document.getElementById("conteudoLiberado").style.display = "block";

    document.getElementById("nomePet").textContent = pet.nome_pet;

    //--------------------------------------------------
    // Link público
    //--------------------------------------------------

    const linkPet =

        `https://safesamas.vercel.app/pet-publico.html?codigo=${qr.codigo}`;

    document.getElementById("qrcode").innerHTML = "";

    new QRCode(document.getElementById("qrcode"), {

        text: linkPet,

        width: 250,

        height: 250

    });

    //--------------------------------------------------
    // Download
    //--------------------------------------------------

    const btn = document.getElementById("btnBaixar");

    if (btn) {

        btn.onclick = function () {

            window.print();

        };

    }

};