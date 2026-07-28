/*
==========================================================
Arquivo: js/pet-publico.js
==========================================================
*/

const parametros = new URLSearchParams(window.location.search);
const codigo = parametros.get("codigo");

async function carregarPerfilPublico() {

    if (!codigo) {
        alert("QR Code inválido.");
        window.location.href = "index.html";
        return;
    }

    const { data: resposta, error } = await banco.rpc(
        "obter_pet_publico",
        {
            codigo_qr: codigo
        }
    );

    if (error || !resposta || !resposta.pet) {

        document.getElementById("nomePet").innerText =
            "Item não encontrado.";

        return;
    }

    const {
        nome,
        foto,
        foto2,
        foto3,

        cidade,
        telefone,
        nome_tutor,

        tipo,
        categoria,

        contato_nome,
        contato_telefone,
        contato_parentesco,

        // ======================
        // VEÍCULO
        // ======================

        marca,
        modelo,
        cor,
        placa,

        // ======================
        // SAÚDE
        // ======================

        tipo_sanguineo,
        condicao_medica,

        // ======================
        // CONTATO EMERGÊNCIA
        // ======================

        nome_emergencia,
        telefone_emergencia,
        parentesco_emergencia

    } = resposta.pet;

    // ==========================================
    // GALERIA DE FOTOS
    // ==========================================

    const galeria =
        document.getElementById("galeriaFotos");

    const fotos = [];

    if (foto) fotos.push(foto);
    if (foto2) fotos.push(foto2);
    if (foto3) fotos.push(foto3);

    if (fotos.length === 0) {
        fotos.push("assets/images/escudo.png");
    }

    galeria.innerHTML = fotos.map((foto, indice) => `
        <img
            src="${foto}"
            alt="Foto ${indice + 1}"
            class="foto-card foto-ampliavel"
            data-foto="${foto}"
            style="
                cursor:pointer;
                width:100%;
                max-width:260px;
                border-radius:15px;
                display:block;
                margin:0 auto 15px auto;
            ">
    `).join("");

    // ==========================================
    // Clique nas imagens
    // ==========================================

    const modal = document.getElementById("modalFoto");
    const imagem = document.getElementById("imagemModal");
    const fechar = document.getElementById("fecharModal");

    document.querySelectorAll(".foto-ampliavel").forEach((img) => {

        img.onclick = function () {

            imagem.src = this.dataset.foto;

            modal.classList.add("ativo");
        };

    });

    fechar.onclick = function () {

        modal.classList.remove("ativo");

    };

    modal.onclick = function (e) {

        if (e.target === modal) {

            modal.classList.remove("ativo");

        }

    };

    document.addEventListener("keydown", function (e) {

        if (e.key === "Escape") {

            modal.classList.remove("ativo");

        }

    });

    // ==========================================
    // DADOS
    // ==========================================

    document.getElementById("nomePet").innerText =
        nome;

    if (tipo === "celular" && contato_nome) {

        document.getElementById("labelTutor").innerText =
            "👤 Contato de confiança";

        document.getElementById("nomeTutor").innerText =
            `${contato_nome} (${contato_parentesco})`;

    } else {

        document.getElementById("labelTutor").innerText =
            "👤 Responsável";

        document.getElementById("nomeTutor").innerText =
            nome_tutor;

    }

    document.getElementById("cidadePet").innerText =
        cidade;

    // ==========================================
    // VEÍCULO
    // ==========================================

    const blocoVeiculo =
        document.getElementById("blocoVeiculo");

    if (

        blocoVeiculo &&
        tipo === "veiculo" &&
        (marca || modelo || cor || placa)

    ){

        blocoVeiculo.style.display = "block";

        if(document.getElementById("infoMarcaModelo")){

            document.getElementById("infoMarcaModelo").innerText =
                `${marca || ""} ${modelo || ""}`.trim();

        }

        if(document.getElementById("infoCor")){

            document.getElementById("infoCor").innerText =
                cor || "-";

        }

        if(document.getElementById("infoPlaca")){

            document.getElementById("infoPlaca").innerText =
                placa || "-";

        }

    }

    // ==========================================
    // INFORMAÇÕES MÉDICAS
    // ==========================================

    const blocoSaude =
        document.getElementById("blocoSaude");

    let possuiInformacaoMedica = false;

    if(

        tipo_sanguineo ||
        condicao_medica ||
        telefone_emergencia

    ){

        possuiInformacaoMedica = true;

    }

    if(

        blocoSaude &&
        possuiInformacaoMedica

    ){

        blocoSaude.style.display = "block";

        if(tipo_sanguineo){

            const itemTipo = document.getElementById("itemTipoSanguineo");
            if(itemTipo){
                itemTipo.style.display="block";
            }

            document.getElementById("valTipoSanguineo").innerText =
                tipo_sanguineo;

        }

        if(condicao_medica){

            const itemCondicao = document.getElementById("itemCondicaoMedica");
            if(itemCondicao){
                itemCondicao.style.display="block";
            }

            document.getElementById("valCondicaoMedica").innerText =
                condicao_medica;

        }

        if(telefone_emergencia){

            const itemContato = document.getElementById("itemContatoEmergencia");
            if(itemContato){
                itemContato.style.display="block";
            }

            document.getElementById("valNomeEmergencia").innerText =
                nome_emergencia || "Contato";

            document.getElementById("valParentescoEmergencia").innerText =
                parentesco_emergencia || "";

            const telEmergencia =
                String(telefone_emergencia).replace(/\D/g,"");

            document.getElementById("linkTelEmergencia").href =
                `tel:+55${telEmergencia}`;

        }

    }

    // ==========================================
    // WHATSAPP
    // ==========================================

    let telefoneDestino = telefone;
    if (
        tipo === "celular" &&
        contato_telefone
    ) {
        telefoneDestino = contato_telefone;
    }
    const telefoneLimpo =
        String(telefoneDestino || "").replace(/\D/g, "");

    let descricao = "item";

    if (tipo === "pet")
        descricao = "pet";

    if (tipo === "veiculo")
        descricao = "veículo";

    const mensagem = encodeURIComponent(
        `Olá! Encontrei o ${descricao} "${nome}" e gostaria de devolvê-lo.`
    );

    document.getElementById("linkWhatsapp").href =
        `https://wa.me/55${telefoneLimpo}?text=${mensagem}`;
}

carregarPerfilPublico();