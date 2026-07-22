/*
==========================================================
Safe Samas
Arquivo: liberar-qr.js
==========================================================
*/

// ==========================================================
// CONFIGURAÇÃO TEMPORÁRIA
// ==========================================================

// true  = bloqueia geração automática do QR Online
// false = libera novamente (quando Mercado Pago estiver pronto)

const BLOQUEAR_QR_ONLINE = true;

// ==========================================================

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
    // BLOQUEIO TEMPORÁRIO DO QR ONLINE
    //--------------------------------------------------

    if (BLOQUEAR_QR_ONLINE) {

        alert(
            "A geração automática de QR Online está temporariamente indisponível enquanto finalizamos a integração dos pagamentos."
        );

        window.location.href = "meus-pets.html";
        return;

    }

    //--------------------------------------------------
    // Gera QR automaticamente
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
    // Abre a página do QR
    //--------------------------------------------------

    window.location.href = `qr-code.html?id=${petId}`;

};