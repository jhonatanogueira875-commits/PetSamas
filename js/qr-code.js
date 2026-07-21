/*
==========================================================
Safe Samas
Arquivo: qr-code.js
==========================================================

Responsável por:

✔ Buscar o pet
✔ Verificar assinatura
✔ Verificar créditos
✔ Criar QR Online automaticamente
✔ Consumir crédito
✔ Salvar no banco
✔ Gerar imagem do QR
==========================================================
*/

const parametros = new URLSearchParams(window.location.search);

const idPet = Number(parametros.get("id"));

window.onload = async function () {

    //--------------------------------------------------
    // Validação
    //--------------------------------------------------

    if (!idPet) {

        window.location.href = "meus-pets.html";
        return;

    }

    //--------------------------------------------------
    // Usuário logado
    //--------------------------------------------------

    const {
        data: { user }
    } = await banco.auth.getUser();

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    //--------------------------------------------------
    // Busca assinatura
    //--------------------------------------------------

    const { data: assinatura } = await banco

        .from("assinaturas")

        .select("*")

        .eq("user_id", user.id)

        .maybeSingle();

    if (!assinatura) {

        alert("Nenhuma assinatura encontrada.");

        window.location.href = "assinatura.html";

        return;

    }

    //--------------------------------------------------
    // Busca o pet
    //--------------------------------------------------

    const { data: pet, error: erroPet } = await banco

        .from("pets")

        .select("id, nome_pet")

        .eq("id", idPet)

        .single();

    if (erroPet || !pet) {

        alert("Item/Pet não encontrado.");

        window.location.href = "meus-pets.html";

        return;

    }

    //--------------------------------------------------
    // Procura QR existente
    //--------------------------------------------------

    let { data: qr } = await banco

        .from("qrcodes")

        .select("*")

        .eq("pet_id", idPet)

        .eq("status", "ativado")

        .maybeSingle();

    //--------------------------------------------------
    // NÃO POSSUI QR
    //--------------------------------------------------

    if (!qr) {

        //--------------------------------------------------
        // Verifica créditos
        //--------------------------------------------------

        const creditos = assinatura.creditos ?? 0;

        if (creditos <= 0) {

            document.getElementById("conteudoLiberado").style.display = "none";

            document.getElementById("bloqueioPagamento").style.display = "block";

            document.getElementById("bloqueioPagamento").innerHTML = `

                <h2>⚠️ Você já utilizou todos os seus créditos.</h2>

                <p>Cada QR Code possui um crédito individual.</p>
                <p>Para proteger um novo item ou pet, adicione um novo crédito à sua conta.</p>

                <br>

                <a href="assinatura.html">
                    <button class="btn-samas">
                        ➕ Comprar novo QR
                    </button>
                </a>

                <br><br>

                <a href="https://wa.me/5542984097827" target="_blank">
                    <button class="btn-samas">
                        💬 Suporte
                    </button>
                </a>

            `;

            return;

        }

        //--------------------------------------------------
        // Descobre automaticamente o próximo código (Apenas sequenciais de 6 dígitos)
        //--------------------------------------------------

        const { data: listaQR, error: erroLista } = await banco

            .from("qrcodes")

            .select("codigo");

        if (erroLista) {

            console.error(erroLista);

            alert("Erro ao consultar os QR Codes.");

            return;

        }

        let maiorNumero = 0;

        (listaQR || []).forEach((item) => {

            if (!item.codigo) return;

            const encontrado = item.codigo.match(/^PET-(\d{6})$/);

            if (!encontrado) return;

            const numero = Number(encontrado[1]);

            if (numero > maiorNumero) {

                maiorNumero = numero;

            }

        });

        const proximoNumero = maiorNumero + 1;

        //--------------------------------------------------
        // Código
        //--------------------------------------------------

        const novoCodigo = `PET-${String(proximoNumero).padStart(6, "0")}`;

        //--------------------------------------------------
        // Salva QR
        //--------------------------------------------------

        const { data: novoQR, error: erroInsert } = await banco

            .from("qrcodes")

            .insert({

                codigo: novoCodigo,

                numero: proximoNumero,

                status: "ativado",

                tipo: "ONLINE",

                origem: "online",

                pet_id: idPet,

                qr_liberado: true,

                activated_at: new Date().toISOString()

            })

            .select()

            .single();

        if (erroInsert) {

            console.error(erroInsert);

            alert("Erro ao gerar QR Code.");

            return;

        }

        qr = novoQR;

        //--------------------------------------------------
        // Consome 1 crédito
        //--------------------------------------------------

        const { error: erroCredito } = await banco

            .from("assinaturas")

            .update({

                creditos: creditos - 1

            })

            .eq("id", assinatura.id);

        if (erroCredito) {

            console.error(erroCredito);

        }

    }

    //--------------------------------------------------
    // Exibe tela
    //--------------------------------------------------

    document.getElementById("bloqueioPagamento").style.display = "none";

    document.getElementById("conteudoLiberado").style.display = "block";

    document.getElementById("nomePet").textContent = pet.nome_pet;

    //--------------------------------------------------
    // Link público
    //--------------------------------------------------

    const linkPet =

        `https://safesamas.vercel.app/pet-publico.html?codigo=${qr.codigo}`;

    document.getElementById("qrcode").innerHTML = "";

    new QRCode(document.getElementById("qrcode"), {

        text: linkPet,

        width: 250,

        height: 250

    });

    //--------------------------------------------------
    // Download
    //--------------------------------------------------

    const btn = document.getElementById("btnBaixar");

    if (btn) {

        btn.onclick = function () {

            window.print();

        };

    }

};