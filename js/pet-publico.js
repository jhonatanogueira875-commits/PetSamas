/*
==========================================================
Safe Samas
Arquivo: js/pet-publico.js

Responsável por:

✔ Receber o código do QR pela URL
✔ Consultar o perfil público via RPC
✔ Identificar o tipo de cadastro
✔ Exibir uma foto para pet/item/humano
✔ Exibir até 3 fotos para veículo
✔ Exibir dados específicos do veículo
✔ Exibir responsável/proprietário
✔ Exibir localização
✔ Exibir informações médicas disponíveis
✔ Exibir contato de emergência
✔ Exibir contato de confiança para itens/celulares
✔ Gerar contato via WhatsApp
✔ Exibir status da revisão médica
✔ Permitir ampliação das fotos
==========================================================
*/


"use strict";


/* ======================================================
   PARÂMETRO DO QR CODE
====================================================== */

const parametros =
    new URLSearchParams(
        window.location.search
    );


const codigo =
    parametros.get("codigo");


/* ======================================================
   FUNÇÕES AUXILIARES
====================================================== */

function elemento(id) {

    return document.getElementById(id);

}


function escaparHTML(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";

    }

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function somenteNumeros(valor) {

    return String(valor || "")
        .replace(/\D/g, "");

}


/* ======================================================
   TIPO DE CADASTRO
====================================================== */

function obterTipoPerfil(
    tipo,
    categoria,
    tipoHumano
) {

    if (tipo === "veiculo") {

        return {
            texto: "🚗 Veículo protegido",
            classe: "tipo-veiculo"
        };

    }


    if (tipo === "humano") {

        const categorias = {

            crianca:
                "🧒 Criança",

            idoso:
                "👴 Pessoa idosa",

            autista:
                "🧩 Pessoa autista",

            adulto:
                "👤 Pessoa",

            outro:
                "👤 Pessoa"

        };


        return {

            texto:
                categorias[tipoHumano]
                || "👤 Pessoa protegida",

            classe:
                "tipo-humano"

        };

    }


    if (tipo === "item") {

        return {

            texto:
                categoria === "celular"
                    ? "📱 Celular protegido"
                    : "🔑 Item protegido",

            classe:
                "tipo-item"

        };

    }


    return {

        texto:
            "🐾 Pet protegido",

        classe:
            "tipo-pet"

    };

}


/* ======================================================
   GALERIA
====================================================== */

function montarGaleria(
    pet
) {

    const galeria =
        elemento("galeriaFotos");


    if (!galeria) {

        return;

    }


    galeria.innerHTML = "";


    const fotos = [];


    if (pet.foto) {

        fotos.push(pet.foto);

    }


    /*
    ------------------------------------------------------
    REGRA DEFINITIVA:

    SOMENTE VEÍCULO UTILIZA FOTO 2 E FOTO 3.
    ------------------------------------------------------
    */

    if (
        pet.tipo === "veiculo"
    ) {

        if (pet.foto2) {

            fotos.push(pet.foto2);

        }

        if (pet.foto3) {

            fotos.push(pet.foto3);

        }

    }


    /*
    ------------------------------------------------------
    FALLBACK
    ------------------------------------------------------
    */

    if (fotos.length === 0) {

        fotos.push(
            "assets/images/escudo.png"
        );

    }


    /*
    ------------------------------------------------------
    VEÍCULO
    ------------------------------------------------------
    */

    if (
        pet.tipo === "veiculo" &&
        fotos.length > 1
    ) {

        galeria.classList.add(
            "galeria-veiculo"
        );


        fotos.forEach(
            function (
                foto,
                indice
            ) {

                const imagem =
                    document.createElement(
                        "img"
                    );


                imagem.src =
                    foto;

                imagem.alt =
                    `Foto ${indice + 1} do veículo`;

                imagem.className =
                    "foto-veiculo foto-ampliavel";

                imagem.dataset.foto =
                    foto;


                galeria.appendChild(
                    imagem
                );

            }
        );


    } else {

        /*
        --------------------------------------------------
        PET / ITEM / HUMANO
        --------------------------------------------------
        */

        galeria.classList.remove(
            "galeria-veiculo"
        );


        const imagem =
            document.createElement(
                "img"
            );


        imagem.src =
            fotos[0];

        imagem.alt =
            "Foto principal";

        imagem.className =
            "foto-principal foto-ampliavel";

        imagem.dataset.foto =
            fotos[0];


        galeria.appendChild(
            imagem
        );

    }


    ativarModalFotos();

}


