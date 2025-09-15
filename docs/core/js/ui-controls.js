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

// Crear botón para el reproductor de música en la barra lateral
export function createMusicPlayerButton() {
    const blueBar = document.getElementById('blue-bar');
    if (!blueBar) {
        console.warn('Blue bar not found. Cannot create music player button.');
        return;
    }
    
    // Crear botón de reproductor (icono de música)
    const musicPlayerButton = document.createElement('button');
    musicPlayerButton.className = 'node-btn music-player-btn';
    musicPlayerButton.innerHTML = '🎵';
    musicPlayerButton.title = 'Reproductor de Música';
    
    // Evento para mostrar/ocultar reproductor
    musicPlayerButton.addEventListener('click', () => {
        showMusicPlayer();
    });
    
    // Agregar a la barra lateral (después del botón de diagrama)
    const diagramButton = document.querySelector('.diagram-btn');
    if (diagramButton) {
        blueBar.insertBefore(musicPlayerButton, diagramButton.nextSibling);
    } else {
        blueBar.appendChild(musicPlayerButton);
    }
}

// Crear botón para el editor en la barra lateral
export function createEditorButton() {
    const blueBar = document.getElementById('blue-bar');
    if (!blueBar) {
        console.warn('Blue bar not found. Cannot create editor button.');
        return;
    }
    
    // Crear botón de editor (icono de código)
    const editorButton = document.createElement('button');
    editorButton.className = 'node-btn editor-btn';
    editorButton.innerHTML = '📝';
    editorButton.title = 'Editor de Código y Texto';
    
    // Evento para mostrar/ocultar editor
    editorButton.addEventListener('click', () => {
        showEditor();
    });
    
    // Agregar a la barra lateral (después del botón de reproductor)
    const musicPlayerButton = document.querySelector('.music-player-btn');
    if (musicPlayerButton) {
        blueBar.insertBefore(editorButton, musicPlayerButton.nextSibling);
    } else {
        blueBar.appendChild(editorButton);
    }
}

