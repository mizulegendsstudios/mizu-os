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
    
    // Sección central: reproductor de música
    const playerSection = createMusicPlayer();
    
    // Sección derecha: widget de estado (batería, wifi, volumen)
    const statusSection = createStatusSection();
    
    mainContainer.appendChild(timeSection);
    mainContainer.appendChild(playerSection);
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

// Crear reproductor de música con el motor integrado
function createMusicPlayer() {
    const container = document.createElement('div');
    container.className = 'music-player';
    container.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 8px 15px;
        max-width: 400px;
        width: 100%;
    `;
    
    // Información de la canción actual
    const trackInfo = document.createElement('div');
    trackInfo.id = 'current-track-info';
    trackInfo.style.cssText = `
        font-size: 12px;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        color: white;
    `;
    trackInfo.textContent = 'No hay música reproduciéndose';
    
    // Contenedor de controles
    const controlsContainer = document.createElement('div');
    controlsContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
    `;
    
    // Campo para ingresar URL
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.id = 'music-link';
    urlInput.placeholder = 'URL de música';
    urlInput.style.cssText = `
        background: transparent;
        border: none;
        color: white;
        outline: none;
        flex-grow: 1;
        font-size: 11px;
        padding: 4px 8px;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 15px;
    `;
    
    // Botón de añadir a playlist
    const addBtn = document.createElement('button');
    addBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
    addBtn.title = 'Añadir a playlist';
    addBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 12px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.1);
    `;
    
    // Botón de play/pause
    const playPauseBtn = document.createElement('button');
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    playPauseBtn.title = 'Reproducir/Pausar';
    playPauseBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 14px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.1);
    `;
    
    // Botón de stop
    const stopBtn = document.createElement('button');
    stopBtn.innerHTML = '<i class="fa-solid fa-stop"></i>';
    stopBtn.title = 'Detener';
    stopBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 12px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.1);
    `;
    
    // Botón de abrir en nueva pestaña
    const openLinkBtn = document.createElement('button');
    openLinkBtn.innerHTML = '<i class="fa-solid fa-up-right-from-square"></i>';
    openLinkBtn.title = 'Abrir en nueva pestaña';
    openLinkBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 12px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.1);
    `;
    
    // Control de volumen
    const volumeContainer = document.createElement('div');
    volumeContainer.style.cssText = 'display: flex; align-items: center; gap: 5px;';
    
    const volumeIcon = document.createElement('i');
    volumeIcon.className = 'fa-solid fa-volume-high';
    volumeIcon.style.cssText = 'color: white; font-size: 12px;';
    
    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '100';
    volumeSlider.value = '50';
    volumeSlider.style.cssText = 'width: 50px; height: 4px;';
    
    volumeContainer.appendChild(volumeIcon);
    volumeContainer.appendChild(volumeSlider);
    
    // Elemento de audio (oculto)
    const audioElement = document.createElement('audio');
    audioElement.style.display = 'none';
    
    // Variables del reproductor
    let playlist = [];
    let currentTrackIndex = -1;
    let isPlaying = false;
    let youtubePlayer = null;
    let isYouTubeApiReady = false;
    
    // Cargar el script de la API de YouTube Iframe
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    // Esta función es llamada por la API de YouTube cuando está lista
    window.onYouTubeIframeAPIReady = function() {
        console.log("YouTube Iframe Player API is ready.");
        isYouTubeApiReady = true;
    };
    
    // Extraer el ID de video de YouTube
    function extractYoutubeId(url) {
        let videoId = null;
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be') || urlObj.hostname.includes('music.youtube.com')) {
                const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
                const match = url.match(regExp);
                if (match && match[1].length === 11) {
                    videoId = match[1];
                }
            }
        } catch (e) {
            return null;
        }
        return videoId;
    }
    
    // Formatear segundos a mm:ss
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
    
    // Mostrar notificación
    function showNotification(message) {
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
    
    // Detener toda la reproducción de medios
    function stopAllMedia() {
        if (!audioElement.paused) {
            audioElement.pause();
            audioElement.removeAttribute('src');
        }
        if (youtubePlayer && typeof youtubePlayer.stopVideo === 'function') {
            youtubePlayer.stopVideo();
            youtubePlayer.destroy();
            youtubePlayer = null;
        }
    }
    
    // Reproducir una pista específica por índice
    function playTrack(index) {
        if (index >= 0 && index < playlist.length) {
            stopAllMedia();
            currentTrackIndex = index;
            const track = playlist[currentTrackIndex];
            
            if (track.source === 'YouTube' && track.videoId) {
                if (isYouTubeApiReady) {
                    if (youtubePlayer) {
                        youtubePlayer.loadVideoById(track.videoId);
                    } else {
                        youtubePlayer = new YT.Player('dynamic-player', {
                            height: '200',
                            width: '100%',
                            videoId: track.videoId,
                            playerVars: { 'playsinline': 1 },
                            events: {
                                'onReady': (event) => {
                                    event.target.playVideo();
                                },
                                'onStateChange': (event) => {
                                    if (event.data === YT.PlayerState.ENDED) {
                                        playNext();
                                    }
                                    if (event.data === YT.PlayerState.PLAYING) {
                                        isPlaying = true;
                                        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                                    }
                                }
                            }
                        });
                    }
                    isPlaying = true;
                    playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                } else {
                    showNotification("Error: La API de YouTube no está lista. Inténtalo de nuevo en unos segundos.");
                    isPlaying = false;
                }
            } else if (track.source === 'SoundCloud' || track.source === 'Mixcloud') {
                // Para estos servicios, abrimos en una nueva pestaña
                window.open(track.url, '_blank');
                isPlaying = true;
                playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            } else if (track.source === 'Local' && track.file) {
                const fileUrl = URL.createObjectURL(track.file);
                audioElement.src = fileUrl;
                audioElement.play();
                isPlaying = true;
                playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            }
            
            trackInfo.textContent = track.title || "Título Desconocido";
        }
    }
    
    // Reproducir la siguiente pista
    function playNext() {
        if (playlist.length > 0) {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
            playTrack(currentTrackIndex);
        }
    }
    
    // Eventos del reproductor
    playPauseBtn.addEventListener('click', () => {
        if (currentTrackIndex === -1) {
            if (playlist.length > 0) {
                playTrack(0);
            }
            return;
        }
        
        const track = playlist[currentTrackIndex];
        if (track.source === 'YouTube' && youtubePlayer) {
            if (isPlaying) {
                youtubePlayer.pauseVideo();
                playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            } else {
                youtubePlayer.playVideo();
                playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            }
        } else if (track.source === 'Local') {
            if (isPlaying) {
                audioElement.pause();
                playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            } else {
                audioElement.play();
                playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            }
        }
        isPlaying = !isPlaying;
    });
    
    stopBtn.addEventListener('click', () => {
        stopAllMedia();
        isPlaying = false;
        currentTrackIndex = -1;
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        trackInfo.textContent = 'No hay música reproduciéndose';
    });
    
    openLinkBtn.addEventListener('click', () => {
        if (currentTrackIndex !== -1) {
            const track = playlist[currentTrackIndex];
            window.open(track.url, '_blank');
        }
    });
    
    addBtn.addEventListener('click', async () => {
        const link = urlInput.value.trim();
        if (!link) {
            showNotification('Por favor, ingresa una URL de música');
            return;
        }
        
        const youtubeId = extractYoutubeId(link);
        const isSoundcloud = link.includes('soundcloud.com');
        const isMixcloud = link.includes('mixcloud.com');
        
        if (youtubeId) {
            const track = {
                title: 'Video de YouTube',
                source: 'YouTube',
                url: link,
                videoId: youtubeId
            };
            playlist.push(track);
            showNotification('Añadido a la playlist');
            if (playlist.length === 1) {
                playTrack(0);
            }
            urlInput.value = '';
        } else if (isSoundcloud || isMixcloud) {
            const track = {
                title: isSoundcloud ? 'Track de SoundCloud' : 'Mix de Mixcloud',
                source: isSoundcloud ? 'SoundCloud' : 'Mixcloud',
                url: link
            };
            playlist.push(track);
            showNotification('Añadido a la playlist');
            if (playlist.length === 1) {
                playTrack(0);
            }
            urlInput.value = '';
        } else {
            showNotification('Enlace no válido. Por favor, ingresa un enlace de YouTube, SoundCloud o Mixcloud');
        }
    });
    
    volumeSlider.addEventListener('input', () => {
        const volume = volumeSlider.value / 100;
        audioElement.volume = volume;
        if (youtubePlayer) {
            youtubePlayer.setVolume(volume * 100);
        }
    });
    
    // Eventos del elemento de audio
    audioElement.addEventListener('ended', playNext);
    audioElement.addEventListener('error', () => {
        playNext();
    });
    
    // Añadir elementos al contenedor
    controlsContainer.appendChild(urlInput);
    controlsContainer.appendChild(addBtn);
    controlsContainer.appendChild(playPauseBtn);
    controlsContainer.appendChild(stopBtn);
    controlsContainer.appendChild(openLinkBtn);
    controlsContainer.appendChild(volumeContainer);
    
    container.appendChild(trackInfo);
    container.appendChild(controlsContainer);
    container.appendChild(audioElement);
    
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
