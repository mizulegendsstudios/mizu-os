/**
 * @fileoverview Módulo que maneja la funcionalidad de zoom y pan dentro de un contenedor.
 * @author Gemini
 */

/** @constant {number} La velocidad de zoom. */
const ZOOM_SPEED = 0.1;

let isPanning = false;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;
let scale = 1;

/**
 * Inicializa los listeners para la funcionalidad de zoom y pan.
 */
export function initializeZoomAndPan() {
    const container = document.getElementById('black-bar');
    const zoomableContent = document.getElementById('black-content-wrapper');

    if (!container || !zoomableContent) {
        console.error('El contenedor para zoom y pan no fue encontrado.');
        return;
    }

    // Listener para el inicio del movimiento (pan)
    container.addEventListener('mousedown', (event) => {
        isPanning = true;
        startX = event.clientX - currentX;
        startY = event.clientY - currentY;
        container.style.cursor = 'grabbing';
    });

    // Listener para el fin del movimiento (pan)
    container.addEventListener('mouseup', () => {
        isPanning = false;
        container.style.cursor = 'grab';
    });

    // Listener para el movimiento del mouse (pan)
    container.addEventListener('mousemove', (event) => {
        if (!isPanning) return;
        currentX = event.clientX - startX;
        currentY = event.clientY - startY;
        zoomableContent.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
    });

    // Listener para la rueda del mouse (zoom)
    container.addEventListener('wheel', (event) => {
        event.preventDefault();
        const delta = Math.sign(event.deltaY);
        const newScale = scale - delta * ZOOM_SPEED;
        
        // Limita el zoom para evitar que se pierda el contenido
        if (newScale >= 0.2 && newScale <= 3) {
            scale = newScale;
            zoomableContent.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
        }
    });

    // Asegura que el cursor vuelva a 'grab' si se suelta el mouse fuera del contenedor
    document.addEventListener('mouseleave', () => {
        isPanning = false;
        container.style.cursor = 'grab';
    });

    console.log('Módulo de zoom y pan inicializado.');
    container.style.cursor = 'grab';
}
