// apps/diagram/js/nodos.js - Versión corregida (solo cambios esenciales)

// Exportar funciones y variable connections 
export { addNode, initDiagram, connections };

// Variables globales para el diagrama de flujo
let nodeId = 0;
let selectedNode = null;
let sourceNode = null;
let connections = [];
const canvas = document.getElementById('canvas');
const connectionsLayer = document.getElementById('connections-layer');
const iconos = ["➕", "⚙️", "✅", "📥", "📤", "🔁", "⚠️", "🔍"];

// Función para añadir un nuevo nodo
function addNode(x = 100, y = 100, redrawCallback) {
  const node = document.createElement('div');
  node.className = 'node';
  node.id = 'node-' + nodeId++;
  node.style.left = x + 'px';
  node.style.top = y + 'px';
  node.style.zIndex = 2;

  // Guardar coordenadas en dataset (OCULTAS pero disponibles)
  node.dataset.x = x;
  node.dataset.y = y;
  node.dataset.z = 2;

  // Asignar ícono aleatorio
  const icono = iconos[Math.floor(Math.random() * iconos.length)];
  
  // Crear span para texto editable
  const textSpan = document.createElement('span');
  textSpan.className = 'node-text';
  textSpan.textContent = icono;
  textSpan.contentEditable = true;
  
  // Añadir al nodo
  node.appendChild(textSpan);

  // Ajustar tamaño inicial
  adjustNodeSize(node);

  // Eventos del nodo
  node.addEventListener('dblclick', changeIcon);
  node.addEventListener('mousedown', (e) => startDrag(e, redrawCallback));
  node.addEventListener('click', (e) => handleNodeClick(e, redrawCallback));
  
  // Evento para ajustar tamaño cuando el texto cambia
  textSpan.addEventListener('input', () => adjustNodeSize(node));
  textSpan.addEventListener('blur', () => adjustNodeSize(node));
  
  // Prevenir Enter en la edición de texto
  textSpan.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      textSpan.blur();
    }
  });

  canvas.appendChild(node);
  return node;
}

// Función para ajustar el tamaño del nodo según el contenido (NUEVA)
function adjustNodeSize(node) {
  const textSpan = node.querySelector('.node-text');
  if (!textSpan) return;
  
  // Medir el texto
  const text = textSpan.textContent || '➕';
  const fontSize = parseInt(window.getComputedStyle(textSpan).fontSize);
  const approxWidth = text.length * fontSize * 0.6 + 30; // Aproximación simple
  
  // Tamaño mínimo y máximo
  const minSize = 60;
  const maxSize = 200;
  const newSize = Math.max(minSize, Math.min(maxSize, approxWidth));
  
  // Aplicar nuevo tamaño manteniendo el centro
  const oldWidth = node.offsetWidth;
  const oldHeight = node.offsetHeight;
  const centerX = parseFloat(node.style.left) + oldWidth / 2;
  const centerY = parseFloat(node.style.top) + oldHeight / 2;
  
  node.style.width = newSize + 'px';
  node.style.height = newSize + 'px';
  node.style.left = (centerX - newSize / 2) + 'px';
  node.style.top = (centerY - newSize / 2) + 'px';
  
  // Actualizar coordenadas en dataset
  node.dataset.x = (centerX - newSize / 2);
  node.dataset.y = (centerY - newSize / 2);
}

// Función para actualizar el texto del nodo (MODIFICADA - sin coordenadas visibles)
function updateNodeText(node, icono, x, y, z) {
  const textSpan = node.querySelector('.node-text');
  if (textSpan) {
    // Solo actualizar si es un ícono (no texto personalizado)
    if (iconos.includes(textSpan.textContent)) {
      textSpan.textContent = icono;
    }
    adjustNodeSize(node);
  }
  
  // Actualizar coordenadas en dataset (OCULTAS)
  node.dataset.x = x;
  node.dataset.y = y;
  node.dataset.z = z;
}

