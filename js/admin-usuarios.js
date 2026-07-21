/*
==========================================================
Arquivo: js/admin-usuarios.js
==========================================================
*/

const listaUsuarios = document.getElementById("listaUsuarios");
const pesquisa = document.getElementById("pesquisaUsuario");

let usuariosCarregados = [];

async function carregarUsuarios() {
    listaUsuarios.innerHTML = "<p>Carregando usuários...</p>";

    // Busca todos os perfis cadastrados
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
        listaUsuarios.innerHTML = "<p>Nenhum usuário encontrado na base.</p>";
        return;
    }

    usuariosCarregados = usuarios;

    // Busca todos os pets uma única vez para otimizar em memória
    const { data: pets } = await banco
        .from("pets")
        .select("user_id");

    const contadorPets = {};
    (pets || []).forEach(pet => {
        contadorPets[pet.user_id] = (contadorPets[pet.user_id] || 0) + 1;
    });

    // Renderiza a lista inicial
    renderizarUsuarios(usuariosCarregados, contadorPets);
}

// Separa a renderização para facilitar filtros e reuso
function renderizarUsuarios(lista, contadorPets = {}) {
    if (!lista || lista.length === 0) {
        listaUsuarios.innerHTML = "<p>Nenhum usuário encontrado para esta busca.</p>";
        return;
    }

    let htmlCards = "";

    lista.forEach(usuario => {
        const totalPets = contadorPets[usuario.id] || 0;

        htmlCards += `
            <div class="card-dashboard">
                <h3>👤 ${usuario.nome || "Usuário Sem Nome"}</h3>
                <p><strong>📧 E-mail:</strong> ${usuario.email || "Não informado"}</p>
                <p><strong>📞 Telefone:</strong> ${usuario.telefone || "Não informado"}</p>
                <p><strong>📍 Cidade:</strong> ${usuario.cidade || "Não informada"}</p>
                <p><strong>📦 Ativos cadastrados:</strong> ${totalPets}</p>
                <button onclick="verUsuario('${usuario.id}')" class="btn-samas">
                    👁 Visualizar Detalhes
                </button>
            </div>
            <br>
        `;
    });

    listaUsuarios.innerHTML = htmlCards;
}

// Configuração do evento de pesquisa em tempo real
if (pesquisa) {
    pesquisa.addEventListener("input", () => {
        const texto = pesquisa.value.toLowerCase();

        const filtrados = usuariosCarregados.filter(usuario =>
            (usuario.nome || "").toLowerCase().includes(texto)
            ||
            (usuario.email || "").toLowerCase().includes(texto)
        );

        // Reconstrói o contador rápido para os filtrados
        // Como o contadorPets global já existe, podemos reaproveitá-lo diretamente
        const contadorPetsTemp = {};
        // Se quisermos recalcular por garantia ou usar o escopo:
        // Vamos garantir que a função de renderização receba os dados corretamente.
        
        // Uma forma prática de manter o contador global acessível na renderização:
        renderizarUsuariosFiltrados(filtrados);
    });
}

// Função auxiliar para renderizar na busca mantendo a contagem correta
async function renderizarUsuariosFiltrados(lista) {
    // Busca rápida opcional ou reaproveita contagem se já mapeada globalmente
    const { data: pets } = await banco
        .from("pets")
        .select("user_id");

    const contadorPets = {};
    (pets || []).forEach(pet => {
        contadorPets[pet.user_id] = (contadorPets[pet.user_id] || 0) + 1;
    });

    renderizarUsuarios(lista, contadorPets);
}

// Redireciona para a página de detalhes que iremos criar
function verUsuario(id) {
    window.location.href = `admin-detalhes-usuario.html?id=${id}`;
}

carregarUsuarios();