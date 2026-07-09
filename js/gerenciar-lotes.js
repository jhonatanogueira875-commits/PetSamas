document.addEventListener("DOMContentLoaded", () => {
    carregarLotes();
});

async function carregarLotes() {

    const lista = document.getElementById("listaLotes");

    const { data, error } = await banco
        .from("qrcodes")
        .select("lote");

    if (error) {
        lista.innerHTML = "Erro ao carregar lotes.";
        return;
    }

    const lotes = [...new Set(
        data
            .map(item => item.lote)
            .filter(lote => lote !== null)
    )].sort((a, b) => a - b);

    if (lotes.length === 0) {
        lista.innerHTML = "<p>Nenhum lote encontrado.</p>";
        return;
    }

    lista.innerHTML = "";

    for (const lote of lotes) {

        const quantidade = data.filter(item => item.lote === lote).length;

        lista.innerHTML += `
            <div class="card-dashboard">

                <h3>📦 Lote ${lote}</h3>

                <p>${quantidade} QR Codes</p>

                <button onclick="abrirLote(${lote})">
                    Abrir
                </button>

            </div>

            <br>
        `;
    }
}

function abrirLote(lote) {
    window.location.href = `impressao-lote.html?lote=${lote}`;
}