// Función para cambiar el ícono de un nodo (MODIFICADA)
function changeIcon(e) {
  const node = e.currentTarget;
  const textSpan = node.querySelector('.node-text');
  if (!textSpan) return;
  
  const currentIndex = iconos.indexOf(textSpan.textContent);
  if (currentIndex === -1) return; // No cambiar si tiene texto personalizado
  
  const nextIndex = (currentIndex + 1) % iconos.length;
  const nuevoIcono = iconos[nextIndex];
  
  textSpan.textContent = nuevoIcono;
  adjustNodeSize(node);
}

// Las funciones handleNodeClick y startDrag permanecen EXACTAMENTE IGUALES
// (sin cambios para mantener compatibilidad)

function handleNodeClick(e, redrawCallback) {
  e.stopPropagation();
  const node = e.currentTarget;
  
  if (sourceNode === node) {
    sourceNode.classList.remove('selected');
    sourceNode = null;
    return;
  }
  
  if (!sourceNode) {
    sourceNode = node;
    node.classList.add('selected');
  } else {
    const from = sourceNode.id;
    const to = node.id;
    if (!connections.some(c => c.from === from && c.to === to)) {
      connections.push({ from, to });
      if (typeof redrawCallback === 'function') {
        redrawCallback();
      }
    }
    sourceNode.classList.remove('selected');
    sourceNode = null;
  }
}

function startDrag(e, redrawCallback) {
  if (e.target.tagName === 'BUTTON') return;
  e.preventDefault();
  
  selectedNode = e.currentTarget;
  const initialLeft = parseFloat(selectedNode.style.left) || 0;
  const initialTop = parseFloat(selectedNode.style.top) || 0;
  const offsetX = e.clientX - initialLeft;
  const offsetY = e.clientY - initialTop;

  const textSpan = selectedNode.querySelector('.node-text');
  const currentContent = textSpan ? textSpan.textContent : '';

  const canvasRect = canvas.getBoundingClientRect();
  const maxX = canvasRect.width - selectedNode.offsetWidth;
  const maxY = canvasRect.height - selectedNode.offsetHeight;

  function drag(e) {
    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;

    selectedNode.style.left = newX + 'px';
    selectedNode.style.top = newY + 'px';

    // Actualizar coordenadas en dataset
    selectedNode.dataset.x = newX;
    selectedNode.dataset.y = newY;

    if (typeof redrawCallback === 'function') {
      redrawCallback();
    }
  }

  function stopDrag() {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);

    const currentX = parseFloat(selectedNode.style.left) || 0;
    const currentY = parseFloat(selectedNode.style.top) || 0;
    let correctedX = Math.max(0, Math.min(currentX, maxX));
    let correctedY = Math.max(0, Math.min(currentY, maxY));

    if (currentX !== correctedX || currentY !== correctedY) {
      selectedNode.style.transition = 'left 0.3s ease-out, top 0.3s ease-out';
      selectedNode.style.left = correctedX + 'px';
      selectedNode.style.top = correctedY + 'px';

      // Actualizar coordenadas en dataset
      selectedNode.dataset.x = correctedX;
      selectedNode.dataset.y = correctedY;

      if (typeof redrawCallback === 'function') {
        redrawCallback();
      }

      setTimeout(() => {
        selectedNode.style.transition = '';
      }, 300);
    }
  }
  
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
}

// Inicializar el diagrama
function initDiagram(redrawCallback) {
  addNode(150, 150, redrawCallback);
  addNode(350, 150, redrawCallback);
  addNode(250, 300, redrawCallback);
  
  const createNodeBtn = document.getElementById('create-node-btn');
  if (createNodeBtn) {
    createNodeBtn.addEventListener('click', () => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.random() * (rect.width - 80);
      const y = Math.random() * (rect.height - 80);
      addNode(x, y, redrawCallback);
      if (typeof redrawCallback === 'function') {
        redrawCallback();
      }
    });
  }
  
  canvas.addEventListener('click', (e) => {
    if (e.target === canvas && sourceNode) {
      sourceNode.classList.remove('selected');
      sourceNode = null;
    }
  });
}
