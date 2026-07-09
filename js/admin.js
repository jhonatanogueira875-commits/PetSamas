/*
==========================================================
Arquivo: admin.js
==========================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    console.log("Painel Administrativo carregado.");
    carregarDashboard();
});

async function carregarDashboard() {
    console.log("Iniciando contadores do dashboard...");

    // 1. QR disponíveis
    console.log("-> Buscando QR disponíveis...");
    const { count: disponiveis, error: erroDisponiveis } = await banco
        .from("qrcodes")
        .select("*", { count: "exact", head: true })
        .eq("status", "disponivel");
    console.log("<- Resultado Disponíveis:", disponiveis, erroDisponiveis);

    if (erroDisponiveis) {
        console.error("Erro ao buscar QR disponíveis:", erroDisponiveis);
        document.getElementById("qrDisponiveis").textContent = "Erro";
    } else {
        document.getElementById("qrDisponiveis").textContent = disponiveis ?? 0;
    }

    // 2. QR ativados
    console.log("-> Buscando QR ativados...");
    const { count: ativados, error: erroAtivados } = await banco
        .from("qrcodes")
        .select("*", { count: "exact", head: true })
        .eq("status", "ativado");
    console.log("<- Resultado Ativados:", ativados, erroAtivados);

    if (erroAtivados) {
        console.error("Erro ao buscar QR ativados:", erroAtivados);
        document.getElementById("qrAtivados").textContent = "Erro";
    } else {
        document.getElementById("qrAtivados").textContent = ativados ?? 0;
    }

    // 3. Total de pets
    console.log("-> Buscando total de pets...");
    const { count: pets, error: erroPets } = await banco
        .from("pets")
        .select("*", { count: "exact", head: true });
    console.log("<- Resultado Pets:", pets, erroPets);

    if (erroPets) {
        console.error("Erro ao buscar total de pets:", erroPets);
        document.getElementById("totalPets").textContent = "Erro";
    } else {
        document.getElementById("totalPets").textContent = pets ?? 0;
    }

    // 4. Último Lote
    console.log("-> Buscando último lote...");
    const { data: ultimoLote, error: erroLote } = await banco
        .from("qrcodes")
        .select("lote")
        .not("lote", "is", null)
        .order("lote", { ascending: false })
        .limit(1);
    console.log("<- Resultado Lote:", ultimoLote, erroLote);

    if (!erroLote && ultimoLote && ultimoLote.length > 0) {
        document.getElementById("ultimoLote").textContent = ultimoLote[0].lote;
    } else {
        document.getElementById("ultimoLote").textContent = "Nenhum";
    }
    
    console.log("Dashboard finalizado.");
}