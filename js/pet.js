/*
==========================================================
Arquivo: js/pet.js (CÓDIGO COMPLETO E CORRIGIDO)
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
    document.getElementById("foto1").src = data.foto || "assets/images/logo.jpg";
    document.getElementById("nomePet").innerText = data.nome_pet;
    document.getElementById("statusPet").innerText = statusTxt;
    document.getElementById("mensagemPet").innerText = msgTxt;
    document.getElementById("labelTutor").innerText = "👤 Responsável";
    document.getElementById("nomeTutor").innerText = data.nome_tutor;
    document.getElementById("cidadePet").innerText = data.cidade;
    document.getElementById("btnContato").innerText = btnTxt;

    // Link WhatsApp com mensagem personalizada e acolhedora
    const telFormatado = data.telefone.replace(/\D/g, "");
    const mensagem = encodeURIComponent(`Olá! 😊

Encontrei "${data.nome_pet}", cadastrado no Safe Samas, e acredito que pertença a você.

Gostaria de confirmar algumas informações para realizarmos a devolução com segurança.

Fico no aguardo!`);
    
    document.getElementById("linkWhatsapp").href = `https://wa.me/55${telFormatado}?text=${mensagem}`;
}

carregarPerfil();