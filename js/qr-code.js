/*
==========================================================
PetSamas - qr-code.js (VERSÃO BLINDADA E INTEGRADA)
==========================================================
*/

const parametros = new URLSearchParams(window.location.search);
const idPet = parametros.get("id");

// Executa a verificação diretamente no banco de dados ao carregar
window.onload = async () => {
    if (!idPet) {
        window.location.href = "/PetSamas/meus-pets.html";
        return;
    }

    // Busca o status direto no banco
    const { data: pet, error } = await banco
        .from("pets")
        .select("id, nome_pet, qr_liberado")
        .eq("id", Number(idPet))
        .single();

    if (error || !pet) {
        alert("Erro ao carregar dados do pet.");
        window.location.href = "/PetSamas/meus-pets.html";
        return;
    }

    // Validação real: checa o banco de dados, não o localStorage
    if (pet.qr_liberado === true) {
        // Libera a visualização
        document.getElementById("bloqueioPagamento").style.display = "none";
        document.getElementById("conteudoLiberado").style.display = "block";
        
        // Carrega o QR Code
        const linkPet = "https://jhonatanogueira875-commits.github.io/PetSamas/pet-publico.html?id=" + pet.id;
        document.getElementById("nomePet").textContent = pet.nome_pet;
        
        new QRCode(document.getElementById("qrcode"), {
            text: linkPet,
            width: 250,
            height: 250
        });

        const btn = document.getElementById("btnBaixar");
        if (btn) btn.onclick = () => window.print();

    } else {
        // Bloqueia e mostra o aviso de pagamento
        document.getElementById("conteudoLiberado").style.display = "none";
        document.getElementById("bloqueioPagamento").style.display = "block";
    }
};