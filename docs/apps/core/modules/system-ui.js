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
 * Módulo de interfaz de usuario del sistema para Mizu OS
 * Gestiona la creación y manipulación de elementos visuales del sistema
 */
export default class SystemUI {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.videoBackground = null;
    this.redBar = null;
    this.blueBar = null;
    this.yellowSquare = null;
    this.blackBar = null;
    this.activeAppId = null;
    this.elements = {};
    
    console.log('SystemUI: Inicializando interfaz de usuario');
  }
  
  init() {
    console.log('SystemUI: Inicializando componentes de la interfaz');
    
    // Crear video de fondo
    this.createVideoBackground();
    
    // Crear barras del sistema
    this.createRedBar();
    this.createBlueBar();
    this.createYellowSquare();
    this.createBlackBar();
    
    // Suscribirse a eventos del sistema
    this.setupEventListeners();
    
    console.log('SystemUI: Interfaz de usuario inicializada correctamente');
    return true;
  }
  
  setupEventListeners() {
    // Suscribirse a eventos de activación/desactivación de aplicaciones
    this.eventBus.on('app:activated', (data) => {
      console.log('SystemUI: Aplicación activada:', data.appId);
      this.activeAppId = data.appId;
      this.updateAppButtons();
    });
    
    this.eventBus.on('app:deactivated', (data) => {
      console.log('SystemUI: Aplicación desactivada:', data.appId);
      if (this.activeAppId === data.appId) {
        this.activeAppId = null;
      }
      this.updateAppButtons();
    });
    
    // Suscribirse a eventos de optimización del sistema
    this.eventBus.on('system:reduce-effects', () => {
      console.log('SystemUI: Reduciendo efectos visuales');
      if (this.videoBackground) {
        this.videoBackground.style.display = 'none';
      }
      document.body.classList.add('reduced-effects');
    });
    
    this.eventBus.on('system:disable-video-background', () => {
      console.log('SystemUI: Desactivando video de fondo');
      if (this.videoBackground) {
        this.videoBackground.style.display = 'none';
      }
    });
    
    this.eventBus.on('system:enable-low-power-mode', () => {
      console.log('SystemUI: Activando modo de bajo consumo');
      if (this.videoBackground) {
        this.videoBackground.style.display = 'none';
      }
      document.body.classList.add('low-power-mode');
    });
    
    this.eventBus.on('system:enable-tv-mode', () => {
      console.log('SystemUI: Activando modo TV');
      document.body.classList.add('tv-mode');
    });
  }
  
  createVideoBackground() {
    console.log('SystemUI: Creando video de fondo');
    
    // Crear elemento de video
    this.videoBackground = document.createElement('video');
    this.videoBackground.className = 'video-background';
    this.videoBackground.id = 'background-video';
    this.videoBackground.autoplay = true;
    this.videoBackground.loop = true;
    this.videoBackground.muted = true;
    this.videoBackground.playsInline = true;
    
    // Establecer fuente del video
    this.videoBackground.src = 'https://cdn.jsdelivr.net/gh/mizulegendsstudios/mizu-board@main/docs/assets/bibiye.webm';
    
    // Estilos del video - ajustados para mayor transparencia
    this.videoBackground.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: -1;
      opacity: 0.5; /* Reducido para mayor transparencia */
      filter: blur(1px); /* Ligero desenfoque para efecto de profundidad */
    `;
    
    // Añadir video al body
    document.body.appendChild(this.videoBackground);
    
    // Guardar referencia al elemento
    this.elements.videoBackground = this.videoBackground;
    
    // Verificar que el video se haya cargado correctamente
    this.videoBackground.addEventListener('loadeddata', () => {
      console.log('SystemUI: Video cargado correctamente');
    });
    
    this.videoBackground.addEventListener('error', () => {
      console.error('SystemUI: Error al cargar el video de fondo');
    });
    
    console.log('SystemUI: Video de fondo creado correctamente');
  }
  
  createRedBar() {
    console.log('SystemUI: Creando barra roja');
    
    // Crear barra roja
    this.redBar = document.createElement('div');
    this.redBar.id = 'red-bar';
    
    // Estilos ajustados para mayor transparencia y efecto de vidrio esmerilado
    this.redBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 40px;
      background: linear-gradient(90deg, 
        rgba(220, 38, 38, 0.7), 
        rgba(220, 38, 38, 0.5)
      );
      backdrop-filter: blur(15px); /* Aumentado para mayor efecto de desenfoque */
      -webkit-backdrop-filter: blur(15px);
      z-index: 1000;
      display: flex;
      align-items: center;
      padding: 0 15px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    // Añadir controles de música a la barra roja
    this.createMusicControls();
    
    // Añadir barra roja al body
    document.body.appendChild(this.redBar);
    
    // Guardar referencia al elemento
    this.elements.redBar = this.redBar;
    
    console.log('SystemUI: Barra roja creada correctamente');
  }
  
  createMusicControls() {
    console.log('StatusWidget: Creando todos los widgets');
    
    // Contenedor de widgets
    const widgetsContainer = document.createElement('div');
    widgetsContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 15px;
      margin-left: auto;
    `;
    
    // Widget de reloj
    const clockWidget = document.createElement('div');
    clockWidget.className = 'status-widget';
    clockWidget.id = 'clock-widget';
    clockWidget.style.cssText = `
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      font-weight: 500;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    `;
    clockWidget.textContent = '00:00';
    
    // Widget de batería
    const batteryWidget = document.createElement('div');
    batteryWidget.className = 'status-widget';
    batteryWidget.id = 'battery-widget';
    batteryWidget.style.cssText = `
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 5px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    `;
    batteryWidget.innerHTML = '<i class="fa-solid fa-battery-three-quarters"></i> 75%';
    
    // Widget de WiFi
    const wifiWidget = document.createElement('div');
    wifiWidget.className = 'status-widget';
    wifiWidget.id = 'wifi-widget';
    wifiWidget.style.cssText = `
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    `;
    wifiWidget.innerHTML = '<i class="fa-solid fa-wifi"></i>';
    
    // Widget de volumen
    const volumeWidget = document.createElement('div');
    volumeWidget.className = 'status-widget';
    volumeWidget.id = 'volume-widget';
    volumeWidget.style.cssText = `
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    `;
    volumeWidget.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    
    // Controles de música
    const musicControls = document.createElement('div');
    musicControls.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
      margin-right: 15px;
    `;
    
    // Botón de reproducción/pausa de música
    const playPauseBtn = document.createElement('button');
    playPauseBtn.className = 'music-control-button';
    playPauseBtn.style.cssText = `
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      backdrop-filter: blur(5px);
    `;
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    playPauseBtn.addEventListener('click', () => {
      this.eventBus.emit('music:togglePlayPause');
    });
    
    // Botón de pista anterior
    const prevBtn = document.createElement('button');
    prevBtn.className = 'music-control-button';
    prevBtn.style.cssText = `
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      backdrop-filter: blur(5px);
    `;
    prevBtn.innerHTML = '<i class="fa-solid fa-backward"></i>';
    prevBtn.addEventListener('click', () => {
      this.eventBus.emit('music:playPrev');
    });
    
    // Botón de pista siguiente
    const nextBtn = document.createElement('button');
    nextBtn.className = 'music-control-button';
    nextBtn.style.cssText = `
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      backdrop-filter: blur(5px);
    `;
    nextBtn.innerHTML = '<i class="fa-solid fa-forward"></i>';
    nextBtn.addEventListener('click', () => {
      this.eventBus.emit('music:playNext');
    });
    
    // Añadir botones a los controles de música
    musicControls.appendChild(prevBtn);
    musicControls.appendChild(playPauseBtn);
    musicControls.appendChild(nextBtn);
    
    // Añadir widgets al contenedor
    widgetsContainer.appendChild(musicControls);
    widgetsContainer.appendChild(clockWidget);
    widgetsContainer.appendChild(batteryWidget);
    widgetsContainer.appendChild(wifiWidget);
    widgetsContainer.appendChild(volumeWidget);
    
    // Añadir contenedor a la barra roja
    this.redBar.appendChild(widgetsContainer);
    
    // Inicializar widgets
    this.initWidgets();
    
    console.log('StatusWidget: Widgets creados correctamente');
  }
  
  initWidgets() {
    // Actualizar reloj
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const clockWidget = document.getElementById('clock-widget');
      if (clockWidget) {
        clockWidget.textContent = `${hours}:${minutes}`;
      }
    };
    
    // Actualizar reloj inmediatamente y luego cada segundo
    updateClock();
    setInterval(updateClock, 1000);
    
    // Simular actualización de batería
    const updateBattery = () => {
      const batteryWidget = document.getElementById('battery-widget');
      if (batteryWidget) {
        const batteryLevel = Math.floor(Math.random() * 40) + 60; // 60-100%
        let batteryIcon = 'fa-battery-full';
        
        if (batteryLevel < 20) {
          batteryIcon = 'fa-battery-empty';
        } else if (batteryLevel < 40) {
          batteryIcon = 'fa-battery-quarter';
        } else if (batteryLevel < 60) {
          batteryIcon = 'fa-battery-half';
        } else if (batteryLevel < 80) {
          batteryIcon = 'fa-battery-three-quarters';
        }
        
        batteryWidget.innerHTML = `<i class="fa-solid ${batteryIcon}"></i> ${batteryLevel}%`;
      }
    };
    
    // Actualizar batería cada 30 segundos
    updateBattery();
    setInterval(updateBattery, 30000);
    
    // Simular cambios de WiFi
    const updateWiFi = () => {
      const wifiWidget = document.getElementById('wifi-widget');
      if (wifiWidget) {
        const wifiStrength = Math.random();
        let wifiIcon = 'fa-wifi';
        
        if (wifiStrength < 0.3) {
          wifiIcon = 'fa-wifi-slash';
        } else if (wifiStrength < 0.6) {
          wifiIcon = 'fa-signal';
        }
        
        wifiWidget.innerHTML = `<i class="fa-solid ${wifiIcon}"></i>`;
      }
    };
    
    // Actualizar WiFi cada 10 segundos
    updateWiFi();
    setInterval(updateWiFi, 10000);
  }
  
  createBlueBar() {
    console.log('SystemUI: Creando barra azul');
    
    // Crear barra azul
    this.blueBar = document.createElement('div');
    this.blueBar.id = 'blue-bar';
    
    // Estilos ajustados para mayor transparencia y efecto de vidrio esmerilado
    this.blueBar.style.cssText = `
      position: fixed;
      top: 40px;
      left: 0;
      width: 60px;
      height: calc(100vh - 40px);
      background: linear-gradient(180deg, 
        rgba(37, 99, 235, 0.7), 
        rgba(37, 99, 235, 0.5)
      );
      backdrop-filter: blur(15px); /* Aumentado para mayor efecto de desenfoque */
      -webkit-backdrop-filter: blur(15px);
      z-index: 999;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 15px 0;
      gap: 15px;
      box-shadow: 2px 0 15px rgba(0, 0, 0, 0.2);
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      overflow-y: auto;
    `;
    
    // Lista de aplicaciones
    const apps = [
      { id: 'music', name: 'Música', icon: '🎵' },
      { id: 'diagram', name: 'Diagramas', icon: '📊' },
      { id: 'editor', name: 'Editor', icon: '📝' },
      { id: 'settings', name: 'Config', icon: '⚙️' },
      { id: 'spreadsheet', name: 'Hoja', icon: '📄' },
      { id: 'performance', name: 'Rendimiento', icon: '⚡' }
    ];
    
    // Crear botones para cada aplicación
    apps.forEach(app => {
      const appButton = this.createAppButton(app.id, app.name, app.icon);
      this.blueBar.appendChild(appButton);
    });
    
    // Añadir barra azul al body
    document.body.appendChild(this.blueBar);
    
    // Guardar referencia al elemento
    this.elements.blueBar = this.blueBar;
    
    console.log('SystemUI: Barra azul creada correctamente');
  }
  
  createAppButton(appId, appName, appIcon) {
    console.log(`[DEBUG] SystemUI: Creando botón para aplicación ${appId}`);
    
    const button = document.createElement('button');
    button.className = 'app-button';
    button.dataset.appId = appId;
    
    // Estilos ajustados para mayor transparencia y efecto de vidrio esmerilado
    button.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      color: rgba(255, 255, 255, 0.9);
      cursor: pointer;
      transition: all 0.2s ease;
      pointer-events: auto;
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
    `;
    
    const icon = document.createElement('div');
    icon.textContent = appIcon;
    icon.style.cssText = `
      font-size: 20px;
      margin-bottom: 3px;
    `;
    
    const name = document.createElement('div');
    name.textContent = appName;
    name.style.cssText = `
      font-size: 9px;
      text-align: center;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `;
    
    button.appendChild(icon);
    button.appendChild(name);
    
    // Evento de clic
    button.addEventListener('click', () => {
      console.log(`[DEBUG] Botón de aplicación ${appId} presionado`);
      
      // Verificar si el EventBus está disponible
      if (!this.eventBus) {
        console.error('[ERROR] EventBus no está disponible');
        return;
      }
      
      console.log('[DEBUG] EventBus disponible:', !!this.eventBus);
      console.log('[DEBUG] Tipo de EventBus:', typeof this.eventBus);
      
      console.log(`[DEBUG] Preparando para manejar clic en aplicación ${appId}`);
      
      // Si es la aplicación activa, emitir evento para alternar visibilidad
      if (this.activeAppId === appId) {
        console.log(`[DEBUG] La aplicación ${appId} ya está activa, alternando visibilidad`);
        this.eventBus.emit(`${appId}:toggleVisibility`, { appId, hide: true });
      } else {
        // Si no es la aplicación activa, activarla normalmente
        console.log(`[DEBUG] La aplicación ${appId} no está activa, se va a activar`);
        this.eventBus.emit('app:activate', { appId });
      }
      
      console.log(`[DEBUG] Evento emitido para ${appId}`);
    });
    
    console.log(`[DEBUG] Botón para aplicación ${appId} creado correctamente`);
    
    return button;
  }
  
  updateAppButtons() {
    // Actualizar estado visual de los botones de aplicaciones
    const appButtons = document.querySelectorAll('.app-button');
    
    appButtons.forEach(button => {
      const appId = button.dataset.appId;
      
      if (appId === this.activeAppId) {
        // Aplicación activa
        button.style.background = 'rgba(255, 255, 255, 0.25)';
        button.style.transform = 'scale(1.05)';
        button.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.3)';
        button.style.border = '1px solid rgba(255, 255, 255, 0.4)';
      } else {
        // Aplicación inactiva
        button.style.background = 'rgba(255, 255, 255, 0.1)';
        button.style.transform = 'scale(1)';
        button.style.boxShadow = 'none';
        button.style.border = '1px solid rgba(255, 255, 255, 0.2)';
      }
    });
  }
  
  createYellowSquare() {
    console.log('SystemUI: Creando cuadrado amarillo');
    
    // Crear cuadrado amarillo
    this.yellowSquare = document.createElement('div');
    this.yellowSquare.id = 'yellow-square';
    
    // Estilos ajustados para mayor transparencia y efecto de vidrio esmerilado
    this.yellowSquare.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      width: 200px;
      height: 200px;
      background: linear-gradient(135deg, 
        rgba(234, 179, 8, 0.7), 
        rgba(234, 179, 8, 0.5)
      );
      backdrop-filter: blur(15px); /* Aumentado para mayor efecto de desenfoque */
      -webkit-backdrop-filter: blur(15px);
      border-radius: 20px;
      transform: translate(-50%, -50%);
      z-index: 998;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 25px rgba(234, 179, 8, 0.3);
      opacity: 0;
      transition: opacity 0.5s ease;
      border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    // Contenido del cuadrado amarillo (holograma)
    const hologram = document.createElement('div');
    hologram.style.cssText = `
      width: 150px;
      height: 150px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.8), rgba(234, 179, 8, 0.4));
      border-radius: 50%;
      animation: pulse 2s infinite;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      font-weight: bold;
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    `;
    hologram.textContent = 'MIZU';
    
    // Añadir animación al holograma
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 0.8; }
      }
    `;
    document.head.appendChild(style);
    
    this.yellowSquare.appendChild(hologram);
    
    // Añadir cuadrado amarillo al body
    document.body.appendChild(this.yellowSquare);
    
    // Guardar referencia al elemento
    this.elements.yellowSquare = this.yellowSquare;
    
    // Mostrar cuadrado amarillo durante 3 segundos al inicio
    setTimeout(() => {
      this.yellowSquare.style.opacity = '1';
      
      setTimeout(() => {
        this.yellowSquare.style.opacity = '0';
      }, 3000);
    }, 500);
    
    console.log('SystemUI: Cuadrado amarillo creado correctamente');
  }
  
  createBlackBar() {
    console.log('SystemUI: Creando barra negra');
    
    // Crear barra negra
    this.blackBar = document.createElement('div');
    this.blackBar.id = 'black-bar';
    
    // Estilos ajustados para mayor transparencia y efecto de vidrio esmerilado
    this.blackBar.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-size: contain;
      background-color: hsla(0, 0%, 0%, 0.3); /* Aumentada la transparencia */
      backdrop-filter: blur(10px); /* Añadido efecto de desenfoque */
      -webkit-backdrop-filter: blur(10px);
      padding: 1rem;
      display: flex;
      gap: 0.5rem;
      z-index: 641;
      transition: top 0.5s ease, left 0.5s ease, right 0.5s ease, bottom 0.5s ease;
      overflow: hidden;
      cursor: grab;
      border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    // Añadir barra negra al body
    document.body.appendChild(this.blackBar);
    
    // Guardar referencia al elemento
    this.elements.blackBar = this.blackBar;
    
    console.log('SystemUI: Barra negra creada correctamente');
  }
  
  // Método para obtener referencias a los elementos de la interfaz
  getElement(elementId) {
    return this.elements[elementId];
  }
}
