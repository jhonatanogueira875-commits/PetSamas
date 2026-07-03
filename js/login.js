/*
==========================================================
PetSamas
Arquivo: login.js

Responsável por:

✔ Login do usuário
✔ Autenticação com Supabase Auth
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
    // LOGIN NO SUPABASE
    // ==================================================

    const { data, error } = await banco.auth.signInWithPassword({

        email: email,

        password: senha

    });


    if (error) {

        alert("E-mail ou senha inválidos.");

        return;

    }


    alert("Login realizado com sucesso!");

    window.location.href = "meus-pets.html";

});