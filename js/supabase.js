/*
==========================================================
PetSamas
Arquivo: supabase.js
==========================================================
*/

alert("SUPABASE.JS CARREGOU");

const SUPABASE_URL =
"https://zkgasxwggvdamuvxcsnf.supabase.co";

const SUPABASE_KEY =
"sb_publishable_NFlKL0lg1JuduUXTEwX9jA_jhxrBUMQ";

const { createClient } = supabase;

const banco = createClient(

    SUPABASE_URL,

    SUPABASE_KEY

);

alert("CONEXÃO CRIADA");