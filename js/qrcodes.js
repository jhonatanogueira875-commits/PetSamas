/*
==========================================================
PetSamas
Arquivo: qrcodes.js

Responsável por:

✔ Gerar lotes de QR Codes
✔ Buscar o último número cadastrado
✔ Continuar a sequência automaticamente
✔ Salvar o lote no Supabase
==========================================================
*/


// ======================================================
// GERAR LOTE
// ======================================================

async function gerarLote(quantidade) {

    const resultado = document.getElementById("resultado");
    const botao = document.querySelector("button");

    // Evita clique duplo
    botao.disabled = true;
    botao.innerHTML = "⏳ Gerando lote...";

    resultado.innerHTML = "Gerando QR Codes...";

    try {

        // ==================================================
        // BUSCA O ÚLTIMO NÚMERO CADASTRADO
        // ==================================================

        const { data: ultimo, error } = await banco
            .from("qrcodes")
            .select("numero")
            .order("numero", { ascending: false })
            .limit(1);

        if (error) throw error;

        let proximoNumero = 1;

        if (ultimo.length > 0 && ultimo[0].numero != null) {

            proximoNumero = ultimo[0].numero + 1;

        }

        // ==================================================
        // GERA O LOTE
        // ==================================================

        const lote = [];

        for (let i = 0; i < quantidade; i++) {

            const numero = proximoNumero + i;

            lote.push({

                numero: numero,

                codigo: `PET-${String(numero).padStart(6, "0")}`,

                status: "disponivel",

                tipo: "PET"

            });

        }

        // ==================================================
        // SALVA NO BANCO
        // ==================================================

        const { error: erroInsert } = await banco
            .from("qrcodes")
            .insert(lote);

        if (erroInsert) throw erroInsert;

        // ==================================================
        // SUCESSO
        // ==================================================

        resultado.innerHTML = `

            <h3>✅ Lote criado com sucesso!</h3>

            <p><strong>Quantidade:</strong> ${quantidade}</p>

            <p><strong>Primeiro QR:</strong> ${lote[0].codigo}</p>

            <p><strong>Último QR:</strong> ${lote[lote.length - 1].codigo}</p>

        `;

    }

    catch (erro) {

        console.error(erro);

        resultado.innerHTML = `

            <p style="color:red;">

                ❌ Erro ao gerar lote.

            </p>

            <p>

                ${erro.message}

            </p>

        `;

    }

    finally {

        botao.disabled = false;

        botao.innerHTML = "➕ Gerar 100 QR Codes";

    }

}