/*
==========================================================
Safe Samas / PetSamas
Arquivo: cadastro.js

VERSÃO:
STORAGE 2026 - CANÔNICA

Responsável por:
✔ Cadastro de pets
✔ Cadastro de itens
✔ Cadastro de veículos
✔ Cadastro de humanos
✔ Edição de cadastros
✔ Upload das fotos para Supabase Storage
✔ Compressão das fotos
✔ Informações médicas
✔ Medicamentos
✔ Alergias
✔ Contato de emergência
✔ Privacidade dos dados médicos
✔ Revisão das informações médicas
✔ Integração com Supabase
✔ Vínculo do QR Code original ao cadastro

ARMAZENAMENTO DE IMAGENS:

As imagens NÃO são armazenadas em Base64
na tabela public.pets.

Elas são enviadas para o bucket:

pet-images

Com os seguintes caminhos:

{pet_id}/foto.jpg
{pet_id}/foto2.jpg
{pet_id}/foto3.jpg

A tabela public.pets armazena SOMENTE o caminho:

foto
foto2
foto3

Exemplo:

foto = "169/foto.jpg"

IMPORTANTE:
- Este arquivo é encapsulado em IIFE.
- Não declara variáveis no escopo global.
- Não redefine variáveis declaradas no HTML.
- O HTML continua responsável pela exibição/ocultação
  dos campos.
==========================================================
*/

