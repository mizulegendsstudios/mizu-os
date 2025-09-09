// nodos-puertos.js — Sistema de puertos anclados a contenedores

let portId = 0;
let selectedPort = null;
let sourcePort = null;
let connections = []; // Compartido con el sistema actual

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
function createContainerWithPorts(x = 100, y = 100, redrawCallback) {
  // Crear contenedor principal (arrastrable)
  const container = document.createElement('div');
  container.className = 'content-container';
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
  container.textContent = 'Contenido';
  container.style.cursor = 'move';

  // Crear puertos (no arrastrables, anclados a los bordes)
  const ports = [];
  positions.forEach(pos => {
    const port = document.createElement('div');
    port.className = 'port';
    port.dataset.port = pos;
    port.dataset.containerId = container.id = 'container-' + portId;

    // Posicionar puerto
    positionPort(port, pos, container);

    // Evento de conexión
    port.addEventListener('click', (e) => handlePortClick(e, port, redrawCallback));

    ports.push(port);
    canvas.appendChild(port);
  });

  // Arrastrar contenedor (mueve todos los puertos con él)
  container.addEventListener('mousedown', (e) => startDragContainer(e, container, ports, redrawCallback));

  canvas.appendChild(container);

  portId++;

  return container;
}

/**
 * Posiciona un puerto en el borde del contenedor
 */
function positionPort(port, position, container) {
  const containerRect = container.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();

  const containerLeft = parseFloat(container.style.left) || 0;
  const containerTop = parseFloat(container.style.top) || 0;

  switch (position) {
    case 'top':
      port.style.left = containerLeft + container.offsetWidth / 2 - 15 + 'px';
      port.style.top = containerTop - 15 + 'px';
      break;
    case 'bottom':
      port.style.left = containerLeft + container.offsetWidth / 2 - 15 + 'px';
      port.style.top = containerTop + container.offsetHeight - 15 + 'px';
      break;
    case 'left':
      port.style.left = containerLeft - 15 + 'px';
      port.style.top = containerTop + container.offsetHeight / 2 - 15 + 'px';
      break;
    case 'right':
      port.style.left = containerLeft + container.offsetWidth - 15 + 'px';
      port.style.top = containerTop + container.offsetHeight / 2 - 15 + 'px';
      break;
  }
}

/**
 * Maneja clic en un puerto (para crear conexiones)
 */
function handlePortClick(e, port, redrawCallback) {
  e.stopPropagation();

  if (sourcePort === port) {
    sourcePort.classList.remove('selected');
    sourcePort = null;
    return;
  }

  if (!sourcePort) {
    sourcePort = port;
    port.classList.add('selected');
  } else {
    const from = sourcePort.id || sourcePort.dataset.containerId + '-' + sourcePort.dataset.port;
    const to = port.id || port.dataset.containerId + '-' + port.dataset.port;

    if (!connections.some(c => c.from === from && c.to === to)) {
      connections.push({ from, to });
      redrawCallback();
    }

    sourcePort.classList.remove('selected');
    sourcePort = null;
  }
}

/**
 * Inicia el arrastre del contenedor (arrastra TODO el grupo)
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

    container.style.left = newX + 'px';
    container.style.top = newY + 'px';

    // Reposicionar puertos
    ports.forEach(port => {
      positionPort(port, port.dataset.port, container);
    });

    redrawCallback();
  }

  function stopDrag() {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);

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

      redrawCallback();

      setTimeout(() => {
        container.style.transition = '';
      }, 300);
    }
  }

  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
}

// Exportar función principal
export { createContainerWithPorts };
