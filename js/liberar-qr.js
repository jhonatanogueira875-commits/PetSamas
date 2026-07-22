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
    // BLOQUEIO DO QR ONLINE (O Físico passa direto por aqui se for o caso, 
    // ou tratamos a origem. Como aqui é a rota do gerador online, travamos aqui!)
    //--------------------------------------------------
    
    alert("A emissão de novos QR Codes online está temporariamente em manutenção para ajuste de pagamentos. Utilize uma tag física ou entre em contato com o suporte.");
    window.location.href = "meus-pets.html";
    return;

    // (A função gerar_qr_pet via RPC só será religada 
    // quando integrarmos o botão de pagamento do Mercado Pago)
};