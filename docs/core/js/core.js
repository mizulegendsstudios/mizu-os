/*
    Archivo principal que orquesta la lógica de la aplicación.
    Mizu OS v2.10.20 — compatible, estable, extensible.
*/

// CORE SYSTEM
console.log(`Cargando sistema...`);
// Importaciones de módulos core
import { initializeLoadingScreen } from "./loading.js";
import { initializeBarHiding } from "./monitor_bars.js";
import { initializeMonitor } from "./monitor_axis.js";
// Importación del widget de estado del sistema
import { initializeStatusWidget } from "./status.js";

// APPS
console.log(`Cargando mejoras...`);
// Importación del sistema de configuración
import { SystemConfig } from "./config.js";
// Importaciones de diagramas
import { drawLines } from '../../apps/diagram/js/drawlines.js';
import { initDiagram } from '../../apps/diagram/js/nodos.js';
import { createContainerWithPorts } from '../../apps/diagram/js/nodos-puertos.js';



// DOM
console.log(`Iniciando sistema...`);
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Inicializa módulos principales
        initializeLoadingScreen();
        initializeMonitor();
        initializeBarHiding();
        // Inicializa el widget de estado del sistema (hora, batería, conexión, volumen
        initializeStatusWidget();  
        
        // Inicializa el sistema de configuración
        window.systemConfig = new SystemConfig();
        
        // Crear botones en la barra lateral
        createDiagramButton(); // Botón para visualizar diagrama
        createConfigButton();  // Botón de configuración
        
        // Configurar evento del holograma para abrir configuración
        setupHologramConfig();
        
        // Inicializa el diagrama de nodos tradicionales
        initDiagram(drawLines);
        console.log(`Activando las mejoras...`);
        
        // Hacer visible el HTML después de cargar
        document.documentElement.style.visibility = 'visible';
        document.documentElement.style.opacity = '1';
        console.log('Aplicación inicializada — sistemas de nodos, puertos, estado y configuración listos.');
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
    }
});

// Crear botón para visualizar diagrama en la barra lateral
function createDiagramButton() {
    const blueBar = document.getElementById('blue-bar');
    if (!blueBar) {
        console.warn('Blue bar not found. Cannot create diagram button.');
        return;
    }
    
    // Crear botón de diagrama (icono de diagrama)
    const diagramButton = document.createElement('button');
    diagramButton.className = 'node-btn diagram-btn';
    diagramButton.innerHTML = '📊';
    diagramButton.title = 'Diagrama';
    
    // Evento para mostrar/ocultar diagrama
    diagramButton.addEventListener('click', () => {
        toggleDiagram();
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

// Función para mostrar/ocultar el diagrama
function toggleDiagram() {
    const diagramContainer = document.getElementById('diagram-container');
    
    if (!diagramContainer) {
        // Si no existe, crear el contenedor del diagrama
        const newContainer = document.createElement('div');
        newContainer.id = 'diagram-container';
        newContainer.className = 'diagram-container';
        newContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        // Crear botón para cerrar el diagrama
        const closeButton = document.createElement('button');
        closeButton.className = 'diagram-close';
        closeButton.innerHTML = '✕';
        closeButton.style.cssText = `
            position: absolute;
            top: 40px;
            right: 20px;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            font-size: 24px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            z-index: 1001;
        `;
        
        closeButton.addEventListener('click', () => {
            document.body.removeChild(newContainer);
        });
        
        // Crear contenedor para el diagrama
        const diagramContent = document.createElement('div');
        diagramContent.className = 'diagram-content';
        diagramContent.style.cssText = `
            width: 90%;
            height: 90%;
            background: rgba(30, 30, 30, 0.9);
            border-radius: 16px;
            overflow: hidden;
        `;
        
        // Inicializar el diagrama
        try {
            initDiagram(drawLines);
            const diagram = document.getElementById('diagram');
            if (diagram) {
                diagramContent.appendChild(diagram);
            } else {
                diagramContent.innerHTML = '<div style="color: white; padding: 20px;">Diagrama no encontrado</div>';
            }
        } catch (error) {
            console.error('Error al inicializar el diagrama:', error);
            diagramContent.innerHTML = '<div style="color: white; padding: 20px;">Error al cargar el diagrama</div>';
        }
        
        newContainer.appendChild(closeButton);
        newContainer.appendChild(diagramContent);
        document.body.appendChild(newContainer);
    } else {
        // Si ya existe, eliminarlo
        document.body.removeChild(diagramContainer);
    }
}

// Configurar evento del holograma para abrir configuración
function setupHologramConfig() {
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
