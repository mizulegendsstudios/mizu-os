// apps/diagram/js/nodos.js - Sistema de nodos mejorado

// Exportar funciones y variable connections — ✅ SOLO AQUÍ, UNA VEZ
export { addNode, initDiagram, connections, updateNodeText };

// Variables globales para el diagrama de flujo
let nodeId = 0;
let selectedNode = null;
let sourceNode = null;
let connections = []; // ✅ Sin export aquí — se exporta al final
const canvas = document.getElementById('canvas');
const connectionsLayer = document.getElementById('connections-layer'); // Capa para DIVs
const iconos = ["➕", "⚙️", "✅", "📥", "📤", "🔁", "⚠️", "🔍"];

// Función para añadir un nuevo nodo — AHORA ACEPTA redrawCallback
function addNode(x = 100, y = 100, redrawCallback, initialText = "") {
  const node = document.createElement('div');
  node.className = 'node';
  node.id = 'node-' + nodeId++;
  node.style.left = x + 'px';
  node.style.top = y + 'px';
  node.style.zIndex = 2;
  node.dataset.x = x;
  node.dataset.y = y;
  node.dataset.z = 2;

  // Asignar ícono aleatorio si no hay texto inicial
  const icono = initialText ? "" : iconos[Math.floor(Math.random() * iconos.length)];
  
  // Crear contenedor interno para el contenido
  const contentContainer = document.createElement('div');
  contentContainer.className = 'node-content';
  
  // Crear span para el texto (editable)
  const textSpan = document.createElement('span');
  textSpan.className = 'node-text';
  textSpan.textContent = initialText || icono;
  textSpan.contentEditable = true;
  
  // Crear span para coordenadas (oculto por defecto)
  const coordsSpan = document.createElement('span');
  coordsSpan.className = 'node-coordinates';
  coordsSpan.style.display = 'none'; // Oculto inicialmente
  coordsSpan.textContent = `(X:${Math.round(x)}, Y:${Math.round(y)}, Z:2)`;
  
  // Añadir elementos al contenedor
  contentContainer.appendChild(textSpan);
  contentContainer.appendChild(coordsSpan);
  node.appendChild(contentContainer);

  // Ajustar tamaño inicial basado en contenido
  adjustNodeSize(node);

  // Eventos del nodo — PASAR redrawCallback
  node.addEventListener('dblclick', (e) => {
    if (e.target.classList.contains('node-text')) {
      // Si se hace doble clic en el texto, permitir edición
      e.target.focus();
    } else {
      // Si se hace doble clic en el nodo, cambiar ícono (solo si no hay texto)
      if (!textSpan.textContent || iconos.includes(textSpan.textContent)) {
        changeIcon(e);
      }
    }
  });
  
  node.addEventListener('mousedown', (e) => startDrag(e, redrawCallback));
  node.addEventListener('click', (e) => handleNodeClick(e, redrawCallback));
  
  // Evento para ajustar tamaño cuando el texto cambia
  textSpan.addEventListener('input', () => {
    adjustNodeSize(node);
    // Guardar texto en dataset para persistencia
    node.dataset.text = textSpan.textContent;
  });
  
  textSpan.addEventListener('blur', () => {
    // Cuando termina la edición, asegurar tamaño final
    adjustNodeSize(node);
  });
  
  // Prevenir Enter y Tab en la edición de texto
  textSpan.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      textSpan.blur();
    }
    if (e.key === 'Tab') {
      e.preventDefault();
    }
  });

  canvas.appendChild(node);
  return node;
}

