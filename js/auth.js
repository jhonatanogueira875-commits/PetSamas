/*
==========================================================
PetSamas
Arquivo: auth.js

Proteção das páginas privadas
Utiliza a autenticação central do SafeSamas
==========================================================
*/

async function verificarLogin() {

    const { data, error } = await banco.auth.getSession();

    if (error) {

        console.error("Erro ao verificar sessão:", error);

        window.location.href = "../login.html";

        return;

    }

    if (!data.session) {

        window.location.href = "../login.html";

        return;

    }

}