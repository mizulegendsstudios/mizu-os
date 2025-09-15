// docs/apps/core/modules/system-ui.js - Sistema de creación de interfaz de usuario para Mizu OS v3.0.0
/*
 * Mizu OS - System UI Module
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
 * Sistema de creación de interfaz de usuario para Mizu OS
 * Gestiona la creación dinámica de todos los elementos visuales del sistema
 */
class SystemUI {
  constructor() {
    this.elements = {};
    this.videoBackgroundUrl = 'https://cdn.jsdelivr.net/gh/mizulegendsstudios/mizu-board@main/docs/core/assets/bibiye.webm';
    this.hologramImageUrl = 'https://cdn.jsdelivr.net/gh/mizulegendsstudios/mizu-axiscore@main/src/images/png/svgmls.png';
  }

  /**
   * Crea el video de fondo
   * @returns {HTMLVideoElement} Elemento de video
   */
  createVideoBackground() {
    // Verificar si ya existe un video de fondo
    const existingVideo = document.querySelector('.video-background');
    if (existingVideo) {
      existingVideo.remove();
    }
    
    const video = document.createElement('video');
    video.className = 'video-background';
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    
    const source = document.createElement('source');
    source.src = this.videoBackgroundUrl;
    source.type = 'video/webm';
    
    video.appendChild(source);
    
    // Agregar al body antes de cualquier otro elemento
    document.body.insertBefore(video, document.body.firstChild);
    
    // Forzar la reproducción
    video.play().catch(error => {
      console.log('Error al reproducir video:', error);
    });
    
    console.log('Video de fondo creado');
    
    return video;
  }

  /**
   * Crea la estructura básica del sistema en el contenedor especificado
   * @param {HTMLElement} container - Contenedor donde se creará la UI
   */
  createSystemStructure(container) {
    console.log('Creando estructura del sistema en:', container);
    
    // Limpiar contenedor
    container.innerHTML = '';
    
    // Crear video de fondo primero
    this.createVideoBackground();
    
    // Crear barra superior (roja)
    this.elements.redBar = this.createRedBar();
    container.appendChild(this.elements.redBar);
    
    // Crear barra lateral (azul)
    this.elements.blueBar = this.createBlueBar();
    container.appendChild(this.elements.blueBar);
    
    // Crear área de trabajo principal (negra)
    this.elements.blackBar = this.createBlackBar();
    container.appendChild(this.elements.blackBar);
    
    // Crear holograma
    this.elements.yellowSquare = this.createHologram();
    container.appendChild(this.elements.yellowSquare);
    
    console.log('Estructura básica del sistema creada');
    console.log('Elementos creados:', {
      redBar: this.elements.redBar,
      blueBar: this.elements.blueBar,
      blackBar: this.elements.blackBar,
      yellowSquare: this.elements.yellowSquare
    });
  }

  /**
   * Crea la barra superior del sistema (roja)
   * @returns {HTMLElement} Elemento de la barra roja
   */
  createRedBar() {
    const redBar = document.createElement('div');
    redBar.id = 'red-bar';
    redBar.className = 'system-bar';
    
    // Widget de estado del sistema
    const systemWidget = document.createElement('div');
    systemWidget.id = 'system-widget';
    systemWidget.className = 'status-widget-container';
    
    // Reloj
    const clockWidget = document.createElement('div');
    clockWidget.className = 'status-widget status-widget-clock';
    clockWidget.innerHTML = `
      <div id="widget-time" class="status-time">00:00</div>
      <div id="widget-date" class="status-date">01/01/2025</div>
    `;
    
    // Batería
    const batteryWidget = document.createElement('div');
    batteryWidget.className = 'status-widget status-widget-battery';
    batteryWidget.innerHTML = `
      <i class="fas fa-battery-three-quarters status-icon"></i>
      <span id="widget-battery" class="status-battery-level">100%</span>
    `;
    
    // WiFi
    const wifiWidget = document.createElement('div');
    wifiWidget.className = 'status-widget status-widget-wifi';
    wifiWidget.innerHTML = `
      <i class="fas fa-wifi status-icon"></i>
      <span id="widget-wifi" class="status-wifi-status">Conectado</span>
    `;
    
    // Volumen
    const volumeWidget = document.createElement('div');
    volumeWidget.className = 'status-widget status-widget-volume';
    volumeWidget.innerHTML = `
      <i class="fas fa-volume-up status-icon"></i>
      <span id="widget-volume" class="status-volume-level">100%</span>
    `;
    
    // Añadir widgets al contenedor
    systemWidget.appendChild(clockWidget);
    systemWidget.appendChild(batteryWidget);
    systemWidget.appendChild(wifiWidget);
    systemWidget.appendChild(volumeWidget);
    
    redBar.appendChild(systemWidget);
    
    return redBar;
  }

