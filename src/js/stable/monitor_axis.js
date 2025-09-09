/**
 * @fileoverview Módulo para actualizar los elementos del DOM con la posición del mouse y el tamaño del viewport.
 * @author Gemini
 */

/**
 * Actualiza los elementos del DOM con la posición del mouse y el tamaño del viewport.
 * @param {MouseEvent} event - El objeto de evento del mouse, si está disponible.
 */
function updateMonitor(event) {
    const mousePositionDiv = document.getElementById('mouse-position');
    const viewportSizeDiv = document.getElementById('viewport-size');

    // Obtenemos las coordenadas del mouse si el evento es de mousemove
    const mouseX = event ? event.clientX : 0;
    const mouseY = event ? event.clientY : 0;

    // Obtenemos las dimensiones del viewport
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    // Actualizamos los divs con los valores
    if (mousePositionDiv) {
        mousePositionDiv.textContent = `Mouse: X: ${mouseX}, Y: ${mouseY}`;
    }
    if (viewportSizeDiv) {
        viewportSizeDiv.textContent = `Viewport: W: ${viewportW}, H: ${viewportH}`;
    }
}

/**
 * Configura los listeners al cargar la página para monitorear el mouse y el viewport.
 */
export function initializeMonitor() {
    // Se ejecuta al inicio para mostrar el tamaño inicial del viewport.
    updateMonitor({ clientX: 0, clientY: 0 });
    
    // Configura el listener para actualizar el monitor al mover el mouse.
    document.addEventListener('mousemove', updateMonitor);
}
