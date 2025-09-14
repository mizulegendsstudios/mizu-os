// core/js/ui-controls.js — Controles de UI: botones, diagrama modal, holograma

export function createDiagramButton() {
    const blueBar = document.getElementById('blue-bar');
    if (!blueBar) {
        console.warn('Blue bar not found. Cannot create diagram button.');
        return;
    }
    
    const diagramButton = document.createElement('button');
    diagramButton.className = 'node-btn diagram-btn';
    diagramButton.innerHTML = '📊';
    diagramButton.title = 'Visualizar Diagrama';
    
    diagramButton.addEventListener('click', () => {
        toggleDiagram();
    });
    
    const createNodeBtn = document.getElementById('create-node-btn');
    if (createNodeBtn) {
        blueBar.insertBefore(diagramButton, createNodeBtn.nextSibling);
    } else {
        blueBar.appendChild(diagramButton);
    }
}

export function createConfigButton() {
    const blueBar = document.getElementById('blue-bar');
    if (!blueBar) {
        console.warn('Blue bar not found. Cannot create config button.');
        return;
    }
    
    const configButton = document.createElement('button');
    configButton.className = 'node-btn config-btn';
    configButton.innerHTML = '⚙️';
    configButton.title = 'Configuración Visual';
    
    configButton.addEventListener('click', () => {
        if (window.systemConfig) {
            window.systemConfig.toggleConfigPanel();
        } else {
            console.error('El sistema de configuración no está disponible');
        }
    });
    
    const createNodeBtn = document.getElementById('create-node-btn');
    if (createNodeBtn) {
        blueBar.insertBefore(configButton, createNodeBtn);
    } else {
        blueBar.appendChild(configButton);
    }
}

export function toggleDiagram() {
    const diagramContainer = document.getElementById('diagram-container');
    
    if (!diagramContainer) {
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
        
        const closeButton = document.createElement('button');
        closeButton.className = 'diagram-close';
        closeButton.innerHTML = '✕';
        closeButton.style.cssText = `
            position: absolute;
            top: 20px;
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
        
        const diagramContent = document.createElement('div');
        diagramContent.className = 'diagram-content';
        diagramContent.style.cssText = `
            width: 90%;
            height: 90%;
            background: rgba(30, 30, 30, 0.9);
            border-radius: 16px;
            overflow: hidden;
        `;
        
        try {
            // Asumimos que initDiagram y drawLines están disponibles globalmente o se importarán donde se use
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
        document.body.removeChild(diagramContainer);
    }
}

export function setupHologramConfig() {
    const yellowSquare = document.getElementById('yellow-square');
    const hologram = document.getElementById('hologram');
    
    if (yellowSquare && hologram) {
        yellowSquare.addEventListener('click', (e) => {
            if (e.target === hologram || hologram.contains(e.target)) {
                if (window.systemConfig) {
                    window.systemConfig.toggleConfigPanel();
                } else {
                    console.error('El sistema de configuración no está disponible');
                }
            }
        });
        
        hologram.style.cursor = 'pointer';
        yellowSquare.style.cursor = 'pointer';
    }
}
