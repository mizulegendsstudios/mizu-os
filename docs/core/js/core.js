/*
https://github.com/mizulegendsstudios/mizu-board/blob/main/docs/core/js/core.js  
    Archivo principal que orquesta la lógica de la aplicación.//
*/
console.log(`Cargando sistema...`);

// Importaciones y lógica que podrían fallar
import { initializeLoadingScreen } from "./loading.js";
import { initializeMonitor } from "./monitor_axis.js";
import { initializeBarHiding } from "./monitor_bars.js";
import { initializeStatusWidget } from "./status.js";
import { systemConfig } from "./config.js";
// DEV
console.log(`Cargando mejoras...`);
// import { initializeZoomAndPan } from "./zoom.js"; // Dejado comentado por compatibilidad con diagram
import { drawLines } from '../../apps/diagram/js/drawlines.js';
// Importamos initDiagram desde nodos.js (sistema de nodos tradicionales)
import { initDiagram } from '../../apps/diagram/js/nodos.js';
// Importamos createContainerWithPorts desde dev/nodos-puertos.js (nuevo sistema de puertos anclados)
import { createContainerWithPorts } from '../../apps/diagram/js/nodos-puertos.js';
// Importamos connections desde nodos.js para compatibilidad
import { connections } from '../../apps/diagram/js/nodos.js';

// DOM
console.log(`Iniciando sistema...`);
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Inicializa módulos estables
        initializeLoadingScreen();
        initializeMonitor();
        initializeBarHiding();
        initializeStatusWidget();
        // initializeZoomAndPan(); // Mantenido comentado por conflicto con nodos
        
        // Crear botón de configuración en la barra lateral
        createConfigButton();
        
        // Configurar evento del holograma para abrir configuración
        setupHologramConfig();
        
        // Crear botón para crear contenedores con puertos anclados
        createContainerWithPortsButton();
        
        // Inicializar el diagrama de nodos (desactivado por ahora)
        // initDiagram(drawLines);
        
        // Hacer visible el HTML después de cargar
        document.documentElement.style.visibility = 'visible';
        document.documentElement.style.opacity = '1';
        console.log('Aplicación inicializada — sistemas de nodos y puertos anclados listos.');
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
    }
});

// Crear botón de configuración en la barra lateral
function createConfigButton() {
    const blueBar = document.getElementById('blue-bar');
    if (!blueBar) {
        console.warn('Blue bar not found. Cannot create config button.');
        return;
    }

    // Crear botón de configuración (icono de engranaje)
    const configButton = document.createElement('button');
    configButton.className = 'node-btn config-btn';
    configButton.innerHTML = '⚙️';
    configButton.title = 'Configuración Visual del Sistema';
    configButton.style.cssText = `
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        z-index: 1000;
        transition: all 0.2s ease;
    `;

    // Evento para abrir/cerrar panel de configuración
    configButton.addEventListener('click', () => {
        systemConfig.toggleConfigPanel();
    });

    // Efecto hover
    configButton.addEventListener('mouseenter', () => {
        configButton.style.transform = 'translateX(-50%) scale(1.1)';
        configButton.style.background = 'rgba(255, 255, 255, 0.2)';
    });

    configButton.addEventListener('mouseleave', () => {
        configButton.style.transform = 'translateX(-50%) scale(1)';
        configButton.style.background = 'rgba(255, 255, 255, 0.1)';
    });

    blueBar.appendChild(configButton);
}

// Configurar evento del holograma para abrir configuración
function setupHologramConfig() {
    const yellowSquare = document.getElementById('yellow-square');
    const hologram = document.getElementById('hologram');
    
    if (yellowSquare && hologram) {
        yellowSquare.addEventListener('click', (e) => {
            // Verificar si se hizo clic directamente en el holograma
            if (e.target === hologram || hologram.contains(e.target)) {
                systemConfig.toggleConfigPanel();
            }
        });
        
        // Añadir cursor pointer para indicar que es clickable
        hologram.style.cursor = 'pointer';
        yellowSquare.style.cursor = 'pointer';
        
        // Efecto hover en el holograma
        hologram.addEventListener('mouseenter', () => {
            hologram.style.transform = 'scale(1.05)';
        });
        
        hologram.addEventListener('mouseleave', () => {
            hologram.style.transform = 'scale(1)';
        });
    }
}

