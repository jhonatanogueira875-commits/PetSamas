/*
==========================================================
PetSamas
Arquivo: cadastro.js

Responsável por:

✔ Novo cadastro
✔ Editar cadastro
✔ Salvar foto
✔ Salvar no Supabase
==========================================================
*/


// ======================================================
// ELEMENTOS
// ======================================================

const formulario = document.getElementById("formCadastro");

const campoFoto = document.getElementById("foto");


// ======================================================
// PARÂMETROS DA URL
// ======================================================

const parametros = new URLSearchParams(window.location.search);

const idEdicao = parametros.get("id");


// ======================================================
// FOTO
// ======================================================

let fotoBase64 = "";


// ======================================================
// CONVERTER FOTO
// ======================================================

campoFoto.addEventListener("change", function () {

    const arquivo = campoFoto.files[0];

    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = function (evento) {

        fotoBase64 = evento.target.result;

    };

    leitor.readAsDataURL(arquivo);

});


// ======================================================
// CARREGA PET PARA EDIÇÃO
// ======================================================

async function carregarPet() {

    if (!idEdicao) return;

    const { data, error } = await banco

        .from("pets")

        .select("*")

        .eq("id", Number(idEdicao))

        .single();


    if (error) {

        console.error(error);

        alert("Erro ao carregar pet.");

        return;

    }

    document.getElementById("nomePet").value = data.nome_pet;

    document.getElementById("nomeTutor").value = data.nome_tutor;

    document.getElementById("cidade").value = data.cidade;

    document.getElementById("telefone").value = data.telefone;

    fotoBase64 = data.foto || "";

}

carregarPet();


// ======================================================
// SALVAR
// ======================================================

formulario.addEventListener("submit", async function (event) {

    event.preventDefault();


    const pet = {

        nome_pet: document.getElementById("nomePet").value,

        nome_tutor: document.getElementById("nomeTutor").value,

        cidade: document.getElementById("cidade").value,

        telefone: document.getElementById("telefone").value,

        foto: fotoBase64

    };


    // ==================================================
    // EDITAR
    // ==================================================

    if (idEdicao) {

        const { error } = await banco

            .from("pets")

            .update(pet)

            .eq("id", Number(idEdicao));


        if (error) {

            console.error(error);

            alert("Erro ao atualizar pet.");

            return;

        }

        window.location.href = "meus-pets.html";

        return;

    }


    // ==================================================
    // NOVO CADASTRO
    // ==================================================

    const { data, error } = await banco

        .from("pets")

        .insert([pet])

        .select()

        .single();


    if (error) {

        console.error(error);

        alert("Erro ao cadastrar pet.");

        return;

    }


    localStorage.setItem(

        "ultimoPet",

        data.id

    );

    window.location.href = "cadastro-sucesso.html";

});