// Función para ajustar el tamaño del nodo según el contenido
function adjustNodeSize(node) {
  const textSpan = node.querySelector('.node-text');
  const contentContainer = node.querySelector('.node-content');
  
  if (!textSpan || !contentContainer) return;
  
  // Medir el texto temporalmente para calcular el tamaño
  const tempSpan = document.createElement('span');
  tempSpan.style.position = 'absolute';
  tempSpan.style.visibility = 'hidden';
  tempSpan.style.whiteSpace = 'nowrap';
  tempSpan.style.font = window.getComputedStyle(textSpan).font;
  tempSpan.textContent = textSpan.textContent || '➕'; // Fallback a ícono si está vacío
  
  document.body.appendChild(tempSpan);
  const textWidth = tempSpan.offsetWidth + 20; // Padding adicional
  const textHeight = tempSpan.offsetHeight + 20;
  document.body.removeChild(tempSpan);
  
  // Tamaño mínimo y máximo
  const minSize = 60;
  const maxSize = 300;
  const newSize = Math.max(minSize, Math.min(maxSize, Math.max(textWidth, textHeight)));
  
  // Aplicar nuevo tamaño
  node.style.width = newSize + 'px';
  node.style.height = newSize + 'px';
  
  // Mantener forma circular
  node.style.borderRadius = '50%';
  
  // Ajustar posición para mantener el centro
  const currentLeft = parseFloat(node.style.left) || 0;
  const currentTop = parseFloat(node.style.top) || 0;
  const sizeChange = newSize - (parseFloat(node.style.width) || minSize);
  
  node.style.left = (currentLeft - sizeChange / 2) + 'px';
  node.style.top = (currentTop - sizeChange / 2) + 'px';
  
  // Actualizar coordenadas en dataset
  node.dataset.x = (currentLeft - sizeChange / 2);
  node.dataset.y = (currentTop - sizeChange / 2);
  
  // Ajustar tamaño de fuente proporcionalmente
  const baseFontSize = 14;
  const scaleFactor = newSize / minSize;
  textSpan.style.fontSize = (baseFontSize * Math.min(scaleFactor, 1.5)) + 'px';
  
  // Centrar contenido
  contentContainer.style.display = 'flex';
  contentContainer.style.alignItems = 'center';
  contentContainer.style.justifyContent = 'center';
  contentContainer.style.width = '100%';
  contentContainer.style.height = '100%';
  contentContainer.style.flexDirection = 'column';
}

// Función para actualizar el texto del nodo (ícono + coordenadas)
function updateNodeText(node, icono, x, y, z) {
  const textSpan = node.querySelector('.node-text');
  const coordsSpan = node.querySelector('.node-coordinates');
  
  if (textSpan && coordsSpan) {
    // Solo actualizar ícono si el texto actual es un ícono o está vacío
    const currentText = textSpan.textContent;
    if (!currentText || iconos.includes(currentText)) {
      textSpan.textContent = icono;
    }
    
    coordsSpan.textContent = `(X:${Math.round(x)}, Y:${Math.round(y)}, Z:${z})`;
    
    // Guardar coordenadas en dataset
    node.dataset.x = x;
    node.dataset.y = y;
    node.dataset.z = z;
    
    // Ajustar tamaño después de actualizar
    adjustNodeSize(node);
  }
}

// Función para cambiar el ícono de un nodo (solo si no tiene texto personalizado)
function changeIcon(e) {
  const node = e.currentTarget;
  const textSpan = node.querySelector('.node-text');
  
  if (!textSpan) return;
  
  // Solo cambiar ícono si el texto actual es un ícono o está vacío
  const currentText = textSpan.textContent;
  if (currentText && !iconos.includes(currentText)) {
    return; // No cambiar si tiene texto personalizado
  }
  
  const currentIndex = iconos.indexOf(currentText);
  const nextIndex = (currentIndex + 1) % iconos.length;
  const nuevoIcono = iconos[nextIndex];
  
  textSpan.textContent = nuevoIcono;
  adjustNodeSize(node);
}

// Función para manejar el clic en un nodo — AHORA RECIBE redrawCallback
function handleNodeClick(e, redrawCallback) {
  // Permitir clic en texto sin activar selección de conexión
  if (e.target.classList.contains('node-text')) {
    return;
  }
  
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
      // Redibujar conexiones
      if (typeof redrawCallback === 'function') {
        redrawCallback();
      }
    }
    sourceNode.classList.remove('selected');
    sourceNode = null;
  }
}

