/*
==========================================================
Arquivo: js/pets.js (CÓDIGO COMPLETO E CORRIGIDO)
==========================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    // Vincula o botão de busca ao HTML
    const btnBuscar = document.getElementById("btnBuscar");
    if (btnBuscar) {
        btnBuscar.addEventListener("click", buscarItensPorUsuario);
    }
});

// Função de busca
async function buscarItensPorUsuario() {
    const listaDiv = document.getElementById("listaPets");
    const input = document.getElementById("inputBusca");
    const termo = input ? input.value.trim() : "";

    if (!termo) {
        listaDiv.innerHTML = `<p>Nenhuma pesquisa realizada.</p>`;
        return;
    }

    listaDiv.innerHTML = "Buscando...";

    let query = banco.from("pets").select("*");

    // Lógica robusta de filtro
    if (termo.includes('-')) {
        query = query.eq("user_id", termo);
    } else {
        query = query.or(`nome_pet.ilike.%${termo}%,nome_tutor.ilike.%${termo}%`);
    }

    const { data, error } = await query.order("nome_pet", { ascending: true });

    if (error) {
        listaDiv.innerHTML = "Erro na busca: " + error.message;
        return;
    }

    if (!data || data.length === 0) {
        listaDiv.innerHTML = "Nenhum item encontrado.";
    } else {
        renderizarResultados(data);
    }
}

// Função que desenha os cards na tela (com tratamento de imagem corrigido)
function renderizarResultados(data) {
    const listaDiv = document.getElementById("listaPets");
    
    listaDiv.innerHTML = "<ul>" + data.map(pet => {
        // Lógica robusta para definir a foto
        const foto = (pet.foto && pet.foto !== "EMPTY") 
            ? pet.foto 
            : "assets/images/default-item.jpg";

        return `
        <li class="card-dashboard" style="margin-bottom: 15px; list-style: none; border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
            <div style="margin-bottom: 10px;">
                <img src="${foto}" 
                     alt="${pet.nome_pet}" 
                     style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%; border: 2px solid #ddd;">
            </div>
            
            <strong>Nome:</strong> ${pet.nome_pet} <br>
            <strong>Tutor:</strong> ${pet.nome_tutor || 'Não informado'} <br>
            <strong>Cidade:</strong> ${pet.cidade || 'Não informada'} <br>
            <small style="color: #666;">UUID: ${pet.user_id}</small>
        </li>`;
    }).join("") + "</ul>";
}