/*
==================================================
PetSamas
Sprint 4
Carregar pet pela URL
==================================================
*/

/*
==================================================
BANCO DE DADOS LOCAL
==================================================
*/

const pets = {

    "000001": {

        id: "000001",

        nome: "Thor",

        especie: "Cachorro",

        raca: "Labrador",

        sexo: "Macho",

        idade: "4 anos",

        porte: "Grande",

        cor: "Caramelo",

        tutor: "Jhonata",

        telefone: "5541999999999",

        cidade: "São Mateus do Sul - PR",

        foto: "assets/images/logo.png"

    },

    "000002": {

        id: "000002",

        nome: "Luna",

        especie: "Cachorro",

        raca: "Border Collie",

        sexo: "Fêmea",

        idade: "2 anos",

        porte: "Médio",

        cor: "Preto e Branco",

        tutor: "Maria",

        telefone: "5541988888888",

        cidade: "Curitiba - PR",

        foto: "assets/images/logo.png"

    },

    "000003": {

        id: "000003",

        nome: "Mel",

        especie: "Gato",

        raca: "SRD",

        sexo: "Fêmea",

        idade: "1 ano",

        porte: "Pequeno",

        cor: "Cinza",

        tutor: "Carlos",

        telefone: "5541977777777",

        cidade: "Piraquara - PR",

        foto: "assets/images/logo.png"

    }

};

/*
==================================================
FUNÇÃO:
Ler o ID informado na URL.

Exemplo:

pet.html?id=000001

Retorno:

000001
==================================================
*/

function obterIdDaURL() {

    const parametros = new URLSearchParams(window.location.search);

    return parametros.get("id");

}

/*
==================================================
FUNÇÃO:
Buscar o pet pelo ID.
==================================================
*/

function obterPet(id) {

    return pets[id];

}

/*
==================================================
FUNÇÃO:
Preencher a página.
==================================================
*/

function preencherPagina(pet) {

    document.getElementById("fotoPet").src = pet.foto;

    document.getElementById("nomePet").textContent =
        `🐶 Olá! Eu sou o ${pet.nome}!`;

    document.getElementById("statusPet").innerHTML =
        "<strong>📍 Estou perdido!</strong>";

    document.getElementById("mensagemPet").textContent =
        "Obrigado por me encontrar. Meu tutor provavelmente está me procurando.";

    document.getElementById("nomeTutor").textContent =
        pet.tutor;

    document.getElementById("cidadePet").textContent =
        pet.cidade;

    document.getElementById("linkWhatsapp").href =
        `https://wa.me/${pet.telefone}`;

}

/*
==================================================
FUNÇÃO:
Mostrar erro caso o ID não exista.
==================================================
*/

function mostrarErro() {

    document.getElementById("nomePet").textContent =
        "Pet não encontrado.";

    document.getElementById("statusPet").textContent = "";

    document.getElementById("mensagemPet").textContent =
        "Verifique se o link está correto.";

    document.getElementById("nomeTutor").textContent = "";

    document.getElementById("cidadePet").textContent = "";

    document.getElementById("linkWhatsapp").style.display = "none";

}

/*
==================================================
INÍCIO DO SISTEMA
==================================================
*/

const id = obterIdDaURL();

const pet = obterPet(id);

if (pet) {

    preencherPagina(pet);

} else {

    mostrarErro();

}