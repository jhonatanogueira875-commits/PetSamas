/*
==========================================================
Safe Samas
Arquivo: qr-code.js
==========================================================

Responsável por:

✔ Buscar o pet
✔ Verificar se existe QR
✔ Criar QR Online automaticamente
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
    // Procura QR já existente
    //--------------------------------------------------

    let { data: qr } = await banco

        .from("qrcodes")

        .select("*")

        .eq("pet_id", idPet)

        .eq("status", "ativado")

        .maybeSingle();

    //--------------------------------------------------
    // NÃO EXISTE
    //--------------------------------------------------

    if (!qr) {

        console.log("Nenhum QR encontrado. Criando automaticamente...");

        //--------------------------------------------------
        // Último número utilizado
        //--------------------------------------------------

        const { data: ultimo } = await banco

            .from("qrcodes")

            .select("numero")

            .order("numero", { ascending: false })

            .limit(1);

        let proximoNumero = 1;

        if (ultimo && ultimo.length > 0) {

            proximoNumero = (ultimo[0].numero || 0) + 1;

        }

        //--------------------------------------------------
        // Código
        //--------------------------------------------------

        const novoCodigo = `PET-${String(proximoNumero).padStart(6, "0")}`;

        //--------------------------------------------------
        // Salva
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