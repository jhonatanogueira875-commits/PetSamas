/*
==========================================================
Arquivo: js/pesquisar.js
==========================================================
*/

async function buscarQRCode() {
    const resultadoPesquisa = document.getElementById("resultadoPesquisa");
    
    // 1. Captura e normalização do Código
    let codigo = document.getElementById("inputCodigo").value.trim().toUpperCase();
    
    // Ajuste 1: Validação de campo vazio
    if (!codigo) {
        alert("Por favor, informe um QR Code.");
        return;
    }

    // Smart Search: Se digitou apenas números, formata para PET-000000
    if (/^\d+$/.test(codigo)) {
        codigo = "PET-" + codigo.padStart(6, "0");
    }

    resultadoPesquisa.innerHTML = "<p>🔍 Pesquisando...</p>";

    // 2. Busca no Supabase
    const { data, error } = await banco
        .from("qrcodes")
        .select("*")
        .eq("codigo", codigo)
        .single();

    if (error || !data) {
        resultadoPesquisa.innerHTML = `
            <div style="color: red;">
                <p>❌ QR Code não encontrado.</p>
                <small>Verifique se o código está correto.</small>
            </div>
        `;
        return;
    }

    // 3. Exibição dos dados (Ajuste 2: Lote e uso do operador ??)
    resultadoPesquisa.innerHTML = `
        <div class="card-dashboard" style="text-align: left; padding: 20px;">
            <h3>✅ QR Code Encontrado</h3>
            <p><strong>Código:</strong> ${data.codigo}</p>
            <p><strong>Lote:</strong> ${data.lote ?? "Sem lote"}</p>
            <p><strong>Status:</strong> ${data.status}</p>
            <p><strong>Origem:</strong> ${data.origem || "Não informado"}</p>
            <p><strong>Tipo:</strong> ${data.tipo || "Não informado"}</p>
            <p><strong>QR Liberado:</strong> ${data.qr_liberado ? "Sim" : "Não"}</p>
            <p><strong>Pet ID Vinculado:</strong> ${data.pet_id ?? "Nenhum"}</p>
        </div>
    `;
}