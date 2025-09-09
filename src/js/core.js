/* Archivo principal que orquesta la lógica de la aplicación. */

// STABLE
import { initializeLoadingScreen } from "./stable/loading.js";
import { initializeBarHiding } from "./stable/monitor_bars.js";
import { initializeMonitor } from "./stable/monitor_axis.js";
// import { initializeZoomAndPan } from "./stable/zoom.js"; // Dejado comentado por compatibilidad

// DEV — Importamos drawLines desde su módulo independiente
import { drawLines } from './dev/drawlines.js';

// Importamos initDiagram desde stable/nodos.js (asumiendo que lo moverás allí)
import { initDiagram } from './stable/nodos.js';

/**
 * Versión de la aplicación.
 * @constant {string}
 */
const VERSION = '2.10.01';

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

    // Carga redundante por compatibilidad (se respeta, aunque no sea necesaria si usas imports)
    const script = document.createElement('script');
    script.src = 'dev/nodos.js'; // O debería ser 'stable/nodos.js'? Ajusta según tu estructura final
    document.head.appendChild(script);

    // Hacer visible el HTML después de cargar
    document.documentElement.style.visibility = 'visible';
    document.documentElement.style.opacity = '1';

    console.log('Aplicación inicializada — drawLines orquestado por core.js');
});
