// Proteção contra cópia casual; não substitui controle de acesso no servidor.
(function() {
    document.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });

    document.addEventListener('dragstart', (event) => {
        if (event.target instanceof Element && event.target.closest('img, video')) {
            event.preventDefault();
        }
    });

    document.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();
        const blockedShortcut =
            event.key === 'F12' ||
            (event.ctrlKey && event.shiftKey && ['i', 'j', 'c'].includes(key)) ||
            (event.ctrlKey && key === 'u');

        if (blockedShortcut) {
            event.preventDefault();
            event.stopPropagation();
        }
    });
})();
