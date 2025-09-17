/*
 * Mizu OS - System UI Module
 * Copyright (C) 2025 Mizu Legends Studios.
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
 * Sistema de interfaz de usuario para Mizu OS
 * Gestiona la creación y manipulación de elementos de la interfaz
 */
// apps/core/modules/system-ui.js
export default class SystemUI {
  constructor(eventBus, statusWidget) {
    this.eventBus = eventBus;
    this.statusWidget = statusWidget;
    this.elements = {};
    this.currentActiveApp = null; // Para rastrear la aplicación activa actual
  }

  init() {
    console.log('SystemUI: Inicializando interfaz de usuario');
    
    // Crear elementos de la interfaz en orden correcto
    this.createVideoBackground();  // PRIMERO: Video de fondo
    this.createRedBar();
    this.createBlueBar();
    this.createYellowSquare();
    this.createBlackBar();
    
    // Suscribirse a eventos de aplicaciones
    this.subscribeToAppEvents();
    
    console.log('SystemUI: Interfaz de usuario inicializada correctamente');
    return true;
  }

  subscribeToAppEvents() {
    // Suscribirse a eventos de activación y desactivación de aplicaciones
    this.eventBus.on('app:activated', (data) => {
      console.log(`SystemUI: Aplicación activada: ${data.appId}`);
      this.currentActiveApp = data.appId;
      this.updateAppButtonsState();
    });
    
    this.eventBus.on('app:deactivated', (data) => {
      console.log(`SystemUI: Aplicación desactivada: ${data.appId}`);
      if (this.currentActiveApp === data.appId) {
        this.currentActiveApp = null;
      }
      this.updateAppButtonsState();
    });
    
    // NUEVO: Suscribirse a eventos de optimización del sistema
    this.eventBus.on('system:optimization-applied', (data) => {
      console.log(`SystemUI: Optimización aplicada: ${data.type}`, data);
      
      // Aplicar cambios visuales según el tipo de optimización
      switch (data.type) {
        case 'disable-video-background':
          if (this.elements.videoBackground) {
            this.elements.videoBackground.style.display = 'none';
          }
          break;
          
        case 'reduce-effects':
          // Reducir efectos visuales
          document.body.classList.add('reduced-effects');
          break;
          
        case 'enable-low-power-mode':
          // Activar modo de bajo consumo
          document.body.classList.add('low-power-mode');
          break;
          
        case 'enable-tv-mode':
          // Activar modo TV
          document.body.classList.add('tv-mode');
          break;
      }
    });
  }

