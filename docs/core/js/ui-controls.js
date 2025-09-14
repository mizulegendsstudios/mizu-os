// core/js/ui-controls.js - Módulo para controles de UI
import { SystemConfig } from "./config.js";

// Crear botón para visualizar diagrama en la barra lateral
export function createDiagramButton() {
    const blueBar = document.getElementById('blue-bar');
    if (!blueBar) {
        console.warn('Blue bar not found. Cannot create diagram button.');
        return;
    }
    
    // Crear botón de diagrama (icono de diagrama)
    const diagramButton = document.createElement('button');
    diagramButton.className = 'node-btn diagram-btn';
    diagramButton.innerHTML = '📊';
    diagramButton.title = 'Visualizar Diagrama';
    
    // Evento para mostrar/ocultar diagrama
    diagramButton.addEventListener('click', () => {
        showDiagram();
    });
    
    // Agregar a la barra lateral (después del botón +)
    const createNodeBtn = document.getElementById('create-node-btn');
    if (createNodeBtn) {
        blueBar.insertBefore(diagramButton, createNodeBtn.nextSibling);
    } else {
        blueBar.appendChild(diagramButton);
    }
}

// Crear botón de configuración en la barra lateral
export function createConfigButton() {
    const blueBar = document.getElementById('blue-bar');
    if (!blueBar) {
        console.warn('Blue bar not found. Cannot create config button.');
        return;
    }
    
    // Crear botón de configuración (icono de engranaje)
    const configButton = document.createElement('button');
    configButton.className = 'node-btn config-btn';
    configButton.innerHTML = '⚙️';
    configButton.title = 'Configuración Visual';
    
    // Evento para abrir/cerrar panel de configuración
    configButton.addEventListener('click', () => {
        if (window.systemConfig) {
            window.systemConfig.toggleConfigPanel();
        } else {
            console.error('El sistema de configuración no está disponible');
        }
    });
    
    // Agregar a la barra lateral (antes del botón +)
    const createNodeBtn = document.getElementById('create-node-btn');
    if (createNodeBtn) {
        blueBar.insertBefore(configButton, createNodeBtn);
    } else {
        blueBar.appendChild(configButton);
    }
}

// Configurar evento del holograma para abrir configuración
export function setupHologramConfig() {
    const yellowSquare = document.getElementById('yellow-square');
    const hologram = document.getElementById('hologram');
    
    if (yellowSquare && hologram) {
        yellowSquare.addEventListener('click', (e) => {
            // Verificar si se hizo clic directamente en el holograma
            if (e.target === hologram || hologram.contains(e.target)) {
                if (window.systemConfig) {
                    window.systemConfig.toggleConfigPanel();
                } else {
                    console.error('El sistema de configuración no está disponible');
                }
            }
        });
        
        // Añadir cursor pointer para indicar que es clickable
        hologram.style.cursor = 'pointer';
        yellowSquare.style.cursor = 'pointer';
    }
}

// Función para mostrar el diagrama dentro de black-bar
export function showDiagram() {
    const blackContentWrapper = document.getElementById('black-content-wrapper');
    const configPanel = document.getElementById('config-panel');
    
    // Ocultar panel de configuración si está visible
    if (configPanel && configPanel.style.display !== 'none') {
        configPanel.style.display = 'none';
        if (window.systemConfig) {
            window.systemConfig.isVisible = false;
        }
    }
    
    // Mostrar el canvas del diagrama
    const canvas = document.getElementById('canvas');
    if (canvas) {
        canvas.style.display = 'block';
    }
    
    // Inicializar el diagrama si no está ya inicializado
    if (!window.diagramInitialized) {
        try {
            import('../../apps/diagram/js/drawlines.js').then(({ drawLines }) => {
                import('../../apps/diagram/js/nodos.js').then(({ initDiagram }) => {
                    initDiagram(drawLines);
                    window.diagramInitialized = true;
                });
            });
        } catch (error) {
            console.error('Error al inicializar el diagrama:', error);
            blackContentWrapper.innerHTML = '<div style="color: white; padding: 20px;">Error al cargar el diagrama</div>';
        }
    }
}
