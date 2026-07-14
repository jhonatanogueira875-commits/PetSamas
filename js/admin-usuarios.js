/*
==========================================================
Arquivo: js/admin-usuarios.js
==========================================================
*/

const listaUsuarios = document.getElementById("listaUsuarios");

async function carregarUsuarios() {

    listaUsuarios.innerHTML = "<p>Carregando usuários...</p>";

    // Busca todos os perfis
    const { data: usuarios, error } = await banco
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {

        console.error(error);

        listaUsuarios.innerHTML = "<p>Erro ao carregar usuários.</p>";

        return;

    }

    if (!usuarios || usuarios.length === 0) {

        listaUsuarios.innerHTML = "<p>Nenhum usuário encontrado.</p>";

        return;

    }

    listaUsuarios.innerHTML = "";

    for (const usuario of usuarios) {

        // Conta quantos pets pertencem ao usuário
        const { count } = await banco
            .from("pets")
            .select("*", { count: "exact", head: true })
            .eq("user_id", usuario.id);

        listaUsuarios.innerHTML += `

            <div class="card-dashboard">

                <h3>👤 ${usuario.nome || "Sem nome"}</h3>

                <p><strong>📞 Telefone:</strong> ${usuario.telefone || "-"}</p>

                <p><strong>📍 Cidade:</strong> ${usuario.cidade || "-"}</p>

                <p><strong>🐶 Pets cadastrados:</strong> ${count || 0}</p>

                <button onclick="verUsuario('${usuario.id}')">

                    👁 Visualizar

                </button>

            </div>

            <br>

        `;

    }

}

function verUsuario(id){

    alert("Perfil do usuário: " + id);

}

carregarUsuarios();