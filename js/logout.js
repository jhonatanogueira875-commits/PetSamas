/*
==========================================================
PetSamas
Arquivo: logout.js

Responsável por:

✔ Encerrar a sessão do usuário
✔ Redirecionar para a página inicial
==========================================================
*/


// ======================================================
// LOGOUT
// ======================================================

async function sair() {

    await banco.auth.signOut();

    window.location.href = "index.html";

}