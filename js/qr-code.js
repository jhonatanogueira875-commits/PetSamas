/*
==========================================================
PetSamas - qr-code.js (VERSÃO 100% SUPABASE)
==========================================================
*/

const parametros = new URLSearchParams(window.location.search);
const idPet = parametros.get("id");

window.onload = async () => {
    if (!idPet) {
        window.location.href = "/PetSamas/meus-pets.html";
        return;
    }

    // BUSCA DIRETA NO BANCO DE DADOS
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

    // LÓGICA DE EXIBIÇÃO BASEADA NO BANCO
    if (pet.qr_liberado === true) {
        document.getElementById("bloqueioPagamento").style.display = "none";
        document.getElementById("conteudoLiberado").style.display = "block";
        
        const linkPet = "https://jhonatanogueira875-commits.github.io/PetSamas/pet-publico.html?id=" + pet.id;
        document.getElementById("nomePet").textContent = pet.nome_pet;
        
        // Limpa qrcode anterior para não duplicar caso recarregue
        document.getElementById("qrcode").innerHTML = "";
        
        new QRCode(document.getElementById("qrcode"), {
            text: linkPet,
            width: 250,
            height: 250
        });

        const btn = document.getElementById("btnBaixar");
        if (btn) btn.onclick = () => window.print();
    } else {
        // FORÇA O BLOQUEIO SE NO BANCO ESTIVER FALSE
        document.getElementById("conteudoLiberado").style.display = "none";
        document.getElementById("bloqueioPagamento").style.display = "block";
    }
};