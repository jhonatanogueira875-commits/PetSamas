/*
==========================================================
Arquivo: js/pet.js
VERSÃO CORRIGIDA - SUPABASE STORAGE
==========================================================
*/

const parametros = new URLSearchParams(window.location.search);
const id = parametros.get("id");


/* ======================================================
   CONVERTER CAMINHO DO STORAGE EM URL PÚBLICA
====================================================== */

function obterUrlPublicaFoto(caminho) {

    if (
        caminho === null ||
        caminho === undefined
    ) {
        return "";
    }

    if (
        typeof caminho !== "string"
    ) {
        return "";
    }

    const valor = caminho.trim();

    if (!valor) {
        return "";
    }


    /* --------------------------------------------------
       BASE64
       Mantém compatibilidade com cadastros antigos
    -------------------------------------------------- */

    if (
        valor.startsWith("data:image/")
    ) {
        return valor;
    }


    /* --------------------------------------------------
       URL COMPLETA
       Caso alguma foto já esteja salva como URL
    -------------------------------------------------- */

    if (
        valor.startsWith("http://") ||
        valor.startsWith("https://")
    ) {
        return valor;
    }


    /* --------------------------------------------------
       SUPABASE STORAGE
    -------------------------------------------------- */

    if (
        typeof banco === "undefined" ||
        !banco ||
        !banco.storage
    ) {
        console.error(
            "PET -> Supabase Storage não está disponível."
        );

        return "";
    }


    /* --------------------------------------------------
       NORMALIZAR CAMINHO
    -------------------------------------------------- */

    let caminhoStorage = valor;

    // Remove barras iniciais
    caminhoStorage = caminhoStorage.replace(
        /^\/+/,
        ""
    );

    // Se já vier como pet-images/179/foto.jpg,
    // remove o nome do bucket.
    caminhoStorage = caminhoStorage.replace(
        /^pet-images\/+/i,
        ""
    );


    console.log(
        "PET -> caminho Storage:",
        caminhoStorage
    );


    /* --------------------------------------------------
       GERAR URL PÚBLICA
    -------------------------------------------------- */

    try {

        const resultado =
            banco
                .storage
                .from("pet-images")
                .getPublicUrl(
                    caminhoStorage
                );


        if (
            resultado &&
            resultado.data &&
            resultado.data.publicUrl
        ) {

            console.log(
                "PET -> URL pública gerada:",
                resultado.data.publicUrl
            );

            return resultado.data.publicUrl;
        }


        console.error(
            "PET -> Não foi possível gerar URL pública:",
            caminhoStorage
        );

        return "";

    } catch (erro) {

        console.error(
            "PET -> Erro ao gerar URL pública:",
            erro
        );

        return "";
    }
}


/* ======================================================
   CARREGAR PERFIL
====================================================== */

async function carregarPerfil() {

    const { data, error } = await banco
        .from("pets")
        .select("*")
        .eq("id", id)
        .single();


    if (error || !data) {

        document.getElementById("nomePet").innerText =
            "Item não encontrado.";

        return;
    }


    // Textos dinâmicos neutralizados
    const statusTxt =
        "🔍 Buscando responsável ❤️";

    const msgTxt =
        "Se você encontrou este item, entre em contato com o responsável.";

    const btnTxt =
        "💬 Falar com o responsável";


    // Preencher elementos
    const galeria =
        document.getElementById("galeriaFotos");

    const fotos = [];


    /* ==================================================
       FOTOS
    ================================================== */

    if (data.foto) {

        const urlFoto =
            obterUrlPublicaFoto(data.foto);

        if (urlFoto) {
            fotos.push(urlFoto);
        }
    }


    if (data.foto2) {

        const urlFoto2 =
            obterUrlPublicaFoto(data.foto2);

        if (urlFoto2) {
            fotos.push(urlFoto2);
        }
    }


    if (data.foto3) {

        const urlFoto3 =
            obterUrlPublicaFoto(data.foto3);

        if (urlFoto3) {
            fotos.push(urlFoto3);
        }
    }


    /* ==================================================
       FALLBACK
    ================================================== */

    if (fotos.length === 0) {

        fotos.push(
            "assets/images/escudo.png"
        );
    }


    /* ==================================================
       MONTAR GALERIA
    ================================================== */

    galeria.innerHTML =
        fotos.map(
            (foto, indice) => `

        <img
            src="${foto}"
            alt="Foto ${indice + 1}"
            class="foto-card foto-ampliavel"
            data-foto="${foto}"
            style="
                width:100%;
                max-width:260px;
                border-radius:15px;
                margin-bottom:15px;
                display:block;
                margin-left:auto;
                margin-right:auto;
                cursor:pointer;
            "
            onerror="
                this.onerror=null;
                this.src='assets/images/escudo.png';
                this.dataset.foto='assets/images/escudo.png';
            "
        >

    `
        ).join("");


    /* ==================================================
       DADOS DO PERFIL
    ================================================== */

    document.getElementById("nomePet").innerText =
        data.nome_pet;

    document.getElementById("statusPet").innerText =
        statusTxt;

    document.getElementById("mensagemPet").innerText =
        msgTxt;

    document.getElementById("labelTutor").innerText =
        "👤 Responsável";

    document.getElementById("nomeTutor").innerText =
        data.nome_tutor;

    document.getElementById("cidadePet").innerText =
        data.cidade;

    document.getElementById("btnContato").innerText =
        btnTxt;


    /* ==================================================
       WHATSAPP
    ================================================== */

    const telFormatado =
        String(data.telefone || "")
            .replace(/\D/g, "");


    const mensagem =
        encodeURIComponent(`Olá! 😊

Encontrei "${data.nome_pet}", cadastrado no Safe Samas, e acredito que pertença a você.

Gostaria de confirmar algumas informações para realizarmos a devolução com segurança.

Fico no aguardo!`);


    document.getElementById("linkWhatsapp").href =
        `https://wa.me/55${telFormatado}?text=${mensagem}`;
}


carregarPerfil();


/* ======================================================
   VISUALIZADOR DE FOTOS
====================================================== */

const modalFoto =
    document.getElementById("modalFoto");

const imagemModal =
    document.getElementById("imagemModal");

const fecharModal =
    document.getElementById("fecharModal");


// Abre a foto
document.addEventListener(
    "click",
    function (e) {

        if (
            e.target.classList.contains(
                "foto-ampliavel"
            )
        ) {

            imagemModal.src =
                e.target.dataset.foto;

            modalFoto.classList.add(
                "ativo"
            );
        }
    }
);


// Fecha pelo X
fecharModal.addEventListener(
    "click",
    function () {

        modalFoto.classList.remove(
            "ativo"
        );
    }
);


// Fecha clicando no fundo preto
modalFoto.addEventListener(
    "click",
    function (e) {

        if (
            e.target === modalFoto
        ) {

            modalFoto.classList.remove(
                "ativo"
            );
        }
    }
);


// Fecha com ESC
document.addEventListener(
    "keydown",
    function (e) {

        if (
            e.key === "Escape"
        ) {

            modalFoto.classList.remove(
                "ativo"
            );
        }
    }
);