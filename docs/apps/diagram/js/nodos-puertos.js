// nodos-puertos.js — Sistema de puertos anclados a contenedores

let portId = 0;
let selectedPort = null;
let sourcePort = null;

// Importamos connections desde nodos.js para compartir el mismo array
import { connections } from '../stable/nodos.js';

const canvas = document.getElementById('canvas');
const connectionsLayer = document.getElementById('connections-layer');

const positions = ['top', 'bottom', 'left', 'right'];

/**
 * Crea un nuevo contenedor con 4 puertos anclados
 * @param {number} x - Posición inicial X
 * @param {number} y - Posición inicial Y
 * @param {function} redrawCallback - Callback para redibujar conexiones
 * @returns {HTMLElement} - El contenedor principal
 */
export function createContainerWithPorts(x = 100, y = 100, redrawCallback) {
  // ID único para este contenedor
  const containerId = 'container-' + portId++;

  // Crear contenedor principal (arrastrable, con contenido visual)
  const container = document.createElement('div');
  container.className = 'content-container';
  container.id = containerId;
  container.style.position = 'absolute';
  container.style.left = x + 'px';
  container.style.top = y + 'px';
  container.style.width = '120px';
  container.style.height = '80px';
  container.style.background = 'white';
  container.style.border = '2px solid #0077cc';
  container.style.borderRadius = '8px';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.boxShadow = '0 3px 6px rgba(0,0,0,0.1)';
  container.style.zIndex = 1;
  container.textContent = `Contenido ${containerId}`;
  container.style.cursor = 'move';
  container.style.fontSize = '12px';
  container.style.fontWeight = 'bold';

  // Crear puertos (no arrastrables, anclados a los bordes)
  const ports = [];
  positions.forEach(pos => {
    const port = document.createElement('div');
    port.className = 'port';
    port.dataset.port = pos;
    port.dataset.containerId = containerId;
    port.id = `${containerId}-${pos}`; // ID único para conexiones

    // Posicionar puerto inicialmente
    positionPort(port, pos, container);

    // Evento de conexión (clic para conectar)
    port.addEventListener('click', (e) => handlePortClick(e, port, redrawCallback));

    // ✅ AÑADIDO PARA DEPURACIÓN: borde rojo y fondo semitransparente
    port.style.border = '1px solid red';
    port.style.background = 'rgba(255, 0, 0, 0.2)';

    // Añadir puerto al canvas
    canvas.appendChild(port);
    ports.push(port);

    console.log(`[createContainerWithPorts] Puerto creado: ${port.id} en posición ${pos}`);
  });

  // Arrastrar contenedor (mueve todos los puertos con él)
  container.addEventListener('mousedown', (e) => startDragContainer(e, container, ports, redrawCallback));

  // Añadir contenedor al canvas
  canvas.appendChild(container);

  console.log(`[nodos-puertos.js] Contenedor creado: ${containerId} con ${ports.length} puertos`);

  return container;
}

/**
 * Posiciona un puerto en el borde del contenedor
 * @param {HTMLElement} port - Elemento del puerto
 * @param {string} position - 'top', 'bottom', 'left', 'right'
 * @param {HTMLElement} container - Contenedor al que está anclado
 */
function positionPort(port, position, container) {
  const containerLeft = parseFloat(container.style.left) || 0;
  const containerTop = parseFloat(container.style.top) || 0;
  const containerWidth = parseFloat(container.style.width) || 120;
  const containerHeight = parseFloat(container.style.height) || 80;

  let left, top;

  switch (position) {
    case 'top':
      left = containerLeft + containerWidth / 2 - 15;
      top = containerTop - 15;
      break;
    case 'bottom':
      left = containerLeft + containerWidth / 2 - 15;
      top = containerTop + containerHeight - 15;
      break;
    case 'left':
      left = containerLeft - 15;
      top = containerTop + containerHeight / 2 - 15;
      break;
    case 'right':
      left = containerLeft + containerWidth - 15;
      top = containerTop + containerHeight / 2 - 15;
      break;
    default:
      left = containerLeft;
      top = containerTop;
  }

  // Aplicar estilos
  port.style.left = left + 'px';
  port.style.top = top + 'px';

  // ✅ DEPURACIÓN: loguear posición calculada
  console.log(`[positionPort] Puerto ${port.id}: left=${left}px, top=${top}px`);
}

/**
 * Maneja clic en un puerto (para crear conexiones)
 * @param {Event} e - Evento de clic
 * @param {HTMLElement} port - Puerto clicado
 * @param {Function} redrawCallback - Callback para redibujar conexiones
 */
function handlePortClick(e, port, redrawCallback) {
  e.stopPropagation();

  if (sourcePort === port) {
    // Cancelar selección
    sourcePort.classList.remove('selected');
    sourcePort = null;
    return;
  }

  if (!sourcePort) {
    // Seleccionar como origen
    sourcePort = port;
    port.classList.add('selected');
    console.log(`[handlePortClick] Puerto seleccionado: ${port.id}`);
  } else {
    // Crear conexión
    const from = sourcePort.id;
    const to = port.id;

    if (!connections.some(c => c.from === from && c.to === to)) {
      connections.push({ from, to });
      console.log(`[handlePortClick] Conexión creada: ${from} → ${to}`);
      if (typeof redrawCallback === 'function') {
        redrawCallback();
      }
    }

    // Deseleccionar
    sourcePort.classList.remove('selected');
    sourcePort = null;
  }
}

/**
 * Inicia el arrastre del contenedor (arrastra TODO el grupo)
 * @param {Event} e - Evento de mousedown
 * @param {HTMLElement} container - Contenedor a arrastrar
 * @param {Array} ports - Array de puertos anclados
 * @param {Function} redrawCallback - Callback para redibujar conexiones
 */
function startDragContainer(e, container, ports, redrawCallback) {
  e.preventDefault();

  const initialLeft = parseFloat(container.style.left) || 0;
  const initialTop = parseFloat(container.style.top) || 0;
  const offsetX = e.clientX - initialLeft;
  const offsetY = e.clientY - initialTop;

  function drag(e) {
    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;

    // Mover contenedor
    container.style.left = newX + 'px';
    container.style.top = newY + 'px';

    // Reposicionar todos los puertos
    ports.forEach(port => {
      positionPort(port, port.dataset.port, container);
    });

    // Redibujar conexiones
    if (typeof redrawCallback === 'function') {
      redrawCallback();
    }
  }

  function stopDrag() {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);

    // Aplicar límites (opcional, puedes ajustar según necesites)
    const canvasRect = canvas.getBoundingClientRect();
    const maxX = canvasRect.width - 120; // Ancho del contenedor
    const maxY = canvasRect.height - 80; // Alto del contenedor

    const currentX = parseFloat(container.style.left) || 0;
    const currentY = parseFloat(container.style.top) || 0;

    let correctedX = Math.max(0, Math.min(currentX, maxX));
    let correctedY = Math.max(0, Math.min(currentY, maxY));

    if (currentX !== correctedX || currentY !== correctedY) {
      container.style.transition = 'left 0.3s ease-out, top 0.3s ease-out';
      container.style.left = correctedX + 'px';
      container.style.top = correctedY + 'px';

      // Reposicionar puertos
      ports.forEach(port => {
        positionPort(port, port.dataset.port, container);
      });

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
