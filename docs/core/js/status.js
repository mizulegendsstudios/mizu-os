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
    
    // Sección central: controles del reproductor
    const playerControlsSection = createPlayerControls();
    
    // Sección derecha: widget de estado (batería, wifi, volumen)
    const statusSection = createStatusSection();
    
    mainContainer.appendChild(timeSection);
    mainContainer.appendChild(playerControlsSection);
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

// Crear controles básicos del reproductor para la barra roja
function createPlayerControls() {
    const container = document.createElement('div');
    container.className = 'player-controls';
    container.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
    `;
    
    // Botón de anterior
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '<i class="fa-solid fa-backward"></i>';
    prevBtn.title = 'Anterior';
    prevBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 14px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.1);
        transition: all 0.2s ease;
    `;
    prevBtn.addEventListener('click', () => {
        if (window.musicPlayer) {
            window.musicPlayer.playPrev();
        }
    });
    
    // Botón de play/pause
    const playPauseBtn = document.createElement('button');
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    playPauseBtn.title = 'Reproducir/Pausar';
    playPauseBtn.style.cssText = `
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
        background-color: rgba(255, 255, 255, 0.2);
        transition: all 0.2s ease;
    `;
    playPauseBtn.addEventListener('click', () => {
        if (window.musicPlayer) {
            window.musicPlayer.togglePlayPause();
        }
    });
    
    // Botón de stop
    const stopBtn = document.createElement('button');
    stopBtn.innerHTML = '<i class="fa-solid fa-stop"></i>';
    stopBtn.title = 'Detener';
    stopBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 14px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.1);
        transition: all 0.2s ease;
    `;
    stopBtn.addEventListener('click', () => {
        if (window.musicPlayer) {
            window.musicPlayer.stop();
        }
    });
    
    // Botón de siguiente
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '<i class="fa-solid fa-forward"></i>';
    nextBtn.title = 'Siguiente';
    nextBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 14px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.1);
        transition: all 0.2s ease;
    `;
    nextBtn.addEventListener('click', () => {
        if (window.musicPlayer) {
            window.musicPlayer.playNext();
        }
    });
    
    // Botón de abrir en nueva pestaña
    const openLinkBtn = document.createElement('button');
    openLinkBtn.innerHTML = '<i class="fa-solid fa-up-right-from-square"></i>';
    openLinkBtn.title = 'Abrir en nueva pestaña';
    openLinkBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 14px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.1);
        transition: all 0.2s ease;
    `;
    openLinkBtn.addEventListener('click', () => {
        if (window.musicPlayer) {
            window.musicPlayer.openInNewTab();
        }
    });
    
    // Información de la canción actual
    const trackInfo = document.createElement('div');
    trackInfo.id = 'mini-track-info';
    trackInfo.style.cssText = `
        font-size: 12px;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
        color: white;
        margin-left: 10px;
    `;
    trackInfo.textContent = 'No hay música';
    
    // Actualizar la información de la canción cuando cambie
    const updateTrackInfo = () => {
        if (window.musicPlayer && window.musicPlayer.currentTrackIndex !== -1) {
            const track = window.musicPlayer.playlist[window.musicPlayer.currentTrackIndex];
            trackInfo.textContent = track.title;
        } else {
            trackInfo.textContent = 'No hay música';
        }
    };
    
    // Actualizar el botón de play/pause cuando cambie el estado
    const updatePlayPauseButton = () => {
        if (window.musicPlayer) {
            const icon = playPauseBtn.querySelector('i');
            if (icon) {
                if (window.musicPlayer.isPlaying) {
                    icon.className = 'fa-solid fa-pause';
                } else {
                    icon.className = 'fa-solid fa-play';
                }
            }
        }
    };
    
    // Escuchar cambios en el reproductor
    setInterval(() => {
        updateTrackInfo();
        updatePlayPauseButton();
    }, 1000);
    
    // Efectos hover
    const buttons = [prevBtn, playPauseBtn, stopBtn, nextBtn, openLinkBtn];
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
    
    container.appendChild(prevBtn);
    container.appendChild(playPauseBtn);
    container.appendChild(stopBtn);
    container.appendChild(nextBtn);
    container.appendChild(openLinkBtn);
    container.appendChild(trackInfo);
    
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
