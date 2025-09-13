/*
https://github.com/mizulegendsstudios/mizu-board/blob/main/docs/apps/diagram/js/nodos.js
*/
// Exportar funciones y variable connections — ✅ SOLO AQUÍ, UNA VEZ
export { addNode, initDiagram, connections };

// Variables globales para el diagrama de flujo
let nodeId = 0;
let selectedNode = null;
let sourceNode = null;
let connections = []; // ✅ Sin export aquí — se exporta al final
const canvas = document.getElementById('canvas');
const connectionsLayer = document.getElementById('connections-layer'); // Capa para DIVs
const iconos = ["➕", "⚙️", "✅", "📥", "📤", "🔁", "⚠️", "🔍"];

// Función para añadir un nuevo nodo
function addNode(x = 100, y = 100, text = "Nuevo nodo", redrawCallback) {
  const node = document.createElement('div');
  node.className = 'node';
  node.id = 'node-' + nodeId++;
  
  // Almacenar coordenadas en dataset (ocultas para uso futuro)
  node.dataset.x = x;
  node.dataset.y = y;
  node.dataset.z = 2;
  
  // Crear ícono
  const iconElement = document.createElement('div');
  iconElement.className = 'node-icon';
  const iconoChar = iconos[Math.floor(Math.random() * iconos.length)];
  iconElement.textContent = iconoChar;
  
  // Crear área de texto editable
  const textElement = document.createElement('div');
  textElement.className = 'node-text';
  textElement.textContent = text;
  textElement.contentEditable = false; // Inicialmente no editable
  
  // Estructura del nodo
  node.appendChild(iconElement);
  node.appendChild(textElement);
  
  // Posicionar el nodo
  node.style.left = x + 'px';
  node.style.top = y + 'px';
  node.style.zIndex = 2;
  
  // Eventos del nodo
  node.addEventListener('dblclick', changeIcon);
  node.addEventListener('mousedown', (e) => startDrag(e, redrawCallback));
  node.addEventListener('click', (e) => handleNodeClick(e, redrawCallback));
  
  canvas.appendChild(node);
  
  // Ajustar tamaño inicial según el texto
  adjustNodeSize(node);
  
  return node;
}

// Función para ajustar el tamaño del nodo según su contenido
function adjustNodeSize(node) {
  const textElement = node.querySelector('.node-text');
  const iconElement = node.querySelector('.node-icon');
  
  if (!textElement) return;
  
  // Medir el contenido del texto
  const textWidth = textElement.scrollWidth;
  const textHeight = textElement.scrollHeight;
  
  // Calcular tamaño mínimo y tamaño según contenido
  const minSize = 60; // Tamaño mínimo del nodo
  const padding = 20; // Padding interno
  
  const contentWidth = Math.max(textWidth, iconElement ? iconElement.offsetWidth : 0);
  const contentHeight = (iconElement ? iconElement.offsetHeight : 0) + textHeight;
  
  // Calcular tamaño final (mínimo o según contenido)
  const finalWidth = Math.max(minSize, contentWidth + padding);
  const finalHeight = Math.max(minSize, contentHeight + padding);
  
  // Aplicar tamaño al nodo
  node.style.width = finalWidth + 'px';
  node.style.height = finalHeight + 'px';
  
  // Centrar el contenido dentro del nodo
  textElement.style.width = '100%';
  textElement.style.height = 'auto';
  textElement.style.display = 'flex';
  textElement.style.alignItems = 'center';
  textElement.style.justifyContent = 'center';
  
  if (iconElement) {
    iconElement.style.position = 'absolute';
    iconElement.style.top = '5px';
    iconElement.style.left = '50%';
    iconElement.style.transform = 'translateX(-50%)';
  }
}

// Función para cambiar el ícono y habilitar la edición de texto
function changeIcon(e) {
  e.stopPropagation();
  const node = e.currentTarget;
  const iconElement = node.querySelector('.node-icon');
  const textElement = node.querySelector('.node-text');
  
  if (!iconElement || !textElement) return;
  
  // Cambiar ícono
  const currentIndex = iconos.indexOf(iconElement.textContent);
  const nextIndex = (currentIndex + 1) % iconos.length;
  iconElement.textContent = iconos[nextIndex];
  
  // Habilitar edición de texto
  enableTextEdit(textElement);
}

