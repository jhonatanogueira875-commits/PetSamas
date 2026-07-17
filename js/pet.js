/*
==========================================================
Arquivo: js/pet.js (VERSÃO DEFINITIVA)
==========================================================
*/

const parametros = new URLSearchParams(window.location.search);
const id = parametros.get("id");

async function carregarPerfil() {
    const { data, error } = await banco
        .from("pets")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !data) {
        document.getElementById("nomePet").innerText = "Item não encontrado.";
        return;
    }

    // Textos dinâmicos neutralizados
    const statusTxt = "🔍 Buscando responsável ❤️";
    const msgTxt = "Se você encontrou este item, entre em contato com o responsável.";
    const btnTxt = "💬 Falar com o responsável";

    // Preencher elementos
    const galeria = document.getElementById("galeriaFotos");
    const fotos = [];
    
    // Foto principal e adicionais
    if (data.foto) fotos.push(data.foto);
    if (data.foto2) fotos.push(data.foto2);
    if (data.foto3) fotos.push(data.foto3);
    
    // Se não existir nenhuma foto, usa o escudo
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
                width:100%;
                max-width:260px;
                border-radius:15px;
                margin-bottom:15px;
                display:block;
                margin-left:auto;
                margin-right:auto;
                cursor:pointer;
            ">
    `).join("");
    
    document.getElementById("nomePet").innerText = data.nome_pet;
    document.getElementById("statusPet").innerText = statusTxt;
    document.getElementById("mensagemPet").innerText = msgTxt;
    document.getElementById("labelTutor").innerText = "👤 Responsável";
    document.getElementById("nomeTutor").innerText = data.nome_tutor;
    document.getElementById("cidadePet").innerText = data.cidade;
    document.getElementById("btnContato").innerText = btnTxt;

    // Link WhatsApp com mensagem personalizada e proteção para o telefone
    const telFormatado = String(data.telefone || "").replace(/\D/g, "");
    const mensagem = encodeURIComponent(`Olá! 😊

Encontrei "${data.nome_pet}", cadastrado no Safe Samas, e acredito que pertença a você.

Gostaria de confirmar algumas informações para realizarmos a devolução com segurança.

Fico no aguardo!`);
    
    document.getElementById("linkWhatsapp").href = `https://wa.me/55${telFormatado}?text=${mensagem}`;
}

carregarPerfil();