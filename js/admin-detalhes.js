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
            <div class="card-dashboard">

                <h3>👤 Perfil</h3>

                <p><strong>Nome:</strong> ${usuario.nome || "Não informado"}</p>

                <p><strong>E-mail:</strong> ${usuario.email || "Não informado"}</p>

                <p><strong>Telefone:</strong> ${usuario.telefone || "Não informado"}</p>

                <p><strong>Cidade:</strong> ${usuario.cidade || "Não informada"}</p>

                <p><strong>Cadastro:</strong> ${new Date(usuario.created_at).toLocaleDateString("pt-BR")}</p>

            </div>
        `;

        // 2. Busca a assinatura do usuário
        const { data: assinatura } = await banco
            .from("assinaturas")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle();

        if (assinatura) {
            infoUsuario.innerHTML += `

            <div class="card-dashboard">

                <h3>💳 Assinatura</h3>

                <p><strong>Status:</strong> ${assinatura.status}</p>

                <p><strong>Créditos:</strong> ${assinatura.creditos ?? 0}</p>

                <p><strong>Início:</strong>
                ${new Date(assinatura.data_inicio).toLocaleDateString("pt-BR")}
                </p>

                <p><strong>Fim:</strong>
                ${new Date(assinatura.data_fim).toLocaleDateString("pt-BR")}
                </p>

                <p><strong>Payment ID:</strong><br>
                ${assinatura.payment_id || "-"}
                </p>

            </div>

            `;
        }

        // 3. Busca os ativos (pets/itens)
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
        
        for (const ativo of ativos) {
            // Busca o código do QR correspondente ao pet para o link público correto
            const { data: qrData } = await banco
                .from("qrcodes")
                .select("codigo")
                .eq("pet_id", ativo.id)
                .maybeSingle();

            const linkPublico = qrData && qrData.codigo 
                ? `pet-publico.html?codigo=${qrData.codigo}` 
                : `pet-publico.html?id=${ativo.id}`;

            listaAtivos.innerHTML += `
                <div class="card-dashboard">
                    <h3>📦 ${ativo.nome_pet || "Sem nome"}</h3>
                    <p><strong>Espécie:</strong> ${ativo.especie || "Não informada"}</p>
                    <p><strong>Categoria:</strong> ${ativo.categoria || "Não informada"}</p>
                    <p><strong>Status:</strong> ${ativo.status || "Ativo"}</p>
                    <a href="${linkPublico}" target="_blank">
                        <button class="btn-samas">👁 Ver Página Pública</button>
                    </a>
                </div>
                <br>
            `;
        }

    } catch (err) {
        console.error("Erro inesperado no sistema:", err);
        infoUsuario.innerHTML = "<p>Ocorreu um erro crítico ao buscar os dados.</p>";
    }
}

carregarDetalhes();