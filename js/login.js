/*
==========================================================
PetSamas
Arquivo: login.js

Responsável por:

✔ Login do usuário
✔ Verificar se possui pets cadastrados
✔ Redirecionamento inteligente
==========================================================
*/

// ======================================================
// FORMULÁRIO
// ======================================================

const formulario = document.getElementById("formLogin");

// ======================================================
// LOGIN
// ======================================================

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

    // ==================================================
    // USUÁRIO LOGADO
    // ==================================================

    const user = data.user;

    // ==================================================
    // VERIFICA SE POSSUI PETS
    // ==================================================

    const { data: pets, error: erroPets } = await banco

        .from("pets")

        .select("id")

        .eq("user_id", user.id);

    if (erroPets) {

        alert("Erro ao carregar os dados.");

        return;

    }

    alert("Login realizado com sucesso!");

    // ==================================================
    // REDIRECIONAMENTO
    // ==================================================

    if (pets.length === 0) {

        window.location.href = "cadastro.html";

    } else {

        window.location.href = "meus-pets.html";

    }

});