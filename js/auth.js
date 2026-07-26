/*
==========================================================
Safe Samas
Arquivo: admin-auth.js

Proteção do Painel Administrativo
==========================================================
*/

async function verificarAdministrador() {

    console.log("ADMIN AUTH EXECUTOU");

    // ==========================================
    // Verifica se existe sessão
    // ==========================================

    const { data, error } = await banco.auth.getSession();

    if (error) {

        console.error(error);

        window.location.href = "../login.html";

        return false;

    }

    if (!data.session) {

        window.location.href = "../login.html";

        return false;

    }

    // ==========================================
    // Busca o perfil do usuário
    // ==========================================

    const { data: perfil, error: erroPerfil } = await banco

        .from("profiles")

        .select("role")

        .eq("id", data.session.user.id)

        .single();

    if (erroPerfil) {

        console.error(erroPerfil);

        window.location.href = "../index.html";

        return false;

    }

    // ==========================================
    // Verifica se é administrador
    // ==========================================

    if (perfil.role !== "admin") {

        alert("Acesso restrito ao administrador.");

        window.location.href = "../index.html";

        return false;

    }

    return true;

}