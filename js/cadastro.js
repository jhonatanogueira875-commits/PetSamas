/*
==========================================================
PetSamas
Arquivo: cadastro.js

Responsável por:
✔ Cadastro de pets/itens
✔ Edição de pets/itens
✔ Upload da foto
==========================================================
*/

// ======================================================
// ELEMENTOS
// ======================================================

const formulario = document.getElementById("formCadastro");
const campoFoto = document.getElementById("foto");
const campoFoto2 = document.getElementById("foto2");
const campoFoto3 = document.getElementById("foto3");
const campoTipo = document.getElementById("tipo");

// ======================================================
// URL PARAM (EDIÇÃO)
// ======================================================

const parametros = new URLSearchParams(window.location.search);
const idEdicao = parametros.get("id");

// ======================================================
// FOTO
// ======================================================

let fotoBase64 = "";
let fotoBase642 = "";
let fotoBase643 = "";

campoFoto.addEventListener("change", function () {
    const arquivo = campoFoto.files[0];
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = function (evento) {
        fotoBase64 = evento.target.result;
    };
    leitor.readAsDataURL(arquivo);
});

if (campoFoto2) {
    campoFoto2.addEventListener("change", function () {
        const arquivo = campoFoto2.files[0];
        if (!arquivo) return;
        const leitor = new FileReader();
        leitor.onload = function (evento) {
            fotoBase642 = evento.target.result;
        };
        leitor.readAsDataURL(arquivo);
    });
}

if (campoFoto3) {
    campoFoto3.addEventListener("change", function () {
        const arquivo = campoFoto3.files[0];
        if (!arquivo) return;
        const leitor = new FileReader();
        leitor.onload = function (evento) {
            fotoBase643 = evento.target.result;
        };
        leitor.readAsDataURL(arquivo);
    });
}

// ======================================================
// CARREGAR PET (EDIÇÃO)
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
                
                if (pet.tipo) {
                    campoTipo.value = pet.tipo;
                }

                fotoBase64 = pet.foto || "";
                fotoBase642 = pet.foto2 || "";
                fotoBase643 = pet.foto3 || "";
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
// PROTEÇÃO DA PÁGINA
// ======================================================

(async () => {
    const autorizado = await protegerCadastro();
    if (!autorizado) {
        return;
    }
})();

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

    // ==================================================
    // EDITAR PET / ITEM
    // ==================================================

    if (idEdicao) {
        const { error } = await banco
            .from("pets")
            .update({
                nome_pet: document.getElementById("nomePet").value,
                nome_tutor: document.getElementById("nomeTutor").value,
                cidade: document.getElementById("cidade").value,
                telefone: document.getElementById("telefone").value,
                tipo: campoTipo.value,
                foto: fotoBase64,
                foto2: fotoBase642,
                foto3: fotoBase643
            })
            .eq("id", idEdicao);

        if (error) {
            alert("Erro ao atualizar.");
            return;
        }

        alert("Atualizado com sucesso!");
        window.location.href = "meus-pets.html";
        return;
    }

    // ==================================================
    // NOVO PET / ITEM
    // ==================================================

    const novoItem = {
        nome_pet: document.getElementById("nomePet").value,
        nome_tutor: document.getElementById("nomeTutor").value,
        cidade: document.getElementById("cidade").value,
        telefone: document.getElementById("telefone").value,
        tipo: campoTipo.value,
        foto: fotoBase64,
        foto2: "",
        foto3: "",
        user_id: user.id
    };

    const { error } = await banco
        .from("pets")
        .insert([novoItem]);

    if (error) {
        alert("Erro ao cadastrar.");
        return;
    }

    localStorage.removeItem("ultimoPet");
    alert("Cadastrado com sucesso!");
    window.location.href = "meus-pets.html";
});