  updateAppButtonsState() {
    // Actualizar el estado visual de los botones de aplicaciones
    const appButtons = document.querySelectorAll('.app-button');
    appButtons.forEach(button => {
      const appId = button.dataset.appId;
      if (appId === this.currentActiveApp) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  createVideoBackground() {
    console.log('SystemUI: Creando video de fondo');
    
    // Video de fondo
    const video = document.createElement('video');
    video.className = 'video-background';
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    
    // URL actualizada del video
    video.src = 'https://cdn.jsdelivr.net/gh/mizulegendsstudios/mizu-board@main/docs/assets/bibiye.webm';
    
    // Añadir manejadores de eventos para depuración
    video.onloadeddata = () => {
      console.log('SystemUI: Video cargado correctamente');
      console.log('SystemUI: Elemento de video:', video);
      console.log('SystemUI: Video tiene src:', video.src);
      console.log('SystemUI: Video está en el DOM:', document.body.contains(video));
    };
    
    video.onerror = () => {
      console.error('SystemUI: Error al cargar el video de fondo');
      console.error('SystemUI: URL del video:', video.src);
    };
    
    // Añadir al body
    document.body.appendChild(video);
    
    // Guardar referencia al elemento
    this.elements.videoBackground = video;
    
    console.log('SystemUI: Video de fondo creado correctamente');
    
    // Verificar que el video se añadió correctamente
    setTimeout(() => {
      const videoElement = document.querySelector('.video-background');
      console.log('SystemUI: Verificación posterior - Video encontrado en DOM:', !!videoElement);
      if (videoElement) {
        console.log('SystemUI: Estado del video:', {
          readyState: videoElement.readyState,
          networkState: videoElement.networkState,
          paused: videoElement.paused,
          ended: videoElement.ended,
          currentTime: videoElement.currentTime,
          duration: videoElement.duration
        });
      }
    }, 1000);
  }

  createRedBar() {
    console.log('SystemUI: Creando barra roja');
    
    const redBar = document.createElement('div');
    redBar.id = 'red-bar';
    
    // Añadir controles de música (centrados)
    const musicControls = this.statusWidget.createMusicControls();
    redBar.appendChild(musicControls);
    
    // Añadir widgets de estado (a la derecha)
    const statusWidgets = this.statusWidget.createAllWidgets();
    redBar.appendChild(statusWidgets);
    
    // Guardar referencia al elemento
    this.elements.redBar = redBar;
    
    // Añadir al body
    document.body.appendChild(redBar);
    
    console.log('SystemUI: Barra roja creada correctamente');
  }

  createBlueBar() {
    console.log('SystemUI: Creando barra azul');
    
    const blueBar = document.createElement('div');
    blueBar.id = 'blue-bar';
    
    // Crear botón para la aplicación de música
    const musicAppButton = this.createAppButton('music', 'Música', 'fa-music');
    blueBar.appendChild(musicAppButton);
    
    // Crear botón para la aplicación de diagram
    const diagramAppButton = this.createAppButton('diagram', 'Diagrama', 'fa-project-diagram');
    blueBar.appendChild(diagramAppButton);
    
    // Crear botón para la aplicación de editor
    const editorAppButton = this.createAppButton('editor', 'Editor', 'fa-edit');
    blueBar.appendChild(editorAppButton);
    
    // Crear botón para la aplicación de settings
    const settingsAppButton = this.createAppButton('settings', 'Configuración', 'fa-cog');
    blueBar.appendChild(settingsAppButton);
    
    // Crear botón para la aplicación de spreadsheet
    const spreadsheetAppButton = this.createAppButton('spreadsheet', 'Hoja de cálculo', 'fa-table');
    blueBar.appendChild(spreadsheetAppButton);
    
    // NUEVO: Crear botón para la aplicación de rendimiento
    const performanceAppButton = this.createAppButton('performance', 'Rendimiento', 'fa-tachometer-alt');
    blueBar.appendChild(performanceAppButton);
    
    // Guardar referencia al elemento
    this.elements.blueBar = blueBar;
    
    // Añadir al body
    document.body.appendChild(blueBar);
    
    console.log('SystemUI: Barra azul creada correctamente');
  }

  createAppButton(appId, title, iconClass) {
    console.log(`SystemUI: Creando botón para aplicación ${appId}`);
    
    const button = document.createElement('button');
    button.className = 'app-button';
    button.title = title;
    button.dataset.appId = appId;
    
    const icon = document.createElement('i');
    icon.className = `fas ${iconClass}`;
    
    button.appendChild(icon);
    
    // Añadir evento de clic para activar/desactivar la aplicación
    button.addEventListener('click', () => {
      console.log(`[DEBUG] Botón de aplicación ${appId} presionado`);
      console.log(`[DEBUG] EventBus disponible:`, !!this.eventBus);
      console.log(`[DEBUG] Tipo de EventBus:`, typeof this.eventBus);
      
      // Verificar que el EventBus esté disponible
      if (this.eventBus) {
        console.log(`[DEBUG] Preparando para manejar clic en aplicación ${appId}`);
        
        // Verificar si esta aplicación ya está activa
        if (this.currentActiveApp === appId) {
          console.log(`[DEBUG] La aplicación ${appId} ya está activa, se va a desactivar`);
          // Si es la misma aplicación, desactivarla
          this.eventBus.emit('app:deactivate', { appId });
        } else {
          console.log(`[DEBUG] La aplicación ${appId} no está activa, se va a activar`);
          // Si hay una aplicación activa diferente, desactivarla primero
          if (this.currentActiveApp) {
            console.log(`[DEBUG] Desactivando aplicación actual: ${this.currentActiveApp}`);
            this.eventBus.emit('app:deactivate', { appId: this.currentActiveApp });
          }
          
          // Activar la nueva aplicación
          this.eventBus.emit('app:activate', { appId });
        }
      } else {
        console.error('[ERROR] EventBus no disponible en SystemUI');
        console.log('[DEBUG] window.MizuOS:', window.MizuOS);
        console.log('[DEBUG] window.MizuOS.eventBus:', window.MizuOS ? window.MizuOS.eventBus : 'undefined');
      }
    });
    
    console.log(`[DEBUG] Botón para aplicación ${appId} creado correctamente`);
    return button;
  }

  createYellowSquare() {
    console.log('SystemUI: Creando cuadrado amarillo');
    
    const yellowSquare = document.createElement('div');
    yellowSquare.id = 'yellow-square';
    
    const cube = document.createElement('div');
    cube.id = 'cube';
    
    const hologram = document.createElement('div');
    hologram.id = 'hologram';
    
    cube.appendChild(hologram);
    yellowSquare.appendChild(cube);
    
    // Guardar referencia al elemento
    this.elements.yellowSquare = yellowSquare;
    
    // Añadir al body
    document.body.appendChild(yellowSquare);
    
    console.log('SystemUI: Cuadrado amarillo creado correctamente');
  }

  createBlackBar() {
    console.log('SystemUI: Creando barra negra');
    
    const blackBar = document.createElement('div');
    blackBar.id = 'black-bar';
    
    // Guardar referencia al elemento
    this.elements.blackBar = blackBar;
    
    // Añadir al body
    document.body.appendChild(blackBar);
    
    console.log('SystemUI: Barra negra creada correctamente');
  }

  // Método para obtener referencias a los elementos de la interfaz
  getElement(elementId) {
    return this.elements[elementId];
  }
}
