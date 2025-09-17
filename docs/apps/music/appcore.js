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
    this.isVisible = true; // Nuevo estado para controlar visibilidad
    
    // Suscribirse a eventos de música
    this.setupEventListeners();
    
    // Cargar el script de la API de YouTube Iframe
    this.loadYouTubeAPI();
  }
  
  setupEventListeners() {
    // Eventos de control de música desde la barra roja
    this.eventBus.on('music:togglePlayPause', () => this.togglePlayPause());
    this.eventBus.on('music:playPrev', () => this.playPrev());
    this.eventBus.on('music:playNext', () => this.playNext());
    this.eventBus.on('music:toggleRepeat', () => this.toggleRepeat());
    this.eventBus.on('music:toggleVolume', () => this.toggleVolume());
    
    // Nuevo evento para alternar visibilidad del reproductor
    this.eventBus.on('music:toggleVisibility', () => this.toggleVisibility());
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
    
    // Cargar la música por defecto si la playlist está vacía
    if (this.playlist.length === 0) {
      this.loadDefaultTrack();
    }
    
    return Promise.resolve();
  }
  
  // Nuevo método para cargar la pista por defecto
  loadDefaultTrack() {
    const defaultTrack = {
      title: 'Mare (Mizu OS Theme)',
      source: 'Local',
      url: 'https://raw.githubusercontent.com/mizulegendsstudios/mizu-os/main/docs/assets/Mare.mp3'
    };
    
    this.playlist.push(defaultTrack);
    this.updatePlaylist();
    
    // Reproducir automáticamente la pista por defecto
    this.playTrack(0);
  }
  
  // Nuevo método para alternar la visibilidad del reproductor
  toggleVisibility() {
    if (!this.panel) return;
    
    this.isVisible = !this.isVisible;
    this.panel.style.display = this.isVisible ? 'flex' : 'none';
    
    // Notificar al sistema que la app está "oculta" pero no destruida
    this.eventBus.emit('app:visibilityChanged', {
      appId: 'music',
      isVisible: this.isVisible
    });
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
    
    // Botones de control
    const prevBtn = this.createControlButton('fa-backward', 'Anterior');
    const playPauseBtn = this.createControlButton('fa-play', 'Reproducir');
    const stopBtn = this.createControlButton('fa-stop', 'Detener');
    const nextBtn = this.createControlButton('fa-forward', 'Siguiente');
    const openLinkBtn = this.createControlButton('fa-up-right-from-square', 'Abrir');
    const hideBtn = this.createControlButton('fa-eye-slash', 'Ocultar'); // Nuevo botón para ocultar
    
    controlsContainer.appendChild(prevBtn);
    controlsContainer.appendChild(playPauseBtn);
    controlsContainer.appendChild(stopBtn);
    controlsContainer.appendChild(nextBtn);
    controlsContainer.appendChild(openLinkBtn);
    controlsContainer.appendChild(hideBtn); // Añadir el nuevo botón
    
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
    
    // Adjuntar eventos después de crear todos los elementos
    prevBtn.addEventListener('click', () => this.playPrev());
    playPauseBtn.addEventListener('click', () => this.togglePlayPause());
    stopBtn.addEventListener('click', () => this.stop());
    nextBtn.addEventListener('click', () => this.playNext());
    openLinkBtn.addEventListener('click', () => this.openInNewTab());
    hideBtn.addEventListener('click', () => this.toggleVisibility()); // Evento para el nuevo botón
    
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
  
  // Método destroy modificado para ocultar en lugar de destruir
  destroy() {
    console.log('MusicApp: Ocultando aplicación de música (no destruyendo)');
    
    // En lugar de destruir, ocultar el panel
    if (this.panel) {
      this.panel.style.display = 'none';
      this.isVisible = false;
    }
    
    // Notificar al sistema que la app está oculta pero no destruida
    this.eventBus.emit('app:visibilityChanged', {
      appId: 'music',
      isVisible: false
    });
    
    // NO detener la música ni eliminar elementos del DOM
  }
  
  // Crear botón de control
  createControlButton(iconClass, title) {
    const button = document.createElement('button');
    button.style.cssText = `
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      pointer-events: auto;
    `;
    
    const icon = document.createElement('i');
    icon.className = `fa-solid ${iconClass}`;
    icon.style.cssText = 'font-size: 20px;';
    
    button.appendChild(icon);
    button.title = title;
    
    return button;
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
  
  // Añadir una pista a la playlist
  async addTrack(url) {
    const youtubeId = this.extractYoutubeId(url);
    const isSoundcloud = url.includes('soundcloud.com');
    const isMixcloud = url.includes('mixcloud.com');
    
    let track = null;
    
    if (youtubeId) {
      track = {
        title: 'Video de YouTube',
        source: 'YouTube',
        url: url,
        videoId: youtubeId
      };
    } else if (isSoundcloud) {
      track = {
        title: 'Track de SoundCloud',
        source: 'SoundCloud',
        url: url
      };
    } else if (isMixcloud) {
      track = {
        title: 'Mix de Mixcloud',
        source: 'Mixcloud',
        url: url
      };
    } else {
      this.showNotification('Enlace no válido. Por favor, ingresa un enlace de YouTube, SoundCloud o Mixcloud');
      return;
    }
    
    this.playlist.push(track);
    this.updatePlaylist();
    this.showNotification('Añadido a la playlist');
    
    // Si es la primera canción, reproducirla automáticamente
    if (this.playlist.length === 1) {
      this.playTrack(0);
    }
  }
  
  // Añadir pista local
  addLocalTrack(file) {
    const track = {
      title: file.name,
      source: 'Local',
      file: file
    };
    
    this.playlist.push(track);
    this.updatePlaylist();
    this.showNotification('Archivo local añadido a la playlist');
    
    // Si es la primera canción, reproducirla automáticamente
    if (this.playlist.length === 1) {
      this.playTrack(0);
    }
  }
  
  // Actualizar la playlist en la interfaz
  updatePlaylist() {
    if (!this.playlistContainerEl) return;
    
    this.playlistContainerEl.innerHTML = '';
    
    if (this.playlist.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.textContent = 'Tu playlist está vacía';
      emptyMessage.style.cssText = `
        color: rgba(255, 255, 255, 0.5);
        text-align: center;
        padding: 20px;
      `;
      this.playlistContainerEl.appendChild(emptyMessage);
      return;
    }
    
    this.playlist.forEach((track, index) => {
      const item = document.createElement('div');
      item.style.cssText = `
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        transition: background 0.2s ease;
        pointer-events: auto;
      `;
      
      if (index === this.currentTrackIndex) {
        item.style.background = 'rgba(99, 102, 241, 0.3)';
      }
      
      const info = document.createElement('div');
      info.innerHTML = `
        <div style="font-weight: bold;">${track.title}</div>
        <div style="font-size: 12px; opacity: 0.7;">${track.source}</div>
      `;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
      deleteBtn.style.cssText = `
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        padding: 5px;
        border-radius: 50%;
        transition: all 0.2s ease;
        pointer-events: auto;
      `;
      
      item.appendChild(info);
      item.appendChild(deleteBtn);
      
      // Adjuntar eventos después de crear los elementos
      item.addEventListener('click', () => {
        this.playTrack(index);
      });
      
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeTrack(index);
      });
      
      this.playlistContainerEl.appendChild(item);
    });
  }
  
  // Eliminar una pista de la playlist
  removeTrack(index) {
    this.playlist.splice(index, 1);
    
    if (index === this.currentTrackIndex) {
      this.stop();
      this.currentTrackIndex = -1;
      this.updateTrackInfo();
    } else if (index < this.currentTrackIndex) {
      this.currentTrackIndex--;
    }
    
    this.updatePlaylist();
    this.showNotification('Pista eliminada de la playlist');
  }
  
  // Reproducir una pista específica
  playTrack(index) {
    if (index >= 0 && index < this.playlist.length) {
      this.stopAllMedia();
      this.currentTrackIndex = index;
      const track = this.playlist[this.currentTrackIndex];
      
      // Ocultar el reproductor de iframes por defecto
      this.mediaPlayerContainerEl.style.display = 'none';
      
      if (track.source === 'YouTube' && track.videoId) {
        if (this.isYouTubeApiReady) {
          this.mediaPlayerContainerEl.style.display = 'block';
          
          if (this.youtubePlayer) {
            this.youtubePlayer.loadVideoById(track.videoId);
          } else {
            this.youtubePlayer = new YT.Player('dynamic-player', {
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
                    this.playNext();
                  }
                  if (event.data === YT.PlayerState.PLAYING) {
                    this.isPlaying = true;
                    this.updatePlayPauseButton();
                  }
                }
              }
            });
          }
          this.isPlaying = true;
          this.updatePlayPauseButton();
        } else {
          this.showNotification("Error: La API de YouTube no está lista. Inténtalo de nuevo en unos segundos.");
          this.isPlaying = false;
        }
      } else if (track.source === 'Local' && track.file) {
        const fileUrl = URL.createObjectURL(track.file);
        this.audioElement.src = fileUrl;
        this.audioElement.play();
        this.isPlaying = true;
        this.updatePlayPauseButton();
      } else if (track.source === 'Local' && track.url) {
        // Para URLs de audio local
        this.audioElement.src = track.url;
        this.audioElement.play();
        this.isPlaying = true;
        this.updatePlayPauseButton();
      } else {
        // Para SoundCloud y Mixcloud, abrimos en una nueva pestaña
        window.open(track.url, '_blank');
        this.isPlaying = true;
        this.updatePlayPauseButton();
      }
      
      this.updateTrackInfo();
      this.updatePlaylist();
    }
  }
  
  // Actualizar información de la pista actual
  updateTrackInfo() {
    if (this.currentTrackIndex !== -1) {
      const track = this.playlist[this.currentTrackIndex];
      this.currentTrackTitleEl.textContent = track.title;
      this.currentTrackSourceEl.textContent = 'Fuente: ' + track.source;
    } else {
      this.currentTrackTitleEl.textContent = 'No hay música reproduciéndose';
      this.currentTrackSourceEl.textContent = '';
    }
  }
  
  // Actualizar botón de play/pause
  updatePlayPauseButton() {
    if (this.playPauseBtnEl) {
      const icon = this.playPauseBtnEl.querySelector('i');
      if (icon) {
        if (this.isPlaying) {
          icon.className = 'fa-solid fa-pause';
        } else {
          icon.className = 'fa-solid fa-play';
        }
      }
    }
    
    // También actualizar el botón en la barra roja si existe
    const redBarPlayBtn = document.querySelector('.music-control-button i.fa-play, .music-control-button i.fa-pause');
    if (redBarPlayBtn) {
      if (this.isPlaying) {
        redBarPlayBtn.className = 'fa-solid fa-pause';
      } else {
        redBarPlayBtn.className = 'fa-solid fa-play';
      }
    }
  }
  
  // Alternar play/pause
  togglePlayPause() {
    console.log('MusicApp: togglePlayPause llamado');
    
    if (this.currentTrackIndex === -1) {
      if (this.playlist.length > 0) {
        this.playTrack(0);
      }
      return;
    }
    
    const track = this.playlist[this.currentTrackIndex];
    if (track.source === 'YouTube' && this.youtubePlayer) {
      if (this.isPlaying) {
        this.youtubePlayer.pauseVideo();
      } else {
        this.youtubePlayer.playVideo();
      }
    } else if (track.source === 'Local') {
      if (this.isPlaying) {
        this.audioElement.pause();
      } else {
        this.audioElement.play();
      }
    }
    
    this.isPlaying = !this.isPlaying;
    this.updatePlayPauseButton();
  }
  
  // Detener reproducción
  stop() {
    console.log('MusicApp: stop llamado');
    this.stopAllMedia();
    this.isPlaying = false;
    this.updatePlayPauseButton();
  }
  
  // Detener todos los medios
  stopAllMedia() {
    if (this.audioElement && !this.audioElement.paused) {
      this.audioElement.pause();
      this.audioElement.removeAttribute('src');
    }
    if (this.youtubePlayer && typeof this.youtubePlayer.stopVideo === 'function') {
      this.youtubePlayer.stopVideo();
      this.youtubePlayer.destroy();
      this.youtubePlayer = null;
    }
  }
  
  // Reproducir siguiente pista
  playNext() {
    console.log('MusicApp: playNext llamado');
    if (this.playlist.length > 0) {
      this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
      this.playTrack(this.currentTrackIndex);
    }
  }
  
  // Reproducir pista anterior
  playPrev() {
    console.log('MusicApp: playPrev llamado');
    if (this.playlist.length > 0) {
      this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
      this.playTrack(this.currentTrackIndex);
    }
  }
  
  // Alternar modo de repetición
  toggleRepeat() {
    console.log('MusicApp: toggleRepeat llamado');
    // Implementar lógica de repetición aquí
    this.showNotification('Modo de repetición alternado');
  }
  
  // Alternar control de volumen
  toggleVolume() {
    console.log('MusicApp: toggleVolume llamado');
    // Implementar control de volumen aquí
    this.showNotification('Control de volumen alternado');
  }
  
  // Abrir en nueva pestaña
  openInNewTab() {
    console.log('MusicApp: openInNewTab llamado');
    if (this.currentTrackIndex !== -1) {
      const track = this.playlist[this.currentTrackIndex];
      window.open(track.url, '_blank');
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
