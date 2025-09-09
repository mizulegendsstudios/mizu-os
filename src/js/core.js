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

/**
 * Versión de la aplicación.
 * @constant {string}
 */
const VERSION = '2.10.04';

document.addEventListener('DOMContentLoaded', () => {
    // Registra la versión de la aplicación en la consola.
    console.log(`Aplicación Mizulegends iniciada. Versión: ${VERSION}`);

    // Inicializa módulos estables
    initializeMonitor();
    initializeBarHiding();
    initializeLoadingScreen();
    // initializeZoomAndPan(); // Mantenido comentado por conflicto con nodos

    // Inicializa el diagrama, pasando drawLines como callback para redibujar conexiones
    initDiagram(drawLines);

    // Carga redundante por compatibilidad — RUTA CORREGIDA
    const script = document.createElement('script');
    script.src = './src/js/stable/nodos.js'; // ✅ Ruta correcta para GitHub Pages
    document.head.appendChild(script);

    // Hacer visible el HTML después de cargar
    document.documentElement.style.visibility = 'visible';
    document.documentElement.style.opacity = '1';

    console.log('Aplicación inicializada — drawLines orquestado por core.js');
});
