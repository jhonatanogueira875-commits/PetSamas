/*
==========================================================
Safe Samas / PetSamas
Arquivo: cadastro.js

Responsável por:
✔ Cadastro de pets
✔ Cadastro de itens
✔ Cadastro de veículos
✔ Cadastro de humanos
✔ Edição de cadastros
✔ Upload das fotos com compressão
✔ Informações médicas
✔ Medicamentos
✔ Alergias
✔ Contato de emergência
✔ Privacidade dos dados médicos
✔ Revisão das informações médicas
✔ Integração com Supabase
✔ Vínculo do QR Code original ao cadastro

IMPORTANTE:
- Este arquivo é totalmente encapsulado.
- Não declara variáveis no escopo global.
- Não redefine variáveis declaradas no HTML.
- O HTML continua responsável pela exibição/ocultação
  dos campos.
- Quando o cadastro é iniciado através de:
      cadastro.html?codigo=PET-000481
  o MESMO QR Code é vinculado ao cadastro criado.
- Nenhum novo QR Code é gerado neste processo.
==========================================================
*/

(() => {

    "use strict";


    // ======================================================
    // INICIALIZAÇÃO
    // ======================================================

    console.log(
        "CADASTRO.JS -> VERSÃO FINAL 2026"
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


    // ------------------------------------------------------
    // Dados comuns
    // ------------------------------------------------------

    const nomePet =
        document.getElementById("nomePet");

    const nomeTutor =
        document.getElementById("nomeTutor");

    const cidade =
        document.getElementById("cidade");

    const telefone =
        document.getElementById("telefone");


    // ------------------------------------------------------
    // Contato de confiança
    // ------------------------------------------------------

    const contatoNome =
        document.getElementById("contatoNome");

    const contatoTelefone =
        document.getElementById("contatoTelefone");

    const contatoParentesco =
        document.getElementById("contatoParentesco");


    // ------------------------------------------------------
    // Veículo
    // ------------------------------------------------------

    const marca =
        document.getElementById("marca");

    const modelo =
        document.getElementById("modelo");

    const cor =
        document.getElementById("cor");

    const placa =
        document.getElementById("placa");


    // ------------------------------------------------------
    // Humano
    // ------------------------------------------------------

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


    // ------------------------------------------------------
    // Saúde
    // ------------------------------------------------------

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


    // ------------------------------------------------------
    // Emergência
    // ------------------------------------------------------

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


    // ------------------------------------------------------
    // Privacidade
    // ------------------------------------------------------

    const dadosMedicosPublicos =
        document.getElementById(
            "dadosMedicosPublicos"
        );


    // ------------------------------------------------------
    // Revisão
    // ------------------------------------------------------

    const confirmarRevisaoSaude =
        document.getElementById(
            "confirmarRevisaoSaude"
        );

    const textoUltimaRevisao =
        document.getElementById(
            "textoUltimaRevisao"
        );


    // ------------------------------------------------------
    // Fotos
    // ------------------------------------------------------

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
    // URL / EDIÇÃO / QR
    // ======================================================

    const parametros =
        new URLSearchParams(
            window.location.search
        );

    const idEdicao =
        parametros.get("id");

    /*
    ----------------------------------------------------------
    QR ORIGINAL RECEBIDO PELA URL

    Exemplo:

    cadastro.html?codigo=PET-000481

    Esse código será preservado durante todo o cadastro.

    IMPORTANTE:
    Não geramos outro QR.

    O QR que iniciou o cadastro será o QR definitivo
    daquele cadastro.
    ----------------------------------------------------------
    */

    const codigoQR =
        parametros.get("codigo")
            ? parametros.get("codigo").trim().toUpperCase()
            : null;


    console.log(
        "CADASTRO.JS -> QR recebido pela URL:",
        codigoQR
    );


    // ======================================================
    // FOTOS EM MEMÓRIA
    // ======================================================

    let fotoBase64 = "";

    let fotoBase642 = "";

    let fotoBase643 = "";


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
        qualidade,
        callback
    ) {

        if (!arquivo) {
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
                        // Já está dentro do limite
                        // ----------------------------------

                        if (
                            largura <=
                                limiteMaximo &&
                            altura <=
                                limiteMaximo
                        ) {

                            callback(
                                evento.target.result
                            );

                            return;
                        }


                        // ----------------------------------
                        // Redimensionamento proporcional
                        // ----------------------------------

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


                        contexto.drawImage(
                            imagem,
                            0,
                            0,
                            largura,
                            altura
                        );


                        const resultado =
                            canvas.toDataURL(
                                "image/jpeg",
                                qualidade
                            );


                        callback(
                            resultado
                        );
                    };


                imagem.onerror =
                    function () {

                        console.error(
                            "CADASTRO.JS -> erro ao carregar imagem."
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

            };


        leitor.readAsDataURL(
            arquivo
        );
    }


    // ======================================================
    // FOTO PRINCIPAL
    // ======================================================

    if (campoFoto) {

        campoFoto.addEventListener(
            "change",
            function () {

                const arquivo =
                    campoFoto.files &&
                    campoFoto.files[0];


                if (!arquivo) {
                    return;
                }


                comprimirImagem(
                    arquivo,
                    1200,
                    0.80,
                    function (resultado) {

                        fotoBase64 =
                            resultado;


                        console.log(
                            "CADASTRO.JS -> foto principal preparada."
                        );

                    }
                );
            }
        );
    }


    // ======================================================
    // FOTO 2
    // ======================================================

    if (campoFoto2) {

        campoFoto2.addEventListener(
            "change",
            function () {

                const arquivo =
                    campoFoto2.files &&
                    campoFoto2.files[0];


                if (!arquivo) {
                    return;
                }


                comprimirImagem(
                    arquivo,
                    1200,
                    0.80,
                    function (resultado) {

                        fotoBase642 =
                            resultado;


                        console.log(
                            "CADASTRO.JS -> foto 2 preparada."
                        );

                    }
                );
            }
        );
    }


    // ======================================================
    // FOTO 3
    // ======================================================

    if (campoFoto3) {

        campoFoto3.addEventListener(
            "change",
            function () {

                const arquivo =
                    campoFoto3.files &&
                    campoFoto3.files[0];


                if (!arquivo) {
                    return;
                }


                comprimirImagem(
                    arquivo,
                    1200,
                    0.80,
                    function (resultado) {

                        fotoBase643 =
                            resultado;


                        console.log(
                            "CADASTRO.JS -> foto 3 preparada."
                        );

                    }
                );
            }
        );
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


            // --------------------------------------------------
            // Data de nascimento
            // --------------------------------------------------

            if (dataNascimento) {

                dataNascimento.value =
                    pet.data_nascimento || "";
            }


            // --------------------------------------------------
            // Idade
            // --------------------------------------------------

            if (idade) {

                idade.value =
                    pet.idade ?? "";
            }


            // --------------------------------------------------
            // Sexo
            // --------------------------------------------------

            if (sexo) {

                sexo.value =
                    pet.sexo || "";
            }


            // --------------------------------------------------
            // Informações importantes
            // --------------------------------------------------

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
            // FOTOS
            // ==================================================

            fotoBase64 =
                pet.foto || "";

            fotoBase642 =
                pet.foto2 || "";

            fotoBase643 =
                pet.foto3 || "";


            // ==================================================
            // ATUALIZAR INTERFACE
            // ==================================================

            if (
                typeof atualizarCampos ===
                "function"
            ) {

                atualizarCampos();
            }


            atualizarMedicamentos();


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


        /*
        ------------------------------------------------------
        Os campos humanos são específicos do cadastro de
        pessoa.

        Não são exigidos para:
        - pet
        - item
        - veículo

        A validação ocorre somente quando o tipo selecionado
        é "humano".
        ------------------------------------------------------
        */


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
                "Usuário autenticado:",
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


            /*
            ------------------------------------------------------
            SOMENTE HUMANO E VEÍCULO POSSUEM DADOS DE SAÚDE.

            PET E ITEM:
            todos os campos médicos permanecem NULL.

            Isso é proposital e NÃO deve ser alterado.
            ------------------------------------------------------
            */

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


                // ----------------------------------------------
                // Medicamentos
                // ----------------------------------------------

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


            /*
            ------------------------------------------------------
            REVISÃO MÉDICA:

            Somente:
            - humano
            - veículo

            possuem essa confirmação.

            Pet e item não entram neste fluxo.
            ------------------------------------------------------
            */

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
            // ==================================================

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
                // Fotos
                // ----------------------------------------------

                foto:
                    fotoBase64,

                foto2:
                    fotoBase642,

                foto3:
                    fotoBase643,


                // ----------------------------------------------
                // Usuário
                // ----------------------------------------------

                user_id:
                    user.id
            };


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
            // ==================================================

            const cadastroSalvo =
                resultadoCadastro.data;


            console.log(
                "CADASTRO.JS -> cadastro salvo:",
                cadastroSalvo
            );


            // ==================================================
            // VÍNCULO DO QR CODE
            // ==================================================

            /*
            ------------------------------------------------------
            Se o cadastro foi iniciado por um QR Code existente,
            vinculamos esse QR ao cadastro salvo.

            Exemplo:

            cadastro.html?codigo=PET-000481

            O código PET-000481 continua sendo o QR definitivo.

            NÃO criamos um novo QR.
            ------------------------------------------------------
            */

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