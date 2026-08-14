/*
==========================================================
Safe Samas
Arquivo: liberar-qr.js
==========================================================
*/

const parametros = new URLSearchParams(window.location.search);
const petId = Number(parametros.get("id"));

window.onload = async function () {

    //--------------------------------------------------
    // Usuário logado
    //--------------------------------------------------

    const {
        data: { user }
    } = await banco.auth.getUser();

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    //--------------------------------------------------
    // Pet informado
    //--------------------------------------------------

    if (!petId) {

        alert("Pet não identificado.");

        window.location.href = "meus-pets.html";

        return;

    }

    //--------------------------------------------------
    // Verifica se já existe QR
    //--------------------------------------------------

    const { data: qrExistente } = await banco

        .from("qrcodes")

        .select("*")

        .eq("pet_id", petId)

        .eq("status", "ativado")

        .maybeSingle();

    if (qrExistente) {

        window.location.href = `qr-code.html?id=${petId}`;

        return;

    }

    //--------------------------------------------------
    // Busca assinatura / créditos
    //--------------------------------------------------

    const { data: assinatura, error: erroAssinatura } = await banco

        .from("assinaturas")

        .select("*")

        .eq("user_id", user.id)

        .maybeSingle();

    if (erroAssinatura) {

        console.error(erroAssinatura);

        alert("Erro ao verificar seus créditos.");

        return;

    }

    //--------------------------------------------------
    // Não possui cadastro de créditos
    //--------------------------------------------------

    if (!assinatura) {

        window.location.href = "comprar.html";

        return;

    }

    //--------------------------------------------------
    // Créditos insuficientes
    //--------------------------------------------------

    const creditos = assinatura.creditos ?? 0;

    if (creditos <= 0) {

        window.location.href = "comprar.html";

        return;

    }

    //--------------------------------------------------
    // Gera novo QR
    //--------------------------------------------------

    const { data, error } = await banco.rpc("gerar_qr_pet", {
        p_pet_id: petId
    });

    if (error) {

        console.error(error);

        alert("Erro ao gerar QR.");

        return;

    }

    //--------------------------------------------------
    // Consome 1 crédito
    //--------------------------------------------------

    const { error: erroCredito } = await banco

        .from("assinaturas")

        .update({

            creditos: creditos - 1

        })

        .eq("id", assinatura.id);

    if (erroCredito) {

        console.error(erroCredito);

        alert("QR gerado, mas ocorreu um erro ao atualizar os créditos.");

    }

    //--------------------------------------------------
    // Abre a página do QR
    //--------------------------------------------------

    window.location.href = `qr-code.html?id=${petId}`;

};