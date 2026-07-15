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

    const isItem = data.tipo === "item";
    
    // Textos dinâmicos
    const tituloTutor = isItem ? "👤 Meu Proprietário" : "👤 Meu Tutor";
    const statusTxt = isItem ? "Procurando meu proprietário ❤️" : "Procurando meu tutor ❤️";
    const msgTxt = isItem ? "Se você me encontrou, entre em contato." : "Se você me encontrou, converse com meu tutor.";
    const btnTxt = isItem ? "💬 Conversar com o proprietário" : "💬 Conversar com meu tutor";

    // Preencher elementos
    document.getElementById("foto1").src = data.foto || "assets/images/logo.jpg";
    document.getElementById("nomePet").innerText = data.nome_pet;
    document.getElementById("statusPet").innerText = statusTxt;
    document.getElementById("mensagemPet").innerText = msgTxt;
    document.getElementById("labelTutor").innerText = tituloTutor;
    document.getElementById("nomeTutor").innerText = data.nome_tutor;
    document.getElementById("cidadePet").innerText = data.cidade;
    document.getElementById("btnContato").innerText = btnTxt;

    // Link WhatsApp
    const telFormatado = data.telefone.replace(/\D/g, "");
    document.getElementById("linkWhatsapp").href = `https://wa.me/55${telFormatado}`;
}

carregarPerfil();