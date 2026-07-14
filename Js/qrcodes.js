/*
==========================================================
PetSamas
Arquivo: qrcodes.js

Responsável por:

✔ Gerar lotes de QR Codes
✔ Buscar o último número cadastrado
✔ Buscar o último lote cadastrado
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
        // BUSCA O ÚLTIMO NÚMERO E O ÚLTIMO LOTE
        // ==================================================

        const { data: ultimo, error } = await banco
            .from("qrcodes")
            .select("numero, lote")
            .order("numero", { ascending: false })
            .limit(1);

        if (error) throw error;

        let proximoNumero = 1;
        let proximoLote = 1;

        if (ultimo.length > 0) {

            proximoNumero = (ultimo[0].numero || 0) + 1;
            proximoLote = (ultimo[0].lote || 0) + 1;

        }

        // ==================================================
        // GERA O LOTE
        // ==================================================

        const qrcodes = [];

        for (let i = 0; i < quantidade; i++) {

            const numero = proximoNumero + i;

            qrcodes.push({

                numero: numero,

                lote: proximoLote,

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
            .insert(qrcodes);

        if (erroInsert) throw erroInsert;

        // ==================================================
        // SUCESSO
        // ==================================================

        resultado.innerHTML = `

            <h3>✅ Lote criado com sucesso!</h3>

            <p><strong>Lote:</strong> ${proximoLote}</p>

            <p><strong>Quantidade:</strong> ${quantidade}</p>

            <p><strong>Primeiro QR:</strong> ${qrcodes[0].codigo}</p>

            <p><strong>Último QR:</strong> ${qrcodes[qrcodes.length - 1].codigo}</p>

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