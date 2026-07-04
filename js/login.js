/*
==========================================================
PetSamas - Login.js (Corrigido para GitHub Pages)
==========================================================
*/

const formulario = document.getElementById("formLogin");

formulario.addEventListener("submit", async function (event) {
    event.preventDefault();
    console.log("Tentando realizar login...");

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

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

    // Verifica pets
    const { data: pets, error: erroPets } = await banco
        .from("pets")
        .select("id")
        .eq("user_id", user.id);

    if (erroPets) {
        console.error("Erro ao buscar pets:", erroPets);
        alert("Erro ao carregar dados.");
        return;
    }

    // REDIRECIONAMENTO CORRIGIDO
    // Usamos caminhos relativos ao diretório atual para funcionar no GitHub Pages
    // Se o seu login.html está na pasta /PetSamas/, os outros arquivos também estão.
    
    console.log("Pets encontrados:", pets.length);

    if (pets.length === 0) {
        console.log("Redirecionando para cadastro.html...");
        window.location.href = "./cadastro.html"; 
    } else {
        console.log("Redirecionando para meus-pets.html...");
        window.location.href = "./meus-pets.html";
    }
});