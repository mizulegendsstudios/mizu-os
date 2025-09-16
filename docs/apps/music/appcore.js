// apps/music/appcore.js
/*
 * Mizu OS - Music App
 * Copyright (C) 2025 Mizu Legends Studios
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */
// apps/music/appcore.js
export default class MusicApp {
    constructor(eventBus, config) {
        this.eventBus = eventBus;
        this.config = config;
        this.container = null;
        this.playlist = [];
        this.currentTrackIndex = -1;
        this.isPlaying = false;
        this.youtubePlayer = null;
        this.isYouTubeApiReady = false;
        this.audioElement = null;
        this.originalPlaylist = [];
        this.isShuffled = false;
        this.repeatMode = 'no-repeat'; // 'no-repeat', 'repeat-all', 'repeat-one'
        
        // Cargar el script de la API de YouTube Iframe
        this.loadYouTubeAPI();
        
        // Suscribirse a eventos de control
        this.subscribeToControlEvents();
    }
    
    // Suscribirse a eventos de control
    subscribeToControlEvents() {
        this.eventBus.on('music:togglePlayPause', () => {
            this.togglePlayPause();
        });
        
        this.eventBus.on('music:stop', () => {
            this.stop();
        });
        
        this.eventBus.on('music:playPrev', () => {
            this.playPrev();
        });
        
        this.eventBus.on('music:playNext', () => {
            this.playNext();
        });
        
        this.eventBus.on('music:toggleRepeat', () => {
            this.toggleRepeatMode();
        });
        
        this.eventBus.on('music:toggleVolume', () => {
            this.toggleVolume();
        });
    }
    
    // Método init: se llama cuando se carga la aplicación
    async init() {
        console.log('MusicApp: Inicializando aplicación de música');
    }
    
    // Método activate: se llama cuando se activa la aplicación
    async activate(container) {
        console.log('MusicApp: Activando aplicación de música');
        this.container = container;
        this.createMusicPlayerPanel();
    }
    
