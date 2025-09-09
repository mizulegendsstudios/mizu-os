/**
 * @fileoverview Archivo principal que orquesta la lógica de la aplicación.
 * @author Gemini
 */
// STABLE
import { initializeLoadingScreen } from "./stable/loading.js";
import { initializeBarHiding } from "./stable/monitor_bars.js";
import { initializeMonitor } from "./stable/monitor_axis.js";
// import { initializeZoomAndPan } from "./stable/zoom.js"; // Dejado comentado por compatibilidad

// DEV — Importamos drawLines desde su módulo independiente
import { drawLines } from './dev/drawlines.js';

// Importamos initDiagram desde stable/nodos.js
import { initDiagram } from './stable/nodos.js';

// Importamos createContentNode desde dev/content-nodes.js
import { createContentNode } from './dev/content-nodes.js';

/**
 * Versión de la aplicación.
 * @constant {string}
 */
const VERSION = '2.10.05';

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

    // Configurar botón para crear contenedores nuevos (content-node)
    const createContainerBtn = document.createElement('button');
    createContainerBtn.className = 'node-btn';
    createContainerBtn.innerHTML = '<span class="plus-icon">C</span>';
    createContainerBtn.title = 'Crear Contenedor + Puertos';

    // Insertar después del botón de nodo tradicional
    const createNodeBtn = document.getElementById('create-node-btn');
    if (createNodeBtn && createNodeBtn.parentNode) {
        createNodeBtn.parentNode.insertBefore(createContainerBtn, createNodeBtn.nextSibling);
    }

    // Evento para crear contenedores
    createContainerBtn.addEventListener('click', () => {
        const rect = canvas.getBoundingClientRect();
        const x = Math.random() * (rect.width - 80);
        const y = Math.random() * (rect.height - 80);
        createContentNode(x, y, drawLines);
    });

    // Hacer visible el HTML después de cargar
    document.documentElement.style.visibility = 'visible';
    document.documentElement.style.opacity = '1';

    console.log('Aplicación inicializada — drawLines orquestado por core.js');
});
