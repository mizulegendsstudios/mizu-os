/**
 * @fileoverview Módulo para controlar la visibilidad de las barras roja y azul.
 * @author Gemini
 */

let hideTimer;
let isHidden = false;
const HIDE_DELAY = 5000; // 5 segundos
const EDGE_THRESHOLD = 50; // píxeles

/* --------------------------------------------------
    FUNCIONES AUXILIARES
-------------------------------------------------- */

/**
 * Oculta las barras roja y azul y expande la capa negra.
 */
function hideBars() {
    const redBar = document.getElementById('red-bar');
    const blueBar = document.getElementById('blue-bar');
    const blackBar = document.getElementById('black-bar');

    // Barras: deslizamiento + fade
    if (redBar) {
        redBar.style.transform = 'translateY(-100%)';
        redBar.style.opacity = '0';
    }
    if (blueBar) {
        blueBar.style.transform = 'translateX(-100%)';
        blueBar.style.opacity = '0';
    }

    // Capa negra: expandir a toda la pantalla
    if (blackBar) {
        blackBar.style.top = '0';
        blackBar.style.left = '0';
        blackBar.style.right = '0';
        blackBar.style.bottom = '0';
    }

    isHidden = true;
}

/**
 * Muestra las barras roja y azul y restaura el tamaño original de la capa negra.
 */
function showBars() {
    const redBar = document.getElementById('red-bar');
    const blueBar = document.getElementById('blue-bar');
    const blackBar = document.getElementById('black-bar');

    // Restaurar transformaciones y opacidad
    if (redBar) {
        redBar.style.transform = 'translateY(0)';
        redBar.style.opacity = '1';
    }
    if (blueBar) {
        blueBar.style.transform = 'translateX(0)';
        blueBar.style.opacity = '1';
    }

    // Restaurar posición original de la capa negra
    if (blackBar) {
        blackBar.style.top = '5rem';
        blackBar.style.left = '5rem';
        blackBar.style.right = '0';
        blackBar.style.bottom = '0';
    }

    isHidden = false;
}

/**
 * Inicia o reinicia el temporizador de ocultación.
 */
function startHideTimer() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideBars, HIDE_DELAY);
}

/* --------------------------------------------------
    INICIALIZACIÓN
-------------------------------------------------- */

/**
 * Configura los listeners al cargar la página.
 */
export function initializeBarHiding() {
    startHideTimer();

    document.getElementById('body-container').addEventListener('mousemove', (event) => {
        clearTimeout(hideTimer);

        // Si están ocultas y el ratón está cerca de los bordes, mostrar.
        if (isHidden) {
            if (event.clientX < EDGE_THRESHOLD || event.clientY < EDGE_THRESHOLD) {
                showBars();
            }
        }

        // Si se muestran y el ratón se aleja, reiniciar el temporizador para ocultarlas.
        if (!isHidden && (event.clientX >= EDGE_THRESHOLD && event.clientY >= EDGE_THRESHOLD)) {
            startHideTimer();
        }
    });
}
