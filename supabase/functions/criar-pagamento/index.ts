// ======================================================
// Safe Samas
// Edge Function: criar-pagamento
// ======================================================

import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {

  fetch: withSupabase(

    { auth: ["publishable", "secret"] },

    async (_req, _ctx) => {

      try {

        // ==========================================
        // LÊ O ACCESS TOKEN DO MERCADO PAGO
        // ==========================================

        const accessToken = Deno.env.get("MP_ACCESS_TOKEN");

        if (!accessToken) {

          return Response.json({

            status: "erro",
            mensagem: "MP_ACCESS_TOKEN não encontrado."

          }, { status: 500 });

        }

        // ==========================================
        // TESTE
        // ==========================================

        return Response.json({

          status: "ok",

          mensagem: "Edge Function funcionando!",

          mercado_pago: true,

          token_encontrado: true

        });

      }

      catch (erro) {

        return Response.json({

          status: "erro",

          mensagem: erro instanceof Error
            ? erro.message
            : "Erro desconhecido."

        }, { status: 500 });

      }

    }

  )

};