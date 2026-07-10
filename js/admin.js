/*
==========================================================
Arquivo: admin.js - Painel Administrativo
==========================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    console.log("Painel Administrativo carregado.");
    carregarDashboard();

    // Navegação
    document.getElementById("btnLotes").addEventListener("click", () => { window.location.href = "lotes.html"; });
    document.getElementById("btnPesquisar").addEventListener("click", () => { window.location.href = "pesquisar.html"; });
    document.getElementById("btnPets").addEventListener("click", () => { window.location.href = "pets.html"; });
    document.getElementById("btnUsuarios").addEventListener("click", () => { window.location.href = "usuarios.html"; });

    // Botão de Gerar QR Online
    document.getElementById("btnGerarOnline").addEventListener("click", gerarQROnline);

    // Botão Copiar Link
    document.getElementById("btnCopiarLink").addEventListener("click", () => {
        const campo = document.getElementById("linkGerado");
        campo.select();
        navigator.clipboard.writeText(campo.value);
        alert("✅ Link copiado!");
    });
});

/**
 * Função para gerar QR via RPC (Seguro)
 */
async function gerarQROnline() {
    console.log("Chamando função RPC para gerar QR...");

    const { data, error } = await banco.rpc("gerar_qr_online");

    if (error) {
        console.error("Erro na chamada RPC:", error);
        alert("Erro ao cadastrar QR: " + error.message);
        return;
    }

    // Sucesso: Chama a função para mostrar o modal
    mostrarModalQR(data.codigo);
    
    // Atualiza o dashboard
    carregarDashboard();
}

/**
 * Exibe o Modal com o QR Code e o Link gerado
 */
function mostrarModalQR(codigo) {
    const link = `https://jhonatanogueira875-commits.github.io/PetSamas/ativar.html?codigo=${codigo}`;

    document.getElementById("codigoGerado").textContent = codigo;
    document.getElementById("linkGerado").value = link;

    const qr = document.getElementById("qrcodeGerado");
    qr.innerHTML = ""; // Limpa o QR anterior

    new QRCode(qr, {
        text: link,
        width: 220,
        height: 220
    });

    document.getElementById("modalQR").style.display = "flex";
}

/**
 * Fecha o modal
 */
function fecharModalQR() {
    document.getElementById("modalQR").style.display = "none";
}

/**
 * Carrega os contadores e status do painel
 */
async function carregarDashboard() {
    console.log("Atualizando contadores do dashboard...");

    // 1. QR disponíveis
    const { count: disponiveis } = await banco.from("qrcodes").select("*", { count: "exact", head: true }).eq("status", "disponivel");
    document.getElementById("qrDisponiveis").textContent = disponiveis ?? 0;

    // 2. QR ativados
    const { count: ativados } = await banco.from("qrcodes").select("*", { count: "exact", head: true }).eq("status", "ativado");
    document.getElementById("qrAtivados").textContent = ativados ?? 0;

    // 3. Total de pets
    const { count: pets } = await banco.from("pets").select("*", { count: "exact", head: true });
    document.getElementById("totalPets").textContent = pets ?? 0;

    // 4. Último Lote
    const { data: ultimoLote } = await banco.from("qrcodes").select("lote").not("lote", "is", null).order("lote", { ascending: false }).limit(1);
    
    if (ultimoLote && ultimoLote.length > 0) {
        document.getElementById("ultimoLote").textContent = ultimoLote[0].coluna_lote || ultimoLote[0].lote;
    } else {
        document.getElementById("ultimoLote").textContent = "Nenhum";
    }
}