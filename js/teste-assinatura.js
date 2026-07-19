/*
==========================================================
Safe Samas

Arquivo:
teste-assinatura.js
==========================================================
*/

const botao = document.getElementById("btnTeste");

const resultado =
document.getElementById("resultado");

botao.addEventListener("click", async () => {

    resultado.innerText =
    "Verificando assinatura...";

    try {

        const ativa =
        await possuiAssinaturaAtiva();

        resultado.innerText =
        JSON.stringify({

            assinatura_ativa: ativa

        }, null, 4);

    }

    catch (erro) {

        resultado.innerText =
        erro.message;

        console.error(erro);

    }

});