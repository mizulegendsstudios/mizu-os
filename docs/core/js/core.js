/*
    Archivo principal que orquesta la lógica de la aplicación.
*/

console.log(`Cargando sistema estable...`);

    // Importaciones y lógica que podrían fallar
    import { initializeLoadingScreen } from "./loading.js";
    import { initializeBarHiding } from "./monitor_bars.js";
    import { initializeMonitor } from "./monitor_axis.js";

    // DEV
    console.log(`Cargando sistema mejoras en desarrollo...`);

    // import { initializeZoomAndPan } from "./docs/core/js/zoom.js"; // Dejado comentado por compatibilidad con diagram
    // import { drawLines } from './docs/apps/diagram/js/drawlines.js';

    // Importamos initDiagram desde nodos.js (sistema de nodos tradicionales)
    import { initDiagram } from '/mizu-board/docs/apps/diagram/js/nodos.js';

    // Importamos createContainerWithPorts desde dev/nodos-puertos.js (nuevo sistema de puertos anclados)
    // import { createContainerWithPorts } from './docs/apps/diagram/js/nodos-puertos.js';

    // DOM
    console.log(`Iniciando sistema...`);

    document.addEventListener('DOMContentLoaded', () => {
        try {
            // Inicializa módulos estables
            initializeMonitor();
            initializeBarHiding();
            initializeLoadingScreen();
            // initializeZoomAndPan(); // Mantenido comentado por conflicto con nodos

            // Inicializa el diagrama de nodos tradicionales
            // initDiagram(drawLines);

            console.log(`Iniciando módulos...`);

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
                const canvas = document.getElementById('canvas'); // Asegúrate de que 'canvas' exista en tu HTML
                const rect = canvas.getBoundingClientRect();
                const x = Math.random() * (rect.width - 150);
                const y = Math.random() * (rect.height - 150);
                // createContainerWithPorts(x, y, drawLines); // Descomenta esta línea cuando esté listo para usar
            }); // Llave de cierre del arrow function

            // Hacer visible el HTML después de cargar
            document.documentElement.style.visibility = 'visible';
            document.documentElement.style.opacity = '1';

            console.log('Aplicación inicializada — sistemas de nodos y puertos anclados listos.');
        } catch (error) {
            console.error('Error al inicializar la aplicación:', error);
        }
    }); // Llave de cierre del DOMContentLoaded
