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
    const userAgent = navigator.userAgent;
    
    // Detección más precisa del navegador
    if (userAgent.includes('Firefox') && !userAgent.includes('Seamonkey')) {
      this.deviceInfo.browser = 'Mozilla Firefox';
    } else if (userAgent.includes('Seamonkey')) {
      this.deviceInfo.browser = 'Seamonkey';
    } else if (userAgent.includes('Chrome') && !userAgent.includes('Chromium') && !userAgent.includes('Edg') && !userAgent.includes('OPR') && !userAgent.includes('Brave') && !userAgent.includes('Whale') && !userAgent.includes('Vivaldi')) {
      this.deviceInfo.browser = 'Google Chrome';
    } else if (userAgent.includes('Chromium')) {
      this.deviceInfo.browser = 'Chromium';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome') && !userAgent.includes('Chromium')) {
      this.deviceInfo.browser = 'Safari';
    } else if (userAgent.includes('Edg')) {
      this.deviceInfo.browser = 'Microsoft Edge';
    } else if (userAgent.includes('Brave')) {
      this.deviceInfo.browser = 'Brave';
    } else if (userAgent.includes('Whale')) {
      this.deviceInfo.browser = 'Naver Whale';
    } else if (userAgent.includes('Vivaldi')) {
      this.deviceInfo.browser = 'Vivaldi';
    } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
      this.deviceInfo.browser = 'Opera';
    } else if (userAgent.includes('UC Browser')) {
      this.deviceInfo.browser = 'UC Browser';
    } else if (userAgent.includes('DuckDuckGo')) {
      this.deviceInfo.browser = 'DuckDuckGo';
    } else {
      this.deviceInfo.browser = 'Navegador desconocido';
    }
    
    // Detección más precisa del sistema operativo
    if (userAgent.includes('Windows')) {
      this.deviceInfo.os = 'Windows';
      // Intentar detectar la versión específica de Windows
      if (userAgent.includes('Windows NT 10.0')) {
        this.deviceInfo.os = 'Windows 10';
      } else if (userAgent.includes('Windows NT 6.3')) {
        this.deviceInfo.os = 'Windows 8.1';
      } else if (userAgent.includes('Windows NT 6.2')) {
        this.deviceInfo.os = 'Windows 8';
      } else if (userAgent.includes('Windows NT 6.1')) {
        this.deviceInfo.os = 'Windows 7';
      } else if (userAgent.includes('Windows NT 6.0')) {
        this.deviceInfo.os = 'Windows Vista';
      } else if (userAgent.includes('Windows NT 5.1')) {
        this.deviceInfo.os = 'Windows XP';
      }
    } else if (userAgent.includes('Android')) {
      this.deviceInfo.os = 'Android';
      // Intentar detectar la versión de Android
      const androidMatch = userAgent.match(/Android\s([0-9\.]*)/);
      if (androidMatch && androidMatch[1]) {
        this.deviceInfo.os = `Android ${androidMatch[1]}`;
      }
    } else if (userAgent.includes('Mac OS X')) {
      this.deviceInfo.os = 'macOS';
      // Intentar detectar la versión específica
      const macMatch = userAgent.match(/Mac OS X\s([0-9_\.]*)/);
      if (macMatch && macMatch[1]) {
        this.deviceInfo.os = `macOS ${macMatch[1].replace(/_/g, '.')}`;
      }
    } else if (userAgent.includes('Linux') && !userAgent.includes('Android')) {
      this.deviceInfo.os = 'Linux';
    } else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      this.deviceInfo.os = 'iOS';
    } else {
      this.deviceInfo.os = 'Sistema operativo desconocido';
    }
    
    // Detección más precisa de la resolución
    let screenWidth = window.screen.width;
    let screenHeight = window.screen.height;
    
    // En algunos navegadores, especialmente en móviles, screen.width y screen.height pueden no ser precisos
    // Intentamos usar window.innerWidth y window.innerHeight como alternativa
    if (screenWidth < 100 || screenHeight < 100) {
      screenWidth = window.innerWidth;
      screenHeight = window.innerHeight;
    }
    
    // Si aún así los valores no son razonables, usamos la resolución del dispositivo
    if (screenWidth < 100 || screenHeight < 100) {
      screenWidth = screen.availWidth;
      screenHeight = screen.availHeight;
    }
    
    // Formatear la resolución
    this.deviceInfo.resolution = `${screenWidth}x${screenHeight}`;
    
    // Detección más precisa del tipo de dispositivo
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
