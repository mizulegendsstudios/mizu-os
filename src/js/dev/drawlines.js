// Importamos connections desde nodos.js — ¡ahora es un import explícito!
import { connections } from '../stable/nodos.js';

// Referencias necesarias (asume que el DOM ya está cargado)
const connectionsLayer = document.getElementById('connections-layer');

/**
 * Dibuja todas las conexiones entre nodos usando elementos <div> (sin SVG).
 * Cada conexión consta de una línea y una punta de flecha triangular.
 */
export function drawLines() {
  // Limpiar capa de conexiones
  if (!connectionsLayer) {
    console.warn('drawLines: #connections-layer no encontrado.');
    return;
  }

  connectionsLayer.innerHTML = '';

  // No necesitamos verificar si connections está definida — ahora es un import
  connections.forEach(conn => {
    const n1 = document.getElementById(conn.from);
    const n2 = document.getElementById(conn.to);
    if (!n1 || !n2) return;

    // Obtener centros de los nodos
    const x1 = n1.offsetLeft + n1.offsetWidth / 2;
    const y1 = n1.offsetTop + n1.offsetHeight / 2;
    const x2 = n2.offsetLeft + n2.offsetWidth / 2;
    const y2 = n2.offsetTop + n2.offsetHeight / 2;

    // Calcular distancia y ángulo
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    // Ajustar longitud: restar el radio del nodo destino (34px para precisión visual)
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

    // Posicionar la punta justo en el borde del nodo destino
    arrow.style.left = adjustedLength + 'px'; // Justo después de la línea
    arrow.style.top = '1px'; // Alineado con el borde superior del triángulo

    // Rotar 90° para que apunte correctamente en cualquier dirección
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