  /**
   * Crea la barra lateral del sistema (azul)
   * @returns {HTMLElement} Elemento de la barra azul
   */
  createBlueBar() {
    const blueBar = document.createElement('div');
    blueBar.id = 'blue-bar';
    blueBar.className = 'system-bar';
    
    // Contenedor para botones de aplicaciones
    const appsContainer = document.createElement('div');
    appsContainer.id = 'apps-container';
    appsContainer.className = 'apps-container';
    
    blueBar.appendChild(appsContainer);
    
    // Botón de configuración en la parte inferior
    const configButton = document.createElement('button');
    configButton.id = 'config-button';
    configButton.className = 'app-button config-button';
    configButton.innerHTML = '<i class="fas fa-cog"></i>';
    configButton.title = 'Configuración';
    
    blueBar.appendChild(configButton);
    
    return blueBar;
  }

  /**
   * Crea el área de trabajo principal (negra)
   * @returns {HTMLElement} Elemento del área de trabajo
   */
  createBlackBar() {
    const blackBar = document.createElement('div');
    blackBar.id = 'black-bar';
    
    // Contenedor para el contenido de las aplicaciones
    const contentWrapper = document.createElement('div');
    contentWrapper.id = 'black-content-wrapper';
    contentWrapper.className = 'content-wrapper';
    
    // Área de trabajo para aplicaciones
    const workspace = document.createElement('div');
    workspace.id = 'workspace';
    workspace.className = 'workspace';
    
    contentWrapper.appendChild(workspace);
    blackBar.appendChild(contentWrapper);
    
    return blackBar;
  }

  /**
   * Crea el holograma del sistema
   * @returns {HTMLElement} Elemento del holograma
   */
  createHologram() {
    const yellowSquare = document.createElement('div');
    yellowSquare.id = 'yellow-square';
    
    const cube = document.createElement('div');
    cube.id = 'cube';
    
    const hologram = document.createElement('div');
    hologram.id = 'hologram';
    
    cube.appendChild(hologram);
    yellowSquare.appendChild(cube);
    
    return yellowSquare;
  }

  /**
   * Actualiza la hora y fecha en el widget
   */
  updateClock() {
    const now = new Date();
    const timeElement = document.getElementById('widget-time');
    const dateElement = document.getElementById('widget-date');
    
    if (timeElement) {
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      timeElement.textContent = `${hours}:${minutes}`;
    }
    
    if (dateElement) {
      const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      
      const dayName = days[now.getDay()];
      const day = now.getDate();
      const month = months[now.getMonth()];
      const year = now.getFullYear();
      
      dateElement.textContent = `${dayName}, ${day} ${month} ${year}`;
    }
  }

  /**
   * Actualiza el estado de la batería
   * @param {number} level - Nivel de batería (0-100)
   * @param {boolean} charging - Si está cargando
   */
  updateBattery(level, charging = false) {
    const batteryElement = document.getElementById('widget-battery');
    if (!batteryElement) return;
    
    const iconElement = batteryElement.previousElementSibling;
    if (iconElement && iconElement.classList.contains('fa-battery-three-quarters')) {
      // Determinar el icono según el nivel
      let iconClass = 'fa-battery-';
      if (charging) {
        iconClass += 'charging';
      } else if (level > 75) {
        iconClass += 'full';
      } else if (level > 50) {
        iconClass += 'three-quarters';
      } else if (level > 25) {
        iconClass += 'half';
      } else {
        iconClass = 'fa-battery-exclamation';
      }
      
      iconElement.className = `fas ${iconClass} status-icon`;
    }
    
    batteryElement.textContent = `${level}%`;
  }

  /**
   * Actualiza el estado de la conexión WiFi
   * @param {string} status - Estado de la conexión
   * @param {number} strength - Intensidad de la señal (0-4)
   */
  updateWiFi(status, strength = 4) {
    const wifiElement = document.getElementById('widget-wifi');
    if (!wifiElement) return;
    
    const iconElement = wifiElement.previousElementSibling;
    if (iconElement && iconElement.classList.contains('fa-wifi')) {
      // Determinar el icono según la intensidad
      let iconClass = 'fa-wifi';
      if (strength <= 0) {
        iconClass = 'fa-wifi-slash';
      } else if (strength < 2) {
        iconClass = 'fa-wifi-1';
      } else if (strength < 3) {
        iconClass = 'fa-wifi-2';
      } else if (strength < 4) {
        iconClass = 'fa-wifi-3';
      }
      
      iconElement.className = `fas ${iconClass} status-icon`;
    }
    
    wifiElement.textContent = status;
  }

