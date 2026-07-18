/*
==========================================================
PetSamas
Arquivo: nova-senha.js

Responsável por:

✔ Alterar senha do usuário
✔ Validar confirmação
✔ Atualizar senha no Supabase
==========================================================
*/

// ======================================================
// FORMULÁRIO
// ======================================================

const form = document.getElementById("formNovaSenha");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const senha = document.getElementById("senha").value;

    const confirmarSenha = document.getElementById("confirmarSenha").value;

    // ==================================================
    // VALIDAÇÃO
    // ==================================================

    if (senha.length < 6) {

        alert("A senha deve possuir pelo menos 6 caracteres.");

        return;

    }

    if (senha !== confirmarSenha) {

        alert("As senhas não coincidem.");

        return;

    }

    // ==================================================
    // ALTERAR SENHA
    // ==================================================

    const { error } = await banco.auth.updateUser({

        password: senha

    });

    if (error) {

        alert("Erro ao alterar a senha.\n\n" + error.message);

        return;

    }

    alert(`Sua senha foi alterada com sucesso!

Faça login utilizando a nova senha.`
    );

    document.getElementById("senha").value = "";
    document.getElementById("confirmarSenha").value = "";
    window.location.href = "login.html";

});