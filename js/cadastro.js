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
console.log("CADASTRO.JS VERSÃO 2026-VEICULO");
console.log("ARQUIVO CADASTRO.JS -> 27/07 21:35");

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

// Elementos específicos centralizados
const nomePet = document.getElementById("nomePet");
const nomeTutor = document.getElementById("nomeTutor");
const cidade = document.getElementById("cidade");
const telefone = document.getElementById("telefone");
const marca = document.getElementById("marca");
const modelo = document.getElementById("modelo");
const cor = document.getElementById("cor");
const placa = document.getElementById("placa");
const tipoSanguineo = document.getElementById("tipoSanguineo");
const condicaoMedica = document.getElementById("condicaoMedica");
const nomeEmergencia = document.getElementById("nomeEmergencia");
const telefoneEmergencia = document.getElementById("telefoneEmergencia");
const parentescoEmergencia = document.getElementById("parentescoEmergencia");

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
                if (nomePet) nomePet.value = pet.nome_pet || "";
                if (nomeTutor) nomeTutor.value = pet.nome_tutor || "";
                if (cidade) cidade.value = pet.cidade || "";
                if (telefone) telefone.value = pet.telefone || "";
                
                if (pet.tipo) {
                    campoTipo.value = pet.tipo;
                }

                campoCategoria.value = pet.categoria || "";
                contatoNome.value = pet.contato_nome || "";
                contatoTelefone.value = pet.contato_telefone || "";
                contatoParentesco.value = pet.contato_parentesco || "";

                // Campos específicos de Veículo
                if (marca) marca.value = pet.marca || "";
                if (modelo) modelo.value = pet.modelo || "";
                if (cor) cor.value = pet.cor || "";
                if (placa) placa.value = pet.placa || "";

                // Campos de Saúde / Emergência
                if (tipoSanguineo) tipoSanguineo.value = pet.tipo_sanguineo || "";
                if (condicaoMedica) condicaoMedica.value = pet.condicao_medica || "";
                if (nomeEmergencia) nomeEmergencia.value = pet.nome_emergencia || "";
                if (telefoneEmergencia) telefoneEmergencia.value = pet.telefone_emergencia || "";
                if (parentescoEmergencia) parentescoEmergencia.value = pet.parentesco_emergencia || "";

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

    // Montagem limpa utilizando as constantes do DOM já mapeadas
    const dadosFormulario = {
        nome_pet: nomePet ? nomePet.value : null,
        nome_tutor: nomeTutor ? nomeTutor.value : null,
        cidade: cidade ? cidade.value : null,
        telefone: telefone ? telefone.value : null,
        tipo: campoTipo.value,
        categoria: campoCategoria.value,
        contato_nome: contatoNome.value,
        contato_telefone: contatoTelefone.value,
        contato_parentesco: contatoParentesco.value,
        
        // Veículos
        marca: marca ? marca.value : null,
        modelo: modelo ? modelo.value : null,
        cor: cor ? cor.value : null,
        placa: placa ? placa.value : null,
        
        // Saúde
        tipo_sanguineo: tipoSanguineo ? tipoSanguineo.value : null,
        condicao_medica: condicaoMedica ? condicaoMedica.value : null,

        // Emergência
        nome_emergencia: nomeEmergencia ? nomeEmergencia.value : null,
        telefone_emergencia: telefoneEmergencia ? telefoneEmergencia.value : null,
        parentesco_emergencia: parentescoEmergencia ? parentescoEmergencia.value : null,

        foto: fotoBase64,
        foto2: fotoBase642,
        foto3: fotoBase643,
        user_id: user.id
    };

    console.log("DADOS PRONTOS PARA ENVIAR:", dadosFormulario);

    // ==================================================
    // EXECUÇÃO UNIFICADA (UPDATE OU INSERT)
    // ==================================================
    let resposta;
    
    if (idEdicao) {
        console.log("EXECUTANDO UPDATE...");
        resposta = await banco
            .from("pets")
            .update(dadosFormulario)
            .eq("id", idEdicao)
            .select();
    } else {
        console.log("EXECUTANDO INSERT...");
        resposta = await banco
            .from("pets")
            .insert([dadosFormulario])
            .select();
    }

    console.log("RESPOSTA COMPLETA DO SUPABASE:", resposta);

    if (resposta.error) {
        console.error("ERRO DO SUPABASE:", resposta.error);
        alert("Erro ao salvar: " + resposta.error.message);
        return;
    }

    if (!idEdicao) {
        localStorage.removeItem("ultimoPet");
    }

    alert(idEdicao ? "Atualizado com sucesso!" : "Cadastrado com sucesso!");
    window.location.href = "meus-pets.html";
});