    // Método deactivate: se llama cuando se desactiva la aplicación
    async deactivate() {
        console.log('MusicApp: Desactivando aplicación de música');
        this.stop();
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
    
    // Cargar el script de la API de YouTube Iframe
    loadYouTubeAPI() {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
        // Esta función es llamada por la API de YouTube cuando está lista
        window.onYouTubeIframeAPIReady = () => {
            console.log("YouTube Iframe Player API is ready.");
            this.isYouTubeApiReady = true;
        };
    }
    
    // Crear panel del reproductor en el contenedor proporcionado
    createMusicPlayerPanel() {
        if (!this.container) {
            console.error('No se encontró el contenedor para la aplicación de música');
            return;
        }
        
        // Limpiar contenedor
        this.container.innerHTML = '';
        
        // Crear el panel del reproductor
        const panel = document.createElement('div');
        panel.className = 'music-player-panel';
        panel.style.cssText = `
            width: 100%;
            height: 100%;
            background: rgba(30, 30, 30, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 0.5rem;
            padding: 20px;
            display: flex;
            flex-direction: column;
            z-index: 642;
            overflow-y: auto;
            font-family: 'Inter', sans-serif;
            color: #fff;
        `;
        
        // Título del reproductor
        const title = document.createElement('h1');
        title.textContent = 'Mizu Music Player';
        title.style.cssText = `
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 1.5rem;
            text-align: center;
            background: linear-gradient(45deg, #00C4FF, #F400F8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        `;
        
        // Información de la canción actual
        const trackInfo = document.createElement('div');
        trackInfo.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 1.5rem;
        `;
        
        const currentTrackTitle = document.createElement('div');
        currentTrackTitle.id = 'current-track-title';
        currentTrackTitle.style.cssText = `
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        `;
        currentTrackTitle.textContent = 'No hay música reproduciéndose';
        
        const currentTrackSource = document.createElement('div');
        currentTrackSource.id = 'current-track-source';
        currentTrackSource.style.cssText = `
            font-size: 0.875rem;
            color: #ccc;
        `;
        
        trackInfo.appendChild(currentTrackTitle);
        trackInfo.appendChild(currentTrackSource);
        
        // Contenedor del reproductor de medios
        const mediaPlayerContainer = document.createElement('div');
        mediaPlayerContainer.id = 'media-player-container';
        mediaPlayerContainer.style.cssText = `
            width: 100%;
            height: 200px;
            margin-bottom: 1.5rem;
            border-radius: 0.375rem;
            overflow: hidden;
            display: none;
        `;
        
        const dynamicPlayer = document.createElement('div');
        dynamicPlayer.id = 'dynamic-player';
        mediaPlayerContainer.appendChild(dynamicPlayer);
        
        // Barra de progreso
        const progressBarContainer = document.createElement('div');
        progressBarContainer.style.cssText = `
            width: 100%;
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
        `;
        
        const currentTime = document.createElement('span');
        currentTime.id = 'current-time';
        currentTime.textContent = '0:00';
        
        const progressBar = document.createElement('input');
        progressBar.id = 'progress-bar';
        progressBar.type = 'range';
        progressBar.value = '0';
        progressBar.step = '1';
        progressBar.style.cssText = `
            flex-grow: 1;
            -webkit-appearance: none;
            appearance: none;
            background: transparent;
            cursor: pointer;
            --progress: 0%;
        `;
        
        const duration = document.createElement('span');
        duration.id = 'duration';
        duration.textContent = '0:00';
        
        progressBarContainer.appendChild(currentTime);
        progressBarContainer.appendChild(progressBar);
        progressBarContainer.appendChild(duration);
        
        // Controles del reproductor
        const controlsContainer = document.createElement('div');
        controlsContainer.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
        `;
        
        // Botón de mezclar
        const shuffleBtn = this.createControlButton('fa-random', 'Mezclar', () => this.shufflePlaylist(), 'secondary-btn');
        
        // Botón anterior
        const prevBtn = this.createControlButton('fa-backward', 'Anterior', () => this.playPrev(), 'secondary-btn');
        
        // Botón de play/pausa
        const playPauseBtn = this.createControlButton('fa-play', 'Reproducir', () => this.togglePlayPause(), 'main-play-btn');
        
        // Botón siguiente
        const nextBtn = this.createControlButton('fa-forward', 'Siguiente', () => this.playNext(), 'secondary-btn');
        
        // Botón de repetir
        const repeatBtn = this.createControlButton('fa-redo', 'Repetir', () => this.toggleRepeatMode(), 'secondary-btn');
        
        controlsContainer.appendChild(shuffleBtn);
        controlsContainer.appendChild(prevBtn);
        controlsContainer.appendChild(playPauseBtn);
        controlsContainer.appendChild(nextBtn);
        controlsContainer.appendChild(repeatBtn);
        
        // Control de volumen
        const volumeContainer = document.createElement('div');
        volumeContainer.style.cssText = `
            width: 100%;
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
        `;
        
        const volumeDownIcon = document.createElement('i');
        volumeDownIcon.className = 'fas fa-volume-down';
        volumeDownIcon.style.color = '#fff';
        
        const volumeBar = document.createElement('input');
        volumeBar.id = 'volume-bar';
        volumeBar.type = 'range';
        volumeBar.value = '100';
        volumeBar.style.cssText = `
            flex-grow: 1;
            -webkit-appearance: none;
            appearance: none;
            background: transparent;
            cursor: pointer;
            --progress: 100%;
        `;
        
        const volumeUpIcon = document.createElement('i');
        volumeUpIcon.className = 'fas fa-volume-up';
        volumeUpIcon.style.color = '#fff';
        
        volumeContainer.appendChild(volumeDownIcon);
        volumeContainer.appendChild(volumeBar);
        volumeContainer.appendChild(volumeUpIcon);
        
        // Sección para añadir música
        const addMusicSection = document.createElement('div');
        addMusicSection.style.cssText = `
            margin-bottom: 1.5rem;
        `;
        
        const urlInputContainer = document.createElement('div');
        urlInputContainer.style.cssText = `
            display: flex;
            margin-bottom: 0.5rem;
        `;
        
        const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.id = 'music-link';
        urlInput.placeholder = 'YouTube, SoundCloud, Mixcloud';
        urlInput.style.cssText = `
            flex-grow: 1;
            padding: 0.75rem;
            border-radius: 0.5rem 0 0 0.5rem;
            background: #374151;
            color: #e5e7eb;
            border: none;
            outline: none;
        `;
        
        const addBtn = document.createElement('button');
        addBtn.textContent = 'Añadir a la Playlist';
        addBtn.style.cssText = `
            padding: 0.75rem 1.5rem;
            border-radius: 0 0.5rem 0.5rem 0;
            background: #fff;
            color: #000;
            font-weight: 600;
            border: none;
            cursor: pointer;
        `;
        addBtn.addEventListener('click', () => {
            const url = urlInput.value.trim();
            if (url) {
                this.parseMusicLink(url);
                urlInput.value = '';
            }
        });
        
        urlInputContainer.appendChild(urlInput);
        urlInputContainer.appendChild(addBtn);
        
        const errorMessage = document.createElement('div');
        errorMessage.id = 'error-message';
        errorMessage.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.5rem;
            display: none;
        `;
        
        // Opción para cargar archivo local
        const loadFileContainer = document.createElement('div');
        loadFileContainer.style.cssText = `
            display: flex;
            justify-content: center;
            margin-top: 0.5rem;
        `;
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'audio/*';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.addLocalTrack(file);
            }
        });
        
        const loadFileBtn = document.createElement('button');
        loadFileBtn.textContent = 'Cargar archivo local';
        loadFileBtn.style.cssText = `
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            background: linear-gradient(90deg, #1D4ED8, #3B82F6);
            color: #fff;
            font-weight: 500;
            border: none;
            cursor: pointer;
        `;
        loadFileBtn.addEventListener('click', () => {
            fileInput.click();
        });
        
        loadFileContainer.appendChild(loadFileBtn);
        loadFileContainer.appendChild(fileInput);
        
        addMusicSection.appendChild(urlInputContainer);
        addMusicSection.appendChild(errorMessage);
        addMusicSection.appendChild(loadFileContainer);
        
        // Playlist
        const playlistSection = document.createElement('div');
        playlistSection.style.cssText = `
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        `;
        
        const playlistTitle = document.createElement('h2');
        playlistTitle.textContent = 'Playlist';
        playlistTitle.style.cssText = `
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
        `;
        
        const playlistContainer = document.createElement('div');
        playlistContainer.id = 'playlist';
        playlistContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            max-height: 16rem;
            overflow-y: auto;
            padding-right: 0.5rem;
        `;
        
        const emptyPlaylistMessage = document.createElement('div');
        emptyPlaylistMessage.id = 'empty-playlist-message';
        emptyPlaylistMessage.textContent = 'Tu playlist está vacía.';
        emptyPlaylistMessage.style.cssText = `
            text-align: center;
            color: #9ca3af;
            padding: 1rem;
        `;
        playlistContainer.appendChild(emptyPlaylistMessage);
        
        playlistSection.appendChild(playlistTitle);
        playlistSection.appendChild(playlistContainer);
        
        // Elemento de audio (oculto)
        this.audioElement = document.createElement('audio');
        this.audioElement.id = 'audio-player';
        this.audioElement.style.display = 'none';
        this.audioElement.addEventListener('ended', () => this.playNext());
        this.audioElement.addEventListener('timeupdate', () => this.updateProgressBar());
        
        // Overlay de carga
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 100;
            color: white;
            font-size: 1.25rem;
            flex-direction: column;
            display: none;
        `;
        
        const spinner = document.createElement('div');
        spinner.style.cssText = `
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid #fff;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
        `;
        
        const loadingText = document.createElement('p');
        loadingText.textContent = 'Cargando...';
        loadingText.style.cssText = 'margin-top: 1rem;';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(loadingText);
        
        // Ensamblar el panel
        panel.appendChild(title);
        panel.appendChild(trackInfo);
        panel.appendChild(mediaPlayerContainer);
        panel.appendChild(progressBarContainer);
        panel.appendChild(controlsContainer);
        panel.appendChild(volumeContainer);
        panel.appendChild(addMusicSection);
        panel.appendChild(playlistSection);
        panel.appendChild(this.audioElement);
        panel.appendChild(loadingOverlay);
        
        // Añadir el panel al contenedor
        this.container.appendChild(panel);
        this.panel = panel;
        
        // Guardar referencias a elementos importantes
        this.currentTrackTitleEl = currentTrackTitle;
        this.currentTrackSourceEl = currentTrackSource;
        this.playlistContainerEl = playlistContainer;
        this.playPauseBtnEl = playPauseBtn;
        this.shuffleBtnEl = shuffleBtn;
        this.repeatBtnEl = repeatBtn;
        this.mediaPlayerContainerEl = mediaPlayerContainer;
        this.dynamicPlayerEl = dynamicPlayer;
        this.progressBarEl = progressBar;
        this.volumeBarEl = volumeBar;
        this.currentTimeEl = currentTime;
        this.durationEl = duration;
        this.errorMessageEl = errorMessage;
        this.emptyPlaylistMessageEl = emptyPlaylistMessage;
        this.loadingOverlayEl = loadingOverlay;
        
        // Añadir estilos CSS personalizados
        this.addCustomStyles();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Inicializar UI
        this.updateUI();
        this.renderPlaylist();
    }
    
    // Añadir estilos CSS personalizados
    addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .icon-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease-in-out;
                border-radius: 9999px;
            }
            
            .icon-btn i {
                font-size: 1.5rem;
                color: #fff;
            }
            
            .icon-btn:hover {
                transform: scale(1.1);
            }
            
            .icon-btn:active {
                transform: scale(0.9);
            }
            
            .main-play-btn {
                background: linear-gradient(45deg, #FF6B6B, #F8E300);
                box-shadow: 0 4px 15px rgba(255, 107, 107, 0.5);
                padding: 1rem;
            }
            
            .secondary-btn {
                background: rgba(255, 255, 255, 0.1);
                padding: 0.75rem;
            }
            
            input[type="range"] {
                -webkit-appearance: none;
                appearance: none;
                background: transparent;
                cursor: pointer;
                --progress: 0%;
            }
            
            input[type="range"]::-webkit-slider-runnable-track {
                background: linear-gradient(to right, #F8E300 var(--progress), rgba(255, 255, 255, 0.5) var(--progress));
                height: 8px;
                border-radius: 4px;
            }
            
            input[type="range"]::-moz-range-track {
                background: linear-gradient(to right, #F8E300 var(--progress), rgba(255, 255, 255, 0.5) var(--progress));
                height: 8px;
                border-radius: 4px;
            }
            
            input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                margin-top: -6px;
                height: 20px;
                width: 20px;
                background: #fff;
                border-radius: 50%;
                box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
            }
            
            input[type="range"]::-moz-range-thumb {
                background: #fff;
                height: 20px;
                width: 20px;
                border-radius: 50%;
                border: none;
            }
            
            .playlist-item {
                background-color: rgba(255, 255, 255, 0.1);
                padding: 0.75rem;
                border-radius: 0.5rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .playlist-item:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }
            
            .active-track {
                background-color: rgba(255, 255, 255, 0.3);
                border-left: 4px solid #fff;
            }
        `;
        
        this.panel.appendChild(style);
    }
    
    // Configurar event listeners
    setupEventListeners() {
        this.progressBarEl.addEventListener('input', () => this.handleSeek());
        this.volumeBarEl.addEventListener('input', () => this.handleVolumeChange());
    }
    
    // Crear botón de control
    createControlButton(iconClass, title, clickHandler, btnClass) {
        const button = document.createElement('button');
        button.className = `icon-btn ${btnClass}`;
        button.title = title;
        button.addEventListener('click', clickHandler);
        
        const icon = document.createElement('i');
        icon.className = `fas ${iconClass}`;
        
        button.appendChild(icon);
        
        return button;
    }
    
    // Mostrar overlay de carga
    showLoading() {
        this.loadingOverlayEl.style.display = 'flex';
    }
    
    // Ocultar overlay de carga
    hideLoading() {
        this.loadingOverlayEl.style.display = 'none';
    }
    
    // Formatear tiempo a mm:ss
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
    
    // Actualizar barra de progreso
    updateProgressBar() {
        if (this.audioElement.duration) {
            this.progressBarEl.value = (this.audioElement.currentTime / this.audioElement.duration) * 100;
            this.currentTimeEl.textContent = this.formatTime(this.audioElement.currentTime);
            this.durationEl.textContent = this.formatTime(this.audioElement.duration);
            this.updateProgressBarBg();
        }
    }
    
    // Actualizar fondo de la barra de progreso
    updateProgressBarBg() {
        this.progressBarEl.style.setProperty('--progress', `${this.progressBarEl.value}%`);
    }
    
    // Manejar búsqueda en la barra de progreso
    handleSeek() {
        const seekTime = (this.progressBarEl.value / 100) * (this.audioElement.duration || (this.youtubePlayer ? this.youtubePlayer.getDuration() : 0));
        const currentTrack = this.playlist[this.currentTrackIndex];
        if (currentTrack?.source === 'YouTube' && this.youtubePlayer) {
            this.youtubePlayer.seekTo(seekTime, true);
        } else if (currentTrack?.source === 'Local' && this.audioElement.duration) {
            this.audioElement.currentTime = seekTime;
        }
        this.updateProgressBarBg();
    }
    
    // Manejar cambio de volumen
    handleVolumeChange() {
        const volume = this.volumeBarEl.value / 100;
        const currentTrack = this.playlist[this.currentTrackIndex];
        if (currentTrack?.source === 'YouTube' && this.youtubePlayer) {
            this.youtubePlayer.setVolume(volume * 100);
        } else {
            this.audioElement.volume = volume;
        }
        this.volumeBarEl.style.setProperty('--progress', `${this.volumeBarEl.value}%`);
    }
    
    // Toggle volume (silenciar/restaurar)
    toggleVolume() {
        if (this.audioElement) {
            if (this.audioElement.volume > 0) {
                this.audioElement.volume = 0;
                this.volumeBarEl.value = 0;
                this.showNotification('Silenciado');
            } else {
                this.audioElement.volume = 1;
                this.volumeBarEl.value = 100;
                this.showNotification('Volumen restaurado');
            }
            this.handleVolumeChange();
        }
        
        if (this.youtubePlayer) {
            if (this.youtubePlayer.isMuted()) {
                this.youtubePlayer.unMute();
                this.showNotification('Volumen restaurado');
            } else {
                this.youtubePlayer.mute();
                this.showNotification('Silenciado');
            }
        }
    }
    
    // Extraer el ID de video de YouTube
    extractYoutubeId(url) {
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
    
    // Procesar enlace de música
    async parseMusicLink(link) {
        this.errorMessageEl.style.display = 'none';
        const youtubeId = this.extractYoutubeId(link);
        const isSoundcloud = link.includes('soundcloud.com');
        const isMixcloud = link.includes('mixcloud.com');
        
        if (youtubeId) {
            this.showLoading();
            try {
                const response = await fetch(`https://noembed.com/embed?url=${link}`);
                if (!response.ok) throw new Error('Error al obtener los metadatos del video.');
                const data = await response.json();
                
                if (data.error) throw new Error(data.error);
                
                const title = data.title || 'Título de YouTube';
                const track = {
                    title: title,
                    source: 'YouTube',
                    url: link,
                    videoId: youtubeId
                };
                this.addTrack(track, this.playlist.length === 0);
            } catch (e) {
                console.error('Error al obtener el título del video:', e);
                this.errorMessageEl.textContent = 'No se pudo obtener el título. Asegúrate de que el enlace sea válido.';
                this.errorMessageEl.style.display = 'block';
                const fallbackTrack = {
                    title: 'Video de YouTube',
                    source: 'YouTube',
                    url: link,
                    videoId: youtubeId
                };
                this.addTrack(fallbackTrack, this.playlist.length === 0);
            } finally {
                this.hideLoading();
            }
        } else if (isSoundcloud) {
            this.showLoading();
            try {
                const response = await fetch(`https://noembed.com/embed?url=${link}`);
                if (!response.ok) throw new Error('Error al obtener los metadatos de SoundCloud.');
                const data = await response.json();
                
                if (data.error) throw new Error(data.error);
                
                const title = data.title || 'Título de SoundCloud';
                const track = {
                    title: title,
                    source: 'SoundCloud',
                    url: link,
                    embedHtml: data.html
                };
                this.addTrack(track, this.playlist.length === 0);
            } catch (e) {
                console.error('Error al obtener el título de SoundCloud:', e);
                this.errorMessageEl.textContent = 'No se pudo obtener el título. Asegúrate de que el enlace sea válido.';
                this.errorMessageEl.style.display = 'block';
                const fallbackTrack = {
                    title: 'Track de SoundCloud',
                    source: 'SoundCloud',
                    url: link,
                    embedHtml: ''
                };
                this.addTrack(fallbackTrack, this.playlist.length === 0);
            } finally {
                this.hideLoading();
            }
        } else if (isMixcloud) {
            this.showLoading();
            try {
                const corsProxy = 'https://api.allorigins.win/raw?url=';
                const apiUrl = `https://www.mixcloud.com/oembed/?url=${encodeURIComponent(link)}`;
                const response = await fetch(`${corsProxy}${apiUrl}`);
                if (!response.ok) throw new Error('Error al obtener los metadatos de Mixcloud.');
                const data = await response.json();
                
                if (data.error) throw new Error(data.error);
                
                const title = data.title || 'Título de Mixcloud';
                const track = {
                    title: title,
                    source: 'Mixcloud',
                    url: link,
                    embedHtml: data.html
                };
                this.addTrack(track, this.playlist.length === 0);
            } catch (e) {
                console.error('Error al obtener el título de Mixcloud:', e);
                this.errorMessageEl.textContent = 'No se pudo obtener el título. Asegúrate de que el enlace sea válido.';
                this.errorMessageEl.style.display = 'block';
                const fallbackTrack = {
                    title: 'Mix de Mixcloud',
                    source: 'Mixcloud',
                    url: link,
                    embedHtml: ''
                };
                this.addTrack(fallbackTrack, this.playlist.length === 0);
            } finally {
                this.hideLoading();
            }
        } else {
            this.errorMessageEl.textContent = 'Enlace no válido. Por favor, ingrese un enlace de YouTube, SoundCloud o Mixcloud.';
            this.errorMessageEl.style.display = 'block';
        }
    }
    
    // Añadir una pista a la playlist
    addTrack(track, autoPlay = false) {
        const wasEmpty = this.playlist.length === 0;
        this.playlist.push(track);
        if (!this.isShuffled) {
            this.originalPlaylist.push(track);
        }
        this.renderPlaylist();
        
        // Lógica para reproducir si la playlist estaba vacía, o si se especificó explícitamente.
        if (autoPlay || wasEmpty) {
            this.playTrack(this.playlist.length - 1);
        }
        
        this.showNotification('Añadido a la playlist');
    }
    
    // Añadir pista local
    addLocalTrack(file) {
        const wasEmpty = this.playlist.length === 0;
        const track = {
            title: file.name,
            source: 'Local',
            file: file
        };
        this.addTrack(track, wasEmpty);
    }
    
    // Eliminar una pista de la playlist
    removeTrack(index) {
        // Revoke the object URL if it's a local file to free up memory
        if (this.playlist[index]?.source === 'Local' && this.playlist[index]?.fileUrl) {
            URL.revokeObjectURL(this.playlist[index].fileUrl);
        }
        
        this.playlist.splice(index, 1);
        if (this.isShuffled) {
            this.originalPlaylist.splice(index, 1);
        }
        
        if (index === this.currentTrackIndex) {
            this.stopAllMedia();
            this.isPlaying = false;
            this.currentTrackIndex = -1;
        } else if (index < this.currentTrackIndex) {
            this.currentTrackIndex--;
        }
        
        this.renderPlaylist();
        this.showNotification('Pista eliminada de la playlist');
    }
    
    // Renderizar playlist
    renderPlaylist() {
        this.playlistContainerEl.innerHTML = '';
        
        if (this.playlist.length === 0) {
            this.emptyPlaylistMessageEl.style.display = 'block';
        } else {
            this.emptyPlaylistMessageEl.style.display = 'none';
            
            this.playlist.forEach((track, index) => {
                const item = document.createElement('div');
                item.className = 'playlist-item';
                
                if (index === this.currentTrackIndex) {
                    item.classList.add('active-track');
                }
                
                item.innerHTML = `
                    <span>${index + 1}. ${track.title || "Título Desconocido"}</span>
                    <button class="text-white hover:text-gray-400" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                
                item.addEventListener('click', () => this.playTrack(index));
                
                item.querySelector('button').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.removeTrack(index);
                });
                
                this.playlistContainerEl.appendChild(item);
            });
        }
        
        this.updateUI();
    }
    
    // Mezclar playlist
    shufflePlaylist() {
        if (this.playlist.length <= 1) return;
        
        if (this.isShuffled) {
            this.playlist = [...this
