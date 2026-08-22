/*
==========================================================
Safe Samas
Arquivo: cadastro.js

Responsável por:
✔ Cadastro de pets
✔ Cadastro de itens
✔ Cadastro de veículos
✔ Cadastro de humanos
✔ Edição de cadastros
✔ Upload e compressão de imagens
✔ Persistência no Supabase

IMPORTANTE:
Este arquivo NÃO altera a estrutura do banco.
O payload utiliza os campos já definidos no projeto.
==========================================================
*/

(() => {

    console.log("==========================================");
    console.log("CADASTRO.JS CARREGADO");
    console.log("VERSÃO: 2026-08-21-CORRIGIDA");
    console.log("==========================================");


    // ======================================================
    // ELEMENTOS PRINCIPAIS
    // ======================================================

    const formulario =
        document.getElementById("formCadastro");

    const campoFoto =
        document.getElementById("foto");

    const campoFoto2 =
        document.getElementById("foto2");

    const campoFoto3 =
        document.getElementById("foto3");

    const campoTipo =
        document.getElementById("tipo");

    const campoCategoria =
        document.getElementById("categoria");


    // ======================================================
    // CAMPOS COMUNS
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

    const grupoHumano =
        document.getElementById("grupoHumano");


    // ======================================================
    // SAÚDE
    // ======================================================

    const tipoSanguineo =
        document.getElementById("tipoSanguineo");

    const condicaoMedica =
        document.getElementById("condicaoMedica");

    const campoUsaMedicamentos =
        document.getElementById("usaMedicamentos");

    const medicamentos =
        document.getElementById("medicamentos");

    const alergias =
        document.getElementById("alergias");

    const observacoesMedicas =
        document.getElementById("observacoesMedicas");


    // ======================================================
    // EMERGÊNCIA
    // ======================================================

    const nomeEmergencia =
        document.getElementById("nomeEmergencia");

    const telefoneEmergencia =
        document.getElementById("telefoneEmergencia");

    const parentescoEmergencia =
        document.getElementById("parentescoEmergencia");


    // ======================================================
    // ELEMENTOS DE INTERFACE
    // ======================================================

    const blocoCategoria =
        document.getElementById("categoriaItem");

    const blocoContato =
        document.getElementById("contatoConfianca");

    const grupoVeiculo =
        document.getElementById("grupoVeiculo");

    const grupoSaude =
        document.getElementById("grupoSaude");

    const blocoRevisaoSaude =
        document.getElementById("blocoRevisaoSaude");

    const grupoMedicamentos =
        document.getElementById("grupoMedicamentos");


    // ======================================================
    // REVISÃO DE SAÚDE
    // ======================================================

    const confirmarRevisaoSaude =
        document.getElementById("confirmarRevisaoSaude");

    const textoUltimaRevisao =
        document.getElementById("textoUltimaRevisao");

    let ultimaRevisaoAnterior = null;


    // ======================================================
    // REVISÃO HUMANA
    // ======================================================

    const confirmarRevisaoHumana =
        document.getElementById("confirmarRevisaoHumana");

    const textoUltimaRevisaoHumana =
        document.getElementById("textoUltimaRevisaoHumana");

    let ultimaRevisaoHumanaAnterior = null;


    // ======================================================
    // PARÂMETRO DE EDIÇÃO
    // ======================================================

    const parametros =
        new URLSearchParams(window.location.search);

    const idEdicao =
        parametros.get("id");


    // ======================================================
    // FOTOS
    // ======================================================

    let fotoBase64 = "";
    let fotoBase642 = "";
    let fotoBase643 = "";


    // ======================================================
    // VERIFICAÇÃO INICIAL
    // ======================================================

    if (!formulario) {

        console.error(
            "ERRO: #formCadastro não foi encontrado."
        );

        return;
    }

    if (typeof banco === "undefined") {

        console.error(
            "ERRO: objeto 'banco' não está disponível."
        );

        return;
    }

    console.log(
        "✅ Formulário encontrado."
    );

    console.log(
        "✅ Supabase disponível."
    );


    // ======================================================
    // COMPRESSÃO DE IMAGEM
    // ======================================================

    function comprimirImagem(
        arquivo,
        limiteMaximo = 1000,
        qualidade = 0.75
    ) {

        return new Promise(
            (resolve, reject) => {

                const leitor =
                    new FileReader();

                leitor.onerror =
                    () => reject(
                        new Error(
                            "Não foi possível ler a imagem."
                        )
                    );

                leitor.onload =
                    evento => {

                        const img =
                            new Image();

                        img.onerror =
                            () => reject(
                                new Error(
                                    "Não foi possível processar a imagem."
                                )
                            );

                        img.onload =
                            () => {

                                let largura =
                                    img.width;

                                let altura =
                                    img.height;


                                if (
                                    largura <= limiteMaximo &&
                                    altura <= limiteMaximo
                                ) {

                                    resolve(
                                        evento.target.result
                                    );

                                    return;
                                }


                                if (
                                    largura > altura
                                ) {

                                    altura =
                                        Math.round(
                                            (
                                                altura *
                                                limiteMaximo
                                            ) /
                                            largura
                                        );

                                    largura =
                                        limiteMaximo;

                                } else {

                                    largura =
                                        Math.round(
                                            (
                                                largura *
                                                limiteMaximo
                                            ) /
                                            altura
                                        );

                                    altura =
                                        limiteMaximo;
                                }


                                const canvas =
                                    document.createElement(
                                        "canvas"
                                    );

                                canvas.width =
                                    largura;

                                canvas.height =
                                    altura;


                                const ctx =
                                    canvas.getContext(
                                        "2d"
                                    );

                                ctx.drawImage(
                                    img,
                                    0,
                                    0,
                                    largura,
                                    altura
                                );


                                const tipoSaida =
                                    arquivo.type ===
                                    "image/png"
                                        ? "image/png"
                                        : "image/jpeg";


                                const resultado =
                                    canvas.toDataURL(
                                        tipoSaida,
                                        qualidade
                                    );


                                resolve(resultado);
                            };


                        img.src =
                            evento.target.result;
                    };


                leitor.readAsDataURL(
                    arquivo
                );
            }
        );
    }


    // ======================================================
    // PREPARAR UPLOAD
    // ======================================================

    function prepararUpload(
        input,
        callback
    ) {

        if (!input) return;


        input.addEventListener(
            "change",
            async () => {

                const arquivo =
                    input.files &&
                    input.files[0];


                if (!arquivo) {
                    return;
                }


                try {

                    console.log(
                        "⏳ Otimizando imagem..."
                    );


                    const resultado =
                        await comprimirImagem(
                            arquivo
                        );


                    callback(
                        resultado
                    );


                    console.log(
                        "✅ Imagem otimizada."
                    );

                } catch (erro) {

                    console.error(
                        "Erro ao processar imagem:",
                        erro
                    );

                    alert(
                        "Não foi possível processar a imagem."
                    );
                }
            }
        );
    }


    // ======================================================
    // ATIVAR UPLOAD
    // ======================================================

    prepararUpload(
        campoFoto,
        resultado => {
            fotoBase64 = resultado;
        }
    );

    prepararUpload(
        campoFoto2,
        resultado => {
            fotoBase642 = resultado;
        }
    );

    prepararUpload(
        campoFoto3,
        resultado => {
            fotoBase643 = resultado;
        }
    );


    // ======================================================
    // ATUALIZAR CAMPOS VISUAIS
    // ======================================================

    function atualizarCampos() {

        const tipo =
            campoTipo
                ? campoTipo.value
                : "";


        // --------------------------------------------------
        // ESCONDER
        // --------------------------------------------------

        if (blocoCategoria)
            blocoCategoria.style.display =
                "none";

        if (blocoContato)
            blocoContato.style.display =
                "none";

        if (grupoHumano)
            grupoHumano.style.display =
                "none";

        if (grupoVeiculo)
            grupoVeiculo.style.display =
                "none";

        if (grupoSaude)
            grupoSaude.style.display =
                "none";

        if (blocoRevisaoSaude)
            blocoRevisaoSaude.style.display =
                "none";


        // --------------------------------------------------
        // ITEM
        // --------------------------------------------------

        if (tipo === "item") {

            if (blocoCategoria)
                blocoCategoria.style.display =
                    "block";


            if (
                campoCategoria &&
                campoCategoria.value ===
                    "celular"
            ) {

                if (blocoContato)
                    blocoContato.style.display =
                        "block";
            }
        }


        // --------------------------------------------------
        // HUMANO
        // --------------------------------------------------

        if (
            tipo === "humano" ||
            tipo === "pessoa"
        ) {

            if (grupoHumano)
                grupoHumano.style.display =
                    "block";


            if (grupoSaude)
                grupoSaude.style.display =
                    "block";
        }


        // --------------------------------------------------
        // VEÍCULO
        // --------------------------------------------------

        if (tipo === "veiculo") {

            if (grupoVeiculo)
                grupoVeiculo.style.display =
                    "block";


            if (grupoSaude)
                grupoSaude.style.display =
                    "block";


            if (blocoRevisaoSaude)
                blocoRevisaoSaude.style.display =
                    "block";
        }


        atualizarMedicamentos();
    }


    // ======================================================
    // MEDICAMENTOS
    // ======================================================

    function atualizarMedicamentos() {

        if (
            !campoUsaMedicamentos ||
            !grupoMedicamentos
        ) {
            return;
        }


        if (
            campoUsaMedicamentos.value ===
            "sim"
        ) {

            grupoMedicamentos.style.display =
                "block";

        } else {

            grupoMedicamentos.style.display =
                "none";

            if (medicamentos) {
                medicamentos.value = "";
            }
        }
    }


    // ======================================================
    // EVENTOS DA INTERFACE
    // ======================================================

    if (campoTipo) {

        campoTipo.addEventListener(
            "change",
            atualizarCampos
        );
    }


    if (campoCategoria) {

        campoCategoria.addEventListener(
            "change",
            atualizarCampos
        );
    }


    if (campoUsaMedicamentos) {

        campoUsaMedicamentos.addEventListener(
            "change",
            atualizarMedicamentos
        );
    }


    // ======================================================
    // USUÁRIO LOGADO
    // ======================================================

    async function getUser() {

        try {

            const {
                data,
                error
            } =
                await banco.auth.getUser();


            if (error) {

                console.error(
                    "Erro ao obter usuário:",
                    error
                );

                return null;
            }


            return data.user || null;

        } catch (erro) {

            console.error(
                "Erro inesperado ao obter usuário:",
                erro
            );

            return null;
        }
    }


    // ======================================================
    // CARREGAR CADASTROS
    // ======================================================

    async function carregarPets() {

        console.log(
            "⏳ Carregando cadastros..."
        );


        const {
            data,
            error
        } =
            await banco
                .from("pets")
                .select("*");


        if (error) {

            console.error(
                "Erro ao carregar cadastros:",
                error
            );

            return;
        }


        const pets =
            data || [];


        console.log(
            "✅ Cadastros carregados:",
            pets.length
        );


        if (!idEdicao) {

            return;
        }


        const pet =
            pets.find(
                item =>
                    String(item.id) ===
                    String(idEdicao)
            );


        if (!pet) {

            console.error(
                "Cadastro não encontrado:",
                idEdicao
            );

            return;
        }


        console.log(
            "✏️ Editando cadastro:",
            pet
        );


        // --------------------------------------------------
        // CAMPOS COMUNS
        // --------------------------------------------------

        if (nomePet)
            nomePet.value =
                pet.nome_pet || "";

        if (nomeTutor)
            nomeTutor.value =
                pet.nome_tutor || "";

        if (cidade)
            cidade.value =
                pet.cidade || "";

        if (telefone)
            telefone.value =
                pet.telefone || "";


        if (campoTipo)
            campoTipo.value =
                pet.tipo || "pet";


        if (campoCategoria)
            campoCategoria.value =
                pet.categoria || "";


        // --------------------------------------------------
        // CONTATO
        // --------------------------------------------------

        if (contatoNome)
            contatoNome.value =
                pet.contato_nome || "";

        if (contatoTelefone)
            contatoTelefone.value =
                pet.contato_telefone || "";

        if (contatoParentesco)
            contatoParentesco.value =
                pet.contato_parentesco || "";


        // --------------------------------------------------
        // VEÍCULO
        // --------------------------------------------------

        if (marca)
            marca.value =
                pet.marca || "";

        if (modelo)
            modelo.value =
                pet.modelo || "";

        if (cor)
            cor.value =
                pet.cor || "";

        if (placa)
            placa.value =
                pet.placa || "";


        // --------------------------------------------------
        // HUMANO
        // --------------------------------------------------

        if (tipoHumano)
            tipoHumano.value =
                pet.tipo_humano || "";


        // --------------------------------------------------
        // SAÚDE
        // --------------------------------------------------

        if (tipoSanguineo)
            tipoSanguineo.value =
                pet.tipo_sanguineo || "";

        if (condicaoMedica)
            condicaoMedica.value =
                pet.condicao_medica || "";


        /*
        O HTML usa SELECT:

        <option value="nao">Não</option>
        <option value="sim">Sim</option>

        Portanto não usamos .checked.
        */

        if (campoUsaMedicamentos) {

            campoUsaMedicamentos.value =
                pet.usa_medicamentos
                    ? "sim"
                    : "nao";
        }


        if (medicamentos)
            medicamentos.value =
                pet.medicamentos || "";

        if (alergias)
            alergias.value =
                pet.alergias || "";

        if (observacoesMedicas)
            observacoesMedicas.value =
                pet.observacoes_medicas || "";


        // --------------------------------------------------
        // EMERGÊNCIA
        // --------------------------------------------------

        if (nomeEmergencia)
            nomeEmergencia.value =
                pet.nome_emergencia || "";

        if (telefoneEmergencia)
            telefoneEmergencia.value =
                pet.telefone_emergencia || "";

        if (parentescoEmergencia)
            parentescoEmergencia.value =
                pet.parentesco_emergencia || "";


        // --------------------------------------------------
        // REVISÃO SAÚDE
        // --------------------------------------------------

        ultimaRevisaoAnterior =
            pet.ultima_revisao_saude ||
            null;


        if (confirmarRevisaoSaude) {

            confirmarRevisaoSaude.checked =
                Boolean(
                    pet.responsabilidade_confirmada
                );
        }


        if (textoUltimaRevisao) {

            if (pet.ultima_revisao_saude) {

                const data =
                    new Date(
                        pet.ultima_revisao_saude
                    );


                textoUltimaRevisao.innerHTML =
                    `<strong>Última revisão:</strong><br>
                    ${data.toLocaleDateString("pt-BR")}
                    às
                    ${data.toLocaleTimeString(
                        "pt-BR",
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    )}`;

            } else {

                textoUltimaRevisao.innerHTML =
                    "<strong>Este cadastro ainda não possui revisão registrada.</strong>";
            }
        }


        // --------------------------------------------------
        // REVISÃO HUMANA
        // --------------------------------------------------

        ultimaRevisaoHumanaAnterior =
            pet.ultima_revisao_humana ||
            null;


        if (confirmarRevisaoHumana) {

            confirmarRevisaoHumana.checked =
                Boolean(
                    pet.responsabilidade_confirmada_humana
                );
        }


        if (textoUltimaRevisaoHumana) {

            if (pet.ultima_revisao_humana) {

                const data =
                    new Date(
                        pet.ultima_revisao_humana
                    );


                textoUltimaRevisaoHumana.innerHTML =
                    `<strong>Última revisão:</strong><br>
                    ${data.toLocaleDateString("pt-BR")}
                    às
                    ${data.toLocaleTimeString(
                        "pt-BR",
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    )}`;

            } else {

                textoUltimaRevisaoHumana.innerHTML =
                    "<strong>Este cadastro ainda não possui revisão registrada.</strong>";
            }
        }


        // --------------------------------------------------
        // FOTOS
        // --------------------------------------------------

        fotoBase64 =
            pet.foto || "";

        fotoBase642 =
            pet.foto2 || "";

        fotoBase643 =
            pet.foto3 || "";


        // --------------------------------------------------
        // ATUALIZAR INTERFACE
        // --------------------------------------------------

        atualizarCampos();

        atualizarMedicamentos();
    }


    // ======================================================
    // SUBMIT
    // ======================================================

    formulario.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            console.log(
                "=========================================="
            );

            console.log(
                "🚀 SUBMIT DO CADASTRO DISPARADO"
            );

            console.log(
                "=========================================="
            );


            // ------------------------------------------------
            // VALIDAÇÃO DA REVISÃO DO VEÍCULO
            // ------------------------------------------------

            if (
                campoTipo &&
                campoTipo.value === "veiculo"
            ) {

                if (
                    !confirmarRevisaoSaude ||
                    !confirmarRevisaoSaude.checked
                ) {

                    alert(
                        "Por favor, confirme a veracidade das informações médicas e de emergência."
                    );

                    if (confirmarRevisaoSaude) {

                        confirmarRevisaoSaude.focus();
                    }

                    return;
                }
            }


            // ------------------------------------------------
            // VALIDAÇÃO DA REVISÃO HUMANA
            // ------------------------------------------------

            if (
                campoTipo &&
                (
                    campoTipo.value === "humano" ||
                    campoTipo.value === "pessoa"
                )
            ) {

                if (
                    confirmarRevisaoHumana &&
                    !confirmarRevisaoHumana.checked
                ) {

                    alert(
                        "Por favor, confirme a veracidade e atualidade das informações da pessoa cadastrada."
                    );

                    confirmarRevisaoHumana.focus();

                    return;
                }
            }


            // ------------------------------------------------
            // USUÁRIO
            // ------------------------------------------------

            console.log(
                "⏳ Obtendo usuário autenticado..."
            );


            const user =
                await getUser();


            if (!user) {

                console.error(
                    "Usuário não autenticado."
                );

                alert(
                    "Usuário não autenticado."
                );

                window.location.href =
                    "login.html";

                return;
            }


            console.log(
                "✅ Usuário:",
                user.id
            );


            // ------------------------------------------------
            // REVISÕES
            // ------------------------------------------------

            const revisaoHumanaConfirmada =
                confirmarRevisaoHumana
                    ? confirmarRevisaoHumana.checked
                    : false;


            const dataRevisaoHumana =
                revisaoHumanaConfirmada
                    ? new Date().toISOString()
                    : ultimaRevisaoHumanaAnterior;


            const revisaoSaudeConfirmada =
                confirmarRevisaoSaude
                    ? confirmarRevisaoSaude.checked
                    : false;


            const dataRevisaoSaude =
                revisaoSaudeConfirmada
                    ? new Date().toISOString()
                    : ultimaRevisaoAnterior;


            // ------------------------------------------------
            // MEDICAMENTOS
            // ------------------------------------------------

            const usaMedicamentosValor =
                campoUsaMedicamentos
                    ? campoUsaMedicamentos.value === "sim"
                    : false;


            // ------------------------------------------------
            // PAYLOAD
            // ------------------------------------------------

            const dadosFormulario = {

                nome_pet:
                    nomePet
                        ? nomePet.value.trim()
                        : null,

                nome_tutor:
                    nomeTutor
                        ? nomeTutor.value.trim()
                        : null,

                cidade:
                    cidade
                        ? cidade.value.trim()
                        : null,

                telefone:
                    telefone
                        ? telefone.value.trim()
                        : null,

                tipo:
                    campoTipo
                        ? campoTipo.value
                        : null,

                categoria:
                    campoCategoria
                        ? campoCategoria.value || null
                        : null,


                // CONTATO

                contato_nome:
                    contatoNome
                        ? contatoNome.value.trim() || null
                        : null,

                contato_telefone:
                    contatoTelefone
                        ? contatoTelefone.value.trim() || null
                        : null,

                contato_parentesco:
                    contatoParentesco
                        ? contatoParentesco.value.trim() || null
                        : null,


                // VEÍCULO

                marca:
                    marca
                        ? marca.value.trim() || null
                        : null,

                modelo:
                    modelo
                        ? modelo.value.trim() || null
                        : null,

                cor:
                    cor
                        ? cor.value.trim() || null
                        : null,

                placa:
                    placa
                        ? placa.value.trim() || null
                        : null,


                // HUMANO

                tipo_humano:
                    tipoHumano
                        ? tipoHumano.value || null
                        : null,

                responsabilidade_confirmada_humana:
                    revisaoHumanaConfirmada,

                ultima_revisao_humana:
                    dataRevisaoHumana,


                // SAÚDE

                tipo_sanguineo:
                    tipoSanguineo
                        ? tipoSanguineo.value || null
                        : null,

                condicao_medica:
                    condicaoMedica
                        ? condicaoMedica.value.trim() || null
                        : null,

                usa_medicamentos:
                    usaMedicamentosValor,

                medicamentos:
                    medicamentos
                        ? medicamentos.value.trim() || null
                        : null,

                alergias:
                    alergias
                        ? alergias.value.trim() || null
                        : null,

                observacoes_medicas:
                    observacoesMedicas
                        ? observacoesMedicas.value.trim() || null
                        : null,


                // EMERGÊNCIA

                nome_emergencia:
                    nomeEmergencia
                        ? nomeEmergencia.value.trim() || null
                        : null,

                telefone_emergencia:
                    telefoneEmergencia
                        ? telefoneEmergencia.value.trim() || null
                        : null,

                parentesco_emergencia:
                    parentescoEmergencia
                        ? parentescoEmergencia.value.trim() || null
                        : null,


                // REVISÃO

                responsabilidade_confirmada:
                    revisaoSaudeConfirmada,

                ultima_revisao_saude:
                    dataRevisaoSaude,


                // FOTOS

                foto:
                    fotoBase64 || null,

                foto2:
                    fotoBase642 || null,

                foto3:
                    fotoBase643 || null,


                // USUÁRIO

                user_id:
                    user.id
            };


            console.log(
                "=========================================="
            );

            console.log(
                "📦 PAYLOAD FINAL:"
            );

            console.log(
                dadosFormulario
            );

            console.log(
                "=========================================="
            );


            // ------------------------------------------------
            // INSERT / UPDATE
            // ------------------------------------------------

            let resposta;


            if (idEdicao) {

                console.log(
                    "✏️ EXECUTANDO UPDATE"
                );


                resposta =
                    await banco
                        .from("pets")
                        .update(
                            dadosFormulario
                        )
                        .eq(
                            "id",
                            idEdicao
                        );

            } else {

                console.log(
                    "➕ EXECUTANDO INSERT"
                );


                resposta =
                    await banco
                        .from("pets")
                        .insert(
                            [dadosFormulario]
                        )
                        .select();
            }


            // ------------------------------------------------
            // RESPOSTA
            // ------------------------------------------------

            console.log(
                "=========================================="
            );

            console.log(
                "📡 RESPOSTA DO SUPABASE:"
            );

            console.log(
                resposta
            );

            console.log(
                "=========================================="
            );


            // ------------------------------------------------
            // ERRO
            // ------------------------------------------------

            if (resposta.error) {

                console.error(
                    "❌ ERRO SUPABASE:",
                    resposta.error
                );


                console.error(
                    "Mensagem:",
                    resposta.error.message
                );


                console.error(
                    "Detalhes:",
                    resposta.error.details
                );


                console.error(
                    "Código:",
                    resposta.error.code
                );


                alert(
                    "Erro ao salvar:\n\n" +
                    (
                        resposta.error.message ||
                        resposta.error.details ||
                        "Erro desconhecido"
                    )
                );


                return;
            }


            // ------------------------------------------------
            // SUCESSO
            // ------------------------------------------------

            console.log(
                "✅ CADASTRO SALVO COM SUCESSO!"
            );


            if (!idEdicao) {

                localStorage.removeItem(
                    "ultimoPet"
                );
            }


            alert(
                idEdicao
                    ? "Atualizado com sucesso!"
                    : "Cadastrado com sucesso!"
            );


            window.location.href =
                "meus-pets.html";
        }
    );


    // ======================================================
    // INICIALIZAÇÃO
    // ======================================================

    atualizarCampos();

    atualizarMedicamentos();

    carregarPets();


    // ======================================================
    // TESTE FINAL
    // ======================================================

    console.log(
        "✅ cadastro.js inicializado completamente."
    );

})();