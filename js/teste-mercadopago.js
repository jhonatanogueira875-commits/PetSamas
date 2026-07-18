/*
==========================================================
Safe Samas
Arquivo: teste-mercadopago.js
==========================================================
*/

const botao = document.getElementById("btnTeste");
const resultado = document.getElementById("resultado");

botao.addEventListener("click", async () => {

    resultado.innerText = "Conectando ao Supabase...";

    try {

        const { data, error } =
            await banco.functions.invoke(
                "criar-pagamento",
                {
                    body: {}
                }
            );

        if (error) {

            resultado.innerText =
                "ERRO:\n\n" +
                JSON.stringify(error, null, 2);

            return;

        }

        resultado.innerText =
            JSON.stringify(data, null, 4);

    }

    catch (erro) {

        resultado.innerText =
            "Falha inesperada:\n\n" +
            erro.message;

    }

});