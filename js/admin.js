/*
==========================================================
Arquivo: admin.js (Versão Atualizada)
==========================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    console.log("Painel Administrativo carregado.");
    carregarDashboard();

    // Navegação
    document.getElementById("btnLotes").addEventListener("click", () => {
        window.location.href = "lotes.html";
    });

    document.getElementById("btnPesquisar").addEventListener("click", () => {
        window.location.href = "pesquisar.html";
    });

    // Nova ligação: Gerenciar Pets
    document.getElementById("btnPets").addEventListener("click", () => {
        window.location.href = "pets.html";
    });
});

async function carregarDashboard() {
    console.log("Iniciando contadores do dashboard...");

    // 1. QR disponíveis
    const { count: disponiveis } = await banco
        .from("qrcodes")
        .select("*", { count: "exact", head: true })
        .eq("status", "disponivel");
    document.getElementById("qrDisponiveis").textContent = disponiveis ?? 0;

    // 2. QR ativados
    const { count: ativados } = await banco
        .from("qrcodes")
        .select("*", { count: "exact", head: true })
        .eq("status", "ativado");
    document.getElementById("qrAtivados").textContent = ativados ?? 0;

    // 3. Total de pets
    const { count: pets } = await banco
        .from("pets")
        .select("*", { count: "exact", head: true });
    document.getElementById("totalPets").textContent = pets ?? 0;

    // 4. Último Lote
    const { data: ultimoLote } = await banco
        .from("qrcodes")
        .select("lote")
        .not("lote", "is", null)
        .order("lote", { ascending: false })
        .limit(1);

    if (ultimoLote && ultimoLote.length > 0) {
        document.getElementById("ultimoLote").textContent = ultimoLote[0].coluna_lote || ultimoLote[0].lote;
    } else {
        document.getElementById("ultimoLote").textContent = "Nenhum";
    }
}