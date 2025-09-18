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
/*
 * Gestor de configuración de Mizu OS
 * Responsable de cargar y mantener la configuración global del sistema
 * // docs/apps/core/configManager.js
 * Rol: Gestión centralizada de la configuración del sistema
 * Filosofía: Proporcionar un punto único de acceso a la configuración global
 *Principios:
 *Cloud-Native: Ejecución 100% en navegador (GitHub Pages + jsDelivr) — sin build, sin bundlers, sin node_modules, sin servidores locales.
 *Extensible por diseño: cada app es un módulo independiente con su propio bootstrap.
 *Licencia libre: GNU AGPL-3.0 — cualquier modificación públicada en la red debe compartirse la fuente.
 *Stack Tecnológico/Zero Dependencies: ES6+ JavaScript vainilla (módulos nativos), CSS3 con Custom Properties, HTML5 APIs (Canvas, WebAudio, etc.). Sin frameworks, sin Tailwind.
*/

export class ConfigManager {
  constructor() {
    this.config = {};
    this.loaded = false;
    console.log('ConfigManager: Inicializado');
  }

  // Cargar la configuración desde un archivo JSON
  async load() {
    try {
      console.log('ConfigManager: Cargando configuración...');
      const response = await fetch('./config/system.json');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      this.config = await response.json();
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
    
    return { ...this.config }; // Devolver una copia para evitar mutaciones externas
  }

  // Verificar si la configuración está cargada
  isLoaded() {
    return this.loaded;
  }

  // Reiniciar la configuración
  reset() {
    this.config = {};
    this.loaded = false;
    console.log('ConfigManager: Configuración reiniciada');
  }
}
