/*
    Archivo principal que orquesta la lógica de la aplicación.
    Mizu OS v2.10.20 — compatible, estable, extensible.
*/

console.log(`Cargando sistema...`);

// Importaciones de módulos core
import { initializeLoadingScreen } from "./loading.js";
import { initializeBarHiding } from "./monitor_bars.js";
import { initializeMonitor } from "./monitor_axis.js";

// Importaciones de diagramas (comentadas temporalmente para estabilización)
// import { drawLines } from '../../apps/diagram/js/drawlines.js';
// import { initDiagram } from '../../apps/diagram/js/nodos.js';
// import { createContainerWithPorts } from '../../apps/diagram/js/nodos-puertos.js';

// Importación del nuevo widget de estado del sistema
import { initializeStatusWidget } from "./status.js";

// DEV
console.log(`Cargando mejoras...`);

// DOM
console.log(`Iniciando sistema...`);

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Inicializa módulos estables del core
        initializeMonitor();
        initializeBarHiding();
        initializeLoadingScreen();
        // initializeZoomAndPan(); // Mantenido comentado por conflicto con nodos

        // Inicializa el widget de estado del sistema (hora, batería, conexión, volumen)
        initializeStatusWidget();

        // Inicializa el diagrama de nodos tradicionales (desactivado temporalmente)
        // initDiagram(drawLines);

        console.log(`Activando las mejoras...`);/*
    Archivo principal que orquesta la lógica de la aplicación.
    Mizu OS v2.10.20 — compatible, estable, extensible.
*/

console.log(`Cargando sistema...`);

// ----------  módulos core ----------
import { initializeLoadingScreen } from "./loading.js";
import { initializeBarHiding }     from "./monitor_bars.js";
import { initializeMonitor }       from "./monitor_axis.js";

// ----------  módulos opcionales  ----------
let drawLines, initDiagram, createContainerWithPorts;
try {
  // descomenta cuando estés listo
  // drawLines                  = await import('../../apps/diagram/js/drawlines.js').then(m => m.drawLines);
  // initDiagram                = await import('../../apps/diagram/js/nodos.js').then(m => m.initDiagram);
  // createContainerWithPorts   = await import('../../apps/diagram/js/nodos-puertos.js').then(m => m.createContainerWithPorts);
} catch (e) {
  console.warn('Módulos de diagrama no cargados:', e.message);
}

// ----------  widget de estado (opcional) ----------
try {
  const { initializeStatusWidget } = await import('./status.js');
  initializeStatusWidget();
} catch (e) {
  console.info('Widget de estado no disponible.');
}

// ----------  arranque ----------
document.addEventListener('DOMContentLoaded', async () => {
  try {
    initializeMonitor();
    initializeBarHiding();
    initializeLoadingScreen(); // controla visibilidad final

    // ----------  botón “P” (desactivado) ----------
    // const createContainerBtn = document.createElement('button');
    // createContainerBtn.className = 'node-btn';
    // createContainerBtn.innerHTML = '<span class="plus-icon">P</span>';
    // createContainerBtn.title = 'Crear Contenedor con Puertos';
    // createContainerBtn.style.marginTop = '0.5rem';
    // document.getElementById('create-node-btn')?.parentNode?.insertBefore(createContainerBtn, createNodeBtn.nextSibling);
    // createContainerBtn.addEventListener('click', () => {
    //   const canvas = document.getElementById('canvas');
    //   const rect = canvas.getBoundingClientRect();
    //   createContainerWithPorts?.(Math.random() * (rect.width - 150), Math.random() * (rect.height - 150), drawLines);
    // });

    // ----------  diagrama (desactivado) ----------
    // if (initDiagram && drawLines) initDiagram(drawLines);

    console.log('Mizu OS inicializado — core, estado y módulos listos.');
  } catch (err) {
    console.error('Fallo en el arranque:', err);
  }
});

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

        // Evento para crear contenedores con puertos (desactivado temporalmente)
        createContainerBtn.addEventListener('click', () => {
            const canvas = document.getElementById('canvas');
            if (!canvas) {
                console.warn('Canvas no encontrado. No se puede crear contenedor.');
                return;
            }
            const rect = canvas.getBoundingClientRect();
            const x = Math.random() * (rect.width - 150);
            const y = Math.random() * (rect.height - 150);
            // createContainerWithPorts(x, y, drawLines); // Descomenta cuando esté listo
        });

        // Hacer visible el HTML después de cargar
        document.documentElement.style.visibility = 'visible';
        document.documentElement.style.opacity = '1';

        console.log('Aplicación inicializada — sistemas de nodos, puertos y estado listos.');
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
    }
});
