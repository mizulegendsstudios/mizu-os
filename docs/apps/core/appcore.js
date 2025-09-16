// apps/core/appcore.js
/*
 * Mizu OS - Core System
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
 * Sistema principal de Mizu OS
 * Punto de entrada para inicializar todos los componentes del sistema
 */

// Importar módulos
import EventBus from './modules/eventbus.js';
import AppLoader from './modules/app-loader.js';
import SystemUI from './modules/system-ui.js';
import StatusWidget from './modules/status-widget.js';
import CSSManager from './modules/css.js';
import Config from './modules/config.js';

// Clase principal del sistema
export default class Core {
  constructor() {
    console.log('[DEBUG] Core: Constructor llamado');
    this.modules = {};
    this.initialized = false;
  }

  async init() {
    console.log('[DEBUG] Core: Iniciando sistema');
    
    if (this.initialized) {
      console.log('Core: El sistema ya está inicializado');
      return;
    }
    
    try {
      // Inicializar configuración
      console.log('[DEBUG] Core: Inicializando configuración');
      this.modules.config = new Config();
      await this.modules.config.init();
      
      // Inicializar gestor de estilos
      console.log('[DEBUG] Core: Inicializando CSS Manager');
      this.modules.css = new CSSManager();
      this.modules.css.init();
      this.modules.css.injectStyles();
      
      // Inicializar EventBus
      console.log('[DEBUG] Core: Inicializando EventBus');
      this.modules.eventBus = new EventBus();
      this.modules.eventBus.init();
      
      // Exponer EventBus globalmente
      console.log('[DEBUG] Core: Exponiendo EventBus globalmente');
      window.MizuOS = {
        eventBus: this.modules.eventBus,
        version: '3.0.0',
        architecture: 'hybrid-decentralized'
      };
      console.log('[DEBUG] Core: window.MizuOS creado:', window.MizuOS);
      console.log('[DEBUG] Core: window.MizuOS.eventBus:', window.MizuOS.eventBus);
      
      // Inicializar widgets de estado
      console.log('[DEBUG] Core: Inicializando StatusWidget');
      this.modules.statusWidget = new StatusWidget();
      
      // Inicializar cargador de aplicaciones
      console.log('[DEBUG] Core: Inicializando AppLoader');
      this.modules.appLoader = new AppLoader(this.modules.eventBus);
      this.modules.appLoader.init();
      
      // Inicializar interfaz de usuario
      console.log('[DEBUG] Core: Inicializando SystemUI');
      this.modules.systemUI = new SystemUI(this.modules.eventBus, this.modules.statusWidget);
      this.modules.systemUI.init();
      
      this.initialized = true;
      console.log('[DEBUG] Core: Sistema inicializado correctamente');
    } catch (error) {
      console.error('[ERROR] Core: Error al inicializar el sistema:', error);
    }
  }
}

// Función para iniciar el sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[DEBUG] DOM cargado, iniciando Mizu OS');
  
  const core = new Core();
  await core.init();
  
  console.log('[DEBUG] Mizu OS iniciado correctamente');
});
