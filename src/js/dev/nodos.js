// Variables globales para el diagrama de flujo
let nodeId = 0;
let selectedNode = null;
let sourceNode = null;
let connections = []; // [{from: id, to: id}]
const canvas = document.getElementById('canvas');
const svg = document.getElementById('svg');
const iconos = ["➕", "⚙️", "✅", "📥", "📤", "🔁", "⚠️", "🔍"];

// Función para añadir un nuevo nodo
function addNode(x = 100, y = 100) {
  const node = document.createElement('div');
  node.className = 'node';
  node.id = 'node-' + nodeId++;
  node.style.left = x + 'px';
  node.style.top = y + 'px';
  node.style.zIndex = 2; // Valor inicial de zIndex, coincide con CSS

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
function handleNodeClick(e) {
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
      drawLines();
    }
    sourceNode.classList.remove('selected');
    sourceNode = null;
  }
}

// Función para dibujar las líneas de conexión (SVG - sin cambios por ahora)
function drawLines() {
  // Limpiar SVG pero mantener los defs
  const defs = svg.querySelector('defs');
  svg.innerHTML = '';
  if (defs) svg.appendChild(defs);
  
  connections.forEach(conn => {
    const n1 = document.getElementById(conn.from);
    const n2 = document.getElementById(conn.to);
    if (!n1 || !n2) return;
    
    const x1 = n1.offsetLeft + n1.offsetWidth / 2;
    const y1 = n1.offsetTop + n1.offsetHeight / 2;
    const x2 = n2.offsetLeft + n2.offsetWidth / 2;
    const y2 = n2.offsetTop + n2.offsetHeight / 2;
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    
    line.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      connections = connections.filter(c => !(c.from === conn.from && c.to === conn.to));
      drawLines();
    });
    
    svg.appendChild(line);
  });
}

// Función para iniciar el arrastre de un nodo
function startDrag(e) {
  if (e.target.tagName === 'BUTTON') return;
  e.preventDefault();
  
  selectedNode = e.currentTarget;
  const rect = selectedNode.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;

  // Extraer ícono actual antes de empezar a arrastrar
  const text = selectedNode.textContent;
  const icono = text.charAt(0);

  function drag(e) {
    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;
    selectedNode.style.left = newX + 'px';
    selectedNode.style.top = newY + 'px';

    // Obtener zIndex actual
    const currentZIndex = window.getComputedStyle(selectedNode).zIndex || 2;

    // Actualizar texto con nuevas coordenadas
    updateNodeText(selectedNode, icono, newX, newY, currentZIndex);

    drawLines();
  }
  
  function stopDrag() {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
  }
  
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
}

// Inicializar el diagrama
function initDiagram() {
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
    });
  }
  
  // Desseleccionar si se hace clic en el canvas
  canvas.addEventListener('click', (e) => {
    if (e.target === canvas && sourceNode) {
      sourceNode.classList.remove('selected');
      sourceNode = null;
    }
  });
}

// Exportar funciones para uso en otros módulos si es necesario
export { addNode, drawLines, initDiagram };
