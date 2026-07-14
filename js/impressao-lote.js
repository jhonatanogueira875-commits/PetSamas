/*
==========================================================
PetSamas
Arquivo: impressao-lote.js
Responsável por: Buscar o lote e gerar a grade de QR Codes
==========================================================
*/

const params = new URLSearchParams(window.location.search);
const numeroLote = params.get("lote");
const informacoes = document.getElementById("informacoesLote");
const grade = document.getElementById("gradeQRCodes");

// Link base para o QR Code
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

    // 1. Comparação mais segura
    if (!data || data.length === 0) {
        informacoes.innerHTML = "Lote não encontrado.";
        return;
    }

    informacoes.innerHTML = `
        <h2>📦 Lote ${numeroLote}</h2>
        <p>${data.length} QR Codes encontrados.</p>
    `;

    grade.innerHTML = "";

    // Geração da grade de QR Codes
    data.forEach(qr => {
        const card = document.createElement("div");
        card.className = "qr-card";
        
        // 3. Mostrar o status do QR
        card.innerHTML = `
            <div class="qr-container" id="qr-${qr.codigo}"></div>
            <p><strong>${qr.codigo}</strong></p>
            <small>Status: ${qr.status}</small>
        `;
        
        grade.appendChild(card);

        // 2. Definir o link de forma legível
        const linkQR = `${SITE}/ativar.html?codigo=${qr.codigo}`;
        
        // Gera o QR Code dentro da div criada
        new QRCode(document.getElementById(`qr-${qr.codigo}`), {
            text: linkQR,
            width: 120,
            height: 120,
            correctLevel: QRCode.CorrectLevel.H
        });
    });
}