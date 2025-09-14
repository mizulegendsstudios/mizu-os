// core/js/status.js — Widget de estado del sistema integrado en la barra superior
export function initializeStatusWidget() {
    // Crear el widget de estado en la barra roja
    const redBar = document.getElementById('red-bar');
    if (!redBar) {
        console.warn('Red bar not found. Skipping status widget initialization.');
        return;
    }
    
    // Crear contenedor del widget
    const statusWidget = document.createElement('div');
    statusWidget.id = 'system-widget';
    statusWidget.className = 'system-widget flex items-center gap-4 px-4 h-full';
    statusWidget.style.cssText = `
        display: flex;
        align-items: center;
        gap: 15px;
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 12px;
        color: white;
        z-index: 1000;
    `;
    
    // Crear elementos para cada indicador
    const timeElement = createTimeElement();
    const batteryElement = createBatteryElement();
    const connectionElement = createConnectionElement();
    const volumeElement = createVolumeElement();
    
    // Añadir elementos al widget en el orden correcto
    statusWidget.appendChild(timeElement);
    statusWidget.appendChild(batteryElement);
    statusWidget.appendChild(connectionElement);
    statusWidget.appendChild(volumeElement);
    
    // Añadir widget a la barra roja
    redBar.appendChild(statusWidget);
    
    // Inicializar actualizaciones
    initializeUpdates(timeElement, batteryElement, connectionElement, volumeElement);
    console.log('Status widget initialized in red bar.');
}

// Crear elemento de tiempo
function createTimeElement() {
    const container = document.createElement('div');
    container.className = 'status-item status-time text-center';
    container.style.cssText = 'display: flex; flex-direction: column; align-items: center;';
    
    const time = document.createElement('div');
    time.id = 'widget-hora';
    time.className = 'status-time-value text-lg font-bold';
    time.style.cssText = 'font-weight: bold; font-size: 14px;';
    
    const date = document.createElement('div');
    date.id = 'widget-fecha';
    date.className = 'status-date-value text-xs opacity-80';
    date.style.cssText = 'font-size: 10px; opacity: 0.8;';
    
    container.appendChild(time);
    container.appendChild(date);
    
    return container;
}

// Crear elemento de batería
function createBatteryElement() {
    const container = document.createElement('div');
    container.className = 'status-item status-battery flex items-center gap-2';
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
    batteryText.className = 'battery-text text-xs';
    batteryText.style.cssText = 'font-size: 10px; min-width: 30px;';
    
    container.appendChild(batteryIcon);
    container.appendChild(batteryText);
    
    return container;
}

// Crear elemento de conexión - CORREGIDO para usar Font Awesome y IDs correctos
function createConnectionElement() {
    const container = document.createElement('div');
    container.className = 'status-item status-connection flex items-center gap-1';
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
    connectionText.className = 'connection-text text-xs';
    connectionText.style.cssText = 'font-size: 10px; min-width: 50px;';
    
    container.appendChild(connectionIcon);
    container.appendChild(connectionText);
    
    return container;
}

// Crear elemento de volumen - CORREGIDO para usar Font Awesome y IDs correctos
function createVolumeElement() {
    const container = document.createElement('div');
    container.className = 'status-item status-volume flex items-center gap-1';
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
    volumeText.className = 'volume-text text-xs';
    volumeText.style.cssText = 'font-size: 10px; min-width: 30px;';
    
    container.appendChild(volumeIcon);
    container.appendChild(volumeText);
    
    return container;
}

// Inicializar actualizaciones periódicas
function initializeUpdates(timeElement, batteryElement, connectionElement, volumeElement) {
    // Actualizar hora y fecha - CORREGIDO para usar IDs correctos
    function updateDateTime() {
        const now = new Date();
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
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
    
    // Actualizar batería - CORREGIDO para usar IDs correctos
    function updateBattery() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                const level = Math.floor(battery.level * 100);
                const batteryLevelEl = document.getElementById('widget-battery-level');
                const batteryTextEl = document.getElementById('widget-battery-pct');
                const batteryIcon = batteryElement.querySelector('.battery-icon');
                
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
    
    // Actualizar conexión - CORREGIDO para usar IDs correctos
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
    
    // Actualizar volumen (simulado) - CORREGIDO para usar IDs correctos
    function updateVolume() {
        const volume = 75; // Valor simulado
        const volumeTextEl = document.getElementById('widget-volume-pct');
        
        if (volumeTextEl) {
            volumeTextEl.textContent = `${volume}%`;
        }
    }
    
    // Ejecutar actualizaciones iniciales
    updateDateTime();
    updateBattery();
    updateConnection();
    updateVolume();
    
    // Configurar actualizaciones periódicas
    setInterval(updateDateTime, 1000);
    
    // Escuchar eventos de conexión
    window.addEventListener('online', updateConnection);
    window.addEventListener('offline', updateConnection);
    
    // Escuchar eventos de batería si está disponible
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            battery.addEventListener('levelchange', updateBattery);
            battery.addEventListener('chargingchange', updateBattery);
        });
    }
}

// Función para alternar la visibilidad del widget
export function toggleStatusWidget() {
    const widget = document.getElementById('system-widget');
    if (widget) {
        const isVisible = widget.style.display !== 'none';
        widget.style.display = isVisible ? 'none' : 'flex';
        console.log(`Status widget ${isVisible ? 'hidden' : 'shown'}`);
    }
}
