import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL_PSI = Deno.env.get("SUPABASE_URL")!;
const SITE_URL = "https://seu-dominio-psionline.vercel.app";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(
    SUPABASE_URL_PSI,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization") ?? "" }
      }
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Response(
      JSON.stringify({ error: "Usuário não autenticado." }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  let body: { availability_id?: string; price?: number } = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const valorConsulta = Number(body.price) || 170.00;
  const externalReference = `PSI_${body.availability_id || 'SLOT'}_${user.id}_${Date.now()}`;
  const ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN");

  const preference = {
    items: [
      {
        title: "Consulta Psicológica - Psi Online",
        description: "Agendamento de consulta individual de psicologia",
        quantity: 1,
        currency_id: "BRL",
        unit_price: valorConsulta
      }
    ],
    // Removido o marketplace_fee temporariamente para não travar o ambiente Sandbox/Teste
    external_reference: externalReference,
    notification_url: `${SUPABASE_URL_PSI}/functions/v1/webhook-mercadopago`,
    back_urls: {
      success: `${SITE_URL}/pagamento-sucesso.html`,
      failure: `${SITE_URL}/pagamento-falha.html`,
      pending: `${SITE_URL}/pagamento-pendente.html`
    },
    auto_return: "approved"
  };

  const resposta = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(preference)
  });

  const texto = await resposta.text();
  let resultado = {};
  try {
    resultado = JSON.parse(texto);
  } catch {
    resultado = { error: texto };
  }

  return new Response(JSON.stringify(resultado), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
});