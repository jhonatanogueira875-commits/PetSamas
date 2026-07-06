/*
==========================================================
PetSamas - Login.js
==========================================================

Responsável por:

✔ Realizar login
✔ Identificar administrador
✔ Redirecionar administrador para o painel
✔ Redirecionar usuários comuns
==========================================================
*/

// ======================================================
// ADMINISTRADOR
// ======================================================

const EMAIL_ADMIN = "nogueira100988@outlook.com";

// ======================================================
// FORMULÁRIO
// ======================================================

const formulario = document.getElementById("formLogin");

formulario.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();

    const senha = document.getElementById("senha").value;

    // ==================================================
    // LOGIN
    // ==================================================

    const { data, error } = await banco.auth.signInWithPassword({

        email,
        password: senha

    });

    if (error) {

        alert("E-mail ou senha inválidos.");

        return;

    }

    const user = data.user;

    // ==================================================
    // ADMINISTRADOR
    // ==================================================

    if (

        user.email &&
        user.email.toLowerCase() === EMAIL_ADMIN.toLowerCase()

    ) {

        window.location.href = "admin.html";

        return;

    }

    // ==================================================
    // BUSCAR PETS
    // ==================================================

    const { data: pets, error: erroPets } = await banco
        .from("pets")
        .select("id")
        .eq("user_id", user.id);

    if (erroPets) {

        alert("Erro ao carregar dados.");

        return;

    }

    // ==================================================
    // REDIRECIONAMENTO
    // ==================================================

    if (pets.length === 0) {

        window.location.href = "cadastro.html";

    } else {

        window.location.href = "meus-pets.html";

    }

});