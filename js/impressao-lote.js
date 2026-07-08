/*
==========================================================
PetSamas
Arquivo: impressao-lote.js

Responsável por:

✔ Buscar um lote no Supabase
✔ Exibir os QR Codes pertencentes ao lote
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
// VALIDAÇÃO
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
// CARREGA O LOTE
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

    if (data.length == 0) {

        informacoes.innerHTML = "Lote não encontrado.";

        return;

    }

    informacoes.innerHTML = `

        <h2>📦 Lote ${numeroLote}</h2>

        <p>

            ${data.length} QR Codes encontrados.

        </p>

    `;

    grade.innerHTML = "";

    data.forEach(qr => {

        const div = document.createElement("div");

        div.style.border = "1px solid #ccc";
        div.style.padding = "15px";
        div.style.margin = "10px";
        div.style.borderRadius = "10px";
        div.style.background = "#fff";

        div.innerHTML = `

            <strong>${qr.codigo}</strong>

            <br><br>

            Status:

            ${qr.status}

        `;

        grade.appendChild(div);

    });

}