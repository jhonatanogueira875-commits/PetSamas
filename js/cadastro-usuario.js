/*
==========================================================
PetSamas
Arquivo: cadastro-usuario.js
Responsável por: Criar usuário no Supabase Auth e redirecionar para pagamento
==========================================================
*/

const formulario = document.getElementById("formCadastroUsuario");

formulario.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    // Validação de senhas
    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem.");
        return;
    }

    // Criar o usuário no Supabase
    const { data, error } = await banco.auth.signUp({
        email: email,
        password: senha,
        options: {
            data: {
                nome: nome
            }
        }
    });

    // Tratamento de erro
    if (error) {
        alert(error.message);
        return;
    }

    // SUCESSO: Redirecionamento para o WhatsApp
    alert("Conta criada com sucesso! Você será redirecionado para concluir a ativação.");

    // AJUSTE AQUI O SEU NÚMERO (Ex: 5542999999999)
    const seuNumero = "5542984097827"; 
    const mensagem = `Olá! Acabei de criar minha conta no PetSamas (E-mail: ${email}). Gostaria de realizar o pagamento da taxa para ativar o QR Code do meu pet.`;

    window.location.href = `https://wa.me/${seuNumero}?text=${encodeURIComponent(mensagem)}`;
});