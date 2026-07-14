/*
==========================================================
PetSamas
Arquivo: producao.js

Responsável por:

✔ Listar os QR Codes cadastrados
✔ Gerar QR Code visual
✔ Permitir download do QR
==========================================================
*/


// ======================================================
// CARREGAR QR CODES
// ======================================================

carregarQRCodes();

async function carregarQRCodes() {

    const lista = document.getElementById("listaQRCodes");

    lista.innerHTML = "Carregando...";

    const { data, error } = await banco

        .from("qrcodes")

        .select("*")

        .eq("status", "disponivel")

        .order("numero", { ascending: true });

    if (error) {

        console.error(error);

        lista.innerHTML = "Erro ao carregar QR Codes.";

        return;

    }

    if (data.length === 0) {

        lista.innerHTML = "Nenhum QR Code disponível.";

        return;

    }

    lista.innerHTML = "";

    data.forEach(qr => {

        lista.innerHTML += `

        <div class="card-qr">

            <h3>${qr.codigo}</h3>

            <button onclick="gerarQRCode('${qr.codigo}')">

                📱 Gerar QR

            </button>

            <div id="qr-${qr.codigo}" style="margin-top:20px;"></div>

        </div>

        <hr style="margin:25px 0;">

        `;

    });

}



// ======================================================
// GERAR QR CODE
// ======================================================

function gerarQRCode(codigo){

    const destino = document.getElementById(`qr-${codigo}`);

    // Evita gerar duas vezes

    if(destino.innerHTML !== ""){

        return;

    }

    // Link que será gravado no QR

    const link = `https://jhonatanogueira875-commits.github.io/PetSamas/ativar.html?codigo=${codigo}`;

    new QRCode(destino,{

        text: link,

        width:220,

        height:220,

        colorDark:"#000000",

        colorLight:"#ffffff",

        correctLevel:QRCode.CorrectLevel.H

    });

    destino.innerHTML += `

        <br>

        <strong>${codigo}</strong>

        <br><br>

        <button onclick="baixarQRCode('${codigo}')">

            ⬇ Baixar PNG

        </button>

    `;

}



// ======================================================
// BAIXAR QR
// ======================================================

function baixarQRCode(codigo){

    const div = document.getElementById(`qr-${codigo}`);

    const imagem = div.querySelector("img");

    if(!imagem){

        alert("QR Code não encontrado.");

        return;

    }

    const link = document.createElement("a");

    link.href = imagem.src;

    link.download = `${codigo}.png`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

}