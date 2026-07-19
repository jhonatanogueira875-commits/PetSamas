/*
==========================================================
Safe Samas
Arquivo: assinatura.js

Responsável por:

✔ Verificar se o usuário possui assinatura ativa
✔ Proteger páginas que exigem assinatura
==========================================================
*/

// ==========================================================
// CONSULTA ASSINATURA DO USUÁRIO
// ==========================================================
async function possuiAssinaturaAtiva() {

    const {
        data: { user }
    } = await banco.auth.getUser();

    if (!user) {
        console.log("Usuário não logado.");
        return {
            autenticado: false,
            possui: false,
            status: null,
            assinatura: null
        };
    }

    const {
        data,
        error
    } = await banco
        .from("assinaturas")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

    if (error) {
        console.error("Erro na consulta:", error);
        return {
            autenticado: true,
            possui: false,
            status: null,
            assinatura: null
        };
    }

    // Registro do resultado da consulta no console conforme solicitado
    console.log("Resultado da consulta:", data);

    if (!data || data.length === 0) {
        return {
            autenticado: true,
            possui: false,
            status: null,
            assinatura: null
        };
    }

    const assinatura = data[0];

    return {
        autenticado: true,
        possui: assinatura.status === "active" &&
                new Date(assinatura.data_fim) > new Date(),
        status: assinatura.status,
        assinatura
    };
}

// ==========================================================
// PROTEGE PÁGINAS QUE EXIGEM ASSINATURA
// ==========================================================

async function protegerCadastro() {

    // Se o usuário já está na página de assinatura, não faça nada!
    if (window.location.pathname.includes("assinatura.html")) {
        console.log("Já estamos na página de assinatura. Sem bloqueios.");
        return true;
    }

    console.log("==== INICIANDO VERIFICAÇÃO DE ASSINATURA ====");

    const resultado = await possuiAssinaturaAtiva();

    console.log("Resultado da verificação:", resultado);

    if (!resultado.possui) {
        console.log("Redirecionando para assinatura.html");
        window.location.href = "assinatura.html";
        return false;
    }

    console.log("Usuário autorizado.");
    return true;
}