/*
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