// Función para iniciar el arrastre de un nodo — AHORA CON LÍMITES Y CORRECCIÓN SUAVE
function startDrag(e, redrawCallback) {
  if (e.target.tagName === 'BUTTON' || e.target.classList.contains('node-text')) return;
  e.preventDefault();
  
  selectedNode = e.currentTarget;

  const initialLeft = parseFloat(selectedNode.style.left) || 0;
  const initialTop = parseFloat(selectedNode.style.top) || 0;

  const offsetX = e.clientX - initialLeft;
  const offsetY = e.clientY - initialTop;

  // Obtener el texto actual (puede ser ícono o texto personalizado)
  const textSpan = selectedNode.querySelector('.node-text');
  const currentContent = textSpan ? textSpan.textContent : '';

  // Obtener límites del canvas
  const canvasRect = canvas.getBoundingClientRect();
  const maxX = canvasRect.width - selectedNode.offsetWidth;
  const maxY = canvasRect.height - selectedNode.offsetHeight;

  function drag(e) {
    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;

    // Aplicar nueva posición (sin límites aún, para fluidez durante arrastre)
    selectedNode.style.left = newX + 'px';
    selectedNode.style.top = newY + 'px';

    // Actualizar coordenadas en dataset
    selectedNode.dataset.x = newX;
    selectedNode.dataset.y = newY;

    // Actualizar texto de coordenadas (aunque esté oculto)
    const coordsSpan = selectedNode.querySelector('.node-coordinates');
    if (coordsSpan) {
      coordsSpan.textContent = `(X:${Math.round(newX)}, Y:${Math.round(newY)}, Z:2)`;
    }

    // Redibujar conexiones
    if (typeof redrawCallback === 'function') {
      redrawCallback();
    }
  }

  function stopDrag() {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);

    // Verificar posición final
    const currentX = parseFloat(selectedNode.style.left) || 0;
    const currentY = parseFloat(selectedNode.style.top) || 0;

    // Calcular posición corregida
    let correctedX = Math.max(0, Math.min(currentX, maxX));
    let correctedY = Math.max(0, Math.min(currentY, maxY));

    // Si está fuera de límites, corregir suavemente
    if (currentX !== correctedX || currentY !== correctedY) {
      // Activar transición suave
      selectedNode.style.transition = 'left 0.3s ease-out, top 0.3s ease-out';
      
      // Aplicar corrección
      selectedNode.style.left = correctedX + 'px';
      selectedNode.style.top = correctedY + 'px';

      // Actualizar coordenadas en dataset
      selectedNode.dataset.x = correctedX;
      selectedNode.dataset.y = correctedY;

      // Actualizar texto de coordenadas
      const coordsSpan = selectedNode.querySelector('.node-coordinates');
      if (coordsSpan) {
        coordsSpan.textContent = `(X:${Math.round(correctedX)}, Y:${Math.round(correctedY)}, Z:2)`;
      }

      // Redibujar conexiones
      if (typeof redrawCallback === 'function') {
        redrawCallback();
      }

      // Desactivar transición después de la animación
      setTimeout(() => {
        selectedNode.style.transition = '';
      }, 300);
    }
  }
  
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
}

// Inicializar el diagrama — AHORA PASA redrawCallback a todos los nodos
function initDiagram(redrawCallback) {
  // Añadir algunos nodos iniciales — PASAR redrawCallback
  addNode(150, 150, redrawCallback, "Inicio");
  addNode(350, 150, redrawCallback, "Proceso");
  addNode(250, 300, redrawCallback, "Fin");
  
  // Configurar el botón para añadir nodos
  const createNodeBtn = document.getElementById('create-node-btn');
  if (createNodeBtn) {
    createNodeBtn.addEventListener('click', () => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.random() * (rect.width - 80);
      const y = Math.random() * (rect.height - 80);
      addNode(x, y, redrawCallback); // Nodo con ícono por defecto
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
}
