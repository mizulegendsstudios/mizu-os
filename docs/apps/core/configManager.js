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

export class ConfigManager {
  constructor() {
    this.config = {};
    this.modulesConfig = {}; // Añadimos esta propiedad para almacenar la configuración de módulos
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
          language: 'es'
        }
      };
      
      // Configuración por defecto para módulos
      this.modulesConfig = {
        ui: {
          name: "UI App",
          dependencies: [],
          enabled: true,
          priority: 1
        }
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
}
