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

// Importamos initDiagram desde stable/nodos.js (sistema de nodos tradicionales)
import { initDiagram } from './stable/nodos.js';

// Importamos createContainerWithPorts desde dev/nodos-puertos.js (nuevo sistema de puertos anclados)
import { createContainerWithPorts } from './dev/nodos-puertos.js';

/**
 * Versión de la aplicación.
 * @constant {string}
 */
const VERSION = '2.10.06';

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
    create
