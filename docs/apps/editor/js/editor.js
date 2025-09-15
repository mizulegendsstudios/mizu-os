// apps/editor/js/editor.js - Versión con exportación correcta

class EditorApp {
  constructor() {
    this.isVisible = false;
    this.currentTab = 'html';
    this.code = {
      html: '',
      css: '',
      js: ''
    };
    this.previewDoc = null;
    this.consoleOutput = [];
    this.init();
  }

  init() {
    this.createEditorStructure();
    this.setupEventListeners();
    this.updatePreview();
  }

  createEditorStructure() {
    // Crear contenedor principal
    const container = document.createElement('div');
    container.className = 'editor-container';
    container.id = 'editor-container';
    
    // Crear barra de pestañas
    const tabs = document.createElement('div');
    tabs.className = 'editor-tabs';
    tabs.innerHTML = `
      <div class="editor-tab active" data-tab="html">HTML</div>
      <div class="editor-tab" data-tab="css">CSS</div>
      <div class="editor-tab" data-tab="js">JavaScript</div>
      <div class="editor-tab" data-tab="console">Console</div>
    `;
    container.appendChild(tabs);
    
    // Crear barra de herramientas
    const toolbar = document.createElement('div');
    toolbar.className = 'editor-toolbar';
    toolbar.innerHTML = `
      <button id="export-btn">Exportar</button>
      <button id="run-btn">Ejecutar</button>
      <button id="clear-console-btn">Limpiar Consola</button>
      <button id="toggle-layout-btn">Cambiar Layout</button>
    `;
    container.appendChild(toolbar);
    
    // Crear contenedor de contenido principal
    const content = document.createElement('div');
    content.className = 'editor-content';
    
    // Crear panel de código
    const codePanel = document.createElement('div');
    codePanel.className = 'editor-panel';
    
    // Crear áreas de código para cada lenguaje
    const htmlArea = document.createElement('textarea');
    htmlArea.className = 'editor-code';
    htmlArea.id = 'html-code';
    htmlArea.style.display = 'block';
    htmlArea.placeholder = 'Escribe tu HTML aquí...';
    
    const cssArea = document.createElement('textarea');
    cssArea.className = 'editor-code';
    cssArea.id = 'css-code';
    cssArea.style.display = 'none';
    cssArea.placeholder = 'Escribe tu CSS aquí...';
    
    const jsArea = document.createElement('textarea');
    jsArea.className = 'editor-code';
    jsArea.id = 'js-code';
    jsArea.style.display = 'none';
    jsArea.placeholder = 'Escribe tu JavaScript aquí...';
    
    const consoleArea = document.createElement('div');
    consoleArea.className = 'console-panel';
    consoleArea.id = 'console-output';
    consoleArea.style.display = 'none';
    
    codePanel.appendChild(htmlArea);
    codePanel.appendChild(cssArea);
    codePanel.appendChild(jsArea);
    codePanel.appendChild(consoleArea);
    
    // Crear separador ajustable
    const divider = document.createElement('div');
    divider.className = 'editor-divider';
    
    // Crear panel de vista previa
    const previewPanel = document.createElement('div');
    previewPanel.className = 'preview-panel';
    
    const previewFrame = document.createElement('iframe');
    previewFrame.className = 'preview-frame';
    previewFrame.id = 'preview-frame';
    
    previewPanel.appendChild(previewFrame);
    
    // Ensamblar todo
    content.appendChild(codePanel);
    content.appendChild(divider);
    content.appendChild(previewPanel);
    container.appendChild(content);
    
    // Agregar al DOM
    const blackBar = document.getElementById('black-bar');
    const wrapper = document.getElementById('black-content-wrapper');
    wrapper.innerHTML = '';
    wrapper.appendChild(container);
    
    // Guardar referencias
    this.container = container;
    this.htmlArea = htmlArea;
    this.cssArea = cssArea;
    this.jsArea = jsArea;
    this.consoleArea = consoleArea;
    this.previewFrame = previewFrame;
    this.divider = divider;
    
    // Configurar separador ajustable
    this.setupResizableDivider();
  }

  setupResizableDivider() {
    let isResizing = false;
    
    this.divider.addEventListener('mousedown', (e) => {
      isResizing = true;
      document.body.style.cursor = 'col-resize';
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      
      const containerRect = this.container.getBoundingClientRect();
      const percentage = (e.clientX - containerRect.left) / containerRect.width * 100;
      
      if (percentage > 20 && percentage < 80) {
        this.container.style.setProperty('--editor-width', `${percentage}%`);
      }
    });
    
    document.addEventListener('mouseup', () => {
      isResizing = false;
      document.body.style.cursor = 'default';
    });
  }

  setupEventListeners() {
    // Eventos de pestañas
    document.querySelectorAll('.editor-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });
    
    // Eventos de área de código
    this.htmlArea.addEventListener('input', () => {
      this.code.html = this.htmlArea.value;
      this.updatePreview();
    });
    
    this.cssArea.addEventListener('input', () => {
      this.code.css = this.cssArea.value;
      this.updatePreview();
    });
    
    this.jsArea.addEventListener('input', () => {
      this.code.js = this.jsArea.value;
      this.updatePreview();
    });
    
    // Eventos de botones
    document.getElementById('export-btn').addEventListener('click', () => {
      this.exportCode();
    });
    
    document.getElementById('run-btn').addEventListener('click', () => {
      this.updatePreview();
    });
    
    document.getElementById('clear-console-btn').addEventListener('click', () => {
      this.clearConsole();
    });
    
    document.getElementById('toggle-layout-btn').addEventListener('click', () => {
      this.toggleLayout();
    });
  }

  switchTab(tabName) {
    // Actualizar pestañas activas
    document.querySelectorAll('.editor-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Mostrar/ocultar áreas correspondientes
    this.htmlArea.style.display = tabName === 'html' ? 'block' : 'none';
    this.cssArea.style.display = tabName === 'css' ? 'block' : 'none';
    this.jsArea.style.display = tabName === 'js' ? 'block' : 'none';
    this.consoleArea.style.display = tabName === 'console' ? 'block' : 'none';
    
    this.currentTab = tabName;
  }

  updatePreview() {
    const html = this.code.html || '<!DOCTYPE html>\n<html>\n<head>\n<title>Vista Previa</title>\n</head>\n<body>\n<h1>¡Bienvenido a Mizu Coder!</h1>\n</body>\n</html>';
    const css = this.code.css || '';
    const js = this.code.js || '';
    
    const previewDoc = this.previewFrame.contentDocument || this.previewFrame.contentWindow.document;
    
    previewDoc.open();
    previewDoc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>
          // Capturar errores de consola
          window.onerror = function(message, source, lineno, colno, error) {
            parent.postMessage({
              type: 'console',
              data: {
                type: 'error',
                message: message,
                source: source,
                lineno: lineno,
                colno: colno
              }
            }, '*');
            return false;
          };
          
          // Capturar logs de consola
          const originalConsoleLog = console.log;
          console.log = function(...args) {
            parent.postMessage({
              type: 'console',
              data: {
                type: 'log',
                message: args.join(' ')
              }
            }, '*');
            originalConsoleLog.apply(console, args);
          };
          
          // Ejecutar código JS
          try {
            ${js}
          } catch (e) {
            parent.postMessage({
              type: 'console',
              data: {
                type: 'error',
                message: e.message
              }
            }, '*');
          }
        </script>
      </body>
      </html>
    `);
    previewDoc.close();
  }

  exportCode() {
    const html = this.code.html || '';
    const css = this.code.css || '';
    const js = this.code.js || '';
    
    const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Documento Exportado desde Mizu Coder</title>
  <style>
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    ${js}
  </script>
</body>
</html>`;
    
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mizu-coder-export.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  clearConsole() {
    this.consoleArea.innerHTML = '';
    this.consoleOutput = [];
  }

  toggleLayout() {
    const content = document.querySelector('.editor-content');
    if (content.style.flexDirection === 'column') {
      content.style.flexDirection = 'row';
    } else {
      content.style.flexDirection = 'column';
    }
  }
}

// EXPORTACIÓN CORRECTA DE LA CLASE
export { EditorApp };
