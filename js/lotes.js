/*
==========================================================
Arquivo: lotes.js
==========================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    carregarLotes();
});

async function carregarLotes() {
    const listaDiv = document.getElementById("listaLotes");
    
    const { data, error } = await banco
        .from("qrcodes")
        .select("lote")
        .not("lote", "is", null)
        .order("lote", { ascending: false });

    if (error) {
        listaDiv.innerHTML = "Erro ao carregar lotes.";
        console.error(error);
        return;
    }

    const lotesUnicos = [...new Set(data.map(item => item.lote))];

    if (lotesUnicos.length === 0) {
        listaDiv.innerHTML = "Nenhum lote encontrado.";
        return;
    }

    listaDiv.innerHTML = "<ul>" + lotesUnicos.map(lote => `
        <li>
            <strong>Lote ${lote}</strong> 
            <a href="impressao-lote.html?lote=${lote}">Ver QR Codes</a>
        </li>
    `).join("") + "</ul>";
}

async function gerarLote() {
    const lote = document.getElementById("numLote").value;
    const qtd = parseInt(document.getElementById("qtdQRCodes").value);

    if (!lote || !qtd || qtd <= 0) {
        alert("Por favor, preencha o número do lote e a quantidade.");
        return;
    }

    const novosQRCodes = [];
    for (let i = 0; i < qtd; i++) {
        // Gera um código aleatório simples (ex: PS-12345)
        const codigoAleatorio = "PS-" + Math.floor(10000 + Math.random() * 90000);
        
        novosQRCodes.push({
            codigo: codigoAleatorio,
            lote: parseInt(lote),
            status: "disponivel"
        });
    }

    const { error } = await banco
        .from("qrcodes")
        .insert(novosQRCodes);

    if (error) {
        console.error(error);
        alert("Erro ao criar o lote: " + error.message);
    } else {
        alert("Lote criado com sucesso!");
        document.getElementById("numLote").value = "";
        document.getElementById("qtdQRCodes").value = "";
        carregarLotes(); // Atualiza a lista
    }
}