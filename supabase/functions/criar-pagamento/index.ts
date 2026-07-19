/*
==========================================================

Safe Samas

Edge Function:
criar-pagamento

Versão:
1.6

Responsável por:

✔ Validar usuário autenticado

✔ Criar assinatura pendente

✔ Criar preferência Mercado Pago

✔ Retornar URL do Checkout

==========================================================
*/
import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const VALOR_ASSINATURA = 29.90;
const TITULO_ASSINATURA = "Ativação anual Safe Samas";
const DESCRICAO_ASSINATURA = "Licença anual do QR Code Safe Samas";
const PREFIXO_REFERENCIA = "PETSAMAS";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods":
        "POST, OPTIONS"
};

Deno.serve(async (req) => {

    const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        {
            global: {
                headers: {
                    Authorization:
                        req.headers.get("Authorization") ?? ""
                }
            }
        }
    );

    const {
        data: {
            user
        },
        error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return new Response(
            JSON.stringify({
                erro:
                    "Usuário não autenticado."
            }),
            {
                status: 401,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json"
                }
            }
        );
    }

    // TESTE DE IDENTIFICAÇÃO DO USUÁRIO
    return new Response(
        JSON.stringify({
            usuario: user.id
        }),
        {
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json"
            }
        }
    );

});