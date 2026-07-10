/*
==========================================================
Arquivo: admin.js - Painel Administrativo
==========================================================
*/

// Inicialização do painel
document.addEventListener("DOMContentLoaded", () => {
    console.log("Painel Administrativo carregado.");
    carregarDashboard();

    // Bindings de navegação
    document.getElementById("btnLotes").addEventListener("click", () => {
        window.location.href = "lotes.html";
    });

    document.getElementById("btnPesquisar").addEventListener("click", () => {
        window.location.href = "pesquisar.html";
    });

    document.getElementById("btnPets").addEventListener("click", () => {
        window.location.href = "pets.html";
    });

    document.getElementById("btnUsuarios").addEventListener("click", () => {
        window.location.href = "usuarios.html";
    });

    // Botão de Gerar QR Online (Chamando a função segura)
    document.getElementById("btnGerarOnline").addEventListener("click", gerarQROnline);
});

/**
 * Função para gerar QR via RPC (Seguro)
 * Esta função chama o SQL dentro do Supabase, ignorando restrições de RLS
 * pois o "SECURITY DEFINER" na função SQL cuida da permissão.
 */
async function gerarQROnline() {
    console.log("Chamando função RPC para gerar QR...");

    // Chama a função SQL criada no Supabase
    const { data, error } = await banco.rpc("gerar_qr_online");

    if (error) {
        console.error("Erro na chamada RPC:", error);
        alert("Erro ao cadastrar QR: " + error.message);
        return;
    }

    // Sucesso
    alert("✅ QR Online criado com sucesso!\n\nCódigo: " + data.codigo);
    
    // Atualiza o dashboard para refletir o novo número
    carregarDashboard();
}

/**
 * Carrega os contadores e status do painel
 */
async function carregarDashboard() {
    console.log("Atualizando contadores do dashboard...");

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

    // 4. Último Lote (Tratamento para nomes de colunas diferentes)
    const { data: ultimoLote } = await banco
        .from("qrcodes")
        .select("lote")
        .not("lote", "is", null)
        .order("lote", { ascending: false })
        .limit(1);

    if (ultimoLote && ultimoLote.length > 0) {
        // Se existir a coluna, exibe, se não, exibe o lote padrão
        document.getElementById("ultimoLote").textContent = ultimoLote[0].coluna_lote || ultimoLote[0].lote;
    } else {
        document.getElementById("ultimoLote").textContent = "Nenhum";
    }
}/*
==========================================================
Arquivo: admin.js - Painel Administrativo
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

    document.getElementById("btnPets").addEventListener("click", () => {
        window.location.href = "pets.html";
    });

    document.getElementById("btnUsuarios").addEventListener("click", () => {
        window.location.href = "usuarios.html";
    });

    // Botão de Gerar QR Online
    document.getElementById("btnGerarOnline").addEventListener("click", gerarQROnline);
});

/**
 * Função para gerar QR via RPC (Seguro)
 */
async function gerarQROnline() {
    console.log("Chamando função RPC para gerar QR...");

    // Chamada segura para o banco de dados
    const { data, error } = await banco.rpc("gerar_qr_online");

    if (error) {
        console.error("Erro na chamada RPC:", error);
        alert("Erro ao cadastrar QR: " + error.message);
        return;
    }

    // Feedback visual
    alert("✅ QR Online criado com sucesso!\n\nCódigo: " + data.codigo);
    
    // Atualiza o dashboard para refletir o novo número
    carregarDashboard();
}

/**
 * Carrega os contadores e status do painel
 */
async function carregarDashboard() {
    console.log("Atualizando contadores do dashboard...");

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