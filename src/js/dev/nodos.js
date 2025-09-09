let nodeId = 0;
let selectedNode = null;
let sourceNode = null;
let connections = []; // [{from: id, to: id}]
const canvas = document.getElementById('canvas');
const svg = document.getElementById('svg');
const iconos = ["➕", "⚙️", "✅", "📥", "📤", "🔁", "⚠️", "🔍"];

function addNode(x = 100, y = 100) {
  const node = document.createElement('div');
  node.className = 'node';
  node.id = 'node-' + nodeId++;
  node.style.left = x + 'px';
  node.style.top = y + 'px';
  // Asignar ícono aleatorio
  const icono = iconos[Math.floor(Math.random() * iconos.length)];
  node.textContent = icono;
  // Doble clic para cambiar ícono
  node.addEventListener('dblclick', () => {
    const currentIndex = iconos.indexOf(node.textContent);
    const nextIndex = (currentIndex + 1) % iconos.length;
    node.textContent = iconos[nextIndex];
  });
  node.addEventListener('mousedown', startDrag);
  node.addEventListener('click', handleNodeClick);
  canvas.appendChild(node);
  return node;
}

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

function drawLines() {
  svg.innerHTML = `
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" 
              refX="10" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
      </marker>
    </defs>
  `;
  
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

function startDrag(e) {
  if (e.target.tagName === 'BUTTON') return;
  e.preventDefault(); // Evita selección de texto
  
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

// Inicializar con algunos nodos
addNode(150, 150);
addNode(350, 150);
addNode(250, 300);

// Desseleccionar si se hace clic en el canvas
canvas.addEventListener('click', (e) => {
  if (e.target === canvas && sourceNode) {
    sourceNode.classList.remove('selected');
    sourceNode = null;
  }
});
