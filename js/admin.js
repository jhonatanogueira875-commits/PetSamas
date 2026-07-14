/*
==========================================================
Arquivo: admin.js - Painel Administrativo
==========================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    console.log("Painel Administrativo carregado.");
    carregarDashboard();

    // Navegação com verificação de segurança individual
    const configurarNav = (id, url) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener("click", () => { window.location.href = url; });
        } else {
            console.warn(`Elemento ${id} não encontrado no DOM. Pulando.`);
        }
    };

    configurarNav("btnLotes", "lotes.html");
    configurarNav("btnPesquisar", "pesquisar.html");
    configurarNav("btnPets", "pets.html");
    configurarNav("btnUsuarios", "usuarios.html");

    // Botão de Gerar QR Online
    const btnGerar = document.getElementById("btnGerarOnline");
    if (btnGerar) {
        btnGerar.addEventListener("click", () => {
            console.log("Botão Gerar QR clicado!");
            gerarQROnline();
        });
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

/**
 * Função para gerar QR via RPC (Seguro)
 */
async function gerarQROnline() {
    const { data, error } = await banco.rpc("gerar_qr_online");

    if (error) {
        console.error("Erro na chamada RPC:", error);
        alert("Erro ao cadastrar QR: " + error.message);
        return;
    }

    const codigo = (typeof data === 'object' && data !== null) ? (data.codigo || data[0]?.codigo || Object.values(data)[0]) : data;
    
    if (!codigo) {
        console.error("Formato de retorno inesperado:", data);
        alert("Erro: O sistema não retornou um código válido.");
        return;
    }
    
    mostrarModalQR(codigo);
    carregarDashboard();
}

/**
 * Exibe o Modal com o QR Code e o Link gerado
 */
function mostrarModalQR(codigo) {
    const link = `https://jhonatanogueira875-commits.github.io/PetSamas/ativar.html?codigo=${codigo}`;

    const campoCodigo = document.getElementById("codigoGerado");
    const campoLink = document.getElementById("linkGerado");
    const qrDiv = document.getElementById("qrcodeGerado");
    const modal = document.getElementById("modalQR");

    if (campoCodigo) campoCodigo.textContent = codigo;
    if (campoLink) campoLink.value = link;

    if (qrDiv) {
        qrDiv.innerHTML = ""; 
        new QRCode(qrDiv, {
            text: link,
            width: 220,
            height: 220
        });
    }

    if (modal) modal.style.display = "flex";
}

/**
 * Fecha o modal
 */
function fecharModalQR() {
    const modal = document.getElementById("modalQR");
    if (modal) modal.style.display = "none";
}

/**
 * Carrega os contadores e status do painel
 */
async function carregarDashboard() {
    console.log("Atualizando contadores do dashboard...");

    try {
        const { count: disponiveis, error: err1 } = await banco.from("qrcodes").select("*", { count: "exact", head: true }).eq("status", "disponivel");
        if (err1) throw err1;
        if (document.getElementById("qrDisponiveis")) document.getElementById("qrDisponiveis").textContent = disponiveis ?? 0;

        const { count: ativados, error: err2 } = await banco.from("qrcodes").select("*", { count: "exact", head: true }).eq("status", "ativado");
        if (err2) throw err2;
        if (document.getElementById("qrAtivados")) document.getElementById("qrAtivados").textContent = ativados ?? 0;

        const { count: pets, error: err3 } = await banco.from("pets").select("*", { count: "exact", head: true });
        if (err3) throw err3;
        if (document.getElementById("totalPets")) document.getElementById("totalPets").textContent = pets ?? 0;

        const { data: ultimoLote, error: err4 } = await banco.from("qrcodes").select("lote").not("lote", "is", null).order("lote", { ascending: false }).limit(1);
        if (err4) throw err4;
        
        const elLote = document.getElementById("ultimoLote");
        if (elLote) {
            if (ultimoLote && ultimoLote.length > 0) {
                elLote.textContent = ultimoLote[0].coluna_lote || ultimoLote[0].lote;
            } else {
                elLote.textContent = "Nenhum";
            }
        }

        console.log("Dashboard atualizado com sucesso!");
    } catch (err) {
        console.error("Erro ao carregar o dashboard:", err);
    }
}