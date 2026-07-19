/*
==========================================================
PetSamas - Arquivo: ativar.js
==========================================================
*/

const params = new URLSearchParams(window.location.search);
const codigo = params.get("codigo");
const conteudo = document.getElementById("conteudo");

if (!codigo) {
    conteudo.innerHTML = `<h3>❌ QR Code inválido.</h3><p>O código não foi informado.</p>`;
} else {
    verificarQRCode();
}

async function verificarQRCode() {
    conteudo.innerHTML = "Consultando QR Code...";

    const { data, error } = await banco
        .from("qrcodes")
        .select("*")
        .eq("codigo", codigo)
        .single();

    if (error || !data) {
        conteudo.innerHTML = `<h3>❌ QR Code não encontrado.</h3><p>Verifique se o QR Code é válido.</p>`;
        return;
    }

    // ==================================================
    // LÓGICA DE UX PERSONALIZADA POR ORIGEM
    // ==================================================
    switch (data.status) {
        case "disponivel":
            const eFisico = data.origem === "fisico";
            
            conteudo.innerHTML = `
                <h2>${eFisico ? "📦 QR Code Físico" : "🌐 QR Code Online"}</h2>
                <p>
                    ${eFisico 
                        ? "Este QR pertence a um produto físico." 
                        : "Este QR foi gerado digitalmente."}
                    Faça login para concluir a vinculação ao seu perfil.
                </p>
                <br>
                <a href="login.html?codigo=${codigo}">
                    <button>🔗 Vincular este QR ao meu perfil</button>
                </a>
                <br><br>
                <small>Não tem conta? <a href="cadastro-usuario.html?codigo=${codigo}">Criar conta</a></small>
            `;
            break;

        case "ativado":
            conteudo.innerHTML = `
                <h2>QR Code já ativado</h2>
                <p>Este QR Code já está vinculado a um perfil protegido.</p>
                <br>
                <a href="pet-publico.html?codigo=${codigo}">
                    <button>👁 Ver Perfil Protegido</button>
                </a>
            `;
            break;

        case "bloqueado":
            conteudo.innerHTML = `<h2>🚫 QR Code bloqueado</h2><p>Entre em contato com o suporte.</p>`;
            break;

        default:
            conteudo.innerHTML = `<h2>Status desconhecido.</h2>`;
    }
}