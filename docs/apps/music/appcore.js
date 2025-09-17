/*
 * Mizu OS - Music App
 * Copyright (C) 2025 Mizu Legends Studios
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
/**
 * Aplicación de reproductor de música para Mizu OS
 * Soporta YouTube, SoundCloud, Mixcloud y archivos locales
 */
export default class MusicApp {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.playlist = [];
    this.currentTrackIndex = -1;
    this.isPlaying = false;
    this.youtubePlayer = null;
    this.isYouTubeApiReady = false;
    this.audioElement = null;
    this.panel = null;
    this.backgroundPlayer = null; // Nuevo: reproductor de fondo
    
    // Suscribirse a eventos de música
    this.setupEventListeners();
    
    // Cargar el script de la API de YouTube Iframe
    this.loadYouTubeAPI();
    
    // Inicializar con Mare.mp3 como pista por defecto
    this.initializeDefaultTrack();
  }
  
  // Nuevo: Inicializar con Mare.mp3 como pista por defecto
  initializeDefaultTrack() {
    const defaultTrack = {
      title: 'Mare',
      source: 'Local',
      url: 'https://github.com/mizulegendsstudios/mizu-os/blob/main/docs/assets/Mare.mp3?raw=true',
      isDefault: true
    };
    
    this.playlist.push(defaultTrack);
  }
  
  setupEventListeners() {
    // Eventos de control de música desde la barra roja
    this.eventBus.on('music:togglePlayPause', () => this.togglePlayPause());
    this.eventBus.on('music:playPrev', () => this.playPrev());
    this.eventBus.on('music:playNext', () => this.playNext());
    this.eventBus.on('music:toggleRepeat', () => this.toggleRepeat());
    this.eventBus.on('music:toggleVolume', () => this.toggleVolume());
  }
  
  // Cargar el script de la API de YouTube Iframe
  loadYouTubeAPI() {
    // Verificar si ya se ha cargado la API
    if (window.YT && window.YT.Player) {
      this.isYouTubeApiReady = true;
      return;
    }
    
    // Verificar si ya se está cargando
    if (document.getElementById('youtube-iframe-api')) {
      return;
    }
    
    const tag = document.createElement('script');
    tag.id = 'youtube-iframe-api';
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    // Esta función es llamada por la API de YouTube cuando está lista
    window.onYouTubeIframeAPIReady = () => {
      console.log("YouTube Iframe Player API is ready.");
      this.isYouTubeApiReady = true;
    };
  }
  
  // Método init requerido por el AppLoader
  init() {
    console.log('MusicApp: Inicializando aplicación de música');
    return Promise.resolve();
  }
  
  // Método render requerido por el AppLoader
  render() {
    console.log('MusicApp: Renderizando interfaz de música');
    
    // Crear el panel del reproductor
    const panel = document.createElement('div');
    panel.id = 'music-player-panel';
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
      overflow-y: auto;
    `;
    
    // Título del reproductor
    const title = document.createElement('h2');
    title.textContent = 'Reproductor de Música';
    title.style.cssText = `
      color: white;
      margin-bottom: 20px;
      text-align: center;
    `;
    
    // Información de la canción actual
    const trackInfo = document.createElement('div');
    trackInfo.id = 'current-track-info';
    trackInfo.style.cssText = `
      background: rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      padding: 15px;
      margin-bottom: 20px;
      text-align: center;
      color: white;
    `;
    
    const currentTrackTitle = document.createElement('div');
    currentTrackTitle.id = 'current-track-title';
    currentTrackTitle.style.cssText = 'font-size: 18px; font-weight: bold; margin-bottom: 5px;';
    currentTrackTitle.textContent = 'No hay música reproduciéndose';
    
    const currentTrackSource = document.createElement('div');
    currentTrackSource.id = 'current-track-source';
    currentTrackSource.style.cssText = 'font-size: 14px; opacity: 0.8;';
    
    trackInfo.appendChild(currentTrackTitle);
    trackInfo.appendChild(currentTrackSource);
    
    // Contenedor del reproductor de medios (YouTube/SoundCloud/Mixcloud)
    const mediaPlayerContainer = document.createElement('div');
    mediaPlayerContainer.id = 'media-player-container';
    mediaPlayerContainer.style.cssText = `
      width: 100%;
      height: 200px;
      margin-bottom: 20px;
      border-radius: 10px;
      overflow: hidden;
      display: none;
    `;
    
    const dynamicPlayer = document.createElement('div');
    dynamicPlayer.id = 'dynamic-player';
    mediaPlayerContainer.appendChild(dynamicPlayer);
    
    // Controles del reproductor
    const controlsContainer = document.createElement('div');
    controlsContainer.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-bottom: 20px;
    `;
    
    // Botones de control - CORREGIDO: usando bind para mantener el contexto
    const prevBtn = this.createControlButton('fa-backward', 'Anterior');
    const playPauseBtn = this.createControlButton('fa-play', 'Reproducir');
    const stopBtn = this.createControlButton('fa-stop', 'Detener');
    const nextBtn = this.createControlButton('fa-forward', 'Siguiente');
    const openLinkBtn = this.createControlButton('fa-up-right-from-square', 'Abrir');
    
    controlsContainer.appendChild(prevBtn);
    controlsContainer.appendChild(playPauseBtn);
    controlsContainer.appendChild(stopBtn);
    controlsContainer.appendChild(nextBtn);
    controlsContainer.appendChild(openLinkBtn);
    
    // Sección para añadir música
    const addMusicSection = document.createElement('div');
    addMusicSection.style.cssText = `
      background: rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      padding: 15px;
      margin-bottom: 20px;
    `;
    
    const addMusicTitle = document.createElement('h3');
    addMusicTitle.textContent = 'Añadir Música';
    addMusicTitle.style.cssText = `
      color: white;
      margin-bottom: 10px;
      font-size: 16px;
    `;
    
    const urlInputContainer = document.createElement('div');
    urlInputContainer.style.cssText = `
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    `;
    
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.id = 'music-url-input';
    urlInput.placeholder = 'URL de YouTube, SoundCloud o Mixcloud';
    urlInput.style.cssText = `
      flex-grow: 1;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.1);
      color: white;
      outline: none;
    `;
    
    const addBtn = document.createElement('button');
    addBtn.textContent = 'Añadir';
    addBtn.style.cssText = `
      padding: 10px 15px;
      border-radius: 5px;
      border: none;
      background: #6366f1;
      color: white;
      cursor: pointer;
      font-weight: bold;
    `;
    
    urlInputContainer.appendChild(urlInput);
    urlInputContainer.appendChild(addBtn);
    
    // Opción para cargar archivo local
    const loadFileContainer = document.createElement('div');
    loadFileContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
    `;
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'audio/*';
    fileInput.style.display = 'none';
    
    const loadFileBtn = document.createElement('button');
    loadFileBtn.textContent = 'Cargar archivo local';
    loadFileBtn.style.cssText = `
      padding: 8px 12px;
      border-radius: 5px;
      border: none;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      cursor: pointer;
      font-size: 14px;
    `;
    
    loadFileContainer.appendChild(loadFileBtn);
    loadFileContainer.appendChild(fileInput);
    
    addMusicSection.appendChild(addMusicTitle);
    addMusicSection.appendChild(urlInputContainer);
    addMusicSection.appendChild(loadFileContainer);
    
    // Playlist
    const playlistSection = document.createElement('div');
    playlistSection.style.cssText = `
      background: rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      padding: 15px;
      flex-grow: 1;
      overflow-y: auto;
    `;
    
    const playlistTitle = document.createElement('h3');
    playlistTitle.textContent = 'Playlist';
    playlistTitle.style.cssText = `
      color: white;
      margin-bottom: 10px;
      font-size: 16px;
    `;
    
    const playlistContainer = document.createElement('div');
    playlistContainer.id = 'playlist-container';
    playlistContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    
    const emptyPlaylistMessage = document.createElement('div');
    emptyPlaylistMessage.textContent = 'Tu playlist está vacía';
    emptyPlaylistMessage.style.cssText = `
      color: rgba(255, 255, 255, 0.5);
      text-align: center;
      padding: 20px;
    `;
    playlistContainer.appendChild(emptyPlaylistMessage);
    
    playlistSection.appendChild(playlistTitle);
    playlistSection.appendChild(playlistContainer);
    
    // Elemento de audio (oculto)
    this.audioElement = document.createElement('audio');
    this.audioElement.style.display = 'none';
    this.audioElement.addEventListener('ended', () => this.playNext());
    
    // Ensamblar el panel
    panel.appendChild(title);
    panel.appendChild(trackInfo);
    panel.appendChild(mediaPlayerContainer);
    panel.appendChild(controlsContainer);
    panel.appendChild(addMusicSection);
    panel.appendChild(playlistSection);
    panel.appendChild(this.audioElement);
    
    // Guardar referencias a elementos importantes
    this.panel = panel;
    this.currentTrackTitleEl = currentTrackTitle;
    this.currentTrackSourceEl = currentTrackSource;
    this.playlistContainerEl = playlistContainer;
    this.playPauseBtnEl = playPauseBtn;
    this.mediaPlayerContainerEl = mediaPlayerContainer;
    this.dynamicPlayerEl = dynamicPlayer;
    
    // Adjuntar eventos después de crear todos los elementos - CORREGIDO
    prevBtn.addEventListener('click', () => this.playPrev());
    playPauseBtn.addEventListener('click', () => this.togglePlayPause());
    stopBtn.addEventListener('click', () => this.stop());
    nextBtn.addEventListener('click', () => this.playNext());
    openLinkBtn.addEventListener('click', () => this.openInNewTab());
    
    addBtn.addEventListener('click', () => {
      const url = urlInput.value.trim();
      if (url) {
        this.addTrack(url);
        urlInput.value = '';
      }
    });
    
    loadFileBtn.addEventListener('click', () => {
      fileInput.click();
    });
    
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.addLocalTrack(file);
      }
    });
    
    return panel;
  }
  
  // Método destroy modificado para no detener la música
  destroy() {
    console.log('MusicApp: Destruyendo aplicación de música');
    
    // NO detener la reproducción al cerrar la aplicación
    // Solo ocultar el panel de la interfaz
    
    if (this.panel && this.panel.parentNode) {
      // En lugar de eliminar el panel, lo ocultamos
      this.panel.style.display = 'none';
    }
    
    // Si hay una canción reproduciéndose, crear un reproductor de fondo
    if (this.isPlaying && this.currentTrackIndex !== -1) {
      this.createBackgroundPlayer();
    }
  }
  
  // Nuevo: Crear un reproductor de fondo que no se detiene al cerrar la app
  createBackgroundPlayer() {
    // Si ya existe un reproductor de fondo, no crear otro
    if (this.backgroundPlayer) {
      return;
    }
    
    const track = this.playlist[this.currentTrackIndex];
    
    // Crear un elemento de audio oculto para la reproducción de fondo
    this.backgroundPlayer = document.createElement('audio');
    this.backgroundPlayer.style.cssText = `
      position: fixed;
      bottom: -100px;
      left: -100px;
      width: 1px;
      height: 1px;
      opacity: 0;
      z-index: -1;
    `;
    
    // Configurar el reproductor según el tipo de pista
    if (track.source === 'Local' || track.isDefault) {
      this.backgroundPlayer.src = track.url;
      this.backgroundPlayer.loop = true; // Repetir la canción en bucle
      this.backgroundPlayer.volume = 0.5;
      
      // Eventos para el reproductor de fondo
      this.backgroundPlayer.addEventListener('ended', () => {
        // Si termina, volver a reproducir
        this.backgroundPlayer.play();
      });
      
      this.backgroundPlayer.addEventListener('error', () => {
        console.error('Error en el reproductor de fondo');
      });
      
      // Iniciar reproducción
      this.backgroundPlayer.play().catch(error => {
        console.error('Error al iniciar el reproductor de fondo:', error);
      });
    } else {
      // Para YouTube, SoundCloud, etc., no podemos crear un reproductor de fondo
      // porque requieren iframes o APIs específicas
      console.log('No se puede crear reproductor de fondo para este tipo de pista:', track.source);
      this.backgroundPlayer = null;
      return;
    }
    
    // Añadir el reproductor de fondo al documento
    document.body.appendChild(this.backgroundPlayer);
    
    // Crear un pequeño controlador flotante para el reproductor de fondo
    this.createBackgroundController();
  }
  
  // Nuevo: Crear un controlador flotante para el reproductor de fondo
  createBackgroundController() {
    if (!this.backgroundPlayer) return;
    
    const controller = document.createElement('div');
    controller.id = 'background-music-controller';
    controller.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(30, 30, 30, 0.9);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 30px;
      padding: 10px 15px;
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 1000;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    `;
    
    // Icono de música
    const musicIcon = document.createElement('div');
    musicIcon.innerHTML = '🎵';
    musicIcon.style.cssText = 'font-size: 16px;';
    
    // Información de la canción
    const trackInfo = document.createElement('div');
    trackInfo.style.cssText = 'font-size: 12px; color: white; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
    trackInfo.textContent = this.playlist[this.currentTrackIndex].title;
    
    // Botón de play/pause
    const playPauseBtn = document.createElement('button');
    playPauseBtn.innerHTML = this.backgroundPlayer.paused ? '▶️' : '⏸️';
    playPauseBtn.style.cssText = `
      background:
