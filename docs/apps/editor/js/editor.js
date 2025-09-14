// apps/editor/js/editor.js - Editor de código como aplicación para Mizu OS
export class EditorApp {
    constructor() {
        this.panel = null;
        this.isVisible = false;
        this.editorContainer = null;
    }

    createEditorPanel() {
        const blackContentWrapper = document.getElementById('black-content-wrapper');
        if (!blackContentWrapper) {
            console.error('No se encontró el contenedor black-content-wrapper');
            return;
        }

        // Ocultar otros paneles
        this.hideOtherPanels();

        // Crear el panel del editor
        this.panel = document.createElement('div');
        this.panel.id = 'editor-panel';
        this.panel.className = 'editor-panel';
        this.panel.style.cssText = `
            width: 100%;
            height: 100%;
            background: rgba(30, 30, 30, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 0.5rem;
            padding: 0;
            display: flex;
            flex-direction: column;
            z-index: 642;
            overflow: hidden;
        `;

        // Insertar el contenido del editor (adaptado del código proporcionado)
        this.panel.innerHTML = `
            <div class="header">
                <h1>Mizu Coder</h1>
                <div class="header-controls">
                    <input type="range" id="resizerSlider" class="progress-bar" min="20" max="80" value="50">
                    <span id="saveIndicator" class="save-indicator">Guardado</span>
                    <div class="code-mode-selector">
                        <span class="mode-label">Separado</span>
                        <label class="mode-switch">
                            <input type="checkbox" id="unifiedModeToggle">
                            <span class="slider"></span>
                        </label>
                        <span class="mode-label">Unificado</span>
                    </div>
                    <button id="exportButton" class="action-button">Exportar</button>
                    <button id="resetButton" class="action-button">Reiniciar</button>
                </div>
            </div>
            <div class="container">
                <div id="editorContainer" class="editor-container">
                    <div class="tabs">
                        <button id="html-tab" class="tab-button active">HTML</button>
                        <button id="css-tab" class="tab-button">CSS</button>
                        <button id="js-tab" class="tab-button">JS</button>
                        <button id="console-tab" class="tab-button">Consola</button>
                    </div>
                    <div id="html-editor-wrapper" class="editor-wrapper">
                        <div id="html-line-numbers" class="line-numbers">1</div>
                        <textarea id="htmlEditor" placeholder="Escribe tu HTML aquí..." class="editor"></textarea>
                    </div>
                    <div id="css-editor-wrapper" class="editor-wrapper" style="display:none;">
                        <div id="css-line-numbers" class="line-numbers">1</div>
                        <textarea id="cssEditor" placeholder="Escribe tu CSS aquí..." class="editor"></textarea>
                    </div>
                    <div id="js-editor-wrapper" class="editor-wrapper" style="display:none;">
                        <div id="js-line-numbers" class="line-numbers">1</div>
                        <textarea id="jsEditor" placeholder="Escribe tu JavaScript aquí..." class="editor"></textarea>
                    </div>
                    <div id="console-wrapper" class="console-container" style="display:none;">
                        <div class="console-header">
                            <div class="console-title">
                                <i class="fas fa-terminal"></i>
                                <span>Consola de Salida</span>
                            </div>
                            <div class="console-controls">
                                <button id="clearConsole" title="Limpiar consola">
                                    <i class="fas fa-trash-alt"></i> Limpiar
                                </button>
                            </div>
                        </div>
                        <div class="console-content" id="consoleContent">
                            <div class="log-entry info">Consola inicializada. Los mensajes de console.log aparecerán aquí.</div>
                        </div>
                    </div>
                </div>
                <div id="resizer" class="resizer"></div>
                <div id="previewContainer" class="preview-container">
                    <iframe id="previewFrame" class="preview-frame" sandbox="allow-same-origin allow-scripts"></iframe>
                    <div id="debugInfo" class="debug-info">Estado: Listo</div>
                </div>
            </div>
        `;

        // Añadir estilos específicos para Mizu OS
        const style = document.createElement('style');
        style.textContent = `
            .editor-panel .header {
                background-color: rgba(30, 0, 0, 0.6);
                backdrop-filter: blur(10px);
                border-radius: 0.5rem;
                margin: 0.5rem;
                padding: 0.75rem;
            }
            .editor-panel .action-button {
                background-color: rgba(59, 130, 246, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .editor-panel .action-button:hover {
                background-color: rgba(37, 99, 235, 0.9);
            }
            .editor-panel .tab-button {
                background-color: rgba(30, 30, 30, 0.8);
                color: rgba(255, 255, 255, 0.7);
            }
            .editor-panel .tab-button.active {
                background-color: rgba(59, 130, 246, 0.3);
                color: #3b82f6;
            }
            .editor-panel .editor {
                background-color: rgba(30, 30, 30, 0.9);
                color: #f9fafb;
            }
            .editor-panel .line-numbers {
                background-color: rgba(17, 24, 39, 0.9);
                color: #6b7280;
            }
            .editor-panel .preview-container {
                background-color: rgba(229, 231, 235, 0.95);
            }
            .editor-panel .console-container {
                background-color: rgba(30, 30, 30, 0.9);
            }
        `;
        this.panel.appendChild(style);

        blackContentWrapper.appendChild(this.panel);
        this.isVisible = true;
        
        // Inicializar el editor
        this.initializeEditor();
    }

