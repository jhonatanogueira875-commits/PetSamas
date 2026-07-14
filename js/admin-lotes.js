/*
==========================================================
PetSamas
Arquivo: impressao-lote.js
Responsável por: Buscar um lote e gerar grade de QR Codes
==========================================================
*/

const params = new URLSearchParams(window.location.search);
const numeroLote = params.get("lote");
const informacoes = document.getElementById("informacoesLote");
const grade = document.getElementById("gradeQRCodes");

const SITE = "https://jhonatanogueira875-commits.github.io/PetSamas";

if (!numeroLote) {
    informacoes.innerHTML = "<h3>❌ Nenhum lote informado.</h3>";
} else {
    carregarLote();
}

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
        <p>${data.length} QR Codes encontrados.</p>
    `;

    grade.innerHTML = "";

    data.forEach(qr => {
        const card = document.createElement("div");
        card.className = "qr-card"; // Usaremos CSS para controlar o tamanho
        
        // Estilo básico para visualização na tela
        card.style.border = "1px solid #ddd";
        card.style.borderRadius = "8px";
        card.style.padding = "10px";
        card.style.background = "#fff";
        card.style.textAlign = "center";

        const areaQR = document.createElement("div");
        areaQR.id = `qrcode-${qr.codigo}`; // ID único para a biblioteca
        areaQR.style.display = "flex";
        areaQR.style.justifyContent = "center";
        areaQR.style.marginBottom = "5px";

        card.appendChild(areaQR);

        const codigoText = document.createElement("strong");
        codigoText.style.fontSize = "12px";
        codigoText.innerText = qr.codigo;
        card.appendChild(codigoText);

        grade.appendChild(card);

        // Gera o QR Code com tamanho adequado para A4
        new QRCode(areaQR, {
            text: `${SITE}/ativar.html?codigo=${qr.codigo}`,
            width: 120, // Tamanho ideal para 4 por linha no A4
            height: 120,
            correctLevel: QRCode.CorrectLevel.H
        });
    });
}