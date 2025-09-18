/*
 * Mizu OS - Core/ConfigManager
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
 * Gestor de configuración de Mizu OS
 * Responsable de cargar y mantener la configuración global del sistema
 * // docs/apps/core/configManager.js
 * Rol: Gestión centralizada de la configuración del sistema
 * Filosofía: Proporcionar un punto único de acceso a la configuración global
 * Principios:
 * Cloud-Native: Ejecución 100% en navegador (GitHub Pages + jsDelivr) — sin build, sin bundlers, sin node_modules, sin servidores locales.
 * Extensible por diseño: cada app es un módulo independiente con su propio bootstrap.
 * Licencia libre: GNU AGPL-3.0 — cualquier modificación públicada en la red debe compartirse la fuente.
 * Stack Tecnológico/Zero Dependencies: ES6+ JavaScript vainilla (módulos nativos), CSS3 con Custom Properties, HTML5 APIs (Canvas, WebAudio, etc.). Sin frameworks, sin Tailwind.
 */

export class ConfigManager {
  constructor() {
    this.config = {};
    this.modulesConfig = {}; // Almacenar la configuración de módulos
    this.loaded = false;
    console.log('ConfigManager: Inicializado');
  }

  // Cargar la configuración desde archivos JSON
  async load() {
    try {
      console.log('ConfigManager: Cargando configuración...');
      
      // Cargar configuración del sistema
      const systemResponse = await fetch('./config/system.json');
      
      if (!systemResponse.ok) {
        throw new Error(`Error ${systemResponse.status}: ${systemResponse.statusText}`);
      }
      
      this.config = await systemResponse.json();
      
      // Cargar configuración de módulos
      const modulesResponse = await fetch('./config/modules.json');
      
      if (!modulesResponse.ok) {
        throw new Error(`Error ${modulesResponse.status}: ${modulesResponse.statusText}`);
      }
      
      this.modulesConfig = await modulesResponse.json();
      
      this.loaded = true;
      console.log('ConfigManager: Configuración cargada correctamente');
      
      // Establecer la versión como variable global para acceso rápido
      if (this.config.version) {
        window.MIZU_VERSION = this.config.version;
        console.log(`ConfigManager: Versión establecida: ${window.MIZU_VERSION}`);
      }
    } catch (error) {
      console.error('ConfigManager: Error cargando configuración:', error);
      
      // Configuración por defecto en caso de error
      this.config = {
        version: '3.0.1',
        debug: false,
        modules: ['core'],
        settings: {
          theme: 'light',
          language: 'es',
          timezone: 'America/Mexico_City',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '24h',
          animations: true,
          notifications: true,
          autoSave: true,
          autoSaveInterval: 30000
        },
        features: {
          darkMode: true,
          offlineMode: true,
          pwa: true,
          voiceControl: false,
          gestureControl: false
        },
        paths: {
          modules: "./apps/",
          assets: "./assets/",
          themes: "./themes/",
          fonts: "./assets/fonts/"
        },
        security: {
          corsEnabled: true,
          contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
          sanitizeInput: true
        },
        performance: {
          lazyLoading: true,
          cacheEnabled: true,
          cacheTTL: 3600000,
          maxConcurrentRequests: 6
        },
        ui: {
          defaultLayout: 'desktop',
          responsiveBreakpoints: {
            mobile: 768,
            tablet: 1024,
            desktop: 1200
          },
          components: {
            header: true,
            sidebar: true,
            footer: true,
            notifications: true
          }
        }
      };
      
      // Configuración por defecto para módulos
      this.modulesConfig = {
        ui: "./apps/ui/ui.json",
        storage: "./apps/storage/storage.json",
        network: "./apps/network/network.json",
        music: "./apps/music/music.json"
      };
      
      this.loaded = true;
      console.log('ConfigManager: Usando configuración por defecto');
    }
  }

