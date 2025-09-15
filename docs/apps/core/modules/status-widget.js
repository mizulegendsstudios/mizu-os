//docs/apps/core/modules/status-widget.js
/*
 * Mizu OS - Status Widget Module
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
 * Sistema de widgets de estado para Mizu OS
 * Gestiona la visualización de información del sistema (hora, batería, WiFi, volumen)
 */
class StatusWidget {
  constructor() {
    this.container = null;
    this.updateInterval = null;
    this.batteryInterval = null;
    this.wifiInterval = null;
    this.volumeInterval = null;
    this.isInitialized = false;
    
    // Configuración
    this.config = {
      clockUpdateInterval: 1000,        // Actualizar reloj cada segundo
      batteryUpdateInterval: 30000,     // Actualizar batería cada 30 segundos
      wifiUpdateInterval: 10000,        // Actualizar WiFi cada 10 segundos
      volumeUpdateInterval: 5000        // Actualizar volumen cada 5 segundos
    };
    
    // Estado actual
    this.state = {
      time: '',
      date: '',
      battery: {
        level: 100,
        charging: false
      },
      wifi: {
        connected: true,
        strength: 4,
        status: 'Conectado'
      },
      volume: {
        level: 75,
        muted: false
      }
    };
  }

  /**
   * Inicializa los widgets de estado en el contenedor especificado
   * @param {HTMLElement} container - Contenedor donde se crearán los widgets
   */
  init(container) {
    if (this.isInitialized) {
      console.warn('StatusWidget ya está inicializado');
      return;
    }

    this.container = container;
    
    // Crear estructura de widgets
    this.createWidgetStructure();
    
    // Iniciar actualizaciones periódicas
    this.startPeriodicUpdates();
    
    // Actualizar inmediatamente
    this.updateAllWidgets();
    
    this.isInitialized = true;
    console.log('StatusWidget inicializado');
  }

  /**
   * Crea la estructura HTML de los widgets
   */
  createWidgetStructure() {
    if (!this.container) return;
    
    // Limpiar contenedor
    this.container.innerHTML = '';
    
    // Crear contenedor principal de widgets
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'status-widget-container';
    widgetContainer.style.display = 'flex';
    widgetContainer.style.alignItems = 'center';
    widgetContainer.style.gap = '20px';
    widgetContainer.style.height = '100%';
    
    // Widget de reloj
    const clockWidget = this.createClockWidget();
    widgetContainer.appendChild(clockWidget);
    
    // Widget de batería
    const batteryWidget = this.createBatteryWidget();
    widgetContainer.appendChild(batteryWidget);
    
    // Widget de WiFi
    const wifiWidget = this.createWifiWidget();
    widgetContainer.appendChild(wifiWidget);
    
    // Widget de volumen
    const volumeWidget = this.createVolumeWidget();
    widgetContainer.appendChild(volumeWidget);
    
    // Añadir al contenedor principal
    this.container.appendChild(widgetContainer);
  }

  /**
   * Crea el widget de reloj
   * @returns {HTMLElement} Elemento del widget
   */
  createClockWidget() {
    const widget = document.createElement('div');
    widget.className = 'status-widget status-widget-clock';
    widget.style.display = 'flex';
    widget.style.flexDirection = 'column';
    widget.style.alignItems = 'center';
    
    // Hora
    const timeElement = document.createElement('div');
    timeElement.id = 'status-time';
    timeElement.className = 'status-time';
    timeElement.style.fontSize = '16px';
    timeElement.style.fontWeight = 'bold';
    
    // Fecha
    const dateElement = document.createElement('div');
    dateElement.id = 'status-date';
    dateElement.className = 'status-date';
    dateElement.style.fontSize = '12px';
    dateElement.style.opacity = '0.8';
    
    widget.appendChild(timeElement);
    widget.appendChild(dateElement);
    
    return widget;
  }

  /**
   * Crea el widget de batería
   * @returns {HTMLElement} Elemento del widget
   */
  createBatteryWidget() {
    const widget = document.createElement('div');
    widget.className = 'status-widget status-widget-battery';
    widget.style.display = 'flex';
    widget.style.alignItems = 'center';
    widget.style.gap = '8px';
    
    // Icono de batería
    const iconElement = document.createElement('i');
    iconElement.id = 'status-battery-icon';
    iconElement.className = 'fas fa-battery-three-quarters status-icon';
    iconElement.style.fontSize = '16px';
    
    // Porcentaje
    const levelElement = document.createElement('span');
    levelElement.id = 'status-battery-level';
    levelElement.className = 'status-battery-level';
    levelElement.style.fontSize = '14px';
    
    widget.appendChild(iconElement);
    widget.appendChild(levelElement);
    
    return widget;
  }

