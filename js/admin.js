/*
==========================================================
Arquivo: admin.js - Painel Administrativo
==========================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    console.log("Painel Administrativo carregado.");
    carregarDashboard();

    // Navegação apenas para botões que possuem ID no HTML
    const configurarNav = (id, url) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener("click", () => { window.location.href = url; });
        }
    };

    configurarNav("btnLotes", "lotes.html");
    configurarNav("btnPesquisar", "pesquisar.html");
    configurarNav("btnPets", "pets.html");
    // Removido "btnUsuarios" daqui, pois ele funciona via link <a> no HTML

    // Botão de Gerar QR Online
    const btnGerar = document.getElementById("btnGerarOnline");
    if (btnGerar) {
        btnGerar.addEventListener("click", gerarQROnline);
    }

    // Botão Copiar Link
    const btnCopiar = document.getElementById("btnCopiarLink");
    if (btnCopiar) {
        btnCopiar.addEventListener("click", () => {
            const campo = document.getElementById("linkGerado");
            if (campo) {
                campo.select();
                navigator.clipboard.writeText(campo.value);
                alert("✅ Link copiado!");
            }
        });
    }
});

async function gerarQROnline() {
    const { data, error } = await banco.rpc("gerar_qr_online");
    if (error) {
        console.error("Erro na chamada RPC:", error);
        alert("Erro ao cadastrar QR: " + error.message);
        return;
    }
    const codigo = (typeof data === 'object' && data !== null) ? (data.codigo || data[0]?.codigo || Object.values(data)[0]) : data;
    if (codigo) {
        mostrarModalQR(codigo);
        carregarDashboard();
    }
}

function mostrarModalQR(codigo) {
    const link = `https://jhonatanogueira875-commits.github.io/PetSamas/ativar.html?codigo=${codigo}`;
    document.getElementById("codigoGerado").textContent = codigo;
    document.getElementById("linkGerado").value = link;
    const qr = document.getElementById("qrcodeGerado");
    qr.innerHTML = ""; 
    new QRCode(qr, { text: link, width: 220, height: 220 });
    document.getElementById("modalQR").style.display = "flex";
}

function fecharModalQR() {
    document.getElementById("modalQR").style.display = "none";
}

async function carregarDashboard() {
    console.log("Atualizando contadores do dashboard...");
    try {
        const { count: disponiveis } = await banco.from("qrcodes").select("*", { count: "exact", head: true }).eq("status", "disponivel");
        if (document.getElementById("qrDisponiveis")) document.getElementById("qrDisponiveis").textContent = disponiveis ?? 0;

        const { count: ativados } = await banco.from("qrcodes").select("*", { count: "exact", head: true }).eq("status", "ativado");
        if (document.getElementById("qrAtivados")) document.getElementById("qrAtivados").textContent = ativados ?? 0;

        const { count: pets } = await banco.from("pets").select("*", { count: "exact", head: true });
        if (document.getElementById("totalPets")) document.getElementById("totalPets").textContent = pets ?? 0;

        const { data: ultimoLote } = await banco.from("qrcodes").select("lote").not("lote", "is", null).order("lote", { ascending: false }).limit(1);
        if (document.getElementById("ultimoLote")) {
            document.getElementById("ultimoLote").textContent = (ultimoLote && ultimoLote.length > 0) ? (ultimoLote[0].coluna_lote || ultimoLote[0].lote) : "Nenhum";
        }
        console.log("Dashboard atualizado com sucesso!");
    } catch (err) {
        console.error("Erro no dashboard:", err);
    }
}