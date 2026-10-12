
import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const LIMIAR_SUSPEITO = 10;
const JANELA_SUSPEITA_MS = 5 * 60 * 1000;

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char] ?? char);
}

async function hashIp(ip: string): Promise<string> {
  const bytes = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });

  if (req.method !== "POST") {
    return json({ erro: "Método não permitido." }, 405);
  }
let supabase: any = null;
  let auditoriaId: number | null = null;
  let qrCodeId: string | null = null;
  let petId: number | null = null;
  let detalhesAuditoria: Record<string, unknown> = {};

  async function atualizarAuditoria(
    resultado: "enviada" | "ignorada" | "falha" | "suspeita",
    motivo?: string,
  ) {
    if (!supabase || auditoriaId === null) return;

    const { error } = await supabase
      .from("auditoria_leituras_qr")
      .update({
        resultado,
        motivo: motivo ?? null,
        detalhes: detalhesAuditoria,
      })
      .eq("id", auditoriaId);

    if (error) {
      console.error("Falha ao atualizar auditoria:", error.message);
    }
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const secretKeysRaw = Deno.env.get("SUPABASE_SECRET_KEYS");

    if (!supabaseUrl || !secretKeysRaw) {
      console.error("Configuração do Supabase indisponível.");
      return json({ erro: "Serviço temporariamente indisponível." }, 500);
    }

    let secretKeys: Record<string, string>;

    try {
      secretKeys = JSON.parse(secretKeysRaw);
    } catch {
      console.error("SUPABASE_SECRET_KEYS não contém JSON válido.");
      return json({ erro: "Serviço temporariamente indisponível." }, 500);
    }

    const secretKey = secretKeys.default;

    if (!secretKey) {
      console.error("Chave padrão do Supabase não encontrada.");
      return json({ erro: "Serviço temporariamente indisponível." }, 500);
    }

    supabase = createClient(supabaseUrl, secretKey);

    const brevoKey = Deno.env.get("BREVO_API_KEY");

    if (!brevoKey) {
      console.error("BREVO_API_KEY não configurada.");
      return json({ erro: "Serviço de e-mail indisponível." }, 500);
    }

    let body: { codigo?: unknown };

    try {
      body = await req.json();
    } catch {
      return json({ erro: "Corpo da requisição inválido." }, 400);
    }

    const codigo = typeof body?.codigo === "string"
      ? body.codigo.trim()
      : "";

    if (!codigo || codigo.length > 200) {
      return json({ erro: "Código inválido." }, 400);
    }

    // Usa somente um hash do IP para auditoria; não grava o IP original.
    // Os cabeçalhos podem ser fornecidos por intermediários, portanto
    // o hash serve como indício, não como prova de identidade.
    const ipInformado =
      req.headers.get("cf-connecting-ip") ??
      req.headers.get("x-real-ip") ??
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

    let ipHash: string | null = null;

    if (ipInformado) {
      try {
        ipHash = await hashIp(ipInformado);
      } catch {
        console.warn("Não foi possível gerar o hash do IP.");
      }
    }

    detalhesAuditoria = {
      user_agent: (req.headers.get("user-agent") ?? "").slice(0, 300),
      ip_hash: ipHash,
      suspeita: false,
      email_status: "pendente",
    };

    // Procura o QR Code no servidor. O cliente não determina o proprietário.
    const { data: qr, error: qrError } = await supabase
      .from("qrcodes")
      .select("id, pet_id")
      .eq("codigo", codigo)
      .eq("status", "ativado")
      .eq("qr_liberado", true)
      .maybeSingle();

    if (qrError) {
      console.error("Erro ao consultar QR Code:", qrError.message);
      return json({ erro: "Não foi possível validar o QR Code." }, 500);
    }

    if (qr) {
      qrCodeId = qr.id;
      petId = qr.pet_id;
    }

    // Registra também tentativas com código inválido.
    if (!qr || !qr.pet_id) {
      const { error: auditError } = await supabase
        .from("auditoria_leituras_qr")
        .insert({
          qr_code_id: qrCodeId,
          pet_id: petId,
          resultado: "ignorada",
          motivo: "QR Code inválido, não ativado ou sem cadastro associado.",
          origem: "pagina_publica",
          detalhes: detalhesAuditoria,
        });

      if (auditError) {
        console.error("Falha ao registrar tentativa:", auditError.message);
      }

      return json({
        status: "ignorado",
        motivo: "QR Code não válido ou não ativado.",
      });
    }

    // Identifica repetição elevada por hash de IP nos últimos cinco minutos.
    // Não bloqueia o envio; apenas marca a leitura para auditoria.
    let suspeita = false;

    if (ipHash) {
      const desde = new Date(
        Date.now() - JANELA_SUSPEITA_MS,
      ).toISOString();

      const { count, error: countError } = await supabase
        .from("auditoria_leituras_qr")
        .select("id", { count: "exact", head: true })
        .contains("detalhes", { ip_hash: ipHash })
        .gte("data_hora", desde);

      if (countError) {
        console.error(
          "Falha ao verificar frequência de leituras:",
          countError.message,
        );
      } else if ((count ?? 0) >= LIMIAR_SUSPEITO) {
        suspeita = true;
      }
    }

    detalhesAuditoria = {
      ...detalhesAuditoria,
      suspeita,
      email_status: "pendente",
    };

    if (suspeita) {
      console.warn("Padrão de leituras repetidas identificado.", {
        qr_code_id: qrCodeId,
        janela_minutos: 5,
      });
    }

    // Cria o registro antes de tentar enviar o e-mail.
    const { data: registro, error: insertError } = await supabase
      .from("auditoria_leituras_qr")
      .insert({
        qr_code_id: qrCodeId,
        pet_id: petId,
        resultado: suspeita ? "suspeita" : "recebida",
        motivo: suspeita
          ? "Frequência elevada de leituras associadas ao mesmo hash de IP."
          : null,
        origem: "pagina_publica",
        detalhes: detalhesAuditoria,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Falha ao registrar leitura:", insertError.message);
      return json({ erro: "Não foi possível registrar a leitura." }, 500);
    }

    auditoriaId = registro.id;

    const { data: pet, error: petError } = await supabase
      .from("pets")
      .select("user_id, nome_pet")
      .eq("id", petId)
      .maybeSingle();

    if (petError) {
      console.error("Erro ao consultar cadastro:", petError.message);
      detalhesAuditoria.email_status = "falha";
      await atualizarAuditoria("falha", "Erro ao consultar o cadastro.");
      return json({ erro: "Não foi possível consultar o cadastro." }, 500);
    }

    if (!pet?.user_id) {
      detalhesAuditoria.email_status = "ignorado";
      await atualizarAuditoria(
        "ignorada",
        "Cadastro sem proprietário associado.",
      );
      return json({
        status: "ignorado",
        motivo: "Cadastro sem proprietário associado.",
      });
    }

    const { data: perfil, error: perfilError } = await supabase
      .from("profiles")
      .select("email, nome")
      .eq("id", pet.user_id)
      .maybeSingle();

    if (perfilError) {
      console.error(
        "Erro ao consultar proprietário:",
        perfilError.message,
      );
      detalhesAuditoria.email_status = "falha";
      await atualizarAuditoria("falha", "Erro ao consultar o proprietário.");
      return json({ erro: "Não foi possível localizar o proprietário." }, 500);
    }

    if (!perfil?.email) {
      detalhesAuditoria.email_status = "ignorado";
      await atualizarAuditoria(
        "ignorada",
        "Proprietário sem e-mail cadastrado.",
      );
      return json({
        status: "ignorado",
        motivo: "Proprietário sem e-mail cadastrado.",
      });
    }

    const nomeItemTexto = pet.nome_pet || "seu item";
    const nomeItemHtml = escapeHtml(nomeItemTexto);
    const nomePessoaHtml = escapeHtml(perfil.nome || "Olá");
    const nomePessoaTexto = perfil.nome || "proprietário";

    const dataHora = new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "America/Sao_Paulo",
    }).format(new Date());

    let respostaBrevo: Response;

    try {
      respostaBrevo = await fetch(
        "https://api.brevo.com/v3/smtp/email",
        {
          method: "POST",
          headers: {
            "api-key": brevoKey,
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: JSON.stringify({
            sender: {
              name: "Safe Samas",
              email: "jhonatanogueira875@gmail.com",
            },
            to: [{
              email: perfil.email,
              ...(perfil.nome ? { name: perfil.nome } : {}),
            }],
            subject: "Seu QR Code Safe Samas foi lido",
            textContent:
              `Olá, ${nomePessoaTexto}!\n\n` +
              `O QR Code de "${nomeItemTexto}" foi lido em ${dataHora}.\n\n` +
              "Este aviso informa apenas que houve uma leitura. " +
              "Não significa necessariamente que o item foi encontrado " +
              "ou recuperado.\n\nSafe Samas",
            htmlContent:
              `<p>${nomePessoaHtml},</p>` +
              `<p>O QR Code de <strong>${nomeItemHtml}</strong> foi lido ` +
              `em <strong>${dataHora}</strong>.</p>` +
              "<p>Este aviso informa apenas que houve uma leitura. " +
              "Não significa necessariamente que o item foi encontrado " +
              "ou recuperado.</p><p>Safe Samas</p>",
            tags: ["safe-samas", "leitura-qr"],
          }),
        },
      );
    } catch (erro) {
      console.error(
        "Falha de comunicação com Brevo:",
        erro instanceof Error ? erro.message : "Erro desconhecido",
      );
      detalhesAuditoria.email_status = "falha";
      await atualizarAuditoria("falha", "Falha de comunicação com o Brevo.");
      return json({ erro: "Não foi possível enviar a notificação." }, 502);
    }

    if (!respostaBrevo.ok) {
      // Não registra o corpo da resposta: ele pode conter dados desnecessários.
      console.error("Brevo recusou o envio. HTTP:", respostaBrevo.status);
      detalhesAuditoria.email_status = "falha";
      await atualizarAuditoria(
        "falha",
        `O Brevo recusou o envio (HTTP ${respostaBrevo.status}).`,
      );
      return json({ erro: "Não foi possível enviar a notificação." }, 502);
    }

    detalhesAuditoria.email_status = "enviada";

    // Mantém a marca de suspeita no campo detalhes mesmo após o envio.
    await atualizarAuditoria(
      suspeita ? "suspeita" : "enviada",
      suspeita
        ? "Leitura suspeita registrada; e-mail enviado normalmente."
        : "E-mail aceito pelo Brevo.",
    );

    return json({
      status: "enviado",
      auditoria: suspeita ? "suspeita" : "registrada",
    });
  } catch (erro) {
    console.error(
      "Erro na notificação de leitura:",
      erro instanceof Error ? erro.message : "Erro desconhecido",
    );

    if (auditoriaId !== null) {
      detalhesAuditoria.email_status = "falha";
      await atualizarAuditoria("falha", "Erro interno ao processar a leitura.");
    }

    return json({ erro: "Erro interno ao processar a leitura." }, 500);
  }
});
