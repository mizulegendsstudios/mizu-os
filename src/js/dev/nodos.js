// Variables globales para el diagrama de flujo
let nodeId = 0;
let selectedNode = null;
let sourceNode = null;
let connections = []; // [{from: id, to: id}]
const canvas = document.getElementById('canvas');
const connectionsLayer = document.getElementById('connections-layer'); // Capa para DIVs
const iconos = ["➕", "⚙️", "✅", "📥", "📤", "🔁", "⚠️", "🔍"];

// Función para añadir un nuevo nodo
function addNode(x = 100, y = 100) {
  const node = document.createElement('div');
  node.className = 'node';
  node.id = 'node-' + nodeId++;
  node.style.left = x + 'px';
  node.style.top = y + 'px';
  node.style.zIndex = 2;

  // Asignar ícono aleatorio
  const icono = iconos[Math.floor(Math.random() * iconos.length)];
  
  // Establecer contenido inicial con coordenadas
  updateNodeText(node, icono, x, y, 2);

  // Eventos del nodo
  node.addEventListener('dblclick', changeIcon);
  node.addEventListener('mousedown', startDrag);
  node.addEventListener('click', handleNodeClick);
  
  canvas.appendChild(node);
  return node;
}

// Función para actualizar el texto del nodo (ícono + coordenadas)
function updateNodeText(node, icono, x, y, z) {
  node.textContent = `${icono} (X:${Math.round(x)}, Y:${Math.round(y)}, Z:${z})`;
}

// Función para cambiar el ícono de un nodo
function changeIcon(e) {
  const node = e.currentTarget;
  // Extraer coordenadas actuales del texto
  const text = node.textContent;
  const coordsMatch = text.match(/\(X:(\d+),\s*Y:(\d+),\s*Z:(\d+)\)$/);
  let x = 0, y = 0, z = 2;
  if (coordsMatch) {
    x = parseInt(coordsMatch[1], 10);
    y = parseInt(coordsMatch[2], 10);
    z = parseInt(coordsMatch[3], 10);
  }

  // Cambiar ícono
  const currentIndex = iconos.indexOf(text.charAt(0));
  const nextIndex = (currentIndex + 1) % iconos.length;
  const nuevoIcono = iconos[nextIndex];

  // Actualizar texto con nuevo ícono y mismas coordenadas
  updateNodeText(node, nuevoIcono, x, y, z);
}

// Función para manejar el clic en un nodo
function handleNodeClick(e, redrawCallback) {
  e.stopPropagation();
  const node = e.currentTarget;
  
  if (sourceNode === node) {
    // Cancelar selección
    sourceNode.classList.remove('selected');
    sourceNode = null;
    return;
  }
  
  if (!sourceNode) {
    // Seleccionar como origen
    sourceNode = node;
    node.classList.add('selected');
  } else {
    // Crear conexión
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

// Función para iniciar el arrastre de un nodo (CORREGIDA: sin saltos)
function startDrag(e, redrawCallback) {
  if (e.target.tagName === 'BUTTON') return;
  e.preventDefault();
  
  selectedNode = e.currentTarget;

  // Obtener posición inicial del nodo (como número, sin 'px')
  const initialLeft = parseFloat(selectedNode.style.left) || 0;
  const initialTop = parseFloat(selectedNode.style.top) || 0;

  // Calcular el offset del clic DENTRO del nodo
  const offsetX = e.clientX - initialLeft;
  const offsetY = e.clientY - initialTop;

  // Extraer ícono actual
  const text = selectedNode.textContent;
  const icono = text.charAt(0);

  function drag(e) {
    // Nueva posición = posición del mouse - offset interno
    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;

    // Aplicar nueva posición
    selectedNode.style.left = newX + 'px';
    selectedNode.style.top = newY + 'px';

    // Obtener zIndex actual
    const currentZIndex = window.getComputedStyle(selectedNode).zIndex || 2;

    // Actualizar texto con nuevas coordenadas
    updateNodeText(selectedNode, icono, newX, newY, currentZIndex);

    // Redibujar conexiones
    if (typeof redrawCallback === 'function') {
      redrawCallback();
    }
  }
  
  function stopDrag() {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
  }
  
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
}

// Inicializar el diagrama — ahora acepta redrawCallback
function initDiagram(redrawCallback) {
  // Añadir algunos nodos iniciales
  addNode(150, 150);
  addNode(350, 150);
  addNode(250, 300);
  
  // Configurar el botón para añadir nodos
  const createNodeBtn = document.getElementById('create-node-btn');
  if (createNodeBtn) {
    createNodeBtn.addEventListener('click', () => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.random() * (rect.width - 80);
      const y = Math.random() * (rect.height - 80);
      addNode(x, y);
      if (typeof redrawCallback === 'function') {
        redrawCallback();
      }
    });
  }
  
  // Desseleccionar si se hace clic en el canvas
  canvas.addEventListener('click', (e) => {
    if (e.target === canvas && sourceNode) {
      sourceNode.classList.remove('selected');
      sourceNode = null;
    }
  });

  // Asignar redrawCallback a los eventos que lo necesitan
  // Reasignamos los listeners de los nodos existentes
  document.querySelectorAll('.node').forEach(node => {
    // Reemplazar listeners para inyectar redrawCallback
    node.replaceWith(node.cloneNode(true)); // Truco simple para limpiar listeners anteriores
    const newNode = document.getElementById(node.id);
    newNode.addEventListener('dblclick', changeIcon);
    newNode.addEventListener('mousedown', (e) => startDrag(e, redrawCallback));
    newNode.addEventListener('click', (e) => handleNodeClick(e, redrawCallback));
  });

  // También asignar redrawCallback al evento de eliminar conexión
  // (esto se hace dentro de drawLines, pero como drawLines lo llama redrawCallback, está cubierto)
}

// Exportar funciones para uso en otros módulos
export { addNode, initDiagram };
