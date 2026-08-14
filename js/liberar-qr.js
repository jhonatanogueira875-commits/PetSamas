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
    // Abre a página do QR
    //--------------------------------------------------

    window.location.href = `qr-code.html?id=${petId}`;

};