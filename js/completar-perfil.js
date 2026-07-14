/*
==========================================================
Arquivo: js/completar-perfil.js
==========================================================
*/

async function salvarPerfil() {

    const telefone = document.getElementById("telefone").value.trim();
    const cidade = document.getElementById("cidade").value.trim();

    const { data } = await banco.auth.getUser();

    if (!data.user) {

        window.location.href = "login.html";
        return;

    }

    const { error } = await banco
        .from("profiles")
        .update({

            telefone: telefone,
            cidade: cidade

        })
        .eq("id", data.user.id);

    if (error) {

        console.error(error);
        alert("Erro ao salvar o perfil.");
        return;

    }

    alert("Cadastro atualizado com sucesso!");

    window.location.href = "meus-pets.html";

}

function pular() {

    window.location.href = "meus-pets.html";

}