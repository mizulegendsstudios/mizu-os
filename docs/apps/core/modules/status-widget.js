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
// apps/core/modules/status-widget.js
// apps/core/modules/status-widget.js
export default class StatusWidget {
  constructor() {
    this.widgets = {};
  }

  createMusicControls() {
    const container = document.createElement('div');
    container.className = 'music-controls-container';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.gap = '8px';
    container.style.marginRight = '15px';
    
    // Botón de reproducción/pausa
    const playPauseBtn = this.createMusicControlButton('fa-play', 'Reproducir/Pausar', () => {
      this.emitMusicEvent('togglePlayPause');
    });
    
    // Botón de detener
    const stopBtn = this.createMusicControlButton('fa-stop', 'Detener', () => {
      this.emitMusicEvent('stop');
    });
    
    // Botón anterior
    const prevBtn = this.createMusicControlButton('fa-backward', 'Anterior', () => {
      this.emitMusicEvent('playPrev');
    });
    
    // Botón siguiente
    const nextBtn = this.createMusicControlButton('fa-forward', 'Siguiente', () => {
      this.emitMusicEvent('playNext');
    });
    
    // Botón de volumen
    const volumeBtn = this.createMusicControlButton('fa-volume-up', 'Volumen', () => {
      this.emitMusicEvent('toggleVolume');
    });
    
    container.appendChild(prevBtn);
    container.appendChild(playPauseBtn);
    container.appendChild(stopBtn);
    container.appendChild(nextBtn);
    container.appendChild(volumeBtn);
    
    return container;
  }
  
  createMusicControlButton(iconClass, title, clickHandler) {
    const button = document.createElement('button');
    button.className = 'music-control-button';
    button.style.cssText = `
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    `;
    
    const icon = document.createElement('i');
    icon.className = `fa-solid ${iconClass}`;
    icon.style.cssText = 'font-size: 14px;';
    
    button.appendChild(icon);
    button.title = title;
    button.addEventListener('click', clickHandler);
    
    return button;
  }
  
  emitMusicEvent(eventName) {
    if (window.MizuOS && window.MizuOS.eventBus) {
      window.MizuOS.eventBus.emit(`music:${eventName}`);
    }
  }

  createSeparator() {
    const separator = document.createElement('div');
    separator.className = 'status-widget';
    separator.id = 'separator-widget';
    separator.style.width = '1px';
    separator.style.height = '20px';
    separator.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    separator.style.margin = '0 10px';
    
    this.widgets.separator = separator;
    return separator;
  }

  createVolume() {
    const volume = document.createElement('div');
    volume.className = 'status-widget';
    volume.id = 'volume-widget';
    
    // Simular nivel de volumen
    const volumeLevel = Math.floor(Math.random() * 100);
    
    // Solo el icono, sin texto
    volume.innerHTML = `<i class="fas fa-volume-up"></i>`;
    
    this.widgets.volume = volume;
    return volume;
  }

  createBattery() {
    const battery = document.createElement('div');
    battery.className = 'status-widget';
    battery.id = 'battery-widget';
    
    // Simular nivel de batería
    const batteryLevel = Math.floor(Math.random() * 100);
    
    // Solo el icono, sin texto
    battery.innerHTML = `<i class="fas fa-battery-three-quarters"></i>`;
    
    this.widgets.battery = battery;
    return battery;
  }

  createWiFi() {
    const wifi = document.createElement('div');
    wifi.className = 'status-widget';
    wifi.id = 'wifi-widget';
    
    // Simular estado de conexión
    const isConnected = Math.random() > 0.3;
    
    // Solo el icono, sin texto
    wifi.innerHTML = `<i class="fas fa-wifi"></i>`;
    
    this.widgets.wifi = wifi;
    return wifi;
  }

  createMonth() {
    const month = document.createElement('div');
    month.className = 'status-widget';
    month.id = 'month-widget';
    
    const updateMonth = () => {
      const now = new Date();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      month.textContent = monthNames[now.getMonth()];
    };
    
    updateMonth();
    
    this.widgets.month = month;
    return month;
  }

  createDay() {
    const day = document.createElement('div');
    day.className = 'status-widget';
    day.id = 'day-widget';
    
    const updateDay = () => {
      const now = new Date();
      day.textContent = now.getDate();
    };
    
    updateDay();
    
    this.widgets.day = day;
    return day;
  }

  createClock() {
    const clock = document.createElement('div');
    clock.className = 'status-widget';
    clock.id = 'clock-widget';
    
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      
      // Convertir a formato 12 horas
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 debe ser 12
      
      clock.innerHTML = `${hours}:${minutes} <small>${ampm}</small>`;
    };
    
    updateClock();
    
    // Actualizar cada minuto
    setInterval(updateClock, 60000);
    
    this.widgets.clock = clock;
    return clock;
  }

  createAllWidgets() {
    console.log('StatusWidget: Creando todos los widgets');
    
    const container = document.createElement('div');
    container.className = 'status-widgets-container';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.gap = '12px';
    container.style.marginLeft = 'auto';
    container.style.marginRight = '10px';
    
    // Nuevo orden: volumen, batería, wifi, mes, día, hora, minutos, am/pm
    container.appendChild(this.createVolume());
    container.appendChild(this.createBattery());
    container.appendChild(this.createWiFi());
    container.appendChild(this.createMonth());
    container.appendChild(this.createDay());
    container.appendChild(this.createClock());
    
    console.log('StatusWidget: Widgets creados correctamente');
    return container;
  }
}