// Crear botón para crear contenedores con puertos anclados
function createContainerWithPortsButton() {
    const blueBar = document.getElementById('blue-bar');
    if (!blueBar) {
        console.warn('Blue bar not found. Cannot create container button.');
        return;
    }

    // Crear botón para crear contenedores (icono "P" de puertos)
    const containerButton = document.createElement('button');
    containerButton.className = 'node-btn';
    containerButton.innerHTML = '<span class="plus-icon">P</span>';
    containerButton.title = 'Crear Contenedor con Puertos Anclados';
    containerButton.style.marginTop = '0.5rem';
    containerButton.style.cssText = `
        position: absolute;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
    `;

    // Insertar después del botón de nodo tradicional
    const createNodeBtn = document.getElementById('create-node-btn');
    if (createNodeBtn && createNodeBtn.parentNode) {
        createNodeBtn.parentNode.insertBefore(containerButton, createNodeBtn.nextSibling);
    } else {
        blueBar.appendChild(containerButton);
    }

    // Evento para crear contenedores con puertos
    containerButton.addEventListener('click', () => {
        const canvas = document.getElementById('canvas'); // Asegúrate de que 'canvas' exista en tu HTML
        const rect = canvas.getBoundingClientRect();
        const x = Math.random() * (rect.width - 150);
        const y = Math.random() * (rect.height - 150);
        
        // createContainerWithPorts(x, y, drawLines); // Descomenta esta línea cuando esté listo para usar
        console.log('Creando contenedor con puertos en posición:', x, y);
        
        // Mostrar notificación
        systemConfig.showNotification('Función de contenedores con puertos en desarrollo');
    });

    // Efecto hover
    containerButton.addEventListener('mouseenter', () => {
        containerButton.style.transform = 'translateX(-50%) scale(1.1)';
    });

    containerButton.addEventListener('mouseleave', () => {
        containerButton.style.transform = 'translateX(-50%) scale(1)';
    });
}

// Función para inicializar el diagrama de nodos tradicionales (mantenida para compatibilidad)
function initDiagramIfEnabled() {
    const createNodeBtn = document.getElementById('create-node-btn');
    if (createNodeBtn) {
        createNodeBtn.addEventListener('click', () => {
            const rect = canvas.getBoundingClientRect();
            const x = Math.random() * (rect.width - 80);
            const y = Math.random() * (rect.height - 80);
            addNode(x, y, "Nuevo nodo", drawLines);
            
            if (typeof drawLines === 'function') {
                drawLines();
            }
        });
    }
    
    // Deseleccionar si se hace clic en el canvas
    const canvas = document.getElementById('canvas');
    if (canvas) {
        canvas.addEventListener('click', (e) => {
            if (e.target === canvas && sourceNode) {
                sourceNode.classList.remove('selected');
                sourceNode = null;
            }
        });
    }
}

// Función auxiliar para crear nodos (importada de nodos.js)
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
    
    const canvas = document.getElementById('canvas');
    if (canvas) {
        canvas.appendChild(node);
    }
    
    // Ajustar tamaño inicial según el texto
    adjustNodeSize(node);
    
    return node;
}

// Variables y funciones auxiliares para nodos (mantenidas para compatibilidad)
let nodeId = 0;
let selectedNode = null;
let sourceNode = null;
const iconos = ["➕", "⚙️", "✅", "📥", "📤", "🔁", "⚠️", "🔍"];

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

function enableTextEdit(textElement) {
    // Guardar el texto original para poder revertir con Escape
    const originalText = textElement.textContent;
    
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
            // Insertar un salto de línea en lugar de crear un nuevo párrafo
            insertLineBreak(textElement);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            // Revertir al texto original
            textElement.textContent = originalText;
            finishEdit();
        }
    };
    
    textElement.addEventListener('blur', finishEdit);
    textElement.addEventListener('keydown', handleKeyDown);
}

function insertLineBreak(textElement) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const br = document.createElement('br');
        range.deleteContents();
        range.insertNode(br);
        
        // Mover el cursor después del salto de línea
        range.setStartAfter(br);
        range.setEndAfter(br);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

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
        const canvas = document.getElementById('canvas');
        if (!canvas) return;
        
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

// Variable global para el canvas
const canvas = document.getElementById('canvas');

// Inicializar diagrama si está habilitado (función desactivada por ahora)
// initDiagramIfEnabled();

console.log(`Mizu OS. Versión: ${window.MIZU_VERSION}`);
