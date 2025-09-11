// content-nodes.js — Sistema de contenedores + puertos (versión funcional + conexiones)

import { connections } from '../nodos.js'; // ✅ IMPORTADO para guardar conexiones

let containerId = 0;
let selectedPort = null;
let sourcePort = null;

// Referencias
const canvas = document.getElementById('canvas');
const iconos = ["➕", "⚙️", "✅", "📥", "📤", "🔁", "⚠️", "🔍"];

/**
 * Crea un nuevo nodo compuesto (contenedor + 4 puertos)
 * @param {number} x - Posición inicial X
 * @param {number} y - Posición inicial Y
 * @param {function} redrawCallback - Callback para redibujar conexiones
 * @returns {HTMLElement} - El contenedor principal
 */
function createContentNode(x = 100, y = 100, redrawCallback) {
  const id = 'container-' + containerId++;

  // Crear contenedor principal
  const container = document.createElement('div');
  container.className = 'node-container';
  container.dataset.nodeId = id;
  container.style.position = 'absolute';
  container.style.left = x + 'px';
  container.style.top = y + 'px';
  container.style.zIndex = 2;

  // Crear contenido visible (similar a los nodos actuales)
  const content = document.createElement('div');
  content.className = 'node-content';
  content.dataset.containerId = id;

  // Asignar ícono aleatorio
  const icono = iconos[Math.floor(Math.random() * iconos.length)];
  content.textContent = `${icono} (X:${Math.round(x)}, Y:${Math.round(y)})`;

  // Crear los 4 puertos
  const ports = createPorts(id);

  // Añadir hijos al contenedor
  container.appendChild(content);
  ports.forEach(port => container.appendChild(port));

  // === EVENTOS ===

  // Arrastrar el contenedor (arrastra TODO el grupo)
  content.addEventListener('mousedown', (e) => startDragContainer(e, container, content, redrawCallback));

  // Cambiar ícono con doble clic
  content.addEventListener('dblclick', (e) => changeIconContent(e, content, x, y));

  // Conectar haciendo clic en los puertos
  ports.forEach(port => {
    port.addEventListener('click', (e) => handlePortClick(e, port, redrawCallback));
  });

  // Añadir al canvas
  canvas.appendChild(container);

  console.log(`[content-nodes.js] Contenedor creado: #${id} en (${x}, ${y})`);
  return container;
}

/**
 * Crea los 4 puertos (top, bottom, left, right)
 * @param {string} containerId - ID del contenedor padre
 * @returns {Array} - Array de elementos de puerto
 */
function createPorts(containerId) {
  const positions = ['top', 'bottom', 'left', 'right'];
  return positions.map(pos => {
    const port = document.createElement('div');
    port.className = `node-port node-port-${pos}`;
    port.dataset.port = pos;
    port.dataset.containerId = containerId;
    return port;
  });
}

/**
 * Inicia el arrastre del contenedor (arrastra TODO el grupo)
 */
function startDragContainer(e, container, content, redrawCallback) {
  e.preventDefault();
  e.stopPropagation();

  const initialLeft = parseFloat(container.style.left) || 0;
  const initialTop = parseFloat(container.style.top) || 0;
  const offsetX = e.clientX - initialLeft;
  const offsetY = e.clientY - initialTop;

  // Extraer ícono actual
  const icono = content.textContent.charAt(0);

  function drag(e) {
    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;

    container.style.left = newX + 'px';
    container.style.top = newY + 'px';

    // Actualizar texto del contenido
    content.textContent = `${icono} (X:${Math.round(newX)}, Y:${Math.round(newY)})`;

    if (typeof redrawCallback === 'function') {
      redrawCallback();
    }
  }

  function stopDrag() {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);

    // Aplicar límites (reutilizar lógica de nodos.js)
    const canvasRect = canvas.getBoundingClientRect();
    const maxX = canvasRect.width - 60; // Tamaño del contenido
    const maxY = canvasRect.height - 60;

    const currentX = parseFloat(container.style.left) || 0;
    const currentY = parseFloat(container.style.top) || 0;

    let correctedX = Math.max(0, Math.min(currentX, maxX));
    let correctedY = Math.max(0, Math.min(currentY, maxY));

    if (currentX !== correctedX || currentY !== correctedY) {
      container.style.transition = 'left 0.3s ease-out, top 0.3s ease-out';
      container.style.left = correctedX + 'px';
      container.style.top = correctedY + 'px';

      // Actualizar texto
      content.textContent = `${icono} (X:${Math.round(correctedX)}, Y:${Math.round(correctedY)})`;

      if (typeof redrawCallback === 'function') {
        redrawCallback();
      }

      setTimeout(() => {
        container.style.transition = '';
      }, 300);
    }
  }

  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
}

/**
 * Maneja clic en un puerto (para crear conexiones) — ✅ AHORA USA ":" COMO SEPARADOR
 */
function handlePortClick(e, port, redrawCallback) {
  e.stopPropagation();

  if (sourcePort === port) {
    // Cancelar selección
    sourcePort.style.background = '';
    sourcePort.style.border = '';
    sourcePort = null;
    return;
  }

  if (!sourcePort) {
    // Seleccionar como origen
    sourcePort = port;
    port.style.background = 'rgba(255, 85, 0, 0.5)'; // Feedback visual
    port.style.border = '1px solid #ff5500';
  } else {
    // Crear conexión entre puertos — ✅ USAR ":" COMO SEPARADOR
    const from = `${sourcePort.dataset.containerId}:${sourcePort.dataset.port}`;
    const to = `${port.dataset.containerId}:${port.dataset.port}`;

    // Guardar conexión si no existe
    if (!connections.some(c => c.from === from && c.to === to)) {
      connections.push({ from, to });
    }

    // Deseleccionar
    sourcePort.style.background = '';
    sourcePort.style.border = '';
    sourcePort = null;

    // Redibujar
    if (typeof redrawCallback === 'function') {
      redrawCallback();
    }
  }
}

/**
 * Cambia el ícono del contenido (similar a nodos.js)
 */
function changeIconContent(e, content, x, y) {
  const text = content.textContent;
  const coordsMatch = text.match(/\(X:(\d+),\s*Y:(\d+)\)$/);
  let currentX = x, currentY = y;
  if (coordsMatch) {
    currentX = parseInt(coordsMatch[1], 10);
    currentY = parseInt(coordsMatch[2], 10);
  }

  const currentIndex = iconos.indexOf(text.charAt(0));
  const nextIndex = (currentIndex + 1) % iconos.length;
  const nuevoIcono = iconos[nextIndex];

  content.textContent = `${nuevoIcono} (X:${Math.round(currentX)}, Y:${Math.round(currentY)})`;
}

// Exportar función principal
export { createContentNode };
