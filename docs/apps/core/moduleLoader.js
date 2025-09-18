/*
 * Mizu OS - Core/ModuleLoader
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
 * Cargador de módulos de Mizu OS
 * Responsable de cargar dinámicamente los módulos principales del sistema
 * // docs/apps/core/moduleLoader.js
 * Rol: Carga dinámica de módulos del sistema
 * Filosofía: Cargar solo los módulos necesarios en el momento adecuado
 *Principios:
 *Cloud-Native: Ejecución 100% en navegador (GitHub Pages + jsDelivr) — sin build, sin bundlers, sin node_modules, sin servidores locales.
 *Extensible por diseño: cada app es un módulo independiente con su propio bootstrap.
 *Licencia libre: GNU AGPL-3.0 — cualquier modificación públicada en la red debe compartirse la fuente.
 *Stack Tecnológico/Zero Dependencies: ES6+ JavaScript vainilla (módulos nativos), CSS3 con Custom Properties, HTML5 APIs (Canvas, WebAudio, etc.). Sin frameworks, sin Tailwind.
*/

export class ModuleLoader {
  constructor() {
    this.loadedModules = new Map();
    this.coreModules = [];
    console.log('ModuleLoader: Inicializado');
  }

  // Cargar los módulos principales del sistema
  async loadCoreModules() {
    try {
      console.log('ModuleLoader: Iniciando carga de módulos principales...');
      
      // Obtener la lista de módulos principales desde la configuración
      const coreModulesList = this.getCoreModulesList();
      
      console.log('ModuleLoader: Módulos principales a cargar:', coreModulesList);
      
      // Cargar cada módulo en paralelo
      const loadPromises = coreModulesList.map(moduleName => this.loadModule(moduleName));
      
      // Esperar a que todos los módulos se carguen
      const results = await Promise.allSettled(loadPromises);
      
      // Procesar los resultados
      results.forEach((result, index) => {
        const moduleName = coreModulesList[index];
        if (result.status === 'fulfilled') {
          console.log(`ModuleLoader: Módulo '${moduleName}' cargado correctamente`);
        } else {
          console.error(`ModuleLoader: Error cargando módulo '${moduleName}':`, result.reason);
        }
      });
      
      console.log('ModuleLoader: Carga de módulos principales completada');
    } catch (error) {
      console.error('ModuleLoader: Error durante la carga de módulos principales:', error);
      throw error;
    }
  }

  // Obtener la lista de módulos principales
  getCoreModulesList() {
    // Por ahora, devolvemos una lista predefinida
    // En una implementación completa, esto podría venir de un archivo de configuración
    return [
      'ui',
      'storage',
      'network'
    ];
  }

  // Cargar un módulo específico
  async loadModule(moduleName) {
    try {
      console.log(`ModuleLoader: Cargando módulo '${moduleName}'...`);
      
      // Construir la ruta del módulo
      const modulePath = `../${moduleName}/${moduleName}.js`;
      
      // Importar dinámicamente el módulo
      const module = await import(modulePath);
      
      // Si el módulo tiene una función de inicialización, llamarla
      if (module.default && typeof module.default.init === 'function') {
        await module.default.init();
      }
      
      // Almacenar el módulo cargado
      this.loadedModules.set(moduleName, module);
      
      console.log(`ModuleLoader: Módulo '${moduleName}' cargado correctamente`);
      return module;
    } catch (error) {
      console.error(`ModuleLoader: Error cargando módulo '${moduleName}':`, error);
      throw error;
    }
  }

  // Obtener un módulo cargado
  getModule(moduleName) {
    if (!this.loadedModules.has(moduleName)) {
      console.warn(`ModuleLoader: El módulo '${moduleName}' no está cargado`);
      return null;
    }
    
    return this.loadedModules.get(moduleName);
  }

  // Verificar si un módulo está cargado
  isModuleLoaded(moduleName) {
    return this.loadedModules.has(moduleName);
  }

  // Descargar un módulo
  async unloadModule(moduleName) {
    if (!this.loadedModules.has(moduleName)) {
      console.warn(`ModuleLoader: El módulo '${moduleName}' no está cargado`);
      return false;
    }
    
    try {
      const module = this.loadedModules.get(moduleName);
      
      // Si el módulo tiene una función de destrucción, llamarla
      if (module.default && typeof module.default.destroy === 'function') {
        await module.default.destroy();
      }
      
      // Eliminar el módulo del mapa
      this.loadedModules.delete(moduleName);
      
      console.log(`ModuleLoader: Módulo '${moduleName}' descargado correctamente`);
      return true;
    } catch (error) {
      console.error(`ModuleLoader: Error descargando módulo '${moduleName}':`, error);
      return false;
    }
  }

  // Obtener todos los módulos cargados
  getLoadedModules() {
    return Array.from(this.loadedModules.keys());
  }
}
