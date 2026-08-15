/*
==========================================================
PetSamas
Arquivo: cadastro.js

Responsável por:
✔ Cadastro de pets/itens/veículos/humanos
✔ Edição de cadastros
✔ Upload das fotos com compressão inteligente
==========================================================
*/
console.log("CADASTRO.JS VERSÃO 2026-HUMANO");
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

// Elemento específico para Tipo Humano
const tipoHumano = document.getElementById("tipoHumano");
const grupoTipoHumano = document.getElementById("grupoTipoHumano");

// ======================================================
// REVISÃO DAS INFORMAÇÕES MÉDICAS
// ======================================================
const blocoRevisaoSaude = document.getElementById("blocoRevisaoSaude");
const confirmarRevisaoSaude = document.getElementById("confirmarRevisaoSaude");
const textoUltimaRevisao = document.getElementById("textoUltimaRevisao");

// Variável para guardar a data anterior e evitar sobrescrever sem querer
let ultimaRevisaoAnterior = null;

// ======================================================
// URL PARAM (EDIÇÃO)
// ======================================================
const parametros = new URLSearchParams(window.location.search);
const idEdicao = parametros.get("id");

// ======================================================
// FOTOS (BASE64)
// ======================================================
let fotoBase64 = "";
let fotoBase642 = "";
let fotoBase643 = "";

// ======================================================
// FUNÇÃO INTELIGENTE DE COMPRESSÃO DE IMAGEM
// ======================================================
function comprimirImagem(arquivo, limiteMaximo = 1000, qualidade = 0.75, callback) {
    const leitor = new FileReader();
    leitor.onload = function (evento) {
        const img = new Image();
        img.onload = function () {
            let largura = img.width;
            let altura = img.height;

            // Se a imagem já for menor ou igual ao limite em ambas as dimensões, não altera
            if (largura <= limiteMaximo && altura <= limiteMaximo) {
                callback(evento.target.result);
                return;
            }

            const canvas = document.createElement("canvas");

            // Redimensionamento proporcional considerando largura e altura máxima
            if (largura > altura) {
                if (largura > limiteMaximo) {
                    altura = Math.round((altura * limiteMaximo) / largura);
                    largura = limiteMaximo;
                }
            } else {
                if (altura > limiteMaximo) {
                    largura = Math.round((largura * limiteMaximo) / altura);
                    altura = limiteMaximo;
                }
            }

            canvas.width = largura;
            canvas.height = altura;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, largura, altura);

            // Preserva PNG se for o caso (ex: QR Codes, logos, transparências), senão compacta em JPEG
            const tipoSaida = arquivo.type === "image/png" ? "image/png" : "image/jpeg";
            const imagemComprimida = canvas.toDataURL(tipoSaida, qualidade);

            callback(imagemComprimida);
        };
        img.src = evento.target.result;
    };
    leitor.readAsDataURL(arquivo);
}

// Função unificada para tratar os inputs de upload de forma limpa
function prepararUpload(input, callback) {
    if (!input) return;
    input.addEventListener("change", function () {
        const arquivo = input.files[0];
        if (!arquivo) return;

        // Feedback visual amigável opcional no console/interface
        console.log("⏳ Otimizando imagem...");

        comprimirImagem(arquivo, 1000, 0.75, function (resultadoOtimizado) {
            callback(resultadoOtimizado);
            console.log("✅ Imagem otimizada com sucesso!");
        });
    });
}

