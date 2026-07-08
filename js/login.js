/*
==========================================================
PetSamas
Arquivo: login.js

Responsável por:

✔ Realizar login
✔ Identificar administrador
✔ Manter o QR Code pela URL
✔ Redirecionar corretamente
==========================================================
*/


// ======================================================
// ADMINISTRADOR
// ======================================================

const EMAIL_ADMIN = "nogueira100988@outlook.com";


// ======================================================
// LÊ O QR CODE DA URL
// ======================================================

const parametros = new URLSearchParams(window.location.search);
const codigoQR = parametros.get("codigo");

// DEBUG DE ENTRADA
console.log("LOGIN - URL:", window.location.href);
console.log("LOGIN - codigoQR:", codigoQR);


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
    // BUSCA PETS DO USUÁRIO
    // ==================================================

    const { data: pets, error: erroPets } = await banco

        .from("pets")

        .select("id")

        .eq("user_id", user.id);

    if (erroPets) {

        alert("Erro ao carregar os pets.");

        return;

    }


    // ==================================================
    // REDIRECIONAMENTO
    // ==================================================

    if (pets.length === 0) {

        if (codigoQR) {

            window.location.href = `cadastro.html?codigo=${codigoQR}`;

        } else {

            window.location.href = "cadastro.html";

        }

        return;

    }

    // DEBUG DE SAÍDA
    console.log("REDIRECIONANDO PARA:");
    console.log(`meus-pets.html?codigo=${codigoQR}`);

    if (codigoQR) {

        window.location.href = `meus-pets.html?codigo=${codigoQR}`;

    } else {

        window.location.href = "meus-pets.html";

    }

});