/*
==========================================================
PetSamas
Arquivo: cadastro-usuario.js

Responsável por:

✔ Criar usuário no Supabase Auth
==========================================================
*/


// ======================================================
// FORMULÁRIO
// ======================================================

const formulario = document.getElementById("formCadastroUsuario");


// ======================================================
// SUBMIT
// ======================================================

formulario.addEventListener("submit", async function (event) {

    event.preventDefault();


    const nome = document.getElementById("nome").value.trim();

    const email = document.getElementById("email").value.trim();

    const senha = document.getElementById("senha").value;

    const confirmarSenha = document.getElementById("confirmarSenha").value;


    // ==================================================
    // VALIDAÇÃO
    // ==================================================

    if (senha !== confirmarSenha) {

        alert("As senhas não coincidem.");

        return;

    }


    // ==================================================
    // CRIA O USUÁRIO
    // ==================================================

    const { data, error } = await banco.auth.signUp({

        email: email,

        password: senha,

        options: {

            data: {

                nome: nome

            }

        }

    });


    // ==================================================
    // ERRO
    // ==================================================

    if (error) {

        alert(error.message);

        return;

    }


    // ==================================================
    // SUCESSO
    // ==================================================

    alert("Conta criada com sucesso!");

    window.location.href = "login.html";

});