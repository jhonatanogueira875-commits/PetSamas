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
    // Assinatura
    //--------------------------------------------------

    const assinaturaAtiva = await possuiAssinaturaAtiva();
    console.log("Resultado da assinatura:", assinaturaAtiva);

    //--------------------------------------------------
    // Possui assinatura
    //--------------------------------------------------

    if (assinaturaAtiva.possui) {

        console.log("Assinatura válida. Redirecionando para WhatsApp.");
        window.location.href = "https://wa.me/5542984097827";

        return;

    }

    //--------------------------------------------------
    // Não possui assinatura
    //--------------------------------------------------

    console.log("Assinatura não encontrada ou expirada. Redirecionando para assinatura.html");
    window.location.href = "assinatura.html";

})();