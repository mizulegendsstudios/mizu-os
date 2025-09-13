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
    statusWidget.className = 'system-widget';
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

    // Añadir elementos al widget
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
    container.className = 'status-item status-time';
    container.style.cssText = 'display: flex; flex-direction: column; align-items: center;';
    
    const time = document.createElement('div');
    time.id = 'widget-time';
    time.className = 'status-time-value';
    time.style.cssText = 'font-weight: bold; font-size: 14px;';
    
    const date = document.createElement('div');
    date.id = 'widget-date';
    date.className = 'status-date-value';
    date.style.cssText = 'font-size: 10px; opacity: 0.8;';
    
    container.appendChild(time);
    container.appendChild(date);
    
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
    batteryText.id = 'widget-battery-text';
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
    connectionIcon.id = 'widget-connection-icon';
    connectionIcon.className = 'connection-icon';
    connectionIcon.style.cssText = `
        width: 16px;
        height: 16px;
        display: inline-block;
        position: relative;
    `;
    // Crear icono de WiFi usando CSS
    connectionIcon.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" style="width: 100%; height: 100%;">
            <path d="M1 9l2 2c4.97-4.97 11.03-4.97 16 0l2-2C15.14 5.86 8.86 5.86 1 9zm8 8l2 2c6.63-6.63 6.63-17.37 0-24l-2 2c5.11 5.11 5.11 13.37 0 18.5zM4.93 19.07l1.41 1.41C9.21 15.81 14.8 15.81 19.07 19.07l1.41-1.41c-3.9-3.9-3.9-10.24 0-14.14zM8 16l1.41 1.41c1.17-1.17 2.59-1.76 4.07-1.76l-1.41-1.41c-1.8.01-3.46.72-4.93 1.93l-.14.14z"/>
        </svg>
    `;
    
    const connectionText = document.createElement('span');
    connectionText.id = 'widget-connection-text';
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
    volumeIcon.className = 'volume-icon';
    volumeIcon.style.cssText = `
        width: 16px;
        height: 16px;
        display: inline-block;
    `;
    // Crear icono de volumen usando CSS
    volumeIcon.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" style="width: 100%; height: 100%;">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.1-0.9-2-2-2s-2 .9-2 2v9l5 5-1.41-1.41V6.1c.9.31 1.91.9 3.3.9 1.4 0 2.5-1.1 2.5-2.5 0-.4-.1-.8-.2-1.1l1.9-1.9c-.2-.6-.3-1.3-.3-2 0-2.21 1.79-4 4-4z"/>
        </svg>
    `;
    
    const volumeText = document.createElement('span');
    volumeText.id = 'widget-volume-text';
    volumeText.className = 'volume-text';
    volumeText.style.cssText = 'font-size: 10px; min-width: 30px;';
    
    container.appendChild(volumeIcon);
    container.appendChild(volumeText);
    
    return container;
}

// Inicializar actualizaciones periódicas
function initializeUpdates(timeElement, batteryElement, connectionElement, volumeElement) {
    // Actualizar hora y fecha
    function updateDateTime() {
        const now = new Date();
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const dateOptions = { day: '2-digit', month: 'short', year: '2-digit' };
        
        const timeEl = timeElement.querySelector('#widget-time');
        const dateEl = timeElement.querySelector('#widget-date');
        
        if (timeEl) {
            timeEl.textContent = now.toLocaleTimeString('es-ES', timeOptions);
        }
        if (dateEl) {
            dateEl.textContent = now.toLocaleDateString('es-ES', dateOptions)
                .replace(/ de /g, ' ')
                .replace(/\./g, '');
        }
    }
    
    // Actualizar batería
    function updateBattery() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                const level = Math.floor(battery.level * 100);
                const batteryLevelEl = batteryElement.querySelector('#widget-battery-level');
                const batteryTextEl = batteryElement.querySelector('#widget-battery-text');
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
            const batteryTextEl = batteryElement.querySelector('#widget-battery-text');
            if (batteryTextEl) {
                batteryTextEl.textContent = 'N/A';
            }
        }
    }
    
    // Actualizar conexión
    function updateConnection() {
        const online = navigator.onLine;
        const connectionIconEl = connectionElement.querySelector('#widget-connection-icon');
        const connectionTextEl = connectionElement.querySelector('#widget-connection-text');
        
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
        const volumeTextEl = volumeElement.querySelector('#widget-volume-text');
        
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