  // Obtener un valor de configuración
  get(key) {
    if (!this.loaded) {
      console.warn('ConfigManager: Configuración no cargada aún');
      return undefined;
    }
    
    // Si se solicita la configuración de módulos, devolver la configuración detallada
    if (key === 'modules') {
      return this.modulesConfig;
    }
    
    // Permitir acceso anidado con notación de puntos (ej: 'settings.theme')
    const keys = key.split('.');
    let value = this.config;
    
    for (const k of keys) {
      if (value === undefined || value === null) {
        return undefined;
      }
      value = value[k];
    }
    
    return value;
  }

  // Establecer un valor de configuración
  set(key, value) {
    if (!this.loaded) {
      console.warn('ConfigManager: Configuración no cargada aún');
      return false;
    }
    
    // Permitir establecer valores anidados con notación de puntos
    const keys = key.split('.');
    let target = this.config;
    
    // Navegar hasta el penúltimo nivel
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (target[k] === undefined || target[k] === null) {
        target[k] = {};
      }
      target = target[k];
    }
    
    // Establecer el valor en el último nivel
    target[keys[keys.length - 1]] = value;
    console.log(`ConfigManager: Configuración actualizada: ${key} =`, value);
    
    return true;
  }

  // Obtener toda la configuración
  getAll() {
    if (!this.loaded) {
      console.warn('ConfigManager: Configuración no cargada aún');
      return {};
    }
    
    return { 
      ...this.config,
      modules: this.modulesConfig // Incluir la configuración de módulos
    }; // Devolver una copia para evitar mutaciones externas
  }

  // Verificar si la configuración está cargada
  isLoaded() {
    return this.loaded;
  }

  // Reiniciar la configuración
  reset() {
    this.config = {};
    this.modulesConfig = {};
    this.loaded = false;
    console.log('ConfigManager: Configuración reiniciada');
  }

  // Recargar la configuración
  async reload() {
    this.reset();
    await this.load();
    console.log('ConfigManager: Configuración recargada');
  }

  // Obtener la configuración de un módulo específico
  getModuleConfig(moduleId) {
    if (!this.loaded) {
      console.warn('ConfigManager: Configuración no cargada aún');
      return undefined;
    }
    
    return this.modulesConfig[moduleId];
  }

  // Establecer la configuración de un módulo específico
  setModuleConfig(moduleId, config) {
    if (!this.loaded) {
      console.warn('ConfigManager: Configuración no cargada aún');
      return false;
    }
    
    this.modulesConfig[moduleId] = config;
    console.log(`ConfigManager: Configuración de módulo actualizada: ${moduleId} =`, config);
    
    return true;
  }

  // Obtener todos los IDs de módulos
  getModuleIds() {
    if (!this.loaded) {
      console.warn('ConfigManager: Configuración no cargada aún');
      return [];
    }
    
    return Object.keys(this.modulesConfig);
  }

  // Verificar si un módulo existe
  hasModule(moduleId) {
    if (!this.loaded) {
      console.warn('ConfigManager: Configuración no cargada aún');
      return false;
    }
    
    return moduleId in this.modulesConfig;
  }

  // Agregar un nuevo módulo
  addModule(moduleId, configPath) {
    if (!this.loaded) {
      console.warn('ConfigManager: Configuración no cargada aún');
      return false;
    }
    
    this.modulesConfig[moduleId] = configPath;
    console.log(`ConfigManager: Módulo agregado: ${moduleId} -> ${configPath}`);
    
    return true;
  }

  // Eliminar un módulo
  removeModule(moduleId) {
    if (!this.loaded) {
      console.warn('ConfigManager: Configuración no cargada aún');
      return false;
    }
    
    if (moduleId in this.modulesConfig) {
      delete this.modulesConfig[moduleId];
      console.log(`ConfigManager: Módulo eliminado: ${moduleId}`);
      return true;
    }
    
    console.warn(`ConfigManager: Módulo no encontrado: ${moduleId}`);
    return false;
  }
}
