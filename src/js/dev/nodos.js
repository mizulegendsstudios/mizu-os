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

// Función para dibujar las líneas de conexión (CON DIVS, SIN SVG)
function drawLines() {
  connectionsLayer.innerHTML = '';

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

    // Ajustar longitud: restar el radio del nodo destino (30px)
    const adjustedLength = length - 30; // Radio del nodo ~30px
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

    // No rotar: el triángulo ya apunta hacia abajo
    arrow.style.transform = 'rotate(90deg)';

    // Agrupar línea + punta
    line.appendChild(arrow);

    // Evento para eliminar conexión con clic derecho
    line.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      connections = connections.filter(c => !(c.from === conn.from && c.to === conn.to));
      drawLines();
    });

    // Añadir al DOM
    connectionsLayer.appendChild(line);
  });
}

// Función para iniciar el arrastre de un nodo (CORREGIDA: sin saltos)
function startDrag(e) {
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
