/*
==========================================================
PetSamas
Arquivo: cadastro.js
==========================================================
*/

// ======================================================
// ELEMENTOS
// ======================================================

const formulario = document.getElementById("formCadastro");
const campoFoto = document.getElementById("foto");

// ======================================================
// URL PARAM (EDIÇÃO)
// ======================================================

const parametros = new URLSearchParams(window.location.search);
const idEdicao = parametros.get("id");

// ======================================================
// FOTO
// ======================================================

let fotoBase64 = "";

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
// CARREGAR PETS (EDIÇÃO)
// ======================================================

let pets = [];

async function carregarPets() {
    const { data, error } = await banco
        .from("pets")
        .select("*");

    if (!error) {
        pets = data;
        if (idEdicao) {
            const pet = pets.find(p => p.id == idEdicao);
            if (pet) {
                document.getElementById("nomePet").value = pet.nome_pet;
                document.getElementById("nomeTutor").value = pet.nome_tutor;
                document.getElementById("cidade").value = pet.cidade;
                document.getElementById("telefone").value = pet.telefone;
                fotoBase64 = pet.foto || "";
            }
        }
    }
}

carregarPets();

// ======================================================
// PEGAR USUÁRIO LOGADO
// ======================================================

async function getUser() {
    const { data } = await banco.auth.getUser();
    return data.user;
}

// ======================================================
// SUBMIT
// ======================================================

formulario.addEventListener("submit", async function (event) {
    event.preventDefault();

    const user = await getUser();

    if (!user) {
        alert("Usuário não autenticado.");
        window.location.href = "login.html";
        return;
    }

    // ==============================================
    // EDITAR
    // ==============================================

    if (idEdicao) {
        const { error } = await banco
            .from("pets")
            .update({
                nome_pet: document.getElementById("nomePet").value,
                nome_tutor: document.getElementById("nomeTutor").value,
                cidade: document.getElementById("cidade").value,
                telefone: document.getElementById("telefone").value,
                foto: fotoBase64
            })
            .eq("id", idEdicao);

        if (error) {
            alert("Erro ao atualizar pet.");
            return;
        }

        // Redireciona para o Painel
        window.location.href = "painel.html";
        return;
    }

    // ==============================================
    // NOVO CADASTRO
    // ==============================================

    const novoPet = {
        nome_pet: document.getElementById("nomePet").value,
        nome_tutor: document.getElementById("nomeTutor").value,
        cidade: document.getElementById("cidade").value,
        telefone: document.getElementById("telefone").value,
        foto: fotoBase64,
        user_id: user.id
    };

    const { error } = await banco
        .from("pets")
        .insert([novoPet]);

    if (error) {
        alert("Erro ao cadastrar pet.");
        return;
    }

    localStorage.removeItem("ultimoPet");

    // Redireciona para o Painel após novo cadastro
    window.location.href = "painel.html";
});