/* ======================================================
   MODAL
====================================================== */

function ativarModalFotos() {

    const modal =
        elemento("modalFoto");

    const imagemModal =
        elemento("imagemModal");

    const fechar =
        elemento("fecharModal");


    if (
        !modal ||
        !imagemModal ||
        !fechar
    ) {

        return;

    }


    document
        .querySelectorAll(
            ".foto-ampliavel"
        )
        .forEach(
            function (imagem) {

                imagem.onclick =
                    function () {

                        imagemModal.src =
                            imagem.dataset.foto;

                        modal.classList.add(
                            "ativo"
                        );

                    };

            }
        );


    fechar.onclick =
        function () {

            modal.classList.remove(
                "ativo"
            );

            imagemModal.src = "";

        };


    modal.onclick =
        function (evento) {

            if (
                evento.target === modal
            ) {

                modal.classList.remove(
                    "ativo"
                );

                imagemModal.src = "";

            }

        };


    document.addEventListener(
        "keydown",
        function (evento) {

            if (
                evento.key === "Escape"
            ) {

                modal.classList.remove(
                    "ativo"
                );

                imagemModal.src = "";

            }

        }
    );

}


/* ======================================================
   IDENTIFICAÇÃO
====================================================== */

function montarIdentificacao(
    pet
) {

    const nome =
        elemento("nomePet");

    const subtitulo =
        elemento("subIdentificacao");

    const tipoPerfil =
        elemento("tipoPerfil");


    if (nome) {

        nome.textContent =
            pet.nome || "Sem identificação";

    }


    if (tipoPerfil) {

        const perfil =
            obterTipoPerfil(
                pet.tipo,
                pet.categoria,
                pet.tipo_humano
            );


        tipoPerfil.textContent =
            perfil.texto;


        tipoPerfil.className =
            `tipo-perfil ${perfil.classe}`;

    }


    if (subtitulo) {

        let texto = "";


        if (
            pet.tipo === "veiculo"
        ) {

            texto =
                "Identificação do veículo";

        } else if (
            pet.tipo === "humano"
        ) {

            texto =
                "Identificação da pessoa";

        } else if (
            pet.tipo === "item"
        ) {

            texto =
                pet.categoria
                    ? `Item: ${pet.categoria}`
                    : "Identificação do item";

        } else {

            texto =
                "Identificação do pet";

        }


        subtitulo.textContent =
            texto;

    }

}


/* ======================================================
   RESPONSÁVEL
====================================================== */

function montarResponsavel(
    pet
) {

    const titulo =
        elemento("tituloResponsavel");

    const dados =
        elemento("dadosResponsavel");


    if (
        !titulo ||
        !dados
    ) {

        return;

    }


    dados.innerHTML = "";


    let tituloTexto =
        "👤 Responsável";


    if (
        pet.tipo === "item" ||
        pet.tipo === "veiculo"
    ) {

        tituloTexto =
            "👤 Proprietário";

    }


    titulo.textContent =
        tituloTexto;


    if (
        pet.nome_tutor
    ) {

        dados.innerHTML = `
            <div class="campo-publico">
                <span class="campo-label">
                    Nome
                </span>

                <span class="campo-valor">
                    ${escaparHTML(
                        pet.nome_tutor
                    )}
                </span>
            </div>
        `;

    } else {

        dados.innerHTML = `
            <div class="campo-publico">
                <span class="campo-valor">
                    Não informado
                </span>
            </div>
        `;

    }

}


/* ======================================================
   LOCALIZAÇÃO
====================================================== */

function montarLocalizacao(
    pet
) {

    const dados =
        elemento("dadosLocalizacao");


    if (!dados) {

        return;

    }


    dados.innerHTML = `
        <div class="campo-publico">

            <span class="campo-label">
                Cidade
            </span>

            <span class="campo-valor">
                ${escaparHTML(
                    pet.cidade || "Não informada"
                )}
            </span>

        </div>
    `;

}


