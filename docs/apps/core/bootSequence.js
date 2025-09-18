/*
 * Mizu OS - Core/BootSequence v1.1.0
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
 * Secuencia de arranque de Mizu OS
 * Responsable de establecer el orden exacto en que deben cargarse los componentes
 * y asegurar que el sistema esté completamente funcional antes de su uso
 * // docs/apps/core/bootSequence.js
 * Rol: Secuenciamiento del arranque del sistema
 * Filosofía: Asegurar que el sistema esté completamente funcional antes de su uso
 *Principios:
 *Cloud-Native: Ejecución 100% en navegador (GitHub Pages + jsDelivr) — sin build, sin bundlers, sin node_modules, sin servidores locales.
 *Extensible por diseño: cada app es un módulo independiente con su propio bootstrap.
 *Licencia libre: GNU AGPL-3.0 — cualquier modificación públicada en la red debe compartirse la fuente.
 *Stack Tecnológico/Zero Dependencies: ES6+ JavaScript vainilla (módulos nativos), CSS3 con Custom Properties, HTML5 APIs (Canvas, WebAudio, etc.). Sin frameworks, sin Tailwind.
*/

import { ConfigManager } from './configManager.js';
import { StyleEngine } from './styleEngine.js';
import { AppLoader } from './appLoader.js';
import { DependencyManager } from './dependencyManager.js';
import { ErrorHandler } from './errorHandler.js';

export class BootSequence {
  constructor() {
    this.config = new ConfigManager();
    this.styleEngine = new StyleEngine();
    this.appLoader = new AppLoader();
    this.dependencyManager = new DependencyManager();
    this.errorHandler = new ErrorHandler();
    
    // Registrar las dependencias principales
    this.dependencyManager.register('config', this.config);
    this.dependencyManager.register('styleEngine', this.styleEngine);
    this.dependencyManager.register('appLoader', this.appLoader);
    
    // Configurar el manejador de errores para el arranque
    this.errorHandler.registerErrorCallback('BootError', (error) => {
      this.errorHandler.handleBootError(error, 'BootSequence');
    });
  }

  // Ejecutar la secuencia de arranque
  async execute() {
    console.log('BootSequence: Iniciando secuencia de arranque');
    
    try {
      // Paso 1: Cargar configuración
      console.log('BootSequence: Paso 1 - Cargando configuración');
      await this.config.load();
      this.dependencyManager.markAsLoaded('config');
      
      // Paso 2: Generar estilos base
      console.log('BootSequence: Paso 2 - Generando estilos base');
      this.styleEngine.generateBaseStyles();
      this.dependencyManager.markAsLoaded('styleEngine');
      
      // Paso 3: Cargar componentes del sistema dinámicamente
      console.log('BootSequence: Paso 3 - Cargando componentes del sistema');
      await this.loadSystemComponents();
      
      // Paso 4: Cargar apps dinámicamente desde la configuración
      console.log('BootSequence: Paso 4 - Cargando apps dinámicamente');
      await this.appLoader.loadAppsFromConfig();
      this.dependencyManager.markAsLoaded('appLoader');
      
      console.log(`BootSequence: Mizu OS v${this.config.get('version')} inicializado correctamente`);
    } catch (error) {
      console.error('BootSequence: Error durante la secuencia de arranque:', error);
      this.errorHandler.handleBootError(error, 'BootSequence');
      throw error;
    }
  }
  
  // Cargar componentes del sistema dinámicamente desde la configuración
  async loadSystemComponents() {
    console.log('BootSequence: Cargando componentes del sistema...');
    
    try {
      // Obtener la lista de componentes del sistema desde la configuración
      const systemComponents = this.config.get('systemComponents') || [];
      
      console.log('BootSequence: Componentes del sistema a cargar:', systemComponents);
      
      // Cargar cada componente dinámicamente
      for (const componentName of systemComponents) {
        try {
          console.log(`BootSequence: Cargando componente del sistema '${componentName}'...`);
          
          // Importar dinámicamente el componente
          const componentModule = await import(`./${componentName}.js`);
          
          // Crear una instancia del componente
          const component = new componentModule.default();
          
          // Si el componente tiene una función de inicialización, llamarla
          if (typeof component.init === 'function') {
            await component.init();
          }
          
          // Registrar el componente en el DependencyManager
          this.dependencyManager.register(componentName, component);
          
          console.log(`BootSequence: Componente del sistema '${componentName}' cargado correctamente`);
        } catch (error) {
          console.error(`BootSequence: Error cargando componente del sistema '${componentName}':`, error);
        }
      }
      
      console.log('BootSequence: Componentes del sistema cargados');
    } catch (error) {
      console.error('BootSequence: Error durante la carga de componentes del sistema:', error);
      throw error;
    }
  }
}
