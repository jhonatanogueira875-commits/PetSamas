/*
==========================================================
Safe Samas
Arquivo: assinatura-pagamento.js

Responsável por:

✔ Criar pagamento da assinatura
✔ Redirecionar para o Mercado Pago
==========================================================
*/

const botaoAssinar =
    document.getElementById("btnAssinar");

botaoAssinar.addEventListener(

    "click",

    async () => {

        botaoAssinar.disabled = true;

        botaoAssinar.innerText =
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

                    "Não foi possível iniciar o pagamento."

                );

                botaoAssinar.disabled = false;

                botaoAssinar.innerText =
                    "💳 Assinar Agora";

                return;

            }

            if (!data.init_point) {

                alert(
                    "Checkout não retornado pelo servidor."
                );

                console.log(data);

                botaoAssinar.disabled = false;

                botaoAssinar.innerText =
                    "💳 Assinar Agora";

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

            botaoAssinar.disabled = false;

            botaoAssinar.innerText =
                "💳 Assinar Agora";

        }

    }

);