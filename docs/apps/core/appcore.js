/*
    Archivo principal que orquesta la lógica de la aplicación.
    Mizu OS v3.0.0
*/
console.log(`Cargando sistema...`);

// Importaciones de módulos core (mismo directorio)
import { initializeLoadingScreen } from "./loading.js";
import { initializeBarHiding } from "./monitor_bars.js";
import { initializeMonitor } from "./monitor_axis.js";
import { initializeStatusWidget } from "./status.js";
import { SystemConfig } from "./config.js";
import { createDiagramButton, createConfigButton, createMusicPlayerButton, createEditorButton, createSpreadsheetButton, setupHologramConfig } from "./ui-controls.js";

// Importaciones de diagramas (desde core/js/ a apps/diagram/js/)
import { drawLines } from '../../apps/diagram/js/drawlines.js';
import { initDiagram } from '../../apps/diagram/js/nodos.js';
import { createContainerWithPorts } from '../../apps/diagram/js/nodos-puertos.js';

// Importación del editor (desde core/js/ a apps/editor/js/)
import { EditorApp } from '../../apps/editor/js/editor.js';

// Importación de la app de spreadsheet (desde core/js/ a apps/spreadsheet/appcore.js)
import { SpreadsheetApp } from '../../apps/spreadsheet/appcore.js';

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
        
        // Crear instancia global de la app de spreadsheet
        window.spreadsheetApp = new SpreadsheetApp(document.getElementById('black-content-wrapper'));
        
        // Crear botones en la barra lateral
        createDiagramButton();
        createConfigButton();
        createMusicPlayerButton();
        createEditorButton();
        createSpreadsheetButton();
        
        // Configurar evento del holograma
        setupHologramConfig();
        
        // Inicializa el diagrama de nodos tradicionales
        initDiagram(drawLines);
        console.log(`Activando las mejoras...`);
        
        // Hacer visible el HTML después de cargar
        document.documentElement.style.visibility = 'visible';
        document.documentElement.style.opacity = '1';
        console.log('Aplicación inicializada — sistemas de nodos, puertos, estado, configuración y hoja de cálculo listos.');
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        console.error('Detalles del error:', error.stack);
        
        // Depuración detallada
        console.error('=== INFORMACIÓN DE DEPURACIÓN ===');
        console.error('Ubicación actual:', window.location.href);
        console.error('Rutas de importación intentadas:');
        console.error('  - ../../apps/editor/js/editor.js');
        console.error('  - ../../apps/diagram/js/drawlines.js');
        console.error('  - ../../apps/diagram/js/nodos.js');
        console.error('  - ../../apps/diagram/js/nodos-puertos.js');
        console.error('  - ../../apps/spreadsheet/appcore.js');
        console.error('=== FIN INFORMACIÓN DE DEPURACIÓN ===');
    }
});
