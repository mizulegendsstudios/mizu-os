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
  
  // Asignar ícono aleatorio
  const icono = iconos[Math.floor(Math.random() * iconos.length)];
  node.textContent = icono;
  
  // Eventos del nodo
  node.addEventListener('dblclick', changeIcon);
  node.addEventListener('mousedown', startDrag);
  node.addEventListener('click', handleNodeClick);
  
  canvas.appendChild(node);
  return node;
}

// Función para cambiar el ícono de un nodo
function changeIcon(e) {
  const node = e.currentTarget;
  const currentIndex = iconos.indexOf(node.textContent);
  const nextIndex = (currentIndex + 1) % iconos.length;
  node.textContent = iconos[nextIndex];
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

// Función para dibujar las líneas de conexión
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
  
  function drag(e) {
    selectedNode.style.left = (e.clientX - offsetX) + 'px';
    selectedNode.style.top = (e.clientY - offsetY) + 'px';
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
