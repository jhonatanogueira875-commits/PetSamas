/*
==========================================================
PetSamas - Login.js (Versão Definitiva - Caminhos Absolutos)
==========================================================
*/

const formulario = document.getElementById("formLogin");

formulario.addEventListener("submit", async function (event) {
    event.preventDefault();
    console.log("Tentando realizar login...");

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    // Autenticação no Supabase
    const { data, error } = await banco.auth.signInWithPassword({
        email,
        password: senha
    });

    if (error) {
        alert("E-mail ou senha inválidos.");
        return;
    }

    const user = data.user;
    console.log("Login efetuado com ID:", user.id);

    // Consulta de pets no banco de dados
    const { data: pets, error: erroPets } = await banco
        .from("pets")
        .select("id")
        .eq("user_id", user.id);

    if (erroPets) {
        console.error("Erro ao buscar pets:", erroPets);
        alert("Erro ao carregar dados.");
        return;
    }

    console.log("Pets encontrados:", pets.length);

    // Redirecionamento forçado pela raiz do repositório /PetSamas/
    if (pets.length === 0) {
        console.log("Redirecionando para cadastro.html...");
        window.location.href = "/PetSamas/cadastro.html";
    } else {
        console.log("Redirecionando para meus-pets.html...");
        window.location.href = "/PetSamas/meus-pets.html";
    }
});