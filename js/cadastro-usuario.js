/*
==========================================================
PetSamas
Arquivo: cadastro-usuario.js

Responsável por:

✔ Criar usuário
✔ Fazer login automático
✔ Criar perfil na tabela profiles
✔ Redirecionar para cadastro do primeiro pet
==========================================================
*/

const formulario = document.getElementById("formCadastroUsuario");

formulario.addEventListener("submit", async function (event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();

    const email = document.getElementById("email").value.trim();

    const senha = document.getElementById("senha").value;

    const confirmarSenha = document.getElementById("confirmarSenha").value;

    // ===============================================
    // VALIDAÇÃO
    // ===============================================

    if (senha !== confirmarSenha) {

        alert("As senhas não coincidem.");

        return;

    }

    // ===============================================
    // CRIAR CONTA
    // ===============================================

    const { error } = await banco.auth.signUp({

        email: email,

        password: senha,

        options: {

            data: {

                nome: nome

            }

        }

    });

    if (error) {

        alert(error.message);

        return;

    }

    // ===============================================
    // LOGIN AUTOMÁTICO
    // ===============================================

    const { error: erroLogin } = await banco.auth.signInWithPassword({

        email: email,

        password: senha

    });

    if (erroLogin) {

        alert("Conta criada com sucesso!\n\nAgora faça o login.");

        window.location.href = "login.html";

        return;

    }

    // ===============================================
    // OBTÉM O USUÁRIO LOGADO
    // ===============================================

    const {

        data: {

            user

        }

    } = await banco.auth.getUser();

    // ===============================================
    // CRIA O PERFIL
    // ===============================================

    if (user) {

        const { error: erroPerfil } = await banco
            .from("profiles")
            .upsert({

                id: user.id,

                nome: nome,

                telefone: "",

                cidade: "",

                avatar_url: ""

            });

        if (erroPerfil) {

            console.error("Erro ao criar perfil:", erroPerfil);

        }

    }

    // ===============================================
    // SUCESSO
    // ===============================================

    alert("Conta criada com sucesso!");

    window.location.href = "cadastro.html";

});