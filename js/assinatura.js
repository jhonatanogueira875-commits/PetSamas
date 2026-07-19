/*
==========================================================
Safe Samas
Arquivo: assinatura.js

Responsável por:

✔ Verificar se o usuário possui assinatura ativa
✔ Proteger páginas que exigem assinatura
==========================================================
*/

async function possuiAssinaturaAtiva() {

    // ==========================================
    // USUÁRIO LOGADO
    // ==========================================

    const {
        data: { user }
    } = await banco.auth.getUser();

    if (!user) {
        console.log("Usuário não logado.");
        return false;
    }

    // ==========================================
    // CONSULTA ASSINATURA
    // ==========================================

    const {
        data,
        error
    } = await banco
        .from("assinaturas")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .gt("data_fim", new Date().toISOString())
        .limit(1);

    if (error) {
        console.error("Erro na consulta de assinatura:", error);
        return false;
    }

    return data.length > 0;
}

// ==========================================================
// PROTEGE PÁGINAS QUE EXIGEM ASSINATURA
// ==========================================================

async function protegerCadastro() {

    console.log("==== INICIANDO VERIFICAÇÃO DE ASSINATURA ====");

    const assinaturaAtiva =
        await possuiAssinaturaAtiva();

    console.log("Assinatura ativa:", assinaturaAtiva);

    if (!assinaturaAtiva) {

        console.log("Redirecionando para assinatura.html");

        window.location.href = "assinatura.html";

        return false;

    }

    console.log("Usuário autorizado.");

    return true;

}