/* ======================================================
   VEÍCULO
====================================================== */

function montarVeiculo(
    pet
) {

    const secao =
        elemento("secaoVeiculo");

    const dados =
        elemento("dadosVeiculo");


    if (
        !secao ||
        !dados
    ) {

        return;

    }


    secao.style.display =
        "none";


    dados.innerHTML = "";


    if (
        pet.tipo !== "veiculo"
    ) {

        return;

    }


    const partes = [];


    if (
        pet.marca ||
        pet.modelo
    ) {

        partes.push(`
            <div class="campo-publico">

                <span class="campo-label">
                    Veículo
                </span>

                <span class="campo-valor">
                    ${escaparHTML(
                        `${pet.marca || ""} ${pet.modelo || ""}`.trim()
                    )}
                </span>

            </div>
        `);

    }


    if (pet.cor) {

        partes.push(`
            <div class="campo-publico">

                <span class="campo-label">
                    Cor
                </span>

                <span class="campo-valor">
                    ${escaparHTML(
                        pet.cor
                    )}
                </span>

            </div>
        `);

    }


    if (pet.placa) {

        partes.push(`
            <div class="campo-publico">

                <span class="campo-label">
                    Placa
                </span>

                <span class="placa-veiculo">
                    ${escaparHTML(
                        pet.placa
                    )}
                </span>

            </div>
        `);

    }


    if (partes.length === 0) {

        return;

    }


    dados.innerHTML =
        partes.join("");


    secao.style.display =
        "block";

}


/* ======================================================
   SAÚDE
====================================================== */

function montarSaude(
    pet
) {

    const secao =
        elemento("secaoSaude");

    const dados =
        elemento("dadosSaude");

    const aviso =
        elemento("avisoRevisao");


    if (
        !secao ||
        !dados ||
        !aviso
    ) {

        return;

    }


    secao.style.display =
        "none";


    dados.innerHTML =
        "";

    aviso.innerHTML =
        "";

    aviso.style.display =
        "none";


    /*
    ------------------------------------------------------
    REGRA:

    INFORMAÇÕES MÉDICAS PÚBLICAS SOMENTE PARA
    PETS E HUMANOS.

    ITENS, CELULARES E VEÍCULOS NÃO DEVEM
    EXIBIR ESTA SEÇÃO.
    ------------------------------------------------------
    */

    if (
        pet.tipo !== "pet" &&
        pet.tipo !== "humano"
    ) {

        return;

    }


    const campos = [];


    /*
    ------------------------------------------------------
    TIPO SANGUÍNEO
    ------------------------------------------------------
    */

    if (
        pet.tipo_sanguineo
    ) {

        campos.push(`
            <div class="campo-publico">

                <span class="campo-label">
                    🩸 Tipo sanguíneo
                </span>

                <span class="campo-valor">
                    ${escaparHTML(
                        pet.tipo_sanguineo
                    )}
                </span>

            </div>
        `);

    }


    /*
    ------------------------------------------------------
    CONDIÇÃO MÉDICA
    ------------------------------------------------------
    */

    if (
        pet.condicao_medica
    ) {

        campos.push(`
            <div class="campo-publico">

                <span class="campo-label">
                    🏥 Condição médica
                </span>

                <span class="campo-valor">
                    ${escaparHTML(
                        pet.condicao_medica
                    )}
                </span>

            </div>
        `);

    }


    /*
    ------------------------------------------------------
    CAMPOS OPCIONAIS
    ------------------------------------------------------

    Se a RPC atual retornar esses campos,
    eles serão exibidos.

    Se não retornar, nada acontece.
    ------------------------------------------------------
    */

    if (
        pet.alergias
    ) {

        campos.push(`
            <div class="campo-publico">

                <span class="campo-label">
                    ⚠️ Alergias
                </span>

                <span class="campo-valor">
                    ${escaparHTML(
                        pet.alergias
                    )}
                </span>

            </div>
        `);

    }


    if (
        pet.observacoes_medicas
    ) {

        campos.push(`
            <div class="campo-publico">

                <span class="campo-label">
                    📝 Observações
                </span>

                <span class="campo-valor">
                    ${escaparHTML(
                        pet.observacoes_medicas
                    )}
                </span>

            </div>
        `);

    }


    /*
    ------------------------------------------------------
    SEM INFORMAÇÕES
    ------------------------------------------------------
    */

    if (
        campos.length === 0
    ) {

        /*
        Ainda podemos exibir a revisão caso exista.
        */

        montarAvisoRevisao(
            pet,
            aviso,
            secao
        );

        return;

    }


    dados.innerHTML =
        campos.join("");


    secao.style.display =
        "block";


    montarAvisoRevisao(
        pet,
        aviso,
        secao
    );

}