// Crear botón para la app de spreadsheet en la barra lateral
export function createSpreadsheetButton() {
    const blueBar = document.getElementById('blue-bar');
    if (!blueBar) {
        console.warn('Blue bar not found. Cannot create spreadsheet button.');
        return;
    }
    
    // Crear botón de spreadsheet (icono de hoja de cálculo)
    const spreadsheetButton = document.createElement('button');
    spreadsheetButton.className = 'node-btn spreadsheet-btn';
    spreadsheetButton.innerHTML = '📊'; // Usamos el icono del manifest
    spreadsheetButton.title = 'Hoja de Cálculo';
    
    // Evento para mostrar/ocultar spreadsheet
    spreadsheetButton.addEventListener('click', () => {
        showSpreadsheet();
    });
    
    // Agregar a la barra lateral (después del botón de editor)
    const editorButton = document.querySelector('.editor-btn');
    if (editorButton) {
        blueBar.insertBefore(spreadsheetButton, editorButton.nextSibling);
    } else {
        blueBar.appendChild(spreadsheetButton);
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
    console.log('Mostrando diagrama...');
    
    const blackContentWrapper = document.getElementById('black-content-wrapper');
    const configPanel = document.getElementById('config-panel');
    const musicPlayerPanel = document.getElementById('music-player-panel');
    const editorPanel = document.getElementById('editor-panel');
    
    // Ocultar otros paneles si están visibles
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
    
    if (editorPanel && editorPanel.style.display !== 'none') {
        editorPanel.style.display = 'none';
        if (window.editorApp) {
            window.editorApp.isVisible = false;
        }
    }
    
    // Descargar la app de spreadsheet si está cargada
    if (window.spreadsheetApp && window.spreadsheetApp.isLoaded) {
        window.spreadsheetApp.unload();
    }
    
    // Mostrar el canvas del diagrama
    const canvas = document.getElementById('canvas');
    if (canvas) {
        canvas.style.display = 'block';
        console.log('Canvas del diagrama encontrado y mostrado');
    } else {
        console.warn('Canvas del diagrama no encontrado, creando uno nuevo...');
        // Crear canvas si no existe
        const newCanvas = document.createElement('canvas');
        newCanvas.id = 'canvas';
        newCanvas.style.width = '100%';
        newCanvas.style.height = '100%';
        newCanvas.style.backgroundColor = '#2d2d2d';
        blackContentWrapper.appendChild(newCanvas);
        console.log('Canvas creado dinámicamente');
    }
    
    // Verificar si el diagrama está inicializado
    if (!window.diagramInitialized) {
        console.warn('El diagrama no está inicializado. Intentando inicializar...');
        try {
            // Verificar si las funciones están disponibles globalmente
            if (typeof initDiagram === 'function' && typeof drawLines === 'function') {
                initDiagram(drawLines);
                window.diagramInitialized = true;
                console.log('Diagrama inicializado correctamente usando funciones globales');
            } else {
                console.error('Funciones de diagrama no disponibles globalmente');
                // Intentar importar dinámicamente como último recurso
                import('../../apps/diagram/js/drawlines.js').then(({ drawLines }) => {
                    import('../../apps/diagram/js/nodos.js').then(({ initDiagram }) => {
                        initDiagram(drawLines);
                        window.diagramInitialized = true;
                        console.log('Diagrama inicializado correctamente mediante importación dinámica');
                    }).catch(err => {
                        console.error('Error al importar nodos.js:', err);
                        blackContentWrapper.innerHTML = '<div style="color: white; padding: 20px;">Error al cargar el módulo de nodos</div>';
                    });
                }).catch(err => {
                    console.error('Error al importar drawlines.js:', err);
                    blackContentWrapper.innerHTML = '<div style="color: white; padding: 20px;">Error al cargar el módulo de diagramas</div>';
                });
            }
        } catch (error) {
            console.error('Error al inicializar el diagrama:', error);
            blackContentWrapper.innerHTML = '<div style="color: white; padding: 20px;">Error al cargar el diagrama: ' + error.message + '</div>';
        }
    } else {
        console.log('Diagrama ya estaba inicializado');
    }
}

// Función para mostrar el reproductor de música dentro de black-bar
export function showMusicPlayer() {
    console.log('Mostrando reproductor de música...');
    
    const blackContentWrapper = document.getElementById('black-content-wrapper');
    const configPanel = document.getElementById('config-panel');
    const canvas = document.getElementById('canvas');
    const editorPanel = document.getElementById('editor-panel');
    
    // Ocultar otros paneles si están visibles
    if (configPanel && configPanel.style.display !== 'none') {
        configPanel.style.display = 'none';
        if (window.systemConfig) {
            window.systemConfig.isVisible = false;
        }
    }
    
    if (canvas) {
        canvas.style.display = 'none';
    }
    
    if (editorPanel && editorPanel.style.display !== 'none') {
        editorPanel.style.display = 'none';
        if (window.editorApp) {
            window.editorApp.isVisible = false;
        }
    }
    
    // Descargar la app de spreadsheet si está cargada
    if (window.spreadsheetApp && window.spreadsheetApp.isLoaded) {
        window.spreadsheetApp.unload();
    }
    
    // Mostrar el reproductor de música
    if (!window.musicPlayer) {
        console.log('Creando nueva instancia del reproductor de música...');
        // Importar dinámicamente el módulo del reproductor
        import('./music-player.js').then(({ MusicPlayer }) => {
            window.musicPlayer = new MusicPlayer();
            window.musicPlayer.createMusicPlayerPanel();
            console.log('Reproductor de música creado y mostrado');
        }).catch(err => {
            console.error('Error al cargar el reproductor de música:', err);
            blackContentWrapper.innerHTML = '<div style="color: white; padding: 20px;">Error al cargar el reproductor de música</div>';
        });
    } else {
        console.log('Mostrando reproductor de música existente...');
        const musicPlayerPanel = document.getElementById('music-player-panel');
        if (musicPlayerPanel) {
            musicPlayerPanel.style.display = 'flex';
            if (window.musicPlayer) {
                window.musicPlayer.isVisible = true;
            }
        } else {
            console.warn('Panel del reproductor no encontrado, creando uno nuevo...');
            window.musicPlayer.createMusicPlayerPanel();
        }
    }
}

// Función para mostrar el editor dentro de black-bar
export function showEditor() {
    console.log('Mostrando editor...');
    
    const blackContentWrapper = document.getElementById('black-content-wrapper');
    const configPanel = document.getElementById('config-panel');
    const canvas = document.getElementById('canvas');
    const musicPlayerPanel = document.getElementById('music-player-panel');
    
    // Ocultar otros paneles si están visibles
    if (configPanel && configPanel.style.display !== 'none') {
        configPanel.style.display = 'none';
        if (window.systemConfig) {
            window.systemConfig.isVisible = false;
        }
    }
    
    if (canvas) {
        canvas.style.display = 'none';
    }
    
    if (musicPlayerPanel && musicPlayerPanel.style.display !== 'none') {
        musicPlayerPanel.style.display = 'none';
        if (window.musicPlayer) {
            window.musicPlayer.isVisible = false;
        }
    }
    
    // Descargar la app de spreadsheet si está cargada
    if (window.spreadsheetApp && window.spreadsheetApp.isLoaded) {
        window.spreadsheetApp.unload();
    }
    
    // Mostrar el editor usando la instancia global
    if (window.editorApp) {
        console.log('EditorApp encontrado, mostrando...');
        try {
            // Usar el método show() para mostrar el editor
            window.editorApp.show();
            console.log('Editor mostrado correctamente');
        } catch (error) {
            console.error('Error al mostrar el editor:', error);
            // Fallback: intentar con el método toggle
            try {
                window.editorApp.toggle();
                console.log('Editor mostrado mediante toggle');
            } catch (toggleError) {
                console.error('Error al hacer toggle del editor:', toggleError);
                // Último recurso: intentar con el método createEditorPanel
                try {
                    window.editorApp.createEditorPanel();
                    console.log('Editor mostrado mediante createEditorPanel');
                } catch (createError) {
                    console.error('Error al crear el panel del editor:', createError);
                    blackContentWrapper.innerHTML = '<div style="color: white; padding: 20px;">Error al mostrar el editor</div>';
                }
            }
        }
    } else {
        console.error('La aplicación del editor no está disponible');
        blackContentWrapper.innerHTML = '<div style="color: white; padding: 20px;">La aplicación del editor no está disponible</div>';
    }
}

// Función para mostrar la app de spreadsheet dentro de black-bar
export function showSpreadsheet() {
    console.log('Mostrando hoja de cálculo...');
    
    const blackContentWrapper = document.getElementById('black-content-wrapper');
    const configPanel = document.getElementById('config-panel');
    const canvas = document.getElementById('canvas');
    const musicPlayerPanel = document.getElementById('music-player-panel');
    const editorPanel = document.getElementById('editor-panel');
    
    // Ocultar otros paneles si están visibles
    if (configPanel && configPanel.style.display !== 'none') {
        configPanel.style.display = 'none';
        if (window.systemConfig) {
            window.systemConfig.isVisible = false;
        }
    }
    
    if (canvas) {
        canvas.style.display = 'none';
    }
    
    if (musicPlayerPanel && musicPlayerPanel.style.display !== 'none') {
        musicPlayerPanel.style.display = 'none';
        if (window.musicPlayer) {
            window.musicPlayer.isVisible = false;
        }
    }
    
    if (editorPanel && editorPanel.style.display !== 'none') {
        editorPanel.style.display = 'none';
        if (window.editorApp) {
            window.editorApp.isVisible = false;
        }
    }
    
    // Mostrar la app de spreadsheet
    if (window.spreadsheetApp) {
        try {
            window.spreadsheetApp.load();
            console.log('Hoja de cálculo mostrada correctamente');
        } catch (error) {
            console.error('Error al mostrar la hoja de cálculo:', error);
            blackContentWrapper.innerHTML = '<div style="color: white; padding: 20px;">Error al mostrar la hoja de cálculo</div>';
        }
    } else {
        console.error('La aplicación de hoja de cálculo no está disponible');
        blackContentWrapper.innerHTML = '<div style="color: white; padding: 20px;">La aplicación de hoja de cálculo no está disponible</div>';
    }
}
