/*
 * Mizu OS - Performance App - Device Info Module
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
/*
 * Módulo para recopilar información del dispositivo
 * docs/apps/performance/modules/device-info.js
 */
export default class DeviceInfo {
  constructor() {
    this.deviceInfo = {};
  }
  
  // Recopilar información del dispositivo
  collectDeviceInfo() {
    // Información del navegador
    const userAgent = navigator.userAgent;
    
    // Extraer nombre del navegador de forma más precisa
    if (userAgent.includes('Firefox')) {
      this.deviceInfo.browser = 'Mozilla Firefox';
    } else if (userAgent.includes('Chrome')) {
      this.deviceInfo.browser = 'Google Chrome';
    } else if (userAgent.includes('Safari')) {
      this.deviceInfo.browser = 'Safari';
    } else if (userAgent.includes('Edge')) {
      this.deviceInfo.browser = 'Microsoft Edge';
    } else {
      this.deviceInfo.browser = 'Navegador desconocido';
    }
    
    // Sistema operativo
    if (userAgent.includes('Windows')) {
      this.deviceInfo.os = 'Windows';
    } else if (userAgent.includes('Mac')) {
      this.deviceInfo.os = 'macOS';
    } else if (userAgent.includes('Linux')) {
      this.deviceInfo.os = 'Linux';
    } else if (userAgent.includes('Android')) {
      this.deviceInfo.os = 'Android';
    } else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      this.deviceInfo.os = 'iOS';
    } else {
      this.deviceInfo.os = 'Sistema operativo desconocido';
    }
    
    // Resolución
    this.deviceInfo.resolution = `${window.screen.width}x${window.screen.height}`;
    
    // Tipo de dispositivo
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      if (window.innerWidth > 768) {
        this.deviceInfo.deviceType = 'Tablet';
      } else {
        this.deviceInfo.deviceType = 'Smartphone';
      }
    } else {
      this.deviceInfo.deviceType = 'Escritorio';
    }
    
    // Detección más precisa de Smart TV solo si hay indicadores claros
    const tvIndicators = [
      'SmartTV', 'GoogleTV', 'AppleTV', 'Web0S', 'Tizen', 'NetCast', 
      'Opera TV', 'Viera', 'PhilipsTV', 'NETTV', 'HbbTV'
    ];
    
    const isTV = tvIndicators.some(indicator => userAgent.includes(indicator));
    
    if (isTV) {
      this.deviceInfo.deviceType = 'Smart TV';
    }
    
    return this.deviceInfo;
  }
}