/* ======================================================
   REVISÃO MÉDICA
====================================================== */

function montarAvisoRevisao(
    pet,
    aviso,
    secao
) {

    if (
        !aviso
    ) {

        return;

    }


    aviso.style.display =
        "block";


    if (
        pet.responsabilidade_confirmada &&
        pet.ultima_revisao_saude
    ) {

        const data =
            new Date(
                pet.ultima_revisao_saude
            );


        const dias =
            Math.floor(
                (
                    Date.now() -
                    data.getTime()
                ) /
                86400000
            );


        const dataFormatada =
            data.toLocaleDateString(
                "pt-BR"
            );


        if (
            dias <= 30
        ) {

            aviso.className =
                "aviso-revisao atualizado";


            aviso.innerHTML = `
                🟢 Informações médicas
                revisadas pelo responsável.
                <br>
                <small>
                    Última revisão:
                    ${dataFormatada}
                </small>
            `;

        } else {

            aviso.className =
                "aviso-revisao atencao";


            aviso.innerHTML = `
                🟡 Recomenda-se confirmar
                as informações médicas.
                <br>
                <small>
                    Última revisão:
                    ${dataFormatada}
                </small>
            `;

        }

    } else {

        aviso.className =
            "aviso-revisao atencao";


        aviso.innerHTML = `
            🟡 Recomenda-se confirmar
            as informações médicas.
            <br>
            <small>
                Este cadastro ainda não possui
                revisão registrada.
            </small>
        `;

    }


    secao.style.display =
        "block";

}


/* ======================================================
   EMERGÊNCIA
====================================================== */

function montarEmergencia(
    pet
) {

    const secao =
        elemento("secaoEmergencia");

    const dados =
        elemento("dadosEmergencia");


    if (
        !secao ||
        !dados
    ) {

        return;

    }


    secao.style.display =
        "none";


    dados.innerHTML =
        "";


    if (
        !pet.telefone_emergencia
    ) {

        return;

    }


    const telefone =
        somenteNumeros(
            pet.telefone_emergencia
        );


    dados.innerHTML = `

        <div class="campo-publico">

            <span class="campo-label">
                Nome
            </span>

            <span class="campo-valor">
                ${escaparHTML(
                    pet.nome_emergencia || "Contato"
                )}
            </span>

        </div>


        ${
            pet.parentesco_emergencia
                ? `
                    <div class="campo-publico">

                        <span class="campo-label">
                            Parentesco
                        </span>

                        <span class="campo-valor">
                            ${escaparHTML(
                                pet.parentesco_emergencia
                            )}
                        </span>

                    </div>
                `
                : ""
        }


        <div class="campo-publico">

            <span class="campo-label">
                Telefone
            </span>

            <span class="campo-valor">

                <a
                    href="tel:+55${telefone}"
                >
                    📞
                    ${escaparHTML(
                        pet.telefone_emergencia
                    )}
                </a>

            </span>

        </div>

    `;


    secao.style.display =
        "block";

}


/* ======================================================
   CONTATOS
====================================================== */