// Función para habilitar la edición de texto
function enableTextEdit(textElement) {
  textElement.contentEditable = true;
  textElement.focus();
  
  // Seleccionar todo el texto
  const range = document.createRange();
  range.selectNodeContents(textElement);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  // Eventos para finalizar la edición
  const finishEdit = () => {
    textElement.contentEditable = false;
    // Actualizar el tamaño del nodo
    adjustNodeSize(textElement.parentElement);
    // Remover eventos
    textElement.removeEventListener('blur', finishEdit);
    textElement.removeEventListener('keydown', handleKeyDown);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finishEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      // Cancelar edición (revertir cambios)
      textElement.contentEditable = false;
      textElement.removeEventListener('blur', finishEdit);
      textElement.removeEventListener('keydown', handleKeyDown);
    }
  };
  
  textElement.addEventListener('blur', finishEdit);
  textElement.addEventListener('keydown', handleKeyDown);
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

// Función para iniciar el arrastre de un nodo
function startDrag(e, redrawCallback) {
  // Si está editando texto, no arrastrar
  if (e.target.classList.contains('node-text') && e.target.contentEditable === 'true') {
    return;
  }
  
  if (e.target.tagName === 'BUTTON') return;
  e.preventDefault();
  
  selectedNode = e.currentTarget;
  const initialLeft = parseFloat(selectedNode.style.left) || 0;
  const initialTop = parseFloat(selectedNode.style.top) || 0;
  const offsetX = e.clientX - initialLeft;
  const offsetY = e.clientY - initialTop;
  
  function drag(e) {
    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;
    
    // Aplicar nueva posición
    selectedNode.style.left = newX + 'px';
    selectedNode.style.top = newY + 'px';
    
    // Actualizar coordenadas en dataset (ocultas)
    selectedNode.dataset.x = newX;
    selectedNode.dataset.y = newY;
    
    // Redibujar conexiones
    if (typeof redrawCallback === 'function') {
      redrawCallback();
    }
  }
  
  function stopDrag() {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
    
    // Verificar posición final
    const canvasRect = canvas.getBoundingClientRect();
    const maxX = canvasRect.width - selectedNode.offsetWidth;
    const maxY = canvasRect.height - selectedNode.offsetHeight;
    
    let correctedX = parseFloat(selectedNode.style.left) || 0;
    let correctedY = parseFloat(selectedNode.style.top) || 0;
    
    // Calcular posición corregida
    correctedX = Math.max(0, Math.min(correctedX, maxX));
    correctedY = Math.max(0, Math.min(correctedY, maxY));
    
    // Si está fuera de límites, corregir suavemente
    if (correctedX !== parseFloat(selectedNode.style.left) || correctedY !== parseFloat(selectedNode.style.top)) {
      selectedNode.style.transition = 'left 0.3s ease-out, top 0.3s ease-out';
      
      selectedNode.style.left = correctedX + 'px';
      selectedNode.style.top = correctedY + 'px';
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
  // Añadir algunos nodos iniciales con texto predeterminado
  addNode(150, 150, "Inicio", redrawCallback);
  addNode(350, 150, "Proceso", redrawCallback);
  addNode(250, 300, "Fin", redrawCallback);
  
  // Configurar el botón para añadir nodos
  const createNodeBtn = document.getElementById('create-node-btn');
  if (createNodeBtn) {
    createNodeBtn.addEventListener('click', () => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.random() * (rect.width - 80);
      const y = Math.random() * (rect.height - 80);
      addNode(x, y, "Nuevo nodo", redrawCallback);
      
      if (typeof redrawCallback === 'function') {
        redrawCallback();
      }
    });
  }
  
  // Deseleccionar si se hace clic en el canvas
  canvas.addEventListener('click', (e) => {
    if (e.target === canvas && sourceNode) {
      sourceNode.classList.remove('selected');
      sourceNode = null;
    }
  });
}
