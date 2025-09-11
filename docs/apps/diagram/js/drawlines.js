// Importamos connections desde nodos.js
import { connections } from './nodos.js';

// Referencias
const connectionsLayer = document.getElementById('connections-layer');

/**
 * Dibuja todas las conexiones entre nodos o puertos usando elementos <div> (sin SVG).
 * Soporta:
 * - Nodos tradicionales: "node-0" → "node-1"
 * - Puertos de contenedores: "container:0:top" → "container:1:right"
 */
export function drawLines() {
  // Limpiar capa de conexiones
  if (!connectionsLayer) {
    console.warn('drawLines: #connections-layer no encontrado.');
    return;
  }

  connectionsLayer.innerHTML = '';

  // Asegurar que connections esté definido
  if (!Array.isArray(connections)) {
    console.warn('drawLines: connections no es un array.');
    return;
  }

  connections.forEach(conn => {
    const { from, to } = conn;

    // Obtener elementos de origen y destino
    let n1 = document.getElementById(from);
    let n2 = document.getElementById(to);

    // Si no son elementos directos, intentar obtener por selector (para puertos)
    // ✅ AHORA USA ":" COMO SEPARADOR
    if (!n1 && from.includes(':')) {
      const [containerId, port] = from.split(':');
      n1 = document.querySelector(`[data-container-id="${containerId}"][data-port="${port}"]`);
    }
    if (!n2 && to.includes(':')) {
      const [containerId, port] = to.split(':');
      n2 = document.querySelector(`[data-container-id="${containerId}"][data-port="${port}"]`);
    }

    if (!n1 || !n2) {
      console.warn(`drawLines: Elemento no encontrado - from: ${from}, to: ${to}`);
      return;
    }

    // Obtener centros (o posición del puerto)
    const x1 = n1.offsetLeft + n1.offsetWidth / 2;
    const y1 = n1.offsetTop + n1.offsetHeight / 2;
    const x2 = n2.offsetLeft + n2.offsetWidth / 2;
    const y2 = n2.offsetTop + n2.offsetHeight / 2;

    // Calcular distancia y ángulo
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    // Ajustar longitud: restar 34px para que la punta toque el borde
    const adjustedLength = length - 34;
    if (adjustedLength <= 0) return;

    // Crear línea
    const line = document.createElement('div');
    line.className = 'connection-line';
    line.style.width = adjustedLength + 'px';
    line.style.left = x1 + 'px';
    line.style.top = y1 + 'px';
    line.style.transform = `rotate(${angle}deg)`;

    // Crear punta de flecha (triángulo)
    const arrow = document.createElement('div');
    arrow.className = 'arrowhead';
    arrow.style.left = adjustedLength + 'px';
    arrow.style.top = '1px';
    arrow.style.transform = 'rotate(90deg)';

    // Agrupar línea + punta
    line.appendChild(arrow);

    // Evento para eliminar conexión con clic derecho
    line.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      // Filtrar conexiones
      connections.splice(0, connections.length, ...connections.filter(c => !(c.from === conn.from && c.to === conn.to)));
      // Redibujar
      drawLines();
    });

    // Añadir al DOM
    connectionsLayer.appendChild(line);
  });
}
