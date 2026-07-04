/*
==========================================================
PetSamas - qr-code.js (VERSÃO BLINDADA)
==========================================================
*/

const parametros = new URLSearchParams(window.location.search);
const idPet = parametros.get("id");

// 1. Verificação imediata: nem espera o resto da página carregar
const estaLiberado = localStorage.getItem(`liberado_${idPet}`);

if (!estaLiberado) {
    // Esconde o conteúdo e mostra o aviso
    document.getElementById("conteudoLiberado").style.display = "none";
    document.getElementById("bloqueioPagamento").style.display = "block";
} else {
    // Se estiver liberado, exibe e carrega o QR
    document.getElementById("bloqueioPagamento").style.display = "none";
    document.getElementById("conteudoLiberado").style.display = "block";
    carregarDadosPet();
}

async function carregarDadosPet() {
    const { data: pet, error } = await banco
        .from("pets")
        .select("*")
        .eq("id", Number(idPet))
        .single();

    if (error || !pet) {
        alert("Pet não encontrado.");
        window.location.href = "index.html";
        return;
    }

    document.getElementById("nomePet").textContent = pet.nome_pet;

    const linkPet = "https://jhonatanogueira875-commits.github.io/PetSamas/pet-publico.html?id=" + pet.id;

    document.getElementById("qrcode").innerHTML = "";
    new QRCode(document.getElementById("qrcode"), {
        text: linkPet,
        width: 250,
        height: 250
    });

    const btn = document.getElementById("btnBaixar");
    if (btn) {
        btn.onclick = () => window.print();
    }
}