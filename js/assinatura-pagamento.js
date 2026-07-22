/*
==========================================================
Safe Samas
Arquivo: assinatura-pagamento.js

Responsável por:

✔ Criar pagamento de 1 crédito
✔ Redirecionar para o Mercado Pago
==========================================================
*/

const botaoComprar =
    document.getElementById("btnAssinar");

botaoComprar.addEventListener(

    "click",

    async () => {

        botaoComprar.disabled = true;

        botaoComprar.innerText =
            "Conectando...";

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

                console.error(error);

                alert(
                    "Não foi possível iniciar a compra."
                );

                botaoComprar.disabled = false;

                botaoComprar.innerText =
                    "💳 Comprar QR Code";

                return;

            }

            if (!data.init_point) {

                alert(
                    "Checkout não retornado pelo servidor."
                );

                console.log(data);

                botaoComprar.disabled = false;

                botaoComprar.innerText =
                    "💳 Comprar QR Code";

                return;

            }

            window.location.href =
                data.init_point;

        }

        catch (erro) {

            console.error(erro);

            alert(
                "Erro inesperado ao conectar ao servidor."
            );

            botaoComprar.disabled = false;

            botaoComprar.innerText =
                "💳 Comprar QR Code";

        }

    }

);