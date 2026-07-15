/*
==========================================================
Arquivo: js/admin-detalhes.js
==========================================================
*/

const infoUsuario = document.getElementById("infoUsuario");
const listaAtivos = document.getElementById("listaAtivos");

// Captura o ID da URL de forma segura
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');

async function carregarDetalhes() {
    console.log("Iniciando busca para o ID:", userId);

    if (!userId) {
        infoUsuario.innerHTML = "<p>Erro: ID de usuário não fornecido.</p>";
        return;
    }

    try {
        // 1. Busca dados do usuário (Sem o .single() para evitar erro de coerção)
        const { data: usuarioData, error: errorUsuario } = await banco
            .from("profiles")
            .select("*")
            .eq("id", userId.toString());

        if (errorUsuario) {
            console.error("Erro ao buscar perfil:", errorUsuario);
            infoUsuario.innerHTML = `<p>Erro ao carregar perfil: ${errorUsuario.message}</p>`;
            return;
        }

        // Verifica se o array retornou algum dado
        if (!usuarioData || usuarioData.length === 0) {
            infoUsuario.innerHTML = "<p>Usuário não encontrado na base de dados.</p>";
            return;
        }

        const usuario = usuarioData[0]; // Pega o primeiro registro encontrado

        infoUsuario.innerHTML = `
            <p><strong>Nome:</strong> ${usuario.nome || "Não informado"}</p>
            <p><strong>Telefone:</strong> ${usuario.telefone || "Não informado"}</p>
            <p><strong>Cidade:</strong> ${usuario.cidade || "Não informada"}</p>
        `;

        // 2. Busca os ativos (pets/itens)
        const { data: ativos, error: errorAtivos } = await banco
            .from("pets")
            .select("*")
            .eq("user_id", userId.toString());

        if (errorAtivos) {
            console.error("Erro ao buscar ativos:", errorAtivos);
            listaAtivos.innerHTML = `<p>Erro ao carregar ativos: ${errorAtivos.message}</p>`;
            return;
        }

        if (!ativos || ativos.length === 0) {
            listaAtivos.innerHTML = "<p>Nenhum ativo cadastrado por este usuário.</p>";
            return;
        }

        listaAtivos.innerHTML = "";
        ativos.forEach(ativo => {
            listaAtivos.innerHTML += `
                <div class="card-dashboard">
                    <h3>📦 ${ativo.nome || "Item sem nome"}</h3>
                    <p><strong>Status:</strong> ${ativo.status || "Ativo"}</p>
                    <a href="pet-publico.html?id=${ativo.id}" target="_blank">
                        <button>👁 Ver Página Pública</button>
                    </a>
                </div>
                <br>
            `;
        });

    } catch (err) {
        console.error("Erro inesperado no sistema:", err);
        infoUsuario.innerHTML = "<p>Ocorreu um erro crítico ao buscar os dados.</p>";
    }
}

carregarDetalhes();