/*
==========================================================
PetSamas
Arquivo: admin.js

Responsável por:
✔ Carregar a lista de pets
✔ Redirecionar para impressão de lotes
==========================================================
*/

// Carrega os dados ao abrir a página
document.addEventListener("DOMContentLoaded", () => {
    carregarPets();
});

// ======================================================
// FUNÇÃO PARA REDIRECIONAR PARA IMPRESSÃO DE LOTE
// ======================================================

function irParaImpressao() {
    const inputLote = document.getElementById("inputLote");
    const numeroLote = inputLote.value.trim();

    if (numeroLote) {
        // Redireciona para a página passando o número do lote como parâmetro
        window.location.href = `impressao-lote.html?lote=${numeroLote}`;
    } else {
        alert("Por favor, digite o número do lote que deseja imprimir.");
        inputLote.focus();
    }
}

// ======================================================
// CARREGAR LISTA DE PETS (Logica original mantida)
// ======================================================

async function carregarPets() {
    const listaDiv = document.getElementById("listaPets");
    
    try {
        const { data, error } = await banco
            .from("qrcodes")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        if (data.length === 0) {
            listaDiv.innerHTML = "Nenhum pet cadastrado.";
            return;
        }

        let html = "<h3>Pets Cadastrados:</h3><ul>";
        data.forEach(pet => {
            html += `<li>${pet.codigo} - Status: ${pet.status}</li>`;
        });
        html += "</ul>";
        
        listaDiv.innerHTML = html;
    } catch (err) {
        console.error(err);
        listaDiv.innerHTML = "Erro ao carregar dados.";
    }
}