    initializeEditor() {
        // Obtener referencias a elementos del DOM
        const htmlEditor = document.getElementById('htmlEditor');
        const cssEditor = document.getElementById('cssEditor');
        const jsEditor = document.getElementById('jsEditor');
        const previewFrame = document.getElementById('previewFrame');
        const consoleContent = document.getElementById('consoleContent');
        
        // Contenido inicial
        const initialHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Proyecto</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        button { background-color: #3b82f6; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="card">
        <h1>¡Bienvenido a Mizu Coder!</h1>
        <p>Editor integrado en Mizu OS</p>
        <button onclick="alert('Hola desde Mizu OS!')">Haz clic aquí</button>
    </div>
</body>
</html>`;
        
        const initialCSS = `/* Estilos personalizados */\nbody { background-color: #f5f5f5; }`;
        const initialJS = `// JavaScript\nconsole.log('¡Hola desde Mizu Coder!');`;
        
        htmlEditor.value = initialHTML;
        cssEditor.value = initialCSS;
        jsEditor.value = initialJS;
        
        // Función para actualizar vista previa
        const updatePreview = () => {
            const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
            const fullDocument = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>${cssEditor.value}</style>
                </head>
                <body>
                    ${htmlEditor.value}
                    <script>
                        try {
                            ${jsEditor.value}
                        } catch(e) {
                            console.error('Error en JavaScript:', e);
                        }
                    <\/script>
                </body>
                </html>
            `;
            
            previewDoc.open();
            previewDoc.write(fullDocument);
            previewDoc.close();
        };
        
        // Event listeners
        htmlEditor.addEventListener('input', updatePreview);
        cssEditor.addEventListener('input', updatePreview);
        jsEditor.addEventListener('input', updatePreview);
        
        // Configurar pestañas
        document.getElementById('html-tab').addEventListener('click', () => this.switchTab('html'));
        document.getElementById('css-tab').addEventListener('click', () => this.switchTab('css'));
        document.getElementById('js-tab').addEventListener('click', () => this.switchTab('js'));
        document.getElementById('console-tab').addEventListener('click', () => this.switchTab('console'));
        
        // Configurar botones
        document.getElementById('exportButton').addEventListener('click', () => this.exportCode());
        document.getElementById('resetButton').addEventListener('click', updatePreview);
        document.getElementById('clearConsole').addEventListener('click', () => {
            consoleContent.innerHTML = '<div class="log-entry info">Consola limpiada.</div>';
        });
        
        // Inicializar vista previa
        updatePreview();
    }

    switchTab(tabName) {
        const tabs = ['html', 'css', 'js', 'console'];
        tabs.forEach(tab => {
            document.getElementById(`${tab}-tab`).classList.remove('active');
            document.getElementById(`${tab}-editor-wrapper`)?.setAttribute('style', 'display:none;');
            document.getElementById(`${tab}-wrapper`)?.setAttribute('style', 'display:none;');
        });
        
        document.getElementById(`${tabName}-tab`).classList.add('active');
        if (tabName === 'console') {
            document.getElementById('console-wrapper').style.display = 'flex';
        } else {
            document.getElementById(`${tabName}-editor-wrapper`).style.display = 'flex';
        }
    }

    exportCode() {
        const activeTab = document.querySelector('.tab-button.active').id.replace('-tab', '');
        let code = '';
        let fileName = '';
        let mimeType = '';
        
        if (activeTab === 'html') {
            code = document.getElementById('htmlEditor').value;
            fileName = 'mizu_coder_html.html';
            mimeType = 'text/html';
        } else if (activeTab === 'css') {
            code = document.getElementById('cssEditor').value;
            fileName = 'mizu_coder_css.css';
            mimeType = 'text/css';
        } else if (activeTab === 'js') {
            code = document.getElementById('jsEditor').value;
            fileName = 'mizu_coder_js.js';
            mimeType = 'application/javascript';
        } else if (activeTab === 'console') {
            code = document.getElementById('consoleContent').innerText;
            fileName = 'mizu_coder_console.txt';
            mimeType = 'text/plain';
        }
        
        const blob = new Blob([code], { type: mimeType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    hideOtherPanels() {
        // Ocultar otros paneles si están visibles
        const configPanel = document.getElementById('config-panel');
        const musicPlayerPanel = document.getElementById('music-player-panel');
        const canvas = document.getElementById('canvas');
        
        if (configPanel && configPanel.style.display !== 'none') {
            configPanel.style.display = 'none';
            if (window.systemConfig) {
                window.systemConfig.isVisible = false;
            }
        }
        
        if (musicPlayerPanel && musicPlayerPanel.style.display !== 'none') {
            musicPlayerPanel.style.display = 'none';
            if (window.musicPlayer) {
                window.musicPlayer.isVisible = false;
            }
        }
        
        if (canvas) {
            canvas.style.display = 'none';
        }
    }

    toggleEditorPanel() {
        if (!this.panel) {
            this.createEditorPanel();
        } else {
            this.panel.style.display = this.isVisible ? 'none' : 'flex';
            this.isVisible = !this.isVisible;
            
            if (this.isVisible) {
                this.hideOtherPanels();
            }
        }
    }
}

// Instancia global del editor
let editorApp;
document.addEventListener('DOMContentLoaded', () => {
    editorApp = new EditorApp();
    window.editorApp = editorApp;
});