function montarContatos(
    pet
) {

    const areaContato =
        elemento("areaContato");

    const linkWhatsapp =
        elemento("linkWhatsapp");

    const btnContato =
        elemento("btnContato");


    const areaConfianca =
        elemento("areaContatoConfianca");

    const linkConfianca =
        elemento("linkContatoConfianca");


    /*
    ------------------------------------------------------
    CONTATO PRINCIPAL
    ------------------------------------------------------
    */

    if (
        pet.tipo === "item"
    ) {

        /*
        O proprietário não recebe contato
        diretamente por este botão.

        O item/celular utiliza o contato
        de confiança quando disponível.
        */

        if (linkWhatsapp) {

            linkWhatsapp.style.display =
                "none";

        }

    } else {

        const telefone =
            somenteNumeros(
                pet.telefone
            );


        if (
            telefone &&
            linkWhatsapp &&
            btnContato
        ) {

            let descricao =
                "item";


            if (
                pet.tipo === "pet"
            ) {

                descricao =
                    "pet";

            } else if (
                pet.tipo === "veiculo"
            ) {

                descricao =
                    "veículo";

            } else if (
                pet.tipo === "humano"
            ) {

                descricao =
                    "pessoa";

            }


            const mensagem =
                encodeURIComponent(
                    `Olá! Encontrei o(a) ${descricao} "${pet.nome}" e gostaria de falar com você.`
                );


            linkWhatsapp.href =
                `https://wa.me/55${telefone}?text=${mensagem}`;


            linkWhatsapp.style.display =
                "inline";


            btnContato.style.display =
                "inline-block";

        } else if (
            linkWhatsapp
        ) {

            linkWhatsapp.style.display =
                "none";

        }

    }


    /*
    ------------------------------------------------------
    CONTATO DE CONFIANÇA
    ------------------------------------------------------
    */

    if (
        pet.tipo === "item" &&
        pet.contato_telefone &&
        areaConfianca &&
        linkConfianca
    ) {

        const telefone =
            somenteNumeros(
                pet.contato_telefone
            );


        const mensagem =
            encodeURIComponent(
                `Olá! Encontrei o item "${pet.nome}" cadastrado no Safe Samas e gostaria de falar com você.`
            );


        linkConfianca.href =
            `https://wa.me/55${telefone}?text=${mensagem}`;


        areaConfianca.style.display =
            "block";

    } else if (
        areaConfianca
    ) {

        areaConfianca.style.display =
            "none";

    }

}


/* ======================================================
   CARREGAMENTO PRINCIPAL
====================================================== */

async function carregarPerfilPublico() {

    console.log(
        "=========================================="
    );

    console.log(
        "SAFE SAMAS - PERFIL PÚBLICO"
    );

    console.log(
        "Código QR:",
        codigo
    );

    console.log(
        "=========================================="
    );


    /*
    ------------------------------------------------------
    VALIDAR QR
    ------------------------------------------------------
    */

    if (!codigo) {

        const nome =
            elemento("nomePet");


        if (nome) {

            nome.textContent =
                "QR Code inválido.";

        }


        return;

    }


    /*
    ------------------------------------------------------
    SUPABASE
    ------------------------------------------------------
    */

    if (
        typeof banco === "undefined"
    ) {

        console.error(
            "❌ Supabase não disponível."
        );


        const nome =
            elemento("nomePet");


        if (nome) {

            nome.textContent =
                "Não foi possível carregar o cadastro.";

        }


        return;

    }


    /*
    ------------------------------------------------------
    CONSULTA PÚBLICA
    ------------------------------------------------------
    */

    const {
        data: resposta,
        error
    } =
        await banco.rpc(
            "obter_pet_publico",
            {
                codigo_qr:
                    codigo
            }
        );


    console.log(
        "Resposta da RPC:",
        resposta
    );


    if (
        error ||
        !resposta ||
        !resposta.pet
    ) {

        console.error(
            "❌ Cadastro público não encontrado:",
            error
        );


        const nome =
            elemento("nomePet");


        if (nome) {

            nome.textContent =
                "Item não encontrado.";

        }


        return;

    }


    /*
    ------------------------------------------------------
    DADOS
    ------------------------------------------------------
    */

    const pet =
        resposta.pet;


    /*
    ------------------------------------------------------
    CONSTRUÇÃO DA PÁGINA
    ------------------------------------------------------
    */

    montarIdentificacao(
        pet
    );


    montarGaleria(
        pet
    );


    montarResponsavel(
        pet
    );


    montarLocalizacao(
        pet
    );


    montarVeiculo(
        pet
    );


    montarSaude(
        pet
    );


    montarEmergencia(
        pet
    );


    montarContatos(
        pet
    );


    console.log(
        "✅ Perfil público carregado."
    );

}


/* ======================================================
   EXECUÇÃO
====================================================== */

carregarPerfilPublico();v