(() => {

    "use strict";


    // ======================================================
    // INICIALIZAÇÃO
    // ======================================================

    console.log(
        "CADASTRO.JS -> VERSÃO STORAGE 2026"
    );

    console.log(
        "CADASTRO.JS -> INICIANDO..."
    );


    // ======================================================
    // ELEMENTOS
    // ======================================================

    const formulario =
        document.getElementById("formCadastro");

    const campoTipo =
        document.getElementById("tipo");

    const campoCategoria =
        document.getElementById("categoria");


    // ======================================================
    // DADOS COMUNS
    // ======================================================

    const nomePet =
        document.getElementById("nomePet");

    const nomeTutor =
        document.getElementById("nomeTutor");

    const cidade =
        document.getElementById("cidade");

    const telefone =
        document.getElementById("telefone");


    // ======================================================
    // CONTATO DE CONFIANÇA
    // ======================================================

    const contatoNome =
        document.getElementById("contatoNome");

    const contatoTelefone =
        document.getElementById("contatoTelefone");

    const contatoParentesco =
        document.getElementById("contatoParentesco");


    // ======================================================
    // VEÍCULO
    // ======================================================

    const marca =
        document.getElementById("marca");

    const modelo =
        document.getElementById("modelo");

    const cor =
        document.getElementById("cor");

    const placa =
        document.getElementById("placa");


    // ======================================================
    // HUMANO
    // ======================================================

    const tipoHumano =
        document.getElementById("tipoHumano");

    const dataNascimento =
        document.getElementById("dataNascimento");

    const idade =
        document.getElementById("idade");

    const sexo =
        document.getElementById("sexo");

    const informacoesImportantes =
        document.getElementById("informacoesImportantes");


    // ======================================================
    // SAÚDE
    // ======================================================

    const tipoSanguineo =
        document.getElementById("tipoSanguineo");

    const condicaoMedica =
        document.getElementById("condicaoMedica");

    const alergias =
        document.getElementById("alergias");

    const usaMedicamentosCampo =
        document.getElementById(
            "usaMedicamentos"
        );

    const medicamentos =
        document.getElementById("medicamentos");

    const observacoesMedicas =
        document.getElementById(
            "observacoesMedicas"
        );


    // ======================================================
    // EMERGÊNCIA
    // ======================================================

    const nomeEmergencia =
        document.getElementById(
            "nomeEmergencia"
        );

    const telefoneEmergencia =
        document.getElementById(
            "telefoneEmergencia"
        );

    const parentescoEmergencia =
        document.getElementById(
            "parentescoEmergencia"
        );


    // ======================================================
    // PRIVACIDADE
    // ======================================================

    const dadosMedicosPublicos =
        document.getElementById(
            "dadosMedicosPublicos"
        );


    // ======================================================
    // REVISÃO
    // ======================================================

    const confirmarRevisaoSaude =
        document.getElementById(
            "confirmarRevisaoSaude"
        );

    const textoUltimaRevisao =
        document.getElementById(
            "textoUltimaRevisao"
        );


    // ======================================================
    // FOTOS
    // ======================================================

    const campoFoto =
        document.getElementById("foto");

    const campoFoto2 =
        document.getElementById("foto2");

    const campoFoto3 =
        document.getElementById("foto3");


    // ======================================================
    // VERIFICAÇÃO DO FORMULÁRIO
    // ======================================================

    if (!formulario) {

        console.error(
            "CADASTRO.JS -> ERRO: #formCadastro não encontrado."
        );

        return;
    }


    // ======================================================
    // URL / EDIÇÃO / QR CODE
    // ======================================================

    const parametros =
        new URLSearchParams(
            window.location.search
        );

    const idEdicao =
        parametros.get("id");


    const codigoQR =
        parametros.get("codigo")
            ? parametros
                .get("codigo")
                .trim()
                .toUpperCase()
            : null;


    console.log(
        "CADASTRO.JS -> QR recebido pela URL:",
        codigoQR
    );


    // ======================================================
    // FOTOS EM MEMÓRIA
    // ======================================================

    /*
    ----------------------------------------------------------
    As imagens selecionadas ficam temporariamente em memória.

    Elas são convertidas para Blob JPEG comprimido.

    NÃO são convertidas para Base64 para serem armazenadas
    no banco.

    null = nenhuma foto nova selecionada.
    ----------------------------------------------------------
    */

    let fotoArquivo = null;

    let fotoArquivo2 = null;

    let fotoArquivo3 = null;


    // ======================================================
    // CAMINHOS DAS FOTOS EXISTENTES
    // ======================================================

    let fotoExistente = "";

    let fotoExistente2 = "";

    let fotoExistente3 = "";


    // ======================================================
    // ÚLTIMA REVISÃO ANTERIOR
    // ======================================================

    let ultimaRevisaoAnterior = null;


    // ======================================================
    // FUNÇÃO: OBTER VALOR DE CAMPO
    // ======================================================

    function obterValor(campo) {

        if (!campo) {
            return null;
        }

        if (
            typeof campo.value !==
            "string"
        ) {

            return campo.value;
        }

        const valor =
            campo.value.trim();

        return valor || null;
    }


    // ======================================================
    // FUNÇÃO: OBTER USUÁRIO
    // ======================================================

    async function obterUsuario() {

        try {

            if (
                typeof banco ===
                "undefined"
            ) {

                console.error(
                    "CADASTRO.JS -> variável 'banco' não encontrada."
                );

                return null;
            }


            const resultado =
                await banco.auth.getUser();


            if (resultado.error) {

                console.error(
                    "CADASTRO.JS -> erro ao obter usuário:",
                    resultado.error
                );

                return null;
            }


            return (
                resultado.data &&
                resultado.data.user
            )
                ? resultado.data.user
                : null;

        } catch (erro) {

            console.error(
                "CADASTRO.JS -> exceção ao obter usuário:",
                erro
            );

            return null;
        }
    }


    // ======================================================
    // COMPRESSÃO DE IMAGEM
    // ======================================================

    function comprimirImagem(
        arquivo,
        limiteMaximo,
        qualidade
    ) {

        return new Promise(
            function (resolve, reject) {

                if (!arquivo) {

                    reject(
                        new Error(
                            "Nenhum arquivo de imagem foi selecionado."
                        )
                    );

                    return;
                }


                const leitor =
                    new FileReader();


                leitor.onload =
                    function (evento) {

                        const imagem =
                            new Image();


                        imagem.onload =
                            function () {

                                let largura =
                                    imagem.width;

                                let altura =
                                    imagem.height;


                                // ----------------------------------
                                // Redimensionamento proporcional
                                // ----------------------------------

                                if (
                                    largura >
                                    limiteMaximo ||
                                    altura >
                                    limiteMaximo
                                ) {

                                    if (
                                        largura >
                                        altura
                                    ) {

                                        altura =
                                            Math.round(
                                                altura *
                                                (
                                                    limiteMaximo /
                                                    largura
                                                )
                                            );

                                        largura =
                                            limiteMaximo;

                                    } else {

                                        largura =
                                            Math.round(
                                                largura *
                                                (
                                                    limiteMaximo /
                                                    altura
                                                )
                                            );

                                        altura =
                                            limiteMaximo;
                                    }
                                }


                                // ----------------------------------
                                // Canvas
                                // ----------------------------------

                                const canvas =
                                    document.createElement(
                                        "canvas"
                                    );


                                canvas.width =
                                    largura;

                                canvas.height =
                                    altura;


                                const contexto =
                                    canvas.getContext(
                                        "2d"
                                    );


                                if (!contexto) {

                                    reject(
                                        new Error(
                                            "Não foi possível criar o contexto do canvas."
                                        )
                                    );

                                    return;
                                }


                                contexto.drawImage(
                                    imagem,
                                    0,
                                    0,
                                    largura,
                                    altura
                                );


                                // ----------------------------------
                                // Blob JPEG
                                // ----------------------------------

                                canvas.toBlob(
                                    function (blob) {

                                        if (!blob) {

                                            reject(
                                                new Error(
                                                    "Não foi possível comprimir a imagem."
                                                )
                                            );

                                            return;
                                        }


                                        resolve(
                                            blob
                                        );

                                    },
                                    "image/jpeg",
                                    qualidade
                                );
                            };


                        imagem.onerror =
                            function () {

                                console.error(
                                    "CADASTRO.JS -> erro ao carregar imagem."
                                );

                                reject(
                                    new Error(
                                        "Erro ao carregar a imagem."
                                    )
                                );
                            };


                        imagem.src =
                            evento.target.result;
                    };


                leitor.onerror =
                    function () {

                        console.error(
                            "CADASTRO.JS -> erro ao ler imagem."
                        );

                        reject(
                            new Error(
                                "Erro ao ler a imagem."
                            )
                        );
                    };


                leitor.readAsDataURL(
                    arquivo
                );
            }
        );
    }


    // ======================================================
    // PREPARAR FOTO
    // ======================================================

    async function prepararFoto(
        arquivo
    ) {

        return await comprimirImagem(
            arquivo,
            1200,
            0.80
        );
    }


    // ======================================================
    // FOTO PRINCIPAL
    // ======================================================

    if (campoFoto) {

        campoFoto.addEventListener(
            "change",
            async function () {

                const arquivo =
                    campoFoto.files &&
                    campoFoto.files[0];


                if (!arquivo) {

                    fotoArquivo =
                        null;

                    return;
                }


                try {

                    fotoArquivo =
                        await prepararFoto(
                            arquivo
                        );


                    console.log(
                        "CADASTRO.JS -> foto principal preparada para Storage."
                    );

                } catch (erro) {

                    fotoArquivo =
                        null;

                    console.error(
                        "CADASTRO.JS -> erro ao preparar foto principal:",
                        erro
                    );


                    alert(
                        "Não foi possível preparar a foto principal."
                    );
                }
            }
        );
    }


    // ======================================================
    // FOTO 2
    // ======================================================

    if (campoFoto2) {

        campoFoto2.addEventListener(
            "change",
            async function () {

                const arquivo =
                    campoFoto2.files &&
                    campoFoto2.files[0];


                if (!arquivo) {

                    fotoArquivo2 =
                        null;

                    return;
                }


                try {

                    fotoArquivo2 =
                        await prepararFoto(
                            arquivo
                        );


                    console.log(
                        "CADASTRO.JS -> foto 2 preparada para Storage."
                    );

                } catch (erro) {

                    fotoArquivo2 =
                        null;

                    console.error(
                        "CADASTRO.JS -> erro ao preparar foto 2:",
                        erro
                    );


                    alert(
                        "Não foi possível preparar a foto 2."
                    );
                }
            }
        );
    }


    // ======================================================
    // FOTO 3
    // ======================================================

    if (campoFoto3) {

        campoFoto3.addEventListener(
            "change",
            async function () {

                const arquivo =
                    campoFoto3.files &&
                    campoFoto3.files[0];


                if (!arquivo) {

                    fotoArquivo3 =
                        null;

                    return;
                }


                try {

                    fotoArquivo3 =
                        await prepararFoto(
                            arquivo
                        );


                    console.log(
                        "CADASTRO.JS -> foto 3 preparada para Storage."
                    );

                } catch (erro) {

                    fotoArquivo3 =
                        null;

                    console.error(
                        "CADASTRO.JS -> erro ao preparar foto 3:",
                        erro
                    );


                    alert(
                        "Não foi possível preparar a foto 3."
                    );
                }
            }
        );
    }


    // ======================================================
    // UPLOAD PARA SUPABASE STORAGE
    // ======================================================

    async function enviarFotoStorage(
        arquivo,
        caminho
    ) {

        if (!arquivo) {

            return {
                sucesso: true,
                caminho: null
            };
        }


        if (
            typeof banco ===
            "undefined"
        ) {

            throw new Error(
                "A conexão com o Supabase não está disponível."
            );
        }


        console.log(
            "CADASTRO.JS -> enviando imagem:",
            caminho
        );


        const resultado =
            await banco
                .storage
                .from("pet-images")
                .upload(
                    caminho,
                    arquivo,
                    {
                        contentType:
                            "image/jpeg",

                        upsert:
                            true,

                        cacheControl:
                            "3600"
                    }
                );


        if (resultado.error) {

            console.error(
                "CADASTRO.JS -> erro no upload:",
                resultado.error
            );

            throw resultado.error;
        }


        console.log(
            "CADASTRO.JS -> imagem enviada:",
            caminho
        );


        return {
            sucesso: true,
            caminho: caminho
        };
    }


    // ======================================================
    // UPLOAD DAS FOTOS
    // ======================================================

    async function enviarFotos(
        petId
    ) {

        const caminhos = {};


        // --------------------------------------------------
        // FOTO PRINCIPAL
        // --------------------------------------------------

        if (fotoArquivo) {

            const caminho =
                `${petId}/foto.jpg`;


            await enviarFotoStorage(
                fotoArquivo,
                caminho
            );


            caminhos.foto =
                caminho;
        }


        // --------------------------------------------------
        // FOTO 2
        // --------------------------------------------------

        if (fotoArquivo2) {

            const caminho =
                `${petId}/foto2.jpg`;


            await enviarFotoStorage(
                fotoArquivo2,
                caminho
            );


            caminhos.foto2 =
                caminho;
        }


        // --------------------------------------------------
        // FOTO 3
        // --------------------------------------------------

        if (fotoArquivo3) {

            const caminho =
                `${petId}/foto3.jpg`;


            await enviarFotoStorage(
                fotoArquivo3,
                caminho
            );


            caminhos.foto3 =
                caminho;
        }


        return caminhos;
    }


    // ======================================================
    // BUSCAR CADASTRO PARA EDIÇÃO
    // ======================================================

    async function carregarCadastro() {

        if (!idEdicao) {

            return;
        }


        console.log(
            "CADASTRO.JS -> carregando cadastro:",
            idEdicao
        );


        try {

            const resposta =
                await banco
                    .from("pets")
                    .select("*")
                    .eq(
                        "id",
                        idEdicao
                    )
                    .single();


            if (resposta.error) {

                console.error(
                    "CADASTRO.JS -> erro ao carregar cadastro:",
                    resposta.error
                );

                alert(
                    "Não foi possível carregar o cadastro."
                );

                return;
            }


            const pet =
                resposta.data;


            if (!pet) {

                alert(
                    "Cadastro não encontrado."
                );

                return;
            }


            // ==================================================
            // DADOS COMUNS
            // ==================================================

            if (nomePet) {

                nomePet.value =
                    pet.nome_pet || "";
            }


            if (nomeTutor) {

                nomeTutor.value =
                    pet.nome_tutor || "";
            }


            if (cidade) {

                cidade.value =
                    pet.cidade || "";
            }


            if (telefone) {

                telefone.value =
                    pet.telefone || "";
            }


            // ==================================================
            // TIPO
            // ==================================================

            if (campoTipo) {

                campoTipo.value =
                    pet.tipo || "";

                campoTipo.dispatchEvent(
                    new Event("change")
                );
            }


            // ==================================================
            // CATEGORIA
            // ==================================================

            if (campoCategoria) {

                campoCategoria.value =
                    pet.categoria || "";

                campoCategoria.dispatchEvent(
                    new Event("change")
                );
            }


            // ==================================================
            // CONTATO DE CONFIANÇA
            // ==================================================

            if (contatoNome) {

                contatoNome.value =
                    pet.contato_nome || "";
            }


            if (contatoTelefone) {

                contatoTelefone.value =
                    pet.contato_telefone || "";
            }


            if (contatoParentesco) {

                contatoParentesco.value =
                    pet.contato_parentesco || "";
            }


            // ==================================================
            // VEÍCULO
            // ==================================================

            if (marca) {

                marca.value =
                    pet.marca || "";
            }


            if (modelo) {

                modelo.value =
                    pet.modelo || "";
            }


            if (cor) {

                cor.value =
                    pet.cor || "";
            }


            if (placa) {

                placa.value =
                    pet.placa || "";
            }


            // ==================================================
            // HUMANO
            // ==================================================

            if (tipoHumano) {

                tipoHumano.value =
                    pet.tipo_humano || "";
            }


            if (dataNascimento) {

                dataNascimento.value =
                    pet.data_nascimento || "";
            }


            if (idade) {

                idade.value =
                    pet.idade ?? "";
            }


            if (sexo) {

                sexo.value =
                    pet.sexo || "";
            }


            if (informacoesImportantes) {

                informacoesImportantes.value =
                    pet.informacoes_importantes || "";
            }


            // ==================================================
            // SAÚDE
            // ==================================================

            if (tipoSanguineo) {

                tipoSanguineo.value =
                    pet.tipo_sanguineo || "";
            }


            if (condicaoMedica) {

                condicaoMedica.value =
                    pet.condicao_medica || "";
            }


            if (alergias) {

                alergias.value =
                    pet.alergias || "";
            }


            // ==================================================
            // MEDICAMENTOS
            // ==================================================

            if (
                usaMedicamentosCampo
            ) {

                if (
                    pet.usa_medicamentos ===
                    true
                ) {

                    usaMedicamentosCampo.value =
                        "true";

                } else if (
                    pet.usa_medicamentos ===
                    false
                ) {

                    usaMedicamentosCampo.value =
                        "false";

                } else {

                    usaMedicamentosCampo.value =
                        "";
                }
            }


            if (medicamentos) {

                medicamentos.value =
                    pet.medicamentos || "";
            }


            if (
                observacoesMedicas
            ) {

                observacoesMedicas.value =
                    pet.observacoes_medicas || "";
            }


            // ==================================================
            // CONTATO DE EMERGÊNCIA
            // ==================================================

            if (nomeEmergencia) {

                nomeEmergencia.value =
                    pet.nome_emergencia || "";
            }


            if (
                telefoneEmergencia
            ) {

                telefoneEmergencia.value =
                    pet.telefone_emergencia || "";
            }


            if (
                parentescoEmergencia
            ) {

                parentescoEmergencia.value =
                    pet.parentesco_emergencia || "";
            }


            // ==================================================
            // PRIVACIDADE
            // ==================================================

            if (
                dadosMedicosPublicos
            ) {

                dadosMedicosPublicos.checked =
                    pet.dados_medicos_publicos !==
                    false;
            }


            // ==================================================
            // REVISÃO
            // ==================================================

            ultimaRevisaoAnterior =
                pet.ultima_revisao_saude ||
                null;


            if (
                confirmarRevisaoSaude
            ) {

                confirmarRevisaoSaude.checked =
                    pet.responsabilidade_confirmada ===
                    true;
            }


            atualizarTextoUltimaRevisao(
                pet.ultima_revisao_saude
            );


            // ==================================================
            // FOTOS EXISTENTES
            // ==================================================

            fotoExistente =
                pet.foto || "";

            fotoExistente2 =
                pet.foto2 || "";

            fotoExistente3 =
                pet.foto3 || "";


            console.log(
                "CADASTRO.JS -> caminhos das fotos existentes:",
                {
                    foto: fotoExistente,
                    foto2: fotoExistente2,
                    foto3: fotoExistente3
                }
            );


            // ==================================================
            // ATUALIZAR INTERFACE
            // ==================================================

            if (
                typeof atualizarCampos ===
                "function"
            ) {

                atualizarCampos();
            }


            if (
                typeof atualizarMedicamentos ===
                "function"
            ) {

                atualizarMedicamentos();
            }


            console.log(
                "CADASTRO.JS -> cadastro carregado com sucesso."
            );


        } catch (erro) {

            console.error(
                "CADASTRO.JS -> erro inesperado ao carregar cadastro:",
                erro
            );

            alert(
                "Ocorreu um erro ao carregar o cadastro."
            );
        }
    }


    // ======================================================
    // FORMATAÇÃO DA DATA DA ÚLTIMA REVISÃO
    // ======================================================

    function atualizarTextoUltimaRevisao(
        data
    ) {

        if (!textoUltimaRevisao) {

            return;
        }


        if (!data) {

            textoUltimaRevisao.textContent =
                "Ainda não há uma revisão registrada.";

            return;
        }


        const dataFormatada =
            new Date(data);


        if (
            Number.isNaN(
                dataFormatada.getTime()
            )
        ) {

            textoUltimaRevisao.textContent =
                "Ainda não há uma revisão registrada.";

            return;
        }


        textoUltimaRevisao.textContent =
            "Última revisão registrada em " +
            dataFormatada.toLocaleDateString(
                "pt-BR"
            ) +
            ".";
    }


    // ======================================================
    // VALIDAÇÃO DO HUMANO
    // ======================================================

    function validarDadosHumano() {

        if (
            !campoTipo ||
            campoTipo.value !==
            "humano"
        ) {

            return true;
        }


        if (
            tipoHumano &&
            !obterValor(tipoHumano)
        ) {

            alert(
                "Selecione o tipo de pessoa."
            );

            tipoHumano.focus();

            return false;
        }


        return true;
    }


    // ======================================================
    // EVENTO SUBMIT
    // ======================================================

    formulario.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            console.log(
                "CADASTRO.JS -> formulário enviado."
            );


            // ==================================================
            // TIPO ATUAL
            // ==================================================

            const tipoAtual =
                campoTipo
                    ? campoTipo.value
                    : null;


            console.log(
                "CADASTRO.JS -> tipo:",
                tipoAtual
            );


            // ==================================================
            // VALIDAÇÃO HUMANO
            // ==================================================

            if (
                !validarDadosHumano()
            ) {

                return;
            }


            // ==================================================
            // USUÁRIO
            // ==================================================

            const user =
                await obterUsuario();


            if (!user) {

                alert(
                    "Usuário não autenticado."
                );

                window.location.href =
                    "login.html";

                return;
            }


            console.log(
                "CADASTRO.JS -> usuário autenticado:",
                user.id
            );


            // ==================================================
            // DADOS MÉDICOS
            // ==================================================

            let tipoSanguineoFinal =
                null;

            let condicaoMedicaFinal =
                null;

            let alergiasFinal =
                null;

            let usaMedicamentosFinal =
                null;

            let medicamentosFinal =
                null;

            let observacoesMedicasFinal =
                null;


            if (
                tipoAtual === "humano" ||
                tipoAtual === "veiculo"
            ) {

                tipoSanguineoFinal =
                    obterValor(
                        tipoSanguineo
                    );


                condicaoMedicaFinal =
                    obterValor(
                        condicaoMedica
                    );


                alergiasFinal =
                    obterValor(
                        alergias
                    );


                if (
                    usaMedicamentosCampo
                ) {

                    if (
                        usaMedicamentosCampo.value ===
                        "true"
                    ) {

                        usaMedicamentosFinal =
                            true;

                    } else if (
                        usaMedicamentosCampo.value ===
                        "false"
                    ) {

                        usaMedicamentosFinal =
                            false;

                    } else {

                        usaMedicamentosFinal =
                            null;
                    }
                }


                medicamentosFinal =
                    obterValor(
                        medicamentos
                    );


                observacoesMedicasFinal =
                    obterValor(
                        observacoesMedicas
                    );
            }


            // ==================================================
            // PRIVACIDADE
            // ==================================================

            let dadosMedicosPublicosFinal =
                true;


            if (
                dadosMedicosPublicos
            ) {

                dadosMedicosPublicosFinal =
                    dadosMedicosPublicos.checked;
            }


            // ==================================================
            // REVISÃO
            // ==================================================

            let responsabilidadeConfirmadaFinal =
                false;

            let ultimaRevisaoFinal =
                ultimaRevisaoAnterior;


            if (
                tipoAtual === "humano" ||
                tipoAtual === "veiculo"
            ) {

                responsabilidadeConfirmadaFinal =
                    confirmarRevisaoSaude
                        ? confirmarRevisaoSaude.checked
                        : false;


                if (
                    responsabilidadeConfirmadaFinal
                ) {

                    ultimaRevisaoFinal =
                        new Date().toISOString();
                }
            }


            // ==================================================
            // PAYLOAD
            // ======================================================

            /*
            ------------------------------------------------------
            IMPORTANTE:

            foto, foto2 e foto3 NÃO fazem parte deste payload.

            Portanto, o INSERT/UPDATE em public.pets NÃO recebe
            Base64.

            As fotos serão processadas depois que obtivermos
            o ID do cadastro.
            ------------------------------------------------------
            */

            const dadosFormulario = {

                // ----------------------------------------------
                // Dados comuns
                // ----------------------------------------------

                nome_pet:
                    obterValor(
                        nomePet
                    ),

                nome_tutor:
                    obterValor(
                        nomeTutor
                    ),

                cidade:
                    obterValor(
                        cidade
                    ),

                telefone:
                    obterValor(
                        telefone
                    ),

                tipo:
                    tipoAtual,

                categoria:
                    obterValor(
                        campoCategoria
                    ),


                // ----------------------------------------------
                // Contato de confiança
                // ----------------------------------------------

                contato_nome:
                    obterValor(
                        contatoNome
                    ),

                contato_telefone:
                    obterValor(
                        contatoTelefone
                    ),

                contato_parentesco:
                    obterValor(
                        contatoParentesco
                    ),


                // ----------------------------------------------
                // Veículo
                // ----------------------------------------------

                marca:
                    obterValor(
                        marca
                    ),

                modelo:
                    obterValor(
                        modelo
                    ),

                cor:
                    obterValor(
                        cor
                    ),

                placa:
                    obterValor(
                        placa
                    ),


                // ----------------------------------------------
                // Humano
                // ----------------------------------------------

                tipo_humano:
                    tipoAtual === "humano"
                        ? obterValor(
                            tipoHumano
                        )
                        : null,

                data_nascimento:
                    tipoAtual === "humano"
                        ? obterValor(
                            dataNascimento
                        )
                        : null,

                idade:
                    tipoAtual === "humano"
                        ? (
                            obterValor(
                                idade
                            ) !== null
                                ? Number(
                                    idade.value
                                )
                                : null
                        )
                        : null,

                sexo:
                    tipoAtual === "humano"
                        ? obterValor(
                            sexo
                        )
                        : null,

                informacoes_importantes:
                    tipoAtual === "humano"
                        ? obterValor(
                            informacoesImportantes
                        )
                        : null,


                // ----------------------------------------------
                // Saúde
                // ----------------------------------------------

                tipo_sanguineo:
                    tipoSanguineoFinal,

                condicao_medica:
                    condicaoMedicaFinal,

                alergias:
                    alergiasFinal,

                usa_medicamentos:
                    usaMedicamentosFinal,

                medicamentos:
                    medicamentosFinal,

                observacoes_medicas:
                    observacoesMedicasFinal,


                // ----------------------------------------------
                // Emergência
                // ----------------------------------------------

                nome_emergencia:
                    obterValor(
                        nomeEmergencia
                    ),

                telefone_emergencia:
                    obterValor(
                        telefoneEmergencia
                    ),

                parentesco_emergencia:
                    obterValor(
                        parentescoEmergencia
                    ),


                // ----------------------------------------------
                // Revisão
                // ----------------------------------------------

                responsabilidade_confirmada:
                    responsabilidadeConfirmadaFinal,

                ultima_revisao_saude:
                    ultimaRevisaoFinal,


                // ----------------------------------------------
                // Privacidade
                // ----------------------------------------------

                dados_medicos_publicos:
                    dadosMedicosPublicosFinal,


                // ----------------------------------------------
                // Usuário
                // ----------------------------------------------

                user_id:
                    user.id
            };


            // ==================================================
            // PROTEÇÃO EXTRA CONTRA BASE64
            // ==================================================

            /*
            ------------------------------------------------------
            Este bloco é deliberadamente redundante.

            Ele garante que mesmo se algum campo de imagem
            estiver presente no formulário, ele não será
            enviado para public.pets.

            As imagens devem obrigatoriamente passar pelo
            Supabase Storage.
            ------------------------------------------------------
            */

            delete dadosFormulario.foto;

            delete dadosFormulario.foto2;

            delete dadosFormulario.foto3;


            console.log(
                "CADASTRO.JS -> dados preparados:",
                dadosFormulario
            );


            // ==================================================
            // EDIÇÃO OU NOVO CADASTRO
            // ==================================================

            let resultadoCadastro;


            if (idEdicao) {

                console.log(
                    "CADASTRO.JS -> modo EDIÇÃO."
                );


                resultadoCadastro =
                    await banco
                        .from("pets")
                        .update(
                            dadosFormulario
                        )
                        .eq(
                            "id",
                            idEdicao
                        )
                        .select()
                        .single();

            } else {

                console.log(
                    "CADASTRO.JS -> modo NOVO CADASTRO."
                );


                resultadoCadastro =
                    await banco
                        .from("pets")
                        .insert(
                            dadosFormulario
                        )
                        .select()
                        .single();
            }


            // ==================================================
            // ERRO NO CADASTRO
            // ==================================================

            if (
                resultadoCadastro.error
            ) {

                console.error(
                    "CADASTRO.JS -> erro ao salvar:",
                    resultadoCadastro.error
                );


                alert(
                    "Não foi possível salvar o cadastro.\n\n" +
                    resultadoCadastro.error.message
                );


                return;
            }


            // ==================================================
            // CADASTRO SALVO
            // ======================================================

            const cadastroSalvo =
                resultadoCadastro.data;


            if (
                !cadastroSalvo ||
                !cadastroSalvo.id
            ) {

                console.error(
                    "CADASTRO.JS -> cadastro salvo sem ID:",
                    cadastroSalvo
                );


                alert(
                    "O cadastro foi salvo, mas não foi possível obter o ID do registro."
                );


                return;
            }


            console.log(
                "CADASTRO.JS -> cadastro salvo:",
                cadastroSalvo
            );


            // ==================================================
            // UPLOAD DAS FOTOS
            // ==================================================

            try {

                const caminhosFotos =
                    await enviarFotos(
                        cadastroSalvo.id
                    );


                // ----------------------------------------------
                // Registrar caminhos no banco
                // ----------------------------------------------

                if (
                    Object.keys(
                        caminhosFotos
                    ).length > 0
                ) {

                    console.log(
                        "CADASTRO.JS -> registrando caminhos:",
                        caminhosFotos
                    );


                    const atualizacaoFotos =
                        await banco
                            .from("pets")
                            .update(
                                caminhosFotos
                            )
                            .eq(
                                "id",
                                cadastroSalvo.id
                            );


                    if (
                        atualizacaoFotos.error
                    ) {

                        console.error(
                            "CADASTRO.JS -> erro ao registrar caminhos das fotos:",
                            atualizacaoFotos.error
                        );


                        alert(
                            "O cadastro foi salvo, mas houve um problema ao registrar as imagens.\n\n" +
                            atualizacaoFotos.error.message
                        );


                        return;
                    }
                }


                console.log(
                    "CADASTRO.JS -> fotos processadas com sucesso."
                );


            } catch (erro) {

                console.error(
                    "CADASTRO.JS -> erro no upload das fotos:",
                    erro
                );


                alert(
                    "O cadastro foi salvo, mas não foi possível enviar uma ou mais fotos para o Storage.\n\n" +
                    erro.message
                );


                return;
            }


            // ==================================================
            // VÍNCULO DO QR CODE
            // ==================================================

            if (codigoQR) {

                console.log(
                    "CADASTRO.JS -> vinculando QR:",
                    codigoQR
                );


                const resultadoQR =
                    await banco
                        .from("qrcodes")
                        .update({
                            pet_id:
                                cadastroSalvo.id
                        })
                        .eq(
                            "codigo",
                            codigoQR
                        );


                if (
                    resultadoQR.error
                ) {

                    console.error(
                        "CADASTRO.JS -> erro ao vincular QR:",
                        resultadoQR.error
                    );


                    alert(
                        "O cadastro foi salvo, mas houve um problema ao vincular o QR Code.\n\n" +
                        resultadoQR.error.message
                    );


                    return;
                }


                console.log(
                    "CADASTRO.JS -> QR vinculado com sucesso."
                );
            }


            // ==================================================
            // SUCESSO
            // ==================================================

            alert(
                idEdicao
                    ? "Cadastro atualizado com sucesso!"
                    : "Cadastro realizado com sucesso!"
            );


            // ==================================================
            // REDIRECIONAMENTO
            // ==================================================

            window.location.href =
                "meus-pets.html";
        }
    );


    // ======================================================
    // INICIALIZAÇÃO
    // ======================================================

    carregarCadastro();


})();