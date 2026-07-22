/*
==========================================================
Safe Samas
Arquivo: assinatura.js

Responsável por:

✔ Consultar os créditos do usuário logado
(temporariamente utilizando a tabela "assinaturas")
==========================================================
*/

// ==========================================================
// CONSULTA CRÉDITOS DO USUÁRIO
// ==========================================================

async function possuiAssinaturaAtiva() {

    //------------------------------------------------------
    // Usuário logado
    //------------------------------------------------------

    const {
        data: { user }
    } = await banco.auth.getUser();

    if (!user) {

        console.log("Usuário não autenticado.");

        return {
            autenticado: false,
            possui: false,
            status: null,
            assinatura: null,
            creditos: 0
        };

    }

    //------------------------------------------------------
    // Busca registro mais recente
    //------------------------------------------------------

    const { data, error } = await banco

        .from("assinaturas")

        .select("*")

        .eq("user_id", user.id)

        .order("created_at", { ascending: false })

        .limit(1);

    if (error) {

        console.error("Erro ao consultar créditos:", error);

        return {
            autenticado: true,
            possui: false,
            status: null,
            assinatura: null,
            creditos: 0
        };

    }

    console.log("Resultado da consulta:", data);

    //------------------------------------------------------
    // Nenhum registro encontrado
    //------------------------------------------------------

    if (!data || data.length === 0) {

        return {
            autenticado: true,
            possui: false,
            status: null,
            assinatura: null,
            creditos: 0
        };

    }

    //------------------------------------------------------
    // Registro encontrado
    //------------------------------------------------------

    const assinatura = data[0];

    const creditos = assinatura.creditos ?? 0;

    return {

        autenticado: true,

        // Temporariamente "possui" significa:
        // possui pelo menos 1 crédito disponível
        possui: creditos > 0,

        status: assinatura.status,

        assinatura,

        creditos

    };

}