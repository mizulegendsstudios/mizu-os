/*
Archivo principal que orquesta la lógica de la aplicación.
 */

// STABLE
import { initializeLoadingScreen } from "/loading.js";
import { initializeBarHiding } from "/monitor_bars.js";
import { initializeMonitor } from "/monitor_axis.js";
// import { initializeZoomAndPan } from "./stable/zoom.js"; // Dejado comentado por compatibilidad

// DEV — Importamos drawLines desde su módulo independiente
import { drawLines } from 'apps/diagram/js/drawlines.js';

// Importamos initDiagram desde stable/nodos.js (sistema de nodos tradicionales)
import { initDiagram } from 'apps/diagram/js/nodos.js';

// Importamos createContainerWithPorts desde dev/nodos-puertos.js (nuevo sistema de puertos anclados)
import { createContainerWithPorts } from 'apps/diagram/js/nodos-puertos.js';

/**
 * Versión de la aplicación.
 * @constant {string}
 */
const VERSION = '2.10.07';

document.addEventListener('DOMContentLoaded', () => {
    // Registra la versión de la aplicación en la consola.
    console.log(`Aplicación Mizu Board iniciada. Versión: ${VERSION}`);

    // Inicializa módulos estables
    initializeMonitor();
    initializeBarHiding();
    initializeLoadingScreen();
    // initializeZoomAndPan(); // Mantenido comentado por conflicto con nodos

    // Inicializa el diagrama de nodos tradicionales
    initDiagram(drawLines);

    // Configurar botón para crear contenedores con puertos anclados
    const createContainerBtn = document.createElement('button');
    createContainerBtn.className = 'node-btn';
    createContainerBtn.innerHTML = '<span class="plus-icon">P</span>';
    createContainerBtn.title = 'Crear Contenedor con Puertos';
    createContainerBtn.style.marginTop = '0.5rem';

    // Insertar después del botón de nodo tradicional
    const createNodeBtn = document.getElementById('create-node-btn');
    if (createNodeBtn && createNodeBtn.parentNode) {
        createNodeBtn.parentNode.insertBefore(createContainerBtn, createNodeBtn.nextSibling);
    }

    // Evento para crear contenedores con puertos
    createContainerBtn.addEventListener('click', () => {
        const rect = canvas.getBoundingClientRect();
        const x = Math.random() * (rect.width - 150);
        const y = Math.random() * (rect.height - 150);
        createContainerWithPorts(x, y, drawLines);
    }); // ← ¡Llave de cierre del arrow function!

    // Hacer visible el HTML después de cargar
    document.documentElement.style.visibility = 'visible';
    document.documentElement.style.opacity = '1';

    console.log('Aplicación inicializada — sistemas de nodos y puertos anclados listos.');
}); // ← ¡Llave de cierre del DOMContentLoaded!
