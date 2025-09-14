// core/js/status.js — Widget de estado del sistema integrado en la barra superior
export function initializeStatusWidget() {
    // Crear el widget de estado en la barra roja
    const redBar = document.getElementById('red-bar');
    if (!redBar) {
        console.warn('Red bar not found. Skipping status widget initialization.');
        return;
    }
    
    // Limpiar el contenido existente de la barra roja
    redBar.innerHTML = '';
    
    // Crear contenedor principal para la barra roja
    const mainContainer = document.createElement('div');
    mainContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 0 15px;
    `;
    
    // Sección izquierda: hora y fecha
    const timeSection = createTimeSection();
    
    // Sección central: controles básicos
    const controlsSection = createBasicControls();
    
    // Sección derecha: widget de estado (batería, wifi, volumen)
    const statusSection = createStatusSection();
    
    mainContainer.appendChild(timeSection);
    mainContainer.appendChild(controlsSection);
    mainContainer.appendChild(statusSection);
    
    redBar.appendChild(mainContainer);
    
    // Inicializar actualizaciones para el widget de estado
    initializeUpdates(statusSection);
    console.log('Status widget initialized in red bar.');
}

// Crear sección de hora y fecha
function createTimeSection() {
    const container = document.createElement('div');
    container.className = 'time-section';
    container.style.cssText = 'display: flex; align-items: center; gap: 10px;';
    
    const time = document.createElement('div');
    time.id = 'widget-hora';
    time.className = 'status-time-value';
    time.style.cssText = 'font-weight: bold; font-size: 16px;';
    
    const date = document.createElement('div');
    date.id = 'widget-fecha';
    date.className = 'status-date-value';
    date.style.cssText = 'font-size: 12px; opacity: 0.8;';
    
    container.appendChild(time);
    container.appendChild(date);
    
    // Actualizar hora y fecha inicialmente
    updateDateTime();
    
    // Configurar actualización periódica
    setInterval(updateDateTime, 1000);
    
    return container;
}

// Actualizar hora y fecha
function updateDateTime() {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const dateOptions = { day: '2-digit', month: 'short', year: '2-digit' };
    
    const timeEl = document.getElementById('widget-hora');
    const dateEl = document.getElementById('widget-fecha');
    
    if (timeEl) {
        timeEl.textContent = now.toLocaleTimeString('es-ES', timeOptions);
    }
    if (dateEl) {
        dateEl.textContent = now.toLocaleDateString('es-ES', dateOptions)
            .replace(/ de /g, ' ')
            .replace(/\./g, '');
    }
}

// Crear controles básicos para la barra roja
function createBasicControls() {
    const container = document.createElement('div');
    container.className = 'basic-controls';
    container.style.cssText = 'display: flex; align-items: center; gap: 8px;';
    
    // Botón para cambiar entre modo código y texto
    const modeToggleBtn = document.createElement('button');
    modeToggleBtn.innerHTML = '<i class="fa-solid fa-code"></i>';
    modeToggleBtn.title = 'Cambiar modo Código/Texto';
    modeToggleBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.1);
        transition: all 0.2s ease;
    `;
    
    modeToggleBtn.addEventListener('click', () => {
        if (window.editorApp) {
            window.editorApp.switchMode(
                window.editorApp.mode === 'code' ? 'text' : 'code'
            );
        }
    });
    
    // Botón para nueva pestaña
    const newTabBtn = document.createElement('button');
    newTabBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
    newTabBtn.title = 'Nueva pestaña';
    newTabBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 14px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.1);
        transition: all 0.2s ease;
    `;
    
    newTabBtn.addEventListener('click', () => {
        if (window.editorApp) {
            if (window.editorApp.mode === 'text') {
                window.editorApp.addNewTextTab();
            }
        }
    });
    
    // Botón para buscar
    const searchBtn = document.createElement('button');
    searchBtn.innerHTML = '<i class="fa-solid fa-search"></i>';
    searchBtn.title = 'Buscar';
    searchBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 14px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.1);
        transition: all 0.2s ease;
    `;
    
    searchBtn.addEventListener('click', () => {
        if (window.editorApp) {
            window.editorApp.toggleSearchBar();
        }
    });
    
    // Botón para guardar/exportar
    const saveBtn = document.createElement('button');
    saveBtn.innerHTML = '<i class="fa-solid fa-download"></i>';
    saveBtn.title = 'Guardar/Exportar';
    saveBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 14px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.1);
        transition: all 0.2s ease;
    `;
    
    saveBtn.addEventListener('click', () => {
        if (window.editorApp) {
            window.editorApp.saveOrExport();
        }
    });
    
    // Información del documento actual
    const docInfo = document.createElement('div');
    docInfo.id = 'mini-doc-info';
    docInfo.style.cssText = `
        font-size: 12px;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
        color: white;
        margin-left: 10px;
    `;
    docInfo.textContent = 'Editor';
    
    // Actualizar la información del documento cuando cambie
    const updateDocInfo = () => {
        if (window.editorApp) {
            if (window.editorApp.mode === 'code') {
                const tabNames = {
                    'html': 'HTML',
                    'css': 'CSS',
                    'js': 'JavaScript',
                    'console': 'Consola'
                };
                docInfo.textContent = `Código - ${tabNames[window.editorApp.activeTab] || ''}`;
            } else {
                if (window.editorApp.currentTextTab >= 0 && 
                    window.editorApp.currentTextTab < window.editorApp.textTabs.length) {
                    const tab = window.editorApp.textTabs[window.editorApp.currentTextTab];
                    docInfo.textContent = `Texto - ${tab.name}`;
                } else {
                    docInfo.textContent = 'Texto';
                }
            }
        }
    };
    
    // Actualizar periódicamente la información del documento
    setInterval(updateDocInfo, 1000);
    
    // Efectos hover
    const buttons = [modeToggleBtn, newTabBtn, searchBtn, saveBtn];
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            btn.style.transform = 'scale(1.1)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            btn.style.transform = 'scale(1)';
        });
    });
    
    container.appendChild(modeToggleBtn);
    container.appendChild(newTabBtn);
    container.appendChild(searchBtn);
    container.appendChild(saveBtn);
    container.appendChild(docInfo);
    
    return container;
}

// Crear sección de estado (batería, wifi, volumen)
function createStatusSection() {
    const container = document.createElement('div');
    container.className = 'status-section';
    container.style.cssText = 'display: flex; align-items: center; gap: 15px;';
    
    // Elemento de batería
    const batteryElement = createBatteryElement();
    
    // Elemento de conexión
    const connectionElement = createConnectionElement();
    
    // Elemento de volumen
    const volumeElement = createVolumeElement();
    
    container.appendChild(batteryElement);
    container.appendChild(connectionElement);
    container.appendChild(volumeElement);
    
    return container;
}

// Crear elemento de batería
function createBatteryElement() {
    const container = document.createElement('div');
    container.className = 'status-item status-battery';
    container.style.cssText = 'display: flex; align-items: center; gap: 5px;';
    
    const batteryIcon = document.createElement('div');
    batteryIcon.className = 'battery-icon';
    batteryIcon.style.cssText = `
        width: 24px;
        height: 12px;
        border: 1px solid currentColor;
        border-radius: 2px;
        position: relative;
        margin-right: 5px;
    `;
    
    // Terminal de la batería
    const terminal = document.createElement('div');
    terminal.style.cssText = `
        position: absolute;
        top: 50%;
        right: -3px;
        transform: translateY(-50%);
        width: 3px;
        height: 6px;
        background-color: currentColor;
        border-top-right-radius: 1px;
        border-bottom-right-radius: 1px;
    `;
    batteryIcon.appendChild(terminal);
    
    // Nivel de la batería
    const batteryLevel = document.createElement('div');
    batteryLevel.className = 'battery-level';
    batteryLevel.id = 'widget-battery-level';
    batteryLevel.style.cssText = `
        position: absolute;
        top: 1px;
        left: 1px;
        height: calc(100% - 2px);
        background-color: currentColor;
        transition: width 0.3s ease;
        width: 70%;
    `;
    batteryIcon.appendChild(batteryLevel);
    
    const batteryText = document.createElement('span');
    batteryText.id = 'widget-battery-pct';
    batteryText.className = 'battery-text';
    batteryText.style.cssText = 'font-size: 10px; min-width: 30px;';
    
    container.appendChild(batteryIcon);
    container.appendChild(batteryText);
    
    return container;
}

// Crear elemento de conexión
function createConnectionElement() {
    const container = document.createElement('div');
    container.className = 'status-item status-connection';
    container.style.cssText = 'display: flex; align-items: center; gap: 5px;';
    
    const connectionIcon = document.createElement('i');
    connectionIcon.id = 'widget-wifi-icon';
    connectionIcon.className = 'fa-solid fa-wifi text-sm';
    connectionIcon.style.cssText = `
        font-size: 14px;
        color: #10b981;
    `;
    
    const connectionText = document.createElement('span');
    connectionText.id = 'widget-wifi-status';
    connectionText.className = 'connection-text';
    connectionText.style.cssText = 'font-size: 10px; min-width: 50px;';
    
    container.appendChild(connectionIcon);
    container.appendChild(connectionText);
    
    return container;
}

// Crear elemento de volumen
function createVolumeElement() {
    const container = document.createElement('div');
    container.className = 'status-item status-volume';
    container.style.cssText = 'display: flex; align-items: center; gap: 5px;';
    
    const volumeIcon = document.createElement('i');
    volumeIcon.id = 'widget-volume-icon';
    volumeIcon.className = 'fa-solid fa-volume-high text-sm';
    volumeIcon.style.cssText = `
        font-size: 14px;
        color: #10b981;
    `;
    
    const volumeText = document.createElement('span');
    volumeText.id = 'widget-volume-pct';
    volumeText.className = 'volume-text';
    volumeText.style.cssText = 'font-size: 10px; min-width: 30px;';
    
    container.appendChild(volumeIcon);
    container.appendChild(volumeText);
    
    return container;
}

// Inicializar actualizaciones para el widget de estado
function initializeUpdates(statusSection) {
    // Actualizar batería
    function updateBattery() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                const level = Math.floor(battery.level * 100);
                const batteryLevelEl = document.getElementById('widget-battery-level');
                const batteryTextEl = document.getElementById('widget-battery-pct');
                const batteryIcon = statusSection.querySelector('.battery-icon');
                
                if (batteryLevelEl) {
                    batteryLevelEl.style.width = `${level}%`;
                }
                
                if (batteryTextEl) {
                    if (battery.charging) {
                        batteryTextEl.textContent = '⚡';
                        batteryIcon.style.color = '#10b981';
                    } else if (level < 20) {
                        batteryTextEl.textContent = `${level}%`;
                        batteryIcon.style.color = '#ef4444';
                    } else {
                        batteryTextEl.textContent = `${level}%`;
                        batteryIcon.style.color = '#10b981';
                    }
                }
            });
        } else {
            const batteryTextEl = document.getElementById('widget-battery-pct');
            if (batteryTextEl) {
                batteryTextEl.textContent = 'N/A';
            }
        }
    }
    
    // Actualizar conexión
    function updateConnection() {
        const online = navigator.onLine;
        const connectionIconEl = document.getElementById('widget-wifi-icon');
        const connectionTextEl = document.getElementById('widget-wifi-status');
        
        if (connectionIconEl) {
            connectionIconEl.style.color = online ? '#10b981' : '#ef4444';
        }
        
        if (connectionTextEl) {
            connectionTextEl.textContent = online ? 'Online' : 'Offline';
        }
    }
    
    // Actualizar volumen (simulado)
    function updateVolume() {
        const volume = 75; // Valor simulado
        const volumeTextEl = document.getElementById('widget-volume-pct');
        
        if (volumeTextEl) {
            volumeTextEl.textContent = `${volume}%`;
        }
    }
    
    // Ejecutar actualizaciones iniciales
    updateBattery();
    updateConnection();
    updateVolume();
    
    // Escuchar eventos de conexión
    window.addEventListener('online', updateConnection);
    window.addEventListener('offline', updateConnection);
    
    // Escuchar eventos de batería si está disponible
    if ('get
