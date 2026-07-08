/*
==========================================================
PetSamas
Arquivo: ativar.js

Responsável por:

✔ Ler o código do QR pela URL
✔ Consultar o Supabase
✔ Informar o status do QR Code
✔ Encaminhar o usuário mantendo o código na URL
==========================================================
*/


// ======================================================
// LÊ O CÓDIGO DA URL
// ======================================================

const params = new URLSearchParams(window.location.search);

const codigo = params.get("codigo");

const conteudo = document.getElementById("conteudo");


// ======================================================
// VALIDAÇÃO
// ======================================================

if (!codigo) {

    conteudo.innerHTML = `

        <h3>❌ QR Code inválido.</h3>

        <p>O código não foi informado.</p>

    `;

} else {

    verificarQRCode();

}


// ======================================================
// CONSULTA O SUPABASE
// ======================================================

async function verificarQRCode() {

    conteudo.innerHTML = "Consultando QR Code...";

    const { data, error } = await banco

        .from("qrcodes")

        .select("*")

        .eq("codigo", codigo)

        .single();


    if (error || !data) {

        conteudo.innerHTML = `

            <h3>❌ QR Code não encontrado.</h3>

            <p>Verifique se o QR Code é válido.</p>

        `;

        return;

    }


    // ==================================================
    // STATUS
    // ==================================================

    switch (data.status) {

        // ----------------------------------------------

        case "disponivel":

            conteudo.innerHTML = `

                <h2>✅ QR Code disponível</h2>

                <p>

                    Este QR Code ainda não foi ativado.

                </p>

                <br>

                <a href="login.html?codigo=${codigo}">

                    <button>

                        🔐 Entrar

                    </button>

                </a>

                <br><br>

                <a href="cadastro-usuario.html?codigo=${codigo}">

                    <button>

                        👤 Criar Conta

                    </button>

                </a>

            `;

            break;

        // ----------------------------------------------

        case "ativado":

            conteudo.innerHTML = `

                <h2>

                    🐾 QR Code já ativado

                </h2>

                <p>

                    Este QR Code já está vinculado a um pet.

                </p>

                <br>

                <a href="pet-publico.html?codigo=${codigo}">

                    <button>

                        👁 Ver Perfil do Pet

                    </button>

                </a>

            `;

            break;

        // ----------------------------------------------

        case "bloqueado":

            conteudo.innerHTML = `

                <h2>

                    🚫 QR Code bloqueado

                </h2>

                <p>

                    Entre em contato com o suporte.

                </p>

            `;

            break;

        // ----------------------------------------------

        default:

            conteudo.innerHTML = `

                <h2>

                    Status desconhecido.

                </h2>

            `;

    }

}