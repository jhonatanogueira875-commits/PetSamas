/*
==========================================================
Safe Samas

Arquivo:
liberar-qr.js

Responsável por:

✔ Verificar login

✔ Verificar assinatura

✔ Encaminhar usuário
==========================================================
*/

(async () => {

    //--------------------------------------------------
    // Usuário logado
    //--------------------------------------------------

    const {
        data: { user }
    } = await banco.auth.getUser();

    console.log("Usuário logado:", user);

    if (!user) {

        console.log("Usuário não encontrado, redirecionando para login.");
        window.location.href = "login.html";

        return;

    }

    //--------------------------------------------------
    // ID do pet recebido pela URL
    //--------------------------------------------------

    const params = new URLSearchParams(window.location.search);
    const petId = params.get("id");

    console.log("Pet selecionado:", petId);

    //--------------------------------------------------
    // Assinatura
    //--------------------------------------------------

    const assinaturaAtiva = await possuiAssinaturaAtiva();
    console.log("Resultado da assinatura:", assinaturaAtiva);

    //--------------------------------------------------
    // Possui assinatura
    //--------------------------------------------------

    if (assinaturaAtiva.possui) {

        console.log("Assinatura válida. Redirecionando para QR Code.");

        window.location.href = `qr-code.html?id=${petId}`;

        return;

    }

    //--------------------------------------------------
    // Não possui assinatura
    //--------------------------------------------------

    console.log("Assinatura não encontrada ou expirada. Redirecionando para assinatura.html");

    window.location.href = "assinatura.html";

})();