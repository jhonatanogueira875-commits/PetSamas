/* ======================================================
   LIGHTBOX REUTILIZÁVEL - SAFE SAMAS
   ====================================================== */

document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("modalFoto");
    const imagem = document.getElementById("imagemModal");
    const fechar = document.getElementById("fecharModal");

    // Valida se os elementos existem na página antes de executar
    if (!modal || !imagem || !fechar) return;

    // Abre o modal ao clicar em qualquer imagem com a classe .foto-ampliavel
    document.querySelectorAll(".foto-ampliavel").forEach((img) => {
        img.onclick = function() {
            imagem.src = this.dataset.foto;
            modal.classList.add("ativo");
        };
    });

    // Fecha ao clicar no X
    fechar.onclick = function() {
        modal.classList.remove("ativo");
    };

    // Fecha ao clicar fora da imagem (no fundo escuro do modal)
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.classList.remove("ativo");
        }
    };

    // Fecha ao pressionar a tecla ESC do teclado
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") {
            modal.classList.remove("ativo");
        }
    });
});