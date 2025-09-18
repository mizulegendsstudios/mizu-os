/*
 * Mizu OS - Modules/Network
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
 * Módulo de red de Mizu OS
 * Responsable de gestionar las comunicaciones de red y la conectividad
 * // docs/apps/network/network.js
 * Rol: Gestión de comunicaciones de red
 * Filosofía: Proporcionar una API unificada para operaciones de red con manejo de errores y caché
 *Principios:
 *Cloud-Native: Ejecución 100% en navegador (GitHub Pages + jsDelivr) — sin build, sin bundlers, sin node_modules, sin servidores locales.
 *Extensible por diseño: cada app es un módulo independiente con su propio bootstrap.
 *Licencia libre: GNU AGPL-3.0 — cualquier modificación públicada en la red debe compartirse la fuente.
 *Stack Tecnológico/Zero Dependencies: ES6+ JavaScript vainilla (módulos nativos), CSS3 con Custom Properties, HTML5 APIs (Canvas, WebAudio, etc.). Sin frameworks, sin Tailwind.
*/

export default {
  name: 'NetworkModule',
  version: '1.0.0',
  
  async init() {
    console.log('NetworkModule: Inicializando módulo de red...');
    
    // Verificar conectividad
    this.checkConnectivity();
    
    // Configurar listeners para cambios de conectividad
    this.setupConnectivityListeners();
    
    // Configurar endpoints base
    this.setupEndpoints();
    
    console.log('NetworkModule: Módulo de red inicializado correctamente');
  },
  
  isOnline: navigator.onLine,
  endpoints: {
    api: '',
    cdn: ''
  },
  
  checkConnectivity() {
    console.log('NetworkModule: Verificando conectividad...');
    this.isOnline = navigator.onLine;
    console.log(`NetworkModule: Estado de conectividad: ${this.isOnline ? 'Online' : 'Offline'}`);
    
    // Actualizar UI con estado de conectividad
    this.updateConnectivityStatus();
  },
  
  setupConnectivityListeners() {
    console.log('NetworkModule: Configurando listeners de conectividad...');
    
    window.addEventListener('online', () => {
      console.log('NetworkModule: Conexión restablecida');
      this.isOnline = true;
      this.updateConnectivityStatus();
    });
    
    window.addEventListener('offline', () => {
      console.log('NetworkModule: Conexión perdida');
      this.isOnline = false;
      this.updateConnectivityStatus();
    });
  },
  
  setupEndpoints() {
    console.log('NetworkModule: Configurando endpoints...');
    
    // Configurar endpoints desde la configuración o valores por defecto
    this.endpoints.api = 'https://api.mizu-os.example.com';
    this.endpoints.cdn = 'https://cdn.mizu-os.example.com';
    
    console.log('NetworkModule: Endpoints configurados:', this.endpoints);
  },
  
  updateConnectivityStatus() {
    const statusEl = document.getElementById('system-status');
    if (statusEl) {
      statusEl.textContent = this.isOnline ? 'Operativo' : 'Sin conexión';
      statusEl.style.color = this.isOnline ? 'var(--secondary-color)' : 'var(--accent-color)';
    }
  },
  
  // Método genérico para peticiones HTTP
  async fetch(url, options = {}) {
    if (!this.isOnline) {
      console.error('NetworkModule: Sin conexión a internet');
      throw new Error('Sin conexión a internet');
    }
    
    console.log(`NetworkModule: Realizando petición a ${url}`);
    
    // Configurar opciones por defecto
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors',
      cache: 'default'
    };
    
    // Combinar opciones por defecto con las proporcionadas
    const fetchOptions = { ...defaultOptions, ...options };
    
    try {
      const response = await fetch(url, fetchOptions);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
      }
      
      // Intentar parsear como JSON, si falla devolver texto
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      console.log(`NetworkModule: Petición a ${url} completada con éxito`);
      return data;
    } catch (error) {
      console.error(`NetworkModule: Error en petición a ${url}:`, error);
      throw error;
    }
  },
  
  // Métodos específicos para diferentes tipos de peticiones
  async get(url, params = {}) {
    // Construir URL con parámetros
    const urlObj = new URL(url);
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        urlObj.searchParams.append(key, params[key]);
      }
    });
    
    return this.fetch(urlObj.toString(), { method: 'GET' });
  },
  
  async post(url, data = {}) {
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  async put(url, data = {}) {
    return this.fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  async delete(url) {
    return this.fetch(url, { method: 'DELETE' });
  },
  
  // Métodos para interactuar con la API
  async apiRequest(endpoint, options = {}) {
    const url = `${this.endpoints.api}${endpoint}`;
    return this.fetch(url, options);
  },
  
  async apiGet(endpoint, params = {}) {
    return this.get(`${this.endpoints.api}${endpoint}`, params);
  },
  
  async apiPost(endpoint, data = {}) {
    return this.post(`${this.endpoints.api}${endpoint}`, data);
  },
  
  // Método para cargar recursos desde CDN
  async loadFromCDN(path) {
    const url = `${this.endpoints.cdn}${path}`;
    return this.fetch(url);
  },
  
  // Método para verificar si un recurso está disponible
  async checkResourceAvailability(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error(`NetworkModule: Error al verificar disponibilidad de ${url}:`, error);
      return false;
    }
  },
  
  async destroy() {
    console.log('NetworkModule: Destruyendo módulo de red...');
    
    // Eliminar listeners de conectividad
    window.removeEventListener('online', this.updateConnectivityStatus);
    window.removeEventListener('offline', this.updateConnectivityStatus);
    
    console.log('NetworkModule: Módulo de red destruido');
  }
};