  /**
   * Actualiza el estado del volumen
   * @param {number} level - Nivel de volumen (0-100)
   * @param {boolean} muted - Si está silenciado
   */
  updateVolume(level, muted = false) {
    const volumeElement = document.getElementById('widget-volume');
    if (!volumeElement) return;
    
    const iconElement = volumeElement.previousElementSibling;
    if (iconElement && iconElement.classList.contains('fa-volume-up')) {
      // Determinar el icono según el nivel
      let iconClass = 'fa-volume-';
      if (muted || level === 0) {
        iconClass += 'mute';
      } else if (level < 33) {
        iconClass += 'down';
      } else if (level < 66) {
        iconClass += 'up';
      } else {
        iconClass += 'up';
      }
      
      iconElement.className = `fas ${iconClass} status-icon`;
    }
    
    volumeElement.textContent = muted ? 'Mute' : `${level}%`;
  }

  /**
   * Añade un botón de aplicación a la barra lateral
   * @param {string} appId - ID de la aplicación
   * @param {string} icon - Icono de la aplicación
   * @param {string} title - Título de la aplicación
   * @param {Function} onClick - Función a ejecutar al hacer clic
   * @returns {HTMLButtonElement} Botón creado
   */
  addAppButton(appId, icon, title, onClick) {
    const appsContainer = document.getElementById('apps-container');
    if (!appsContainer) return null;
    
    const button = document.createElement('button');
    button.id = `app-button-${appId}`;
    button.className = 'app-button';
    button.innerHTML = icon;
    button.title = title;
    button.dataset.appId = appId;
    
    if (typeof onClick === 'function') {
      button.addEventListener('click', onClick);
    }
    
    appsContainer.appendChild(button);
    
    return button;
  }

  /**
   * Activa o desactiva un botón de aplicación
   * @param {string} appId - ID de la aplicación
   * @param {boolean} active - Estado de activación
   */
  setAppButtonActive(appId, active) {
    const button = document.getElementById(`app-button-${appId}`);
    if (button) {
      if (active) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    }
  }

  /**
   * Obtiene el contenedor de contenido de las aplicaciones
   * @returns {HTMLElement} Contenedor de contenido
   */
  getContentWrapper() {
    return document.getElementById('black-content-wrapper');
  }

  /**
   * Obtiene el área de trabajo
   * @returns {HTMLElement} Área de trabajo
   */
  getWorkspace() {
    return document.getElementById('workspace');
  }

  /**
   * Muestra u oculta las barras del sistema
   * @param {boolean} visible - Visibilidad de las barras
   */
  toggleSystemBars(visible) {
    const bars = ['red-bar', 'blue-bar', 'yellow-square'];
    
    bars.forEach(barId => {
      const bar = document.getElementById(barId);
      if (bar) {
        bar.style.display = visible ? '' : 'none';
      }
    });
  }

  /**
   * Inicia el sistema de actualización periódica de widgets
   */
  startWidgetUpdates() {
    // Actualizar reloj cada segundo
    setInterval(() => this.updateClock(), 1000);
    
    // Actualizar estado de la batería cada 5 minutos
    setInterval(() => {
      // Simular estado de batería
      const level = Math.floor(Math.random() * 100);
      const charging = Math.random() > 0.8;
      this.updateBattery(level, charging);
    }, 300000);
    
    // Actualizar estado de WiFi cada 30 segundos
    setInterval(() => {
      // Simular estado de WiFi
      const statuses = ['Conectado', 'Conectando...', 'Desconectado'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const strength = Math.floor(Math.random() * 5);
      this.updateWiFi(status, strength);
    }, 30000);
    
    // Actualizar volumen cada minuto
    setInterval(() => {
      // Simular estado de volumen
      const level = Math.floor(Math.random() * 100);
      const muted = Math.random() > 0.9;
      this.updateVolume(level, muted);
    }, 60000);
    
    // Actualizar inmediatamente
    this.updateClock();
    this.updateBattery(85, false);
    this.updateWiFi('Conectado', 4);
    this.updateVolume(75, false);
  }
}

// Exportar la clase
export { SystemUI };
