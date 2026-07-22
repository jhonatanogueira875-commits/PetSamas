/*
==========================================================
Safe Samas
Arquivo: assinatura.js

Responsável por:

✔ Consultar a assinatura do usuário logado
==========================================================
*/

// ==========================================================
// CONSULTA ASSINATURA DO USUÁRIO
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
            assinatura: null
        };

    }

    //------------------------------------------------------
    // Busca assinatura mais recente
    //------------------------------------------------------

    const { data, error } = await banco

        .from("assinaturas")

        .select("*")

        .eq("user_id", user.id)

        .order("created_at", { ascending: false })

        .limit(1);

    if (error) {

        console.error("Erro ao consultar assinatura:", error);

        return {
            autenticado: true,
            possui: false,
            status: null,
            assinatura: null
        };

    }

    console.log("Resultado da consulta:", data);

    //------------------------------------------------------
    // Nenhuma assinatura encontrada
    //------------------------------------------------------

    if (!data || data.length === 0) {

        return {
            autenticado: true,
            possui: false,
            status: null,
            assinatura: null
        };

    }

    //------------------------------------------------------
    // Assinatura encontrada
    //------------------------------------------------------

    const assinatura = data[0];

    const ativa =

        assinatura.status === "active" &&

        new Date(assinatura.data_fim) > new Date();

    return {

        autenticado: true,

        possui: ativa,

        status: assinatura.status,

        assinatura

    };

}