/*
==========================================================

Safe Samas

Edge Function:
criar-pagamento

Versão:
2.1 (Com depuração robusta de resposta)

Responsável por:

✔ Validar usuário autenticado

✔ Criar preferência Mercado Pago

✔ Retornar Checkout URL

==========================================================
*/

import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const VALOR_ASSINATURA = 29.90;
const TITULO_ASSINATURA = "Ativação anual Safe Samas";
const DESCRICAO_ASSINATURA = "Licença anual do QR Code Safe Samas";
const PREFIXO_REFERENCIA = "SAFE";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods":
        "POST, OPTIONS"
};

Deno.serve(async (req) => {

    if (req.method === "OPTIONS") {
        return new Response("ok", {
            headers: corsHeaders
        });
    }

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
        data: { user },
        error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {

        return new Response(
            JSON.stringify({
                erro: "Usuário não autenticado."
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

    const externalReference =
        `${PREFIXO_REFERENCIA}_${user.id}_${Date.now()}`;

    const ACCESS_TOKEN =
        Deno.env.get("MP_ACCESS_TOKEN");

    const preference = {

        items: [

            {

                title: TITULO_ASSINATURA,

                description: DESCRICAO_ASSINATURA,

                quantity: 1,

                currency_id: "BRL",

                unit_price: VALOR_ASSINATURA

            }

        ],

        external_reference: externalReference,

        notification_url:
            "https://zkgasxwggvdamuvxcsnf.supabase.co/functions/v1/webhook-mercadopago",

        back_urls: {

            success:
                "https://safesamas.vercel.app/sucesso.html",

            failure:
                "https://safesamas.vercel.app/falha.html",

            pending:
                "https://safesamas.vercel.app/pendente.html"

        },

        auto_return: "approved"

    };

    const resposta = await fetch(

        "https://api.mercadopago.com/checkout/preferences",

        {

            method: "POST",

            headers: {

                Authorization:
                    `Bearer ${ACCESS_TOKEN}`,

                "Content-Type":
                    "application/json"

            },

            body:
                JSON.stringify(preference)

        }

    );

    const texto = await resposta.text();

    console.log("=================================");
    console.log("STATUS:", resposta.status);
    console.log("BODY:");
    console.log(texto);
    console.log("=================================");

    let resultado = {};

    try {

        resultado = JSON.parse(texto);

    } catch {

        resultado = {
            erro: texto
        };

    }

    return new Response(

        JSON.stringify(resultado),

        {

            headers: {

                ...corsHeaders,

                "Content-Type":
                    "application/json"

            }

        }

    );

});