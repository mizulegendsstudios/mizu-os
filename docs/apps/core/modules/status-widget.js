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
export default class StatusWidget {
  constructor() {
    this.widgets = {};
  }

  createClock() {
    const clock = document.createElement('div');
    clock.className = 'status-widget';
    clock.id = 'clock-widget';
    
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      clock.textContent = `${hours}:${minutes}:${seconds}`;
    };
    
    // Actualizar inmediatamente
    updateClock();
    
    // Actualizar cada segundo
    setInterval(updateClock, 1000);
    
    this.widgets.clock = clock;
    return clock;
  }

  createBattery() {
    const battery = document.createElement('div');
    battery.className = 'status-widget';
    battery.id = 'battery-widget';
    
    // Simular nivel de batería (en una implementación real se usaría la API de batería)
    const batteryLevel = Math.floor(Math.random() * 100);
    
    battery.innerHTML = `
      <i class="fas fa-battery-three-quarters"></i>
      <span>${batteryLevel}%</span>
    `;
    
    this.widgets.battery = battery;
    return battery;
  }

  createWiFi() {
    const wifi = document.createElement('div');
    wifi.className = 'status-widget';
    wifi.id = 'wifi-widget';
    
    // Simular estado de conexión (en una implementación real se usaría la API de conexión)
    const isConnected = Math.random() > 0.3;
    
    wifi.innerHTML = `
      <i class="fas fa-wifi"></i>
      <span>${isConnected ? 'Conectado' : 'Desconectado'}</span>
    `;
    
    this.widgets.wifi = wifi;
    return wifi;
  }

  createVolume() {
    const volume = document.createElement('div');
    volume.className = 'status-widget';
    volume.id = 'volume-widget';
    
    // Simular nivel de volumen
    const volumeLevel = Math.floor(Math.random() * 100);
    
    volume.innerHTML = `
      <i class="fas fa-volume-up"></i>
      <span>${volumeLevel}%</span>
    `;
    
    this.widgets.volume = volume;
    return volume;
  }

  createAllWidgets() {
    console.log('StatusWidget: Creando todos los widgets');
    
    const container = document.createElement('div');
    container.className = 'status-widgets-container';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.gap = '15px';
    container.style.marginLeft = 'auto';
    
    // Crear y añadir widgets
    container.appendChild(this.createClock());
    container.appendChild(this.createBattery());
    container.appendChild(this.createWiFi());
    container.appendChild(this.createVolume());
    
    console.log('StatusWidget: Widgets creados correctamente');
    return container;
  }
}
