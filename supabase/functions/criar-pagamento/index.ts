import "@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":
    "POST, OPTIONS",
};

Deno.serve(async (req) => {

  // ==========================================
  // CORS
  // ==========================================

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {

    // ==========================================
    // TOKEN MERCADO PAGO
    // ==========================================

    const ACCESS_TOKEN =
      Deno.env.get("MP_ACCESS_TOKEN");

    if (!ACCESS_TOKEN) {

      return new Response(

        JSON.stringify({

          erro: "MP_ACCESS_TOKEN não encontrado."

        }),

        {

          status: 500,

          headers: {

            ...corsHeaders,

            "Content-Type": "application/json"

          }

        }

      );

    }

    // ==========================================
    // REFERÊNCIA DO PAGAMENTO
    // ==========================================

    const referencia =
      `PETSAMAS-2026-${Date.now()}`;

    // ==========================================
    // CRIAR PREFERÊNCIA
    // ==========================================

    const resposta = await fetch(

      "https://api.mercadopago.com/checkout/preferences",

      {

        method: "POST",

        headers: {

          "Authorization":
            `Bearer ${ACCESS_TOKEN}`,

          "Content-Type":
            "application/json"

        },

        body: JSON.stringify({

          items: [

            {

              title:
                "Ativação anual Safe Samas",

              description:
                "Licença anual do QR Code Safe Samas",

              quantity: 1,

              currency_id: "BRL",

              unit_price: 29.90

            }

          ],

          external_reference:
            referencia,

          back_urls: {

            success:
              "https://jhonatanogueira875-commits.github.io/PetSamas/pagamento-sucesso.html",

            pending:
              "https://jhonatanogueira875-commits.github.io/PetSamas/pagamento-pendente.html",

            failure:
              "https://jhonatanogueira875-commits.github.io/PetSamas/pagamento-falha.html"

          },

          auto_return:
            "approved"

        })

      }

    );

    const dados =
      await resposta.json();

    // ==========================================
    // ERRO MERCADO PAGO
    // ==========================================

    if (!resposta.ok) {

      return new Response(

        JSON.stringify({

          erro: "Erro Mercado Pago",

          detalhes: dados

        }),

        {

          status: resposta.status,

          headers: {

            ...corsHeaders,

            "Content-Type": "application/json"

          }

        }

      );

    }

    // ==========================================
    // SUCESSO
    // ==========================================

    return new Response(

      JSON.stringify({

        status: "ok",

        referencia,

        checkout_url:
          dados.init_point

      }),

      {

        status: 200,

        headers: {

          ...corsHeaders,

          "Content-Type": "application/json"

        }

      }

    );

  }

  catch (erro) {

    return new Response(

      JSON.stringify({

        erro: erro.message

      }),

      {

        status: 500,

        headers: {

          ...corsHeaders,

          "Content-Type": "application/json"

        }

      }

    );

  }

});