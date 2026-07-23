/*
==========================================================
Safe Samas
Arquivo: comprar-qr.js

Responsável por:
✔ Criar pagamento de 1 crédito
✔ Redirecionar para o Mercado Pago
==========================================================
*/

console.log("comprar-qr.js carregado");

const botaoComprar = document.getElementById("btnComprar");

console.log("Botão encontrado:", botaoComprar);

if (botaoComprar) {
    botaoComprar.addEventListener(

        "click",

        async () => {

            console.log("Botão clicado!");

            botaoComprar.disabled = true;

            botaoComprar.innerText = "Conectando...";

            try {

                const {

                    data,

                    error

                } = await banco.functions.invoke(

                    "criar-pagamento",

                    {

                        body: {}

                    }

                );

                if (error) {

                    console.error("Erro na Edge Function:", error);

                    alert(
                        "Não foi possível iniciar a compra."
                    );

                    botaoComprar.disabled = false;

                    botaoComprar.innerText =
                        "💳 Comprar QR Code";

                    return;

                }

                if (!data || !data.init_point) {

                    alert(
                        "Checkout não retornado pelo servidor."
                    );

                    console.log("Dados retornados:", data);

                    botaoComprar.disabled = false;

                    botaoComprar.innerText =
                        "💳 Comprar QR Code";

                    return;

                }

                window.location.href =
                    data.init_point;

            }

            catch (erro) {

                console.error("Erro inesperado:", erro);

                alert(
                    "Erro inesperado ao conectar ao servidor."
                );

                botaoComprar.disabled = false;

                botaoComprar.innerText =
                    "💳 Comprar QR Code";

            }

        }

    );
} else {
    console.error("ERRO CRÍTICO: Elemento #btnComprar não foi encontrado na página!");
}