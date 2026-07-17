alert("PET-PUBLICO NOVO CARREGADO");
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
        nome_tutor
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

    document.getElementById("nomeTutor").innerText =
        nome_tutor;

    document.getElementById("cidadePet").innerText =
        cidade;

    // ==========================================
    // WHATSAPP
    // ==========================================

    const telefoneLimpo =
        String(telefone || "").replace(/\D/g, "");

    const mensagem = encodeURIComponent(
        `Olá! Encontrei o item "${nome}" e gostaria de devolvê-lo.`
    );

    document.getElementById("linkWhatsapp").href =
        `https://wa.me/55${telefoneLimpo}?text=${mensagem}`;
}

carregarPerfilPublico();