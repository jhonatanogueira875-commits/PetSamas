/*
==========================================================
PetSamas
Arquivo: recuperar-senha.js

Responsável por:

✔ Recuperação de senha
==========================================================
*/

// ======================================================
// FORMULÁRIO
// ======================================================

const form = document.getElementById("formRecuperar");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    if (!email) {

        alert("Informe seu e-mail.");

        return;

    }

    const { error } = await banco.auth.resetPasswordForEmail(
        email,
        {
            redirectTo:
                "https://jhonatanogueira875-commits.github.io/PetSamas/nova-senha.html"
        }
    );

    if (error) {

        alert("Erro ao enviar o e-mail.\n\n" + error.message);

        return;

    }

    alert(
        "Enviamos um link para recuperação da senha.\n\nVerifique também a caixa de spam."
    );

    window.location.href = "login.html";

});