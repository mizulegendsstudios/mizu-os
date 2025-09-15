/*
    Archivo principal que orquesta la lógica de la aplicación.
    Mizu OS v2.10.21
*/
console.log(`Cargando sistema...`);

// Importaciones de módulos core
import { initializeLoadingScreen } from "./loading.js";
import { initializeBarHiding } from "./monitor_bars.js";
import { initializeMonitor } from "./monitor_axis.js";
import { initializeStatusWidget } from "./status.js";
import { SystemConfig } from "./config.js";
import { createDiagramButton, createConfigButton, createMusicPlayerButton, createEditorButton, setupHologramConfig } from "./ui-controls.js";

// Importaciones de diagramas
import { drawLines } from '../../apps/diagram/js/drawlines.js';
import { initDiagram } from '../../apps/diagram/js/nodos.js';
import { createContainerWithPorts } from '../../apps/diagram/js/nodos-puertos.js';

// Importación del editor - CORREGIDO
import { EditorApp } from '../../apps/editor/js/editor.js';

// DOM
console.log(`Iniciando sistema...`);
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Inicializa módulos estables
        initializeMonitor();
        initializeBarHiding();
        initializeLoadingScreen();
        
        // Inicializa el widget de estado del sistema
        initializeStatusWidget();
        
        // Inicializa el sistema de configuración
        window.systemConfig = new SystemConfig();
        
        // Crear instancia global del editor
        window.editorApp = new EditorApp();
        
        // Crear botones en la barra lateral
        createDiagramButton();
        createConfigButton();
        createMusicPlayerButton();
        createEditorButton();
        
        // Configurar evento del holograma
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
        console.error('Detalles del error:', error.stack);
    }
});
