/*
==========================================================
PetSamas
Arquivo: auth.js

Responsável por:

✔ Verificar se existe usuário logado
✔ Proteger páginas privadas
==========================================================
*/


// ======================================================
// VERIFICA USUÁRIO LOGADO
// ======================================================

async function verificarLogin() {

    const {

        data: {

            session

        }

    } = await banco.auth.getSession();


    if (!session) {

        window.location.href = "login.html";

        return;

    }

}