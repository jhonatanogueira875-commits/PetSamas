/*
==========================================================
PetSamas
Arquivo: cadastro.js

Responsável por:
✔ Cadastro de pets/itens/veículos
✔ Edição de pets/itens/veículos
✔ Upload das fotos
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
const campoCategoria = document.getElementById("categoria");
const contatoNome = document.getElementById("contatoNome");
const contatoTelefone = document.getElementById("contatoTelefone");
const contatoParentesco = document.getElementById("contatoParentesco");

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
// CARREGAR REGISTRO (EDIÇÃO)
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
                // Campos comuns
                if (document.getElementById("nomePet")) document.getElementById("nomePet").value = pet.nome_pet || "";
                if (document.getElementById("nomeTutor")) document.getElementById("nomeTutor").value = pet.nome_tutor || "";
                if (document.getElementById("cidade")) document.getElementById("cidade").value = pet.cidade || "";
                if (document.getElementById("telefone")) document.getElementById("telefone").value = pet.telefone || "";
                
                if (pet.tipo) {
                    campoTipo.value = pet.tipo;
                }

                campoCategoria.value = pet.categoria || "";
                contatoNome.value = pet.contato_nome || "";
                contatoTelefone.value = pet.contato_telefone || "";
                contatoParentesco.value = pet.contato_parentesco || "";

                // Campos específicos de Veículo (caso existam no HTML)
                if (document.getElementById("marca")) document.getElementById("marca").value = pet.marca || "";
                if (document.getElementById("modelo")) document.getElementById("modelo").value = pet.modelo || "";
                if (document.getElementById("cor")) document.getElementById("cor").value = pet.cor || "";
                if (document.getElementById("placa")) document.getElementById("placa").value = pet.placa || "";
                if (document.getElementById("tipoSanguineo")) document.getElementById("tipoSanguineo").value = pet.tipo_sanguineo || "";
                if (document.getElementById("condicaoMedica")) document.getElementById("condicaoMedica").value = pet.condicao_medica || "";

                // Dispara o evento change ou função visual se necessário para atualizar a exibição dos blocos na edição
                if (typeof atualizarCampos === "function") {
                    atualizarCampos();
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

    // Montagem segura dos dados considerando elementos opcionais/condicionais no HTML
    const dadosFormulario = {
        nome_pet: document.getElementById("nomePet") ? document.getElementById("nomePet").value : null,
        nome_tutor: document.getElementById("nomeTutor") ? document.getElementById("nomeTutor").value : null,
        cidade: document.getElementById("cidade") ? document.getElementById("cidade").value : null,
        telefone: document.getElementById("telefone") ? document.getElementById("telefone").value : null,
        tipo: campoTipo.value,
        categoria: campoCategoria.value,
        contato_nome: contatoNome.value,
        contato_telefone: contatoTelefone.value,
        contato_parentesco: contatoParentesco.value,
        
        // Novos campos para Veículos / Saúde (Certifique-se de que os IDs no HTML batem com estes)
        marca: document.getElementById("marca") ? document.getElementById("marca").value : null,
        modelo: document.getElementById("modelo") ? document.getElementById("modelo").value : null,
        cor: document.getElementById("cor") ? document.getElementById("cor").value : null,
        placa: document.getElementById("placa") ? document.getElementById("placa").value : null,
        tipo_sanguineo: document.getElementById("tipoSanguineo") ? document.getElementById("tipoSanguineo").value : null,
        condicao_medica: document.getElementById("condicaoMedica") ? document.getElementById("condicaoMedica").value : null,

        foto: fotoBase64,
        foto2: fotoBase642,
        foto3: fotoBase643,
        user_id: user.id
    };

    // ==================================================
    // EDITAR PET / ITEM / VEÍCULO
    // ==================================================

    if (idEdicao) {
        const { error } = await banco
            .from("pets")
            .update(dadosFormulario)
            .eq("id", idEdicao);

        if (error) {
            console.error("Erro ao atualizar:", error);
            alert("Erro ao atualizar: " + error.message);
            return;
        }

        alert("Atualizado com sucesso!");
        window.location.href = "meus-pets.html";
        return;
    }

    // ==================================================
    // NOVO PET / ITEM / VEÍCULO
    // ==================================================

    const { error } = await banco
        .from("pets")
        .insert([dadosFormulario]);

    if (error) {
        console.error("Erro ao cadastrar:", error);
        alert("Erro ao cadastrar: " + error.message);
        return;
    }

    localStorage.removeItem("ultimoPet");
    alert("Cadastrado com sucesso!");
    window.location.href = "meus-pets.html";
});