  /**
   * Crea el widget de WiFi
   * @returns {HTMLElement} Elemento del widget
   */
  createWifiWidget() {
    const widget = document.createElement('div');
    widget.className = 'status-widget status-widget-wifi';
    widget.style.display = 'flex';
    widget.style.alignItems = 'center';
    widget.style.gap = '8px';
    
    // Icono de WiFi
    const iconElement = document.createElement('i');
    iconElement.id = 'status-wifi-icon';
    iconElement.className = 'fas fa-wifi status-icon';
    iconElement.style.fontSize = '16px';
    
    // Estado
    const statusElement = document.createElement('span');
    statusElement.id = 'status-wifi-status';
    statusElement.className = 'status-wifi-status';
    statusElement.style.fontSize = '14px';
    
    widget.appendChild(iconElement);
    widget.appendChild(statusElement);
    
    return widget;
  }

  /**
   * Crea el widget de volumen
   * @returns {HTMLElement} Elemento del widget
   */
  createVolumeWidget() {
    const widget = document.createElement('div');
    widget.className = 'status-widget status-widget-volume';
    widget.style.display = 'flex';
    widget.style.alignItems = 'center';
    widget.style.gap = '8px';
    
    // Icono de volumen
    const iconElement = document.createElement('i');
    iconElement.id = 'status-volume-icon';
    iconElement.className = 'fas fa-volume-up status-icon';
    iconElement.style.fontSize = '16px';
    
    // Nivel
    const levelElement = document.createElement('span');
    levelElement.id = 'status-volume-level';
    levelElement.className = 'status-volume-level';
    levelElement.style.fontSize = '14px';
    
    widget.appendChild(iconElement);
    widget.appendChild(levelElement);
    
    return widget;
  }

  /**
   * Inicia las actualizaciones periódicas de los widgets
   */
  startPeriodicUpdates() {
    // Actualizar reloj cada segundo
    this.updateInterval = setInterval(() => {
      this.updateClock();
    }, this.config.clockUpdateInterval);
    
    // Simular actualización de batería
    this.batteryInterval = setInterval(() => {
      this.simulateBatteryUpdate();
    }, this.config.batteryUpdateInterval);
    
    // Simular actualización de WiFi
    this.wifiInterval = setInterval(() => {
      this.simulateWifiUpdate();
    }, this.config.wifiUpdateInterval);
    
    // Simular actualización de volumen
    this.volumeInterval = setInterval(() => {
      this.simulateVolumeUpdate();
    }, this.config.volumeUpdateInterval);
  }

  /**
   * Detiene las actualizaciones periódicas
   */
  stopPeriodicUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    if (this.batteryInterval) {
      clearInterval(this.batteryInterval);
      this.batteryInterval = null;
    }
    
    if (this.wifiInterval) {
      clearInterval(this.wifiInterval);
      this.wifiInterval = null;
    }
    
    if (this.volumeInterval) {
      clearInterval(this.volumeInterval);
      this.volumeInterval = null;
    }
  }

  /**
   * Actualiza todos los widgets
   */
  updateAllWidgets() {
    this.updateClock();
    this.updateBattery();
    this.updateWifi();
    this.updateVolume();
  }

  /**
   * Actualiza el widget de reloj
   */
  updateClock() {
    const now = new Date();
    
    // Formatear hora
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.state.time = `${hours}:${minutes}`;
    
    // Formatear fecha
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    
    this.state.date = `${dayName}, ${day} ${month}`;
    
    // Actualizar DOM
    const timeElement = document.getElementById('status-time');
    const dateElement = document.getElementById('status-date');
    
    if (timeElement) timeElement.textContent = this.state.time;
    if (dateElement) dateElement.textContent = this.state.date;
  }

  /**
   * Actualiza el widget de batería
   */
  updateBattery() {
    const iconElement = document.getElementById('status-battery-icon');
    const levelElement = document.getElementById('status-battery-level');
    
    if (!iconElement || !levelElement) return;
    
    // Determinar icono según el nivel y estado de carga
    let iconClass = 'fas fa-battery-';
    
    if (this.state.battery.charging) {
      iconClass += 'charging';
    } else if (this.state.battery.level >= 90) {
      iconClass += 'full';
    } else if (this.state.battery.level >= 70) {
      iconClass += 'three-quarters';
    } else if (this.state.battery.level >= 50) {
      iconClass += 'half';
    } else if (this.state.battery.level >= 20) {
      iconClass += 'quarter';
    } else {
      iconClass = 'fas fa-battery-exclamation';
    }
    
    iconElement.className = `${iconClass} status-icon`;
    levelElement.textContent = `${this.state.battery.level}%`;
  }

  /**
   * Actualiza el widget de WiFi
   */
  updateWifi() {
    const iconElement = document.getElementById('status-wifi-icon');
    const statusElement = document.getElementById('status-wifi-status');
    
    if (!iconElement || !statusElement) return;
    
    // Determinar icono según el estado
    let iconClass = 'fas fa-';
    
    if (!this.state.wifi.connected) {
      iconClass += 'wifi-slash';
    } else if (this.state.wifi.strength >= 3) {
      iconClass += 'wifi';
    } else {
      iconClass += `wifi-${this.state.wifi.strength}`;
    }
    
    iconElement.className = `${iconClass} status-icon`;
    statusElement.textContent = this.state.wifi.status;
  }

  /**
   * Actualiza el widget de volumen
   */
  updateVolume() {
    const iconElement = document.getElementById('status-volume-icon');
    const levelElement = document.getElementById('status-volume-level');
    
    if (!iconElement || !levelElement) return;
    
    // Determinar icono según el nivel y estado
    let iconClass = 'fas fa-volume-';
    
    if (this.state.volume.muted) {
      iconClass += 'mute';
    } else if (this.state.volume.level >= 66) {
      iconClass += 'up';
    } else if (this.state.volume.level >= 33) {
      iconClass += 'down';
    } else {
      iconClass = 'fas fa-volume-off';
    }
    
    iconElement.className = `${iconClass} status-icon`;
    levelElement.textContent = this.state.volume.muted ? 'Mute' : `${this.state.volume.level}%`;
  }

  /**
   * Simula una actualización de batería
   */
  simulateBatteryUpdate() {
    // Simular descarga lenta
    if (!this.state.battery.charging && this.state.battery.level > 0) {
      this.state.battery.level = Math.max(0, this.state.battery.level - 1);
    }
    
    // Simular carga si está conectado
    if (this.state.battery.charging && this.state.battery.level < 100) {
      this.state.battery.level = Math.min(100, this.state.battery.level + 2);
    }
    
    // Simular cambio de estado de carga
    if (Math.random() > 0.95) {
      this.state.battery.charging = !this.state.battery.charging;
    }
    
    this.updateBattery();
  }

  /**
   * Simula una actualización de WiFi
   */
  simulateWifiUpdate() {
    // Simular desconexión ocasional
    if (Math.random() > 0.9) {
      this.state.wifi.connected = !this.state.wifi.connected;
      
      if (this.state.wifi.connected) {
        this.state.wifi.status = 'Conectado';
        this.state.wifi.strength = Math.floor(Math.random() * 4) + 1;
      } else {
        this.state.wifi.status = 'Desconectado';
        this.state.wifi.strength = 0;
      }
    } else if (this.state.wifi.connected) {
      // Simular cambios de señal
      if (Math.random() > 0.8) {
        this.state.wifi.strength = Math.floor(Math.random() * 4) + 1;
      }
    }
    
    this.updateWifi();
  }

  /**
   * Simula una actualización de volumen
   */
  simulateVolumeUpdate() {
    // Simular cambios de volumen
    if (Math.random() > 0.8) {
      const change = Math.floor(Math.random() * 10) - 5; // -5 a +5
      this.state.volume.level = Math.max(0, Math.min(100, this.state.volume.level + change));
    }
    
    // Simular silencio ocasional
    if (Math.random() > 0.95) {
      this.state.volume.muted = !this.state.volume.muted;
    }
    
    this.updateVolume();
  }

  /**
   * Establece manualmente el nivel de batería
   * @param {number} level - Nivel de batería (0-100)
   * @param {boolean} charging - Si está cargando
   */
  setBattery(level, charging = false) {
    this.state.battery.level = Math.max(0, Math.min(100, level));
    this.state.battery.charging = charging;
    this.updateBattery();
  }

  /**
   * Establece manualmente el estado de WiFi
   * @param {boolean} connected - Si está conectado
   * @param {number} strength - Intensidad de la señal (0-4)
   * @param {string} status - Texto de estado
   */
  setWifi(connected, strength = 0, status = '') {
    this.state.wifi.connected = connected;
    this.state.wifi.strength = Math.max(0, Math.min(4, strength));
    this.state.wifi.status = status || (connected ? 'Conectado' : 'Desconectado');
    this.updateWifi();
  }

  /**
   * Establece manualmente el nivel de volumen
   * @param {number} level - Nivel de volumen (0-100)
   * @param {boolean} muted - Si está silenciado
   */
  setVolume(level, muted = false) {
    this.state.volume.level = Math.max(0, Math.min(100, level));
    this.state.volume.muted = muted;
    this.updateVolume();
  }

  /**
   * Obtiene el estado actual de los widgets
   * @returns {Object} Estado actual
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Destruye el widget y limpia recursos
   */
  destroy() {
    this.stopPeriodicUpdates();
    
    if (this.container) {
      this.container.innerHTML = '';
      this.container = null;
    }
    
    this.isInitialized = false;
    console.log('StatusWidget destruido');
  }
}

// Exportar la clase
export { StatusWidget };

// Crear instancia global si no existe
if (typeof window !== 'undefined' && !window.statusWidget) {
  window.statusWidget = new StatusWidget();
}
