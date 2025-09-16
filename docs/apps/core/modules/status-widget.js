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
      // Solo mostrar horas y minutos, sin segundos
      clock.innerHTML = `<i class="far fa-clock"></i> ${hours}:${minutes}`;
    };
    
    // Actualizar inmediatamente
    updateClock();
    
    // Actualizar cada minuto en lugar de cada segundo
    setInterval(updateClock, 60000);
    
    this.widgets.clock = clock;
    return clock;
  }

  createBattery() {
    const battery = document.createElement('div');
    battery.className = 'status-widget';
    battery.id = 'battery-widget';
    
    // Simular nivel de batería (en una implementación real se usaría la API de batería)
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
    
    // Simular estado de conexión (en una implementación real se usaría la API de conexión)
    const isConnected = Math.random() > 0.3;
    
    // Solo el icono, sin texto
    wifi.innerHTML = `<i class="fas fa-wifi"></i>`;
    
    this.widgets.wifi = wifi;
    return wifi;
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

  createAllWidgets() {
    console.log('StatusWidget: Creando todos los widgets');
    
    const container = document.createElement('div');
    container.className = 'status-widgets-container';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.gap = '15px';
    container.style.marginLeft = 'auto';
    
    // Nuevo orden: WiFi, Volumen, Batería, Reloj
    container.appendChild(this.createVolume());
    container.appendChild(this.createWiFi());
    container.appendChild(this.createBattery());
    container.appendChild(this.createClock());
    
    console.log('StatusWidget: Widgets creados correctamente');
    return container;
  }
}
