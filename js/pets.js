/*
==========================================================
Arquivo: js/pets.js (Corrigido)
==========================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    carregarPets();
});

async function carregarPets() {
    const listaDiv = document.getElementById("listaPets");
    
    // Busca todos os pets ordenados pelo nome
    const { data, error } = await banco
        .from("pets")
        .select("*")
        .order("nome_pet", { ascending: true });

    if (error) {
        listaDiv.innerHTML = "Erro ao carregar pets: " + error.message;
        console.error(error);
        return;
    }

    if (data.length === 0) {
        listaDiv.innerHTML = "Nenhum pet cadastrado no momento.";
        return;
    }

    // Monta a lista de pets usando os campos corretos do seu banco
    listaDiv.innerHTML = "<ul>" + data.map(pet => `
        <li class="card-dashboard" style="margin-bottom: 10px; list-style: none;">
            <strong>Nome:</strong> ${pet.nome_pet} <br>
            <strong>Tutor:</strong> ${pet.nome_tutor || 'Não informado'} <br>
            <strong>Cidade:</strong> ${pet.cidade || 'Não informada'}
        </li>
    `).join("") + "</ul>";
}