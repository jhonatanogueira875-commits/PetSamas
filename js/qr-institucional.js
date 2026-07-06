/*
==========================================================
PetSamas
Arquivo: qr-institucional.js

Responsável por:

✔ Gerar o QR Code institucional
✔ Permitir baixar o QR em PNG
==========================================================
*/

// ======================================================
// LINK OFICIAL
// ======================================================

const LINK_SITE = "https://jhonatanogueira875-commits.github.io/PetSamas/";


// ======================================================
// GERAR QR CODE
// ======================================================

new QRCode(document.getElementById("qrcode"), {

    text: LINK_SITE,

    width: 280,

    height: 280,

    colorDark: "#000000",

    colorLight: "#ffffff",

    correctLevel: QRCode.CorrectLevel.H

});


// ======================================================
// BAIXAR QR CODE
// ======================================================

function baixarQRCode() {

    const imagem = document.querySelector("#qrcode img");

    if (!imagem) {

        alert("QR Code ainda não foi gerado.");

        return;

    }

    const link = document.createElement("a");

    link.href = imagem.src;

    link.download = "QR-Institucional-PetSamas.png";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

}