// core/js/editor-app.js - Aplicación de editor de código y texto
export class EditorApp {
    constructor() {
        this.isVisible = false;
        this.panel = null;
        this.mode = 'code'; // 'code' o 'text'
        this.activeTab = 'html'; // Para modo código: 'html', 'css', 'js', 'console'
        this.currentTextTab = 0; // Para modo texto
        this.textTabs = []; // Pestañas de texto
        this.codeContent = {
            html: '',
            css: '',
            js: ''
        };
        this.previewFrame = null;
        this.consoleContent = [];
        this.searchResults = [];
        this.currentSearchIndex = -1;
        
        // Cargar contenido guardado
        this.loadFromLocalStorage();
    }
    
    // Crear panel del editor
    createEditorPanel() {
        if (this.panel) {
            this.toggleEditorPanel();
            return;
        }
        
        const blackContentWrapper = document.getElementById('black-content-wrapper');
        if (!blackContentWrapper) {
            console.error('No se encontró el contenedor black-content-wrapper');
            return;
        }
        
        // Ocultar otras aplicaciones
        this.hideOtherApps();
        
        // Crear el panel del editor
        const panel = document.createElement('div');
        panel.id = 'editor-panel';
        panel.className = 'editor-panel';
        panel.style.cssText = `
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
        
        // Crear encabezado
        const header = this.createHeader();
        
        // Crear contenedor principal
        const mainContainer = document.createElement('div');
        mainContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            overflow: hidden;
        `;
        
        // Crear contenedor del modo código
        const codeModeContainer = this.createCodeModeContainer();
        
        // Crear contenedor del modo texto
        const textModeContainer = this.createTextModeContainer();
        
        // Añadir elementos al contenedor principal
        mainContainer.appendChild(codeModeContainer);
        mainContainer.appendChild(textModeContainer);
        
        // Ensamblar el panel
        panel.appendChild(header);
        panel.appendChild(mainContainer);
        
        // Añadir el panel al contenedor
        blackContentWrapper.appendChild(panel);
        this.panel = panel;
        this.isVisible = true;
        
        // Inicializar la vista
        this.initializeView();
        
        // Configurar eventos
        this.setupEvents();
    }
    
    // Crear encabezado del editor
    createHeader() {
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            background: rgba(0, 0, 0, 0.3);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        `;
        
        // Título
        const title = document.createElement('div');
        title.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-code';
        icon.style.cssText = 'color: #3b82f6; font-size: 18px;';
        
        const titleText = document.createElement('h2');
        titleText.textContent = 'Mizu Editor';
        titleText.style.cssText = 'margin: 0; color: white; font-size: 18px;';
        
        title.appendChild(icon);
        title.appendChild(titleText);
        
        // Controles
        const controls = document.createElement('div');
        controls.style.cssText = 'display: flex; gap: 10px; align-items: center;';
        
        // Selector de modo
        const modeSelector = document.createElement('div');
        modeSelector.style.cssText = 'display: flex; background: rgba(0, 0, 0, 0.5); border-radius: 20px; padding: 2px;';
        
        const codeModeBtn = document.createElement('button');
        codeModeBtn.textContent = 'Código';
        codeModeBtn.id = 'code-mode-btn';
        codeModeBtn.style.cssText = `
            padding: 5px 12px;
            border: none;
            border-radius: 18px;
            background: ${this.mode === 'code' ? '#3b82f6' : 'transparent'};
            color: white;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
        `;
        
        const textModeBtn = document.createElement('button');
        textModeBtn.textContent = 'Texto';
        textModeBtn.id = 'text-mode-btn';
        textModeBtn.style.cssText = `
            padding: 5px 12px;
            border: none;
            border-radius: 18px;
            background: ${this.mode === 'text' ? '#3b82f6' : 'transparent'};
            color: white;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
        `;
        
        modeSelector.appendChild(codeModeBtn);
        modeSelector.appendChild(textModeBtn);
        
        // Botón de nueva pestaña
        const newTabBtn = document.createElement('button');
        newTabBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
        newTabBtn.title = 'Nueva pestaña';
        newTabBtn.style.cssText = `
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        `;
        
        // Botón de buscar
        const searchBtn = document.createElement('button');
        searchBtn.innerHTML = '<i class="fa-solid fa-search"></i>';
        searchBtn.title = 'Buscar';
        searchBtn.style.cssText = `
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        `;
        
        // Botón de guardar/exportar
        const saveBtn = document.createElement('button');
        saveBtn.innerHTML = '<i class="fa-solid fa-download"></i>';
        saveBtn.title = 'Guardar/Exportar';
        saveBtn.style.cssText = `
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        `;
        
        // Botón de cerrar
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '<i class="fa-solid fa-times"></i>';
        closeBtn.title = 'Cerrar';
        closeBtn.style.cssText = `
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        `;
        
        controls.appendChild(modeSelector);
        controls.appendChild(newTabBtn);
        controls.appendChild(searchBtn);
        controls.appendChild(saveBtn);
        controls.appendChild(closeBtn);
        
        header.appendChild(title);
        header.appendChild(controls);
        
        return header;
    }
    
    // Crear contenedor del modo código
    createCodeModeContainer() {
        const container = document.createElement('div');
        container.id = 'code-mode-container';
        container.style.cssText = `
            display: ${this.mode === 'code' ? 'flex' : 'none'};
            flex-direction: column;
            flex-grow: 1;
            overflow: hidden;
        `;
        
        // Pestañas del modo código
        const tabsContainer = document.createElement('div');
        tabsContainer.style.cssText = `
            display: flex;
            background: rgba(0, 0, 0, 0.2);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        `;
        
        const tabs = ['html', 'css', 'js', 'console'];
        const tabLabels = {
            'html': 'HTML',
            'css': 'CSS',
            'js': 'JavaScript',
            'console': 'Consola'
        };
        
        tabs.forEach(tab => {
            const tabBtn = document.createElement('button');
            tabBtn.id = `${tab}-tab`;
            tabBtn.textContent = tabLabels[tab];
            tabBtn.style.cssText = `
                padding: 8px 16px;
                background: none;
                border: none;
                color: ${this.activeTab === tab ? '#3b82f6' : '#9ca3af'};
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                border-bottom: 2px solid ${this.activeTab === tab ? '#3b82f6' : 'transparent'};
                transition: all 0.2s;
            `;
            
            tabBtn.addEventListener('click', () => {
                this.switchCodeTab(tab);
            });
            
            tabsContainer.appendChild(tabBtn);
        });
        
        // Contenedor de editores
        const editorsContainer = document.createElement('div');
        editorsContainer.style.cssText = 'display: flex; flex-grow: 1; overflow: hidden;';
        
        // Editor HTML
        const htmlEditorContainer = this.createEditorContainer('html', 'Escribe tu HTML aquí...');
        
        // Editor CSS
        const cssEditorContainer = this.createEditorContainer('css', 'Escribe tu CSS aquí...');
        
        // Editor JS
        const jsEditorContainer = this.createEditorContainer('js', 'Escribe tu JavaScript aquí...');
        
        // Consola
        const consoleContainer = this.createConsoleContainer();
        
        // Vista previa
        const previewContainer = this.createPreviewContainer();
        
        // Separador redimensionable
        const resizer = document.createElement('div');
        resizer.style.cssText = `
            width: 8px;
            background: rgba(255, 255, 255, 0.1);
            cursor: col-resize;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const resizerHandle = document.createElement('div');
        resizerHandle.style.cssText = `
            width: 4px;
            height: 40px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 2px;
        `;
        
        resizer.appendChild(resizerHandle);
        
        // Ensamblar contenedor
        editorsContainer.appendChild(htmlEditorContainer);
        editorsContainer.appendChild(cssEditorContainer);
        editorsContainer.appendChild(jsEditorContainer);
        editorsContainer.appendChild(consoleContainer);
        
        container.appendChild(tabsContainer);
        container.appendChild(editorsContainer);
        container.appendChild(resizer);
        container.appendChild(previewContainer);
        
        // Configurar redimensionamiento
        this.setupResizer(resizer, editorsContainer, previewContainer);
        
        return container;
    }
    
    // Crear contenedor del modo texto
    createTextModeContainer() {
        const container = document.createElement('div');
        container.id = 'text-mode-container';
        container.style.cssText = `
            display: ${this.mode === 'text' ? 'flex' : 'none'};
            flex-direction: column;
            flex-grow: 1;
            overflow: hidden;
        `;
        
        // Pestañas de texto
        const tabsContainer = document.createElement('div');
        tabsContainer.id = 'text-tabs-container';
        tabsContainer.style.cssText = `
            display: flex;
            background: rgba(0, 0, 0, 0.2);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            overflow-x: auto;
        `;
        
        // Botón de nueva pestaña
        const newTabBtn = document.createElement('button');
        newTabBtn.innerHTML = '+';
        newTabBtn.style.cssText = `
            padding: 6px 12px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            cursor: pointer;
            font-size: 14px;
            margin-left: 5px;
            border-radius: 4px;
        `;
        
        newTabBtn.addEventListener('click', () => {
            this.addNewTextTab();
        });
        
        tabsContainer.appendChild(newTabBtn);
        
        // Contenedor de editores de texto
        const editorsContainer = document.createElement('div');
        editorsContainer.id = 'text-editors-container';
        editorsContainer.style.cssText = 'display: flex; flex-grow: 1; overflow: hidden;';
        
        // Barra de búsqueda
        const searchBar = document.createElement('div');
        searchBar.id = 'text-search-bar';
        searchBar.style.cssText = `
            display: none;
            background: rgba(0, 0, 0, 0.3);
            padding: 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            gap: 8px;
            align-items: center;
        `;
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Buscar...';
        searchInput.style.cssText = `
            flex: 1;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 6px 8px;
            font-size: 14px;
            border-radius: 4px;
            outline: none;
        `;
        
        const searchPrevBtn = document.createElement('button');
        searchPrevBtn.innerHTML = '⬆️';
        searchPrevBtn.title = 'Anterior';
        searchPrevBtn.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            padding: 6px 10px;
            border-radius: 4px;
            cursor: pointer;
        `;
        
        const searchNextBtn = document.createElement('button');
        searchNextBtn.innerHTML = '⬇️';
        searchNextBtn.title = 'Siguiente';
        searchNextBtn.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            padding: 6px 10px;
            border-radius: 4px;
            cursor: pointer;
        `;
        
        const closeSearchBtn = document.createElement('button');
        closeSearchBtn.innerHTML = '✕';
        closeSearchBtn.title = 'Cerrar búsqueda';
        closeSearchBtn.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            padding: 6px 10px;
            border-radius: 4px;
            cursor: pointer;
        `;
        
        const searchInfo = document.createElement('span');
        searchInfo.id = 'text-search-info';
        searchInfo.style.cssText = 'color: #9ca3af; font-size: 12px;';
        
        searchBar.appendChild(searchInput);
        searchBar.appendChild(searchPrevBtn);
        searchBar.appendChild(searchNextBtn);
        searchBar.appendChild(closeSearchBtn);
        searchBar.appendChild(searchInfo);
        
        // Ensamblar contenedor
        container.appendChild(tabsContainer);
        container.appendChild(searchBar);
        container.appendChild(editorsContainer);
        
        return container;
    }
    
    // Crear contenedor de editor para el modo código
    createEditorContainer(type, placeholder) {
        const container = document.createElement('div');
        container.id = `${type}-editor-container`;
        container.style.cssText = `
            display: ${this.activeTab === type ? 'flex' : 'none'};
            flex-direction: column;
            flex-grow: 1;
            width: 100%;
        `;
        
        // Contenedor con números de línea y editor
        const editorWrapper = document.createElement('div');
        editorWrapper.style.cssText = 'display: flex; flex-grow: 1; overflow: hidden;';
        
        // Números de línea
        const lineNumbers = document.createElement('div');
        lineNumbers.id = `${type}-line-numbers`;
        lineNumbers.style.cssText = `
            width: 40px;
            background: rgba(0, 0, 0, 0.3);
            color: #6b7280;
            padding: 10px 5px;
            text-align: right;
            font-family: monospace;
            font-size: 14px;
            line-height: 1.5;
            user-select: none;
            overflow-y: hidden;
        `;
        lineNumbers.textContent = '1';
        
        // Editor
        const editor = document.createElement('textarea');
        editor.id = `${type}-editor`;
        editor.placeholder = placeholder;
        editor.style.cssText = `
            flex-grow: 1;
            resize: none;
            padding: 10px;
            background: rgba(0, 0, 0, 0.2);
            color: #f9fafb;
            border: none;
            outline: none;
            font-family: 'Fira Code', monospace;
            font-size: 14px;
            line-height: 1.5;
            tab-size: 4;
        `;
        
        // Cargar contenido guardado
        editor.value = this.codeContent[type] || '';
        
        // Configurar eventos
        editor.addEventListener('input', () => {
            this.updateCodeContent(type, editor.value);
            this.updateLineNumbers(type, lineNumbers);
            this.updatePreview();
        });
        
        editor.addEventListener('scroll', () => {
            lineNumbers.scrollTop = editor.scrollTop;
        });
        
        // Sincronizar scroll
        lineNumbers.addEventListener('scroll', () => {
            editor.scrollTop = lineNumbers.scrollTop;
        });
        
        editorWrapper.appendChild(lineNumbers);
        editorWrapper.appendChild(editor);
        container.appendChild(editorWrapper);
        
        return container;
    }
    
    // Crear contenedor de la consola
    createConsoleContainer() {
        const container = document.createElement('div');
        container.id = 'console-editor-container';
        container.style.cssText = `
            display: ${this.activeTab === 'console' ? 'flex' : 'none'};
            flex-direction: column;
            flex-grow: 1;
            width: 100%;
            background: rgba(0, 0, 0, 0.2);
        `;
        
        // Encabezado de la consola
        const consoleHeader = document.createElement('div');
        consoleHeader.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            background: rgba(0, 0, 0, 0.3);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        `;
        
        const consoleTitle = document.createElement('div');
        consoleTitle.style.cssText = 'display: flex; align-items: center; gap: 8px;';
        
        const consoleIcon = document.createElement('i');
        consoleIcon.className = 'fa-solid fa-terminal';
        consoleIcon.style.cssText = 'color: #3b82f6;';
        
        const consoleText = document.createElement('span');
        consoleText.textContent = 'Consola';
        consoleText.style.cssText = 'color: white; font-weight: 500;';
        
        consoleTitle.appendChild(consoleIcon);
        consoleTitle.appendChild(consoleText);
        
        const clearConsoleBtn = document.createElement('button');
        clearConsoleBtn.innerHTML = '<i class="fa-solid fa-trash"></i> Limpiar';
        clearConsoleBtn.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 5px;
        `;
        
        clearConsoleBtn.addEventListener('click', () => {
            this.clearConsole();
        });
        
        consoleHeader.appendChild(consoleTitle);
        consoleHeader.appendChild(clearConsoleBtn);
        
        // Contenido de la consola
        const consoleContent = document.createElement('div');
        consoleContent.id = 'console-content';
        consoleContent.style.cssText = `
            flex-grow: 1;
            overflow-y: auto;
            padding: 10px;
            font-family: 'Fira Code', monospace;
            font-size: 14px;
            color: #e5e7eb;
        `;
        
        // Mensaje inicial
        const initialMessage = document.createElement('div');
        initialMessage.style.cssText = 'color: #3b82f6; margin-bottom: 8px;';
        initialMessage.textContent = 'Consola inicializada. Los mensajes de console.log aparecerán aquí.';
        consoleContent.appendChild(initialMessage);
        
        container.appendChild(consoleHeader);
        container.appendChild(consoleContent);
        
        return container;
    }
    
    // Crear contenedor de vista previa
    createPreviewContainer() {
        const container = document.createElement('div');
        container.id = 'preview-container';
        container.style.cssText = `
            width: 40%;
            height: 100%;
            background: white;
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        `;
        
        // Iframe para la vista previa
        const previewFrame = document.createElement('iframe');
        previewFrame.id = 'preview-frame';
        previewFrame.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
        `;
        previewFrame.sandbox = 'allow-same-origin allow-scripts';
        
        container.appendChild(previewFrame);
        this.previewFrame = previewFrame;
        
        return container;
    }
    
    // Configurar redimensionamiento
    setupResizer(resizer, leftPanel, rightPanel) {
        let isResizing = false;
        
        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            document.body.style.cursor = 'col-resize';
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            
            const containerRect = leftPanel.parentElement.getBoundingClientRect();
            const containerWidth = containerRect.width;
            const newLeftWidth = e.clientX - containerRect.left;
            const newRightWidth = containerWidth - newLeftWidth;
            
            if (newLeftWidth > 200 && newRightWidth > 200) {
                leftPanel.style.width = `${newLeftWidth}px`;
                rightPanel.style.width = `${newRightWidth}px`;
            }
        });
        
        document.addEventListener('mouseup', () => {
            isResizing = false;
            document.body.style.cursor = 'default';
        });
    }
    
    // Inicializar la vista
    initializeView() {
        // Actualizar números de línea
        ['html', 'css', 'js'].forEach(type => {
            const editor = document.getElementById(`${type}-editor`);
            const lineNumbers = document.getElementById(`${type}-line-numbers`);
            if (editor && lineNumbers) {
                this.updateLineNumbers(type, lineNumbers);
            }
        });
        
        // Cargar pestañas de texto
        this.loadTextTabs();
        
        // Actualizar vista previa
        this.updatePreview();
    }
    
    // Configurar eventos
    setupEvents() {
        // Eventos de los botones del encabezado
        document.getElementById('code-mode-btn').addEventListener('click', () => {
            this.switchMode('code');
        });
        
        document.getElementById('text-mode-btn').addEventListener('click', () => {
            this.switchMode('text');
        });
        
        // Botón de nueva pestaña
        document.querySelector('#editor-panel .fa-plus').parentElement.addEventListener('click', () => {
            if (this.mode === 'code') {
                // En modo código, nueva pestaña no tiene efecto directo
                this.showNotification('En modo código, utiliza las pestañas existentes');
            } else {
                this.addNewTextTab();
            }
        });
        
        // Botón de buscar
        document.querySelector('#editor-panel .fa-search').parentElement.addEventListener('click', () => {
            this.toggleSearchBar();
        });
        
        // Botón de guardar/exportar
        document.querySelector('#editor-panel .fa-download').parentElement.addEventListener('click', () => {
            this.saveOrExport();
        });
        
        // Botón de cerrar
        document.querySelector('#editor-panel .fa-times').parentElement.addEventListener('click', () => {
            this.toggleEditorPanel();
        });
        
        // Eventos de la barra de búsqueda en modo texto
        const searchInput = document.getElementById('text-search-bar')?.querySelector('input');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.performSearch();
            });
        }
        
        const searchPrevBtn = document.getElementById('text-search-bar')?.querySelector('button:nth-child(3)');
        if (searchPrevBtn) {
            searchPrevBtn.addEventListener('click', () => {
                this.prevSearchResult();
            });
        }
        
        const searchNextBtn = document.getElementById('text-search-bar')?.querySelector('button:nth-child(4)');
        if (searchNextBtn) {
            searchNextBtn.addEventListener('click', () => {
                this.nextSearchResult();
            });
        }
        
        const closeSearchBtn = document.getElementById('text-search-bar')?.querySelector('button:nth-child(5)');
        if (closeSearchBtn) {
            closeSearchBtn.addEventListener('click', () => {
                this.hideSearchBar();
            });
        }
    }
    
    // Cambiar entre modo código y texto
    switchMode(mode) {
        this.mode = mode;
        
        // Actualizar botones del modo
        const codeModeBtn = document.getElementById('code-mode-btn');
        const textModeBtn = document.getElementById('text-mode-btn');
        
        if (codeModeBtn && textModeBtn) {
            codeModeBtn.style.background = mode === 'code' ? '#3b82f6' : 'transparent';
            textModeBtn.style.background = mode === 'text' ? '#3b82f6' : 'transparent';
        }
        
        // Mostrar/ocultar contenedores
        const codeModeContainer = document.getElementById('code-mode-container');
        const textModeContainer = document.getElementById('text-mode-container');
        
        if (codeModeContainer && textModeContainer) {
            codeModeContainer.style.display = mode === 'code' ? 'flex' : 'none';
            textModeContainer.style.display = mode === 'text' ? 'flex' : 'none';
        }
        
        // Guardar configuración
        localStorage.setItem('mizu-editor-mode', mode);
        
        // Actualizar vista previa si estamos en modo código
        if (mode === 'code') {
            this.updatePreview();
        }
    }
    
    // Cambiar pestaña en modo código
    switchCodeTab(tab) {
        this.activeTab = tab;
        
        // Actualizar estilos de pestañas
        ['html', 'css', 'js', 'console'].forEach(t => {
            const tabBtn = document.getElementById(`${t}-tab`);
            if (tabBtn) {
                tabBtn.style.color = this.activeTab === t ? '#3b82f6' : '#9ca3af';
                tabBtn.style.borderBottom = `2px solid ${this.activeTab === t ? '#3b82f6' : 'transparent'}`;
            }
        });
        
        // Mostrar/ocultar editores
        ['html', 'css', 'js', 'console'].forEach(t => {
            const container = document.getElementById(`${t}-editor-container`);
            if (container) {
                container.style.display = this.activeTab === t ? 'flex' : 'none';
            }
        });
    }
    
    // Actualizar contenido del código
    updateCodeContent(type, content) {
        this.codeContent[type] = content;
        localStorage.setItem(`mizu-editor-${type}`, content);
    }
    
    // Actualizar números de línea
    updateLineNumbers(type, lineNumbersElement) {
        const editor = document.getElementById(`${type}-editor`);
        if (!editor) return;
        
        const lines = editor.value.split('\n');
        lineNumbersElement.innerHTML = lines.map((_, index) => index + 1).join('<br>');
    }
    
    // Actualizar vista previa
    updatePreview() {
        if (!this.previewFrame) return;
        
        const previewDoc = this.previewFrame.contentDocument || this.previewFrame.contentWindow.document;
        
        try {
            const html = this.codeContent.html || '';
            const css = this.codeContent.css || '';
            const js = this.codeContent.js || '';
            
            const fullDocument = `
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
                        // Capturar console.log
                        const originalLog = console.log;
                        const originalWarn = console.warn;
                        const originalError = console.error;
                        
                        console.log = (...args) => {
                            originalLog.apply(console, args);
                            window.parent.mizuEditor.addConsoleMessage('log', args);
                        };
                        
                        console.warn = (...args) => {
                            originalWarn.apply(console, args);
                            window.parent.mizuEditor.addConsoleMessage('warn', args);
                        };
                        
                        console.error = (...args) => {
                            originalError.apply(console, args);
                            window.parent.mizuEditor.addConsoleMessage('error', args);
                        };
                        
                        // Ejecutar el código del usuario
                        ${js}
                    <\/script>
                </body>
                </html>
            `;
            
            previewDoc.open();
            previewDoc.write(fullDocument);
            previewDoc.close();
        } catch (error) {
            console.error('Error al actualizar vista previa:', error);
        }
    }
    
    // Agregar mensaje a la consola
    addConsoleMessage(type, args) {
        const consoleContent = document.getElementById('console-content');
        if (!consoleContent) return;
        
        const message = document.createElement('div');
        message.style.cssText = 'margin-bottom: 8px; padding-left: 8px; border-left: 3px solid;';
        
        switch (type) {
            case 'log':
                message.style.borderColor = '#3b82f6';
                message.style.color = '#3b82f6';
                break;
            case 'warn':
                message.style.borderColor = '#f59e0b';
                message.style.color = '#f59e0b';
                break;
            case 'error':
                message.style.borderColor = '#ef4444';
                message.style.color = '#ef4444';
                break;
        }
        
        // Formatear los argumentos
        const formattedArgs = args.map(arg => {
            if (typeof arg === 'object') {
                try {
                    return JSON.stringify(arg, null, 2);
                } catch (e) {
                    return String(arg);
                }
            }
            return String(arg);
        }).join(' ');
        
        message.textContent = `[${type.toUpperCase()}] ${formattedArgs}`;
        consoleContent.appendChild(message);
        
        // Auto-scroll al final
        consoleContent.scrollTop = consoleContent.scrollHeight;
        
        // Actualizar pestaña de consola si no está activa
        if (this.activeTab !== 'console') {
            const consoleTab = document.getElementById('console-tab');
            if (consoleTab) {
                consoleTab.style.color = '#ef4444';
            }
        }
    }
    
    // Limpiar consola
    clearConsole() {
        const consoleContent = document.getElementById('console-content');
        if (consoleContent) {
            consoleContent.innerHTML = '';
            
            const initialMessage = document.createElement('div');
            initialMessage.style.cssText = 'color: #3b82f6; margin-bottom: 8px;';
            initialMessage.textContent = 'Consola limpiada.';
            consoleContent.appendChild(initialMessage);
            
            // Restaurar color de la pestaña
            const consoleTab = document.getElementById('console-tab');
            if (consoleTab) {
                consoleTab.style.color = this.activeTab === 'console' ? '#3b82f6' : '#9ca3af';
            }
        }
    }
    
    // Cargar pestañas de texto
    loadTextTabs() {
        // Cargar pestañas guardadas
        const savedTabs = localStorage.getItem('mizu-editor-text-tabs');
        if (savedTabs) {
            try {
                this.textTabs = JSON.parse(savedTabs);
            } catch (e) {
                console.error('Error al cargar pestañas de texto:', e);
                this.textTabs = [];
            }
        }
        
        // Si no hay pestañas, crear una por defecto
        if (this.textTabs.length === 0) {
            this.textTabs = [
                { name: 'Nuevo documento', content: '' }
            ];
        }
        
        // Renderizar pestañas
        this.renderTextTabs();
    }
    
    // Renderizar pestañas de texto
    renderTextTabs() {
        const tabsContainer = document.getElementById('text-tabs-container');
        if (!tabsContainer) return;
        
        // Mantener el botón de nueva pestaña
        const newTabBtn = tabsContainer.querySelector('button');
        tabsContainer.innerHTML = '';
        tabsContainer.appendChild(newTabBtn);
        
        // Crear pestañas
        this.textTabs.forEach((tab, index) => {
            const tabElement = document.createElement('button');
            tabElement.style.cssText = `
                padding: 8px 16px;
                background: ${index === this.currentTextTab ? 'rgba(59, 130, 246, 0.3)' : 'transparent'};
                border: none;
                color: ${index === this.currentTextTab ? '#3b82f6' : '#9ca3af'};
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                border-bottom: 2px solid ${index === this.currentTextTab ? '#3b82f6' : 'transparent'};
                white-space: nowrap;
                display: flex;
                align-items: center;
                transition: all 0.2s;
            `;
            
            const tabText = document.createElement('span');
            tabText.textContent = tab.name;
            tabText.style.cssText = 'max-width: 150px; overflow: hidden; text-overflow: ellipsis;';
            
            tabElement.appendChild(tabText);
            
            // Botón para cerrar pestaña
            if (this.textTabs.length > 1) {
                const closeBtn = document.createElement('button');
                closeBtn.innerHTML = '×';
                closeBtn.style.cssText = `
                    background: none;
                    border: none;
                    color: #9ca3af;
                    margin-left: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s;
                `;
                
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.closeTextTab(index);
                });
                
                closeBtn.addEventListener('mouseenter', () => {
                    closeBtn.style.background = 'rgba(239, 68, 68, 0.2)';
                    closeBtn.style.color = '#ef4444';
                });
                
                closeBtn.addEventListener('mouseleave', () => {
                    closeBtn.style.background = 'none';
                    closeBtn.style.color = '#9ca3af';
                });
                
                tabElement.appendChild(closeBtn);
            }
            
            tabElement.addEventListener('click', () => {
                this.switchTextTab(index);
            });
            
            tabsContainer.appendChild(tabElement);
        });
        
        // Crear editores
        this.renderTextEditors();
    }
    
    // Renderizar editores de texto
    renderTextEditors() {
        const editorsContainer = document.getElementById('text-editors-container');
        if (!editorsContainer) return;
        
        editorsContainer.innerHTML = '';
        
        this.textTabs.forEach((tab, index) => {
            const editorContainer = document.createElement('div');
            editorContainer.id = `text-editor-${index}`;
            editorContainer.style.cssText = `
                display: ${index === this.currentTextTab ? 'flex' : 'none'};
                flex-direction: column;
                flex-grow: 1;
                width: 100%;
            `;
            
            const editor = document.createElement('textarea');
            editor.placeholder = 'Escribe aquí...';
            editor.style.cssText = `
                flex-grow: 1;
                resize: none;
                padding: 10px;
                background: rgba(0, 0, 0, 0.2);
                color: #f9fafb;
                border: none;
                outline: none;
                font-family: 'Inter', sans-serif;
                font-size: 14px;
                line-height: 1.5;
            `;
            
            editor.value = tab.content || '';
            
            editor.addEventListener('input', () => {
                this.textTabs[index].content = editor.value;
                this.saveTextTabs();
            });
            
            editorContainer.appendChild(editor);
            editorsContainer.appendChild(editorContainer);
        });
    }
    
    // Cambiar pestaña de texto
    switchTextTab(index) {
        this.currentTextTab = index;
        this.renderTextTabs();
    }
    
    // Añadir nueva pestaña de texto
    addNewTextTab() {
        const newTab = {
            name: `Documento ${this.textTabs.length + 1}`,
            content: ''
        };
        
        this.textTabs.push(newTab);
        this.currentTextTab = this.textTabs.length - 1;
        
        this.renderTextTabs();
        this.saveTextTabs();
        
        // Enfocar el nuevo editor
        setTimeout(() => {
            const editor = document.querySelector(`#text-editor-${this.currentTextTab} textarea`);
            if (editor) {
                editor.focus();
            }
        }, 100);
    }
    
    // Cerrar pestaña de texto
    closeTextTab(index) {
        if (this.textTabs.length <= 1) {
            this.showNotification('No se puede cerrar la última pestaña');
            return;
        }
        
        this.textTabs.splice(index, 1);
        
        if (this.currentTextTab >= this.textTabs.length) {
            this.currentTextTab = this.textTabs.length - 1;
        } else if (this.currentTextTab > index) {
            this.currentTextTab--;
        }
        
        this.renderTextTabs();
        this.saveTextTabs();
    }
    
    // Guardar pestañas de texto
    saveTextTabs() {
        localStorage.setItem('mizu-editor-text-tabs', JSON.stringify(this.textTabs));
    }
    
    // Mostrar/ocultar barra de búsqueda
    toggleSearchBar() {
        const searchBar = document.getElementById('text-search-bar');
        if (!searchBar) return;
        
        if (searchBar.style.display === 'flex') {
            this.hideSearchBar();
        } else {
            searchBar.style.display = 'flex';
            const searchInput = searchBar.querySelector('input');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
    }
    
    // Ocultar barra de búsqueda
    hideSearchBar() {
        const searchBar = document.getElementById('text-search-bar');
        if (searchBar) {
            searchBar.style.display = 'none';
            this.searchResults = [];
            this.currentSearchIndex = -1;
        }
    }
    
    // Realizar búsqueda
    performSearch() {
        const searchBar = document.getElementById('text-search-bar');
        if (!searchBar) return;
        
        const searchInput = searchBar.querySelector('input');
        const searchInfo = document.getElementById('text-search-info');
        
        if (!searchInput || !searchInfo) return;
        
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            this.searchResults = [];
            this.currentSearchIndex = -1;
            searchInfo.textContent = '';
            return;
        }
        
        const editor = document.querySelector(`#text-editor-${this.currentTextTab} textarea`);
        if (!editor) return;
        
        const content = editor.value.toLowerCase();
        this.searchResults = [];
        
        let index = 0;
        while ((index = content.indexOf(query, index)) !== -1) {
            this.searchResults.push(index);
            index += query.length;
        }
        
        this.currentSearchIndex = this.searchResults.length > 0 ? 0 : -1;
        
        if (this.searchResults.length > 0) {
            searchInfo.textContent = `${this.currentSearchIndex + 1} de ${this.searchResults.length}`;
            this.highlightSearchResult();
        } else {
            searchInfo.textContent = 'No se encontraron resultados';
        }
    }
    
    // Resaltar resultado de búsqueda
    highlightSearchResult() {
        if (this.currentSearchIndex < 0 || this.currentSearchIndex >= this.searchResults.length) return;
        
        const editor = document.querySelector(`#text-editor-${this.currentTextTab} textarea`);
        if (!editor) return;
        
        const start = this.searchResults[this.currentSearchIndex];
        const end = start + document.getElementById('text-search-bar').querySelector('input').value.length;
        
        editor.focus();
        editor.setSelectionRange(start, end);
        
        // Scroll al resultado
        const lineHeight = parseInt(getComputedStyle(editor).lineHeight);
        const lines = editor.value.substring(0, start).split('\n').length - 1;
        editor.scrollTop = lines * lineHeight;
    }
    
    // Siguiente resultado de búsqueda
    nextSearchResult() {
        if (this.searchResults.length === 0) return;
        
        this.currentSearchIndex = (this.currentSearchIndex + 1) % this.searchResults.length;
        
        const searchInfo = document.getElementById('text-search-info');
        if (searchInfo) {
            searchInfo.textContent = `${this.currentSearchIndex + 1} de ${this.searchResults.length}`;
        }
        
        this.highlightSearchResult();
    }
    
    // Anterior resultado de búsqueda
    prevSearchResult() {
        if (this.searchResults.length === 0) return;
        
        this.currentSearchIndex = this.currentSearchIndex <= 0 
            ? this.searchResults.length - 1 
            : this.currentSearchIndex - 1;
        
        const searchInfo = document.getElementById('text-search-info');
        if (searchInfo) {
            searchInfo.textContent = `${this.currentSearchIndex + 1} de ${this.searchResults.length}`;
        }
        
        this.highlightSearchResult();
    }
    
    // Guardar o exportar
    saveOrExport() {
        if (this.mode === 'code') {
            this.exportCode();
        } else {
            this.exportText();
        }
    }
    
    // Exportar código
    exportCode() {
        let content = '';
        let fileName = '';
        let mimeType = '';
        
        switch (this.activeTab) {
            case 'html':
                content = this.codeContent.html;
                fileName = 'mizu-editor-html.html';
                mimeType = 'text/html';
                break;
            case 'css':
                content = this.codeContent.css;
                fileName = 'mizu-editor-css.css';
                mimeType = 'text/css';
                break;
            case 'js':
                content = this.codeContent.js;
                fileName = 'mizu-editor-js.js';
                mimeType = 'application/javascript';
                break;
            case 'console':
                content = document.getElementById('console-content')?.innerText || '';
                fileName = 'mizu-editor-console.txt';
                mimeType = 'text/plain';
                break;
        }
        
        if (!content) {
            this.showNotification('No hay contenido para exportar');
            return;
        }
        
        const blob = new Blob([content], { type: mimeType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showNotification('Archivo exportado correctamente');
    }
    
    // Exportar texto
    exportText() {
        if (this.currentTextTab < 0 || this.currentTextTab >= this.textTabs.length) {
            this.showNotification('No hay pestaña de texto activa');
            return;
        }
        
        const tab = this.textTabs[this.currentTextTab];
        const content = tab.content || '';
        
        if (!content) {
            this.showNotification('No hay contenido para exportar');
            return;
        }
        
        const blob = new Blob([content], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${tab.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showNotification('Archivo exportado correctamente');
    }
    
    // Cargar contenido guardado
    loadFromLocalStorage() {
        // Cargar modo
        const savedMode = localStorage.getItem('mizu-editor-mode');
        if (savedMode === 'code' || savedMode === 'text') {
            this.mode = savedMode;
        }
        
        // Cargar contenido de código
        this.codeContent.html = localStorage.getItem('mizu-editor-html') || '';
        this.codeContent.css = localStorage.getItem('mizu-editor-css') || '';
        this.codeContent.js = localStorage.getItem('mizu-editor-js') || '';
    }
    
    // Ocultar otras aplicaciones
    hideOtherApps() {
        const configPanel = document.getElementById('config-panel');
        const canvas = document.getElementById('canvas');
        
        if (configPanel && configPanel.style.display !== 'none') {
            configPanel.style.display = 'none';
            if (window.systemConfig) {
                window.systemConfig.isVisible = false;
            }
        }
        
        if (canvas) {
            canvas.style.display = 'none';
        }
        
        const musicPlayerPanel = document.getElementById('music-player-panel');
        if (musicPlayerPanel && musicPlayerPanel.style.display !== 'none') {
            musicPlayerPanel.style.display = 'none';
            if (window.musicPlayer) {
                window.musicPlayer.isVisible = false;
            }
        }
    }
    
    // Toggle panel del editor
    toggleEditorPanel() {
        if (!this.panel) {
            this.createEditorPanel();
        } else {
            this.panel.style.display = this.isVisible ? 'none' : 'flex';
            this.isVisible = !this.isVisible;
        }
    }
    
    // Mostrar notificación
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'config-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Instancia global del editor
let editorApp;
document.addEventListener('DOMContentLoaded', () => {
    editorApp = new EditorApp();
    window.mizuEditor = editorApp; // Hacerlo global para acceso desde el iframe
});
