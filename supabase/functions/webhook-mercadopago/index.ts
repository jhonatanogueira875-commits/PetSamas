import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":
    "POST, OPTIONS, GET",
};

Deno.serve(async (req) => {
  
  console.log("VERSAO 2.1");

  // ==========================================
  // CORS
  // ==========================================
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  // ==========================================
  // TESTE MANUAL (GET)
  // ==========================================
  if (req.method === "GET") {
    return new Response(
      JSON.stringify({
        status: "Webhook funcionando ✅"
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }

  try {
    // ==========================================
    // CLIENTE SUPABASE (SERVICE ROLE)
    // ==========================================
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN");

    if (!ACCESS_TOKEN) {
      return new Response(
        JSON.stringify({ erro: "MP_ACCESS_TOKEN não encontrado." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // ==========================================
    // DADOS RECEBIDOS DO WEBHOOK
    // ==========================================
    const webhook = await req.json();
    const paymentId = webhook?.data?.id;

    if (!paymentId) {
      return new Response(
        JSON.stringify({ status: "ignorado", motivo: "Webhook sem payment_id." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ==========================================
    // CONSULTA AO MERCADO PAGO
    // ==========================================
    const resposta = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
      }
    );

    const pagamento = await resposta.json();

    // ==========================================
    // PAGAMENTO APROVADO?
    // ==========================================
    if (pagamento.status !== "approved") {
      return new Response(
        JSON.stringify({
          status: pagamento.status
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
    // IDENTIFICA O USUÁRIO
    // ==========================================
    const referencia = pagamento.external_reference;
    const userId = referencia.split("_")[1];

    // ==========================================
    // EVITA DUPLICIDADE
    // ==========================================
    const { data: assinaturaExistente } = await supabase
      .from("assinaturas")
      .select("id")
      .eq("payment_id", String(paymentId))
      .maybeSingle();

    if (assinaturaExistente) {
      return new Response(
        JSON.stringify({
          status: "assinatura já cadastrada"
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    // ==========================================
    // DATAS
    // ==========================================
    const inicio = new Date();
    const fim = new Date();
    fim.setFullYear(fim.getFullYear() + 1);

    // ==========================================
    // PROCURA ASSINATURA DO USUÁRIO
    // ==========================================
    const { data: assinaturaUsuario } = await supabase
      .from("assinaturas")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    // ==========================================
    // USUÁRIO JÁ POSSUI ASSINATURA
    // ==========================================
    if (assinaturaUsuario) {

      const creditosAtuais = assinaturaUsuario.creditos ?? 0;

      const { error } = await supabase
        .from("assinaturas")
        .update({

          status: "active",

          creditos: creditosAtuais + 1,

          data_inicio: inicio.toISOString(),

          data_fim: fim.toISOString(),

          payment_id: String(paymentId),

          external_reference: referencia

        })
        .eq("id", assinaturaUsuario.id);

      if (error) throw error;

      console.log("=================================");
      console.log("CRÉDITO ADICIONADO");
      console.log("Usuário:", userId);
      console.log("Créditos:", creditosAtuais + 1);
      console.log("=================================");

    }
    // ==========================================
    // PRIMEIRA ASSINATURA
    // ==========================================
    else {

      const { error } = await supabase
        .from("assinaturas")
        .insert({

          user_id: userId,

          status: "active",

          creditos: 1,

          data_inicio: inicio.toISOString(),

          data_fim: fim.toISOString(),

          payment_id: String(paymentId),

          external_reference: referencia

        });

      if (error) throw error;

      console.log("=================================");
      console.log("PRIMEIRA ASSINATURA");
      console.log("Usuário:", userId);
      console.log("Créditos: 1");
      console.log("=================================");

    }

    // ==========================================
    // RETORNO
    // ==========================================
    return new Response(
      JSON.stringify({
        status: "ok",
        assinatura: true
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );

  } catch (erro) {
    return new Response(
      JSON.stringify({ erro: erro.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});