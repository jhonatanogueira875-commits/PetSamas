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
    // DADOS RECEBIDOS DO WEBHOOK
    // ==========================================

    const webhook =
      await req.json();

    console.log("=================================");
    console.log("WEBHOOK RECEBIDO");
    console.log(JSON.stringify(webhook, null, 2));
    console.log("=================================");

    // ==========================================
    // ID DO PAGAMENTO
    // ==========================================

    const paymentId =
      webhook?.data?.id;

    if (!paymentId) {

      return new Response(

        JSON.stringify({

          status: "ignorado",

          motivo: "Webhook sem payment_id."

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

    // ==========================================
    // CONSULTA AO MERCADO PAGO
    // ==========================================

    const resposta = await fetch(

      `https://api.mercadopago.com/v1/payments/${paymentId}`,

      {

        method: "GET",

        headers: {

          Authorization:
            `Bearer ${ACCESS_TOKEN}`

        }

      }

    );

    const pagamento =
      await resposta.json();

    console.log("=================================");
    console.log("PAGAMENTO ENCONTRADO");
    console.log(JSON.stringify(pagamento, null, 2));
    console.log("=================================");

    // ==========================================
    // RETORNO
    // ==========================================

    return new Response(

      JSON.stringify({

        status: "ok",

        payment_id: paymentId,

        payment_status:
          pagamento.status,

        external_reference:
          pagamento.external_reference

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