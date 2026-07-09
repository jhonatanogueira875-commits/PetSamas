/*
==========================================================
Arquivo: pesquisar.js
==========================================================
*/

async function buscarQRCode() {
    const codigo = document.getElementById("inputCodigo").value.trim();
    const resultadoDiv = document.getElementById("resultadoPesquisa");

    if (!codigo) {
        alert("Por favor, digite um código.");
        return;
    }

    resultadoDiv.innerHTML = "Buscando...";

    const { data, error } = await banco
        .from("qrcodes")
        .select("*")
        .eq("codigo", codigo)
        .single(); // Esperamos apenas um resultado

    if (error) {
        if (error.code === 'PGRST116') {
            resultadoDiv.innerHTML = "<h3>❌ Código não encontrado.</h3>";
        } else {
            console.error(error);
            resultadoDiv.innerHTML = "<h3>Erro ao buscar no banco de dados.</h3>";
        }
        return;
    }

    // Exibe o resultado
    resultadoDiv.innerHTML = `
        <div class="card-dashboard">
            <h3>Resultado:</h3>
            <p><strong>Código:</strong> ${data.codigo}</p>
            <p><strong>Lote:</strong> ${data.lote}</p>
            <p><strong>Status:</strong> ${data.status}</p>
        </div>
    `;
}