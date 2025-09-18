/*
 * Mizu OS - Core/BootSequence
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
import AppLoader from './appLoader.js';
import { DependencyManager } from './dependencyManager.js';
import { ErrorHandler } from './errorHandler.js';

export class BootSequence {
  constructor() {
    this.config = new ConfigManager();
    this.styleEngine = new StyleEngine();
    this.appLoader = new AppLoader();
    this.dependencyManager = new DependencyManager();
    this.errorHandler = new ErrorHandler();
    
    // Exponer los servicios globalmente para que otros módulos puedan acceder a ellos
    window.configManager = this.config;
    window.styleEngine = this.styleEngine;
    window.appLoader = this.appLoader;
    window.dependencyManager = this.dependencyManager;
    window.errorHandler = this.errorHandler;
    
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
      
      // Paso 3: Inicializar el cargador de aplicaciones
      console.log('BootSequence: Paso 3 - Inicializando el cargador de aplicaciones');
      await this.appLoader.init();
      
      // Paso 4: Cargar apps dinámicamente desde la configuración
      console.log('BootSequence: Paso 4 - Cargando apps dinámicamente');
      await this.appLoader.loadApps();
      this.dependencyManager.markAsLoaded('appLoader');
      
      console.log(`BootSequence: Mizu OS v${this.config.get('version')} inicializado correctamente`);
    } catch (error) {
      console.error('BootSequence: Error durante la secuencia de arranque:', error);
      this.errorHandler.handleBootError(error, 'BootSequence');
      throw error;
    }
  }
}
