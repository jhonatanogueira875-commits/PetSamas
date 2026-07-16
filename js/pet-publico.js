/*
==========================================================
PetSamas - Pet Público (API v1.0 - Consumindo RPC)
==========================================================
*/

const parametros = new URLSearchParams(window.location.search);
const codigo = parametros.get("codigo");

async function carregarPet() {
    if (!codigo) {
        alert("QR Code inválido.");
        window.location.href = "index.html";
        return;
    }

    try {
        // Chamada única para a nossa API Pública (RPC)
        // O Supabase lida com a autenticação anon automaticamente
        const { data: resposta, error } = await banco.rpc("obter_pet_publico", {
            codigo_qr: codigo
        });

        if (error) {
            console.error("Erro na API:", error);
            alert("Erro de comunicação com o servidor.");
            return;
        }

        // Validação da nossa API (Padronizada)
        if (!resposta || !resposta.encontrado) {
            alert("Pet não localizado.");
            window.location.href = "index.html";
            return;
        }

        // Extração dos dados do objeto padronizado
        const { nome, foto, cidade, telefone, nome_tutor } = resposta.pet;

        // Preenchimento do perfil
        document.getElementById("foto1").src = 
            foto && foto.trim() !== "" ? foto : "assets/images/default-item.jpg";
        
        document.getElementById("nomePet").textContent = nome;
        document.getElementById("nomeTutor").textContent = nome_tutor;
        document.getElementById("cidadePet").textContent = cidade;

        // Lógica do WhatsApp (Modificada para mensagem neutra)
        const telefoneLimpo = String(telefone || "").replace(/\D/g, "");
        const mensagem = `Olá! Encontrei este item (${nome}) e gostaria de devolvê-lo.`;
        const botaoWhatsapp = document.getElementById("linkWhatsapp");

        if (telefoneLimpo.length >= 10) {
            botaoWhatsapp.href = `https://wa.me/55${telefoneLimpo}?text=${encodeURIComponent(mensagem)}`;
        } else {
            botaoWhatsapp.onclick = (e) => { e.preventDefault(); alert("Telefone indisponível."); };
        }

    } catch (err) {
        console.error("Erro inesperado no carregamento:", err);
        alert("Ocorreu um erro ao processar o perfil.");
    }
}

carregarPet();