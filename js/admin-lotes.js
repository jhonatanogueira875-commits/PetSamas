/*
==========================================================
PetSamas
Arquivo: impressao-lote.js

Responsável por:

✔ Buscar um lote no Supabase
✔ Gerar os QR Codes para impressão
==========================================================
*/


// ======================================================
// LÊ O LOTE DA URL
// ======================================================

const params = new URLSearchParams(window.location.search);

const numeroLote = params.get("lote");

const informacoes = document.getElementById("informacoesLote");

const grade = document.getElementById("gradeQRCodes");


// ======================================================
// LINK OFICIAL
// ======================================================

const SITE =

"https://jhonatanogueira875-commits.github.io/PetSamas";


// ======================================================
// INICIAR
// ======================================================

if (!numeroLote) {

    informacoes.innerHTML = `

        <h3>❌ Nenhum lote informado.</h3>

    `;

}
else {

    carregarLote();

}


// ======================================================
// CARREGAR LOTE
// ======================================================

async function carregarLote() {

    informacoes.innerHTML = "Carregando lote...";

    const { data, error } = await banco

        .from("qrcodes")

        .select("*")

        .eq("lote", numeroLote)

        .order("numero", { ascending: true });

    if (error) {

        console.error(error);

        informacoes.innerHTML = "Erro ao consultar o banco.";

        return;

    }

    if (data.length === 0) {

        informacoes.innerHTML = "Lote não encontrado.";

        return;

    }

    informacoes.innerHTML = `

        <h2>📦 Lote ${numeroLote}</h2>

        <p>${data.length} QR Codes</p>

    `;

    grade.innerHTML = "";



    // ==================================================
    // GERA CADA QR CODE
    // ==================================================

    data.forEach(qr => {

        const card = document.createElement("div");

        card.style.width = "220px";
        card.style.display = "inline-block";
        card.style.margin = "15px";
        card.style.padding = "15px";
        card.style.border = "1px solid #ddd";
        card.style.borderRadius = "12px";
        card.style.background = "#ffffff";
        card.style.textAlign = "center";

        const areaQR = document.createElement("div");

        areaQR.style.display = "flex";
        areaQR.style.justifyContent = "center";
        areaQR.style.marginBottom = "12px";

        card.appendChild(areaQR);

        new QRCode(areaQR, {

            text: `${SITE}/ativar.html?codigo=${qr.codigo}`,

            width: 150,

            height: 150,

            colorDark: "#000000",

            colorLight: "#ffffff",

            correctLevel: QRCode.CorrectLevel.H

        });

        const codigo = document.createElement("strong");

        codigo.innerText = qr.codigo;

        card.appendChild(codigo);

        grade.appendChild(card);

    });

}