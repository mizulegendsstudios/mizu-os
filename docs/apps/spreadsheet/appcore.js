// apps/spreadsheet/appcore.js — Orquestador de la app
import { generateStyles } from './modules/style.js';
import { initializeLogic } from './modules/logic.js';
import { initializeUI } from './modules/ui.js';
import { initializeOperations } from './modules/operations.js';

export class SpreadsheetApp {
    constructor(container) {
        this.container = container;
        this.isLoaded = false;
    }
    
    async load() {
        if (this.isLoaded) return;
        
        // Generar estilos dinámicamente
        generateStyles();
        
        // Crear estructura HTML
        this.container.innerHTML = `
            <div class="spreadsheet-container">
                <h1 class="spreadsheet-title">Tabla de Hoja de Cálculo</h1>
                
                <div class="spreadsheet-controls">
                    <input type="text" id="formula-input" placeholder="Introduce una fórmula (ej: =SUMA(A1:B2))" class="formula-input">
                    <button id="apply-formula-btn" class="apply-btn">Aplicar Fórmula</button>
                </div>
                
                <div class="spreadsheet-operations">
                    <button id="add-row-btn" class="add-row-btn">Añadir Fila</button>
                    <button id="add-col-btn" class="add-col-btn">Añadir Columna</button>
                    <button id="del-row-btn" class="del-row-btn">Eliminar Fila</button>
                    <button id="del-col-btn" class="del-col-btn">Eliminar Columna</button>
                </div>
                
                <div class="table-container">
                    <table id="data-table">
                        <thead><tr><th class="col-header"></th></tr></thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        `;
        
        // Inicializar módulos
        initializeLogic();
        initializeUI();
        initializeOperations();
        
        this.isLoaded = true;
        console.log('Spreadsheet App loaded');
    }
    
    unload() {
        if (!this.isLoaded) return;
        
        // Limpiar estilos
        const style = document.getElementById('spreadsheet-styles');
        if (style) style.remove();
        
        // Limpiar contenido
        this.container.innerHTML = '';
        this.isLoaded = false;
        console.log('Spreadsheet App unloaded');
    }
}