// Ativando a preparação em lote para os campos de foto
prepararUpload(campoFoto, r => fotoBase64 = r);
prepararUpload(campoFoto2, r => fotoBase642 = r);
prepararUpload(campoFoto3, r => fotoBase643 = r);

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

                // Campo específico de Humano
                if (tipoHumano) {
                    tipoHumano.value = pet.tipo_humano || "";
                }

                // Campos de Saúde / Emergência
                if (tipoSanguineo) tipoSanguineo.value = pet.tipo_sanguineo || "";
                if (condicaoMedica) condicaoMedica.value = pet.condicao_medica || "";
                if (nomeEmergencia) nomeEmergencia.value = pet.nome_emergencia || "";
                if (telefoneEmergencia) telefoneEmergencia.value = pet.telefone_emergencia || "";
                if (parentescoEmergencia) parentescoEmergencia.value = pet.parentesco_emergencia || "";

                // ======================================================
                // REVISÃO DAS INFORMAÇÕES MÉDICAS
                // ======================================================
                ultimaRevisaoAnterior = pet.ultima_revisao_saude || null;

                if (confirmarRevisaoSaude) {
                    confirmarRevisaoSaude.checked =
                        pet.responsabilidade_confirmada || false;
                }

                if (textoUltimaRevisao) {
                    if (pet.ultima_revisao_saude) {
                        const data = new Date(pet.ultima_revisao_saude);
                        textoUltimaRevisao.innerHTML =
                            `<strong>Última revisão:</strong><br>${data.toLocaleDateString("pt-BR")} às ${data.toLocaleTimeString("pt-BR",{
                                hour:"2-digit",
                                minute:"2-digit"
                            })}`;
                    } else {
                        textoUltimaRevisao.innerHTML =
                            "<strong>Este cadastro ainda não possui revisão registrada.</strong>";
                    }
                }

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

    // ==================================================
    // VALIDAÇÃO DA REVISÃO MÉDICA PARA VEÍCULOS
    // ==================================================
    if (campoTipo.value === "veiculo") {
        if (!confirmarRevisaoSaude || !confirmarRevisaoSaude.checked) {
            alert("Por favor, confirme a veracidade das informações médicas e de emergência marcando a caixa de revisão.");
            if (confirmarRevisaoSaude) {
                confirmarRevisaoSaude.focus();
                confirmarRevisaoSaude.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return;
        }
    }

    const user = await getUser();
    if (!user) {
        alert("Usuário não autenticado.");
        window.location.href = "login.html";
        return;
    }

    // Montagem do payload otimizado
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

        // Humanos
        tipo_humano: tipoHumano ? tipoHumano.value : null,
        
        // Saúde
        tipo_sanguineo: tipoSanguineo ? tipoSanguineo.value : null,
        condicao_medica: condicaoMedica ? condicaoMedica.value : null,

        // Emergência
        nome_emergencia: nomeEmergencia ? nomeEmergencia.value : null,
        telefone_emergencia: telefoneEmergencia ? telefoneEmergencia.value : null,
        parentesco_emergencia: parentescoEmergencia ? parentescoEmergencia.value : null,

        // Revisão de Saúde
        responsabilidade_confirmada: confirmarRevisaoSaude ? confirmarRevisaoSaude.checked : false,
        ultima_revisao_saude: (confirmarRevisaoSaude && confirmarRevisaoSaude.checked)
            ? new Date().toISOString()
            : ultimaRevisaoAnterior,

        foto: fotoBase64,
        foto2: fotoBase642,
        foto3: fotoBase643,
        user_id: user.id
    };

    console.log("DADOS PRONTOS PARA ENVIAR:", dadosFormulario);

    // ==================================================
    // EXECUÇÃO UNIFICADA (UPDATE SEM .select() OU INSERT)
    // ==================================================
    let resposta;
    
    if (idEdicao) {
        console.log("EXECUTANDO UPDATE (SEM .select)...");
        resposta = await banco
            .from("pets")
            .update(dadosFormulario)
            .eq("id", idEdicao);
    } else {
        console.log("EXECUTANDO INSERT...");
        resposta = await banco
            .from("pets")
            .insert([dadosFormulario])
            .select();
    }

    console.log("RESPOSTA COMPLETA DO SUPABASE:", resposta);
    console.log("ERROR:", resposta.error);
    console.log("DATA:", resposta.data);

    if (resposta.error) {
        console.error("ERRO COMPLETO DO SUPABASE:", JSON.stringify(resposta.error, null, 2));
        alert("Erro ao salvar: " + (resposta.error.message || resposta.error.details || "Erro desconhecido no banco"));
        return;
    }

    if (!idEdicao) {
        localStorage.removeItem("ultimoPet");
    }

    alert(idEdicao ? "Atualizado com sucesso!" : "Cadastrado com sucesso!");
    window.location.href = "meus-pets.html";
});