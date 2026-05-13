// Script de proteção do site - bloqueia apenas download de imagens
(function() {
    // Bloquear clique direito APENAS em imagens
    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    // Bloquear drag and drop de imagens
    document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    // Remover "Save image as" do contexto de imagens
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
    });
})();
