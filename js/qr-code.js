/*
==========================================================
PetSamas
Arquivo: qr-code.js
==========================================================

Responsável por:

✔ Buscar o pet
✔ Verificar se existe QR vinculado
✔ Gerar o QR Code
✔ Exibir mensagem caso ainda não exista QR
==========================================================
*/

const parametros = new URLSearchParams(window.location.search);

const idPet = Number(parametros.get("id"));

window.onload = async function () {

    if (!idPet) {

        window.location.href = "meus-pets.html";

        return;

    }

    // ==================================================
    // BUSCA O PET
    // ==================================================

    const { data: pet, error: erroPet } = await banco

        .from("pets")

        .select("id, nome_pet")

        .eq("id", idPet)

        .single();

    if (erroPet || !pet) {

        alert("Pet não encontrado.");

        window.location.href = "meus-pets.html";

        return;

    }

    // ==================================================
    // PROCURA QR VINCULADO
    // ==================================================

    const { data: qr, error: erroQR } = await banco

        .from("qrcodes")

        .select("codigo, status")

        .eq("pet_id", idPet)

        .eq("status", "ativado")

        .single();

    // ==================================================
    // NÃO POSSUI QR
    // ==================================================

    if (erroQR || !qr) {

        document.getElementById("conteudoLiberado").style.display = "none";

        document.getElementById("bloqueioPagamento").style.display = "block";

        return;

    }

    // ==================================================
    // POSSUI QR
    // ==================================================

    document.getElementById("bloqueioPagamento").style.display = "none";

    document.getElementById("conteudoLiberado").style.display = "block";

    document.getElementById("nomePet").textContent = pet.nome_pet;

    const linkPet =
        `https://jhonatanogueira875-commits.github.io/PetSamas/pet-publico.html?codigo=${qr.codigo}`;

    document.getElementById("qrcode").innerHTML = "";

    new QRCode(document.getElementById("qrcode"), {

        text: linkPet,

        width: 250,

        height: 250

    });

    const btn = document.getElementById("btnBaixar");

    if (btn) {

        btn.onclick = function () {

            window.print();

        };

    }

};