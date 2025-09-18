/*
 * Mizu OS - App Loader Module (Refactorizado)
 * Copyright (C) 2025 Mizu Legends Studios.
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
 * Orquestador ligero de aplicaciones para Mizu OS
 * Coordina los módulos descentralizados y mantiene compatibilidad con el sistema existente
 * // apps/core/modules/app-loader.js
 */
import SystemBootstrap from './system-bootstrap.js';

export default class AppLoader {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.systemBootstrap = null;
    this.initialized = false;
    
    console.log('[DEBUG] AppLoader: Constructor llamado con EventBus:', !!eventBus);
  }
  
  /**
   * Inicializa el sistema y el orquestador
   */
  async init() {
    console.log('AppLoader: Inicializando orquestador de aplicaciones (v2.0 - descentralizado)');
    
    if (this.initialized) {
      console.log('AppLoader: El orquestador ya está inicializado');
      return true;
    }
    
    try {
      // Inicializar el sistema bootstrap
      this.systemBootstrap = new SystemBootstrap();
      await this.systemBootstrap.init();
      
      // Configurar manejadores de eventos para compatibilidad
      this.setupCompatibilityHandlers();
      
      this.initialized = true;
      console.log('✅ AppLoader: Orquestador inicializado correctamente');
      return true;
    } catch (error) {
      console.error('❌ AppLoader: Error al inicializar orquestador:', error);
      return false;
    }
  }
  
  /**
   * Configura manejadores para mantener compatibilidad con el código existente
   */
  setupCompatibilityHandlers() {
    console.log('AppLoader: Configurando manejadores de compatibilidad');
    
    // Mantener compatibilidad con eventos existentes
    this.eventBus.on('app:activate', (data) => {
      console.log('[DEBUG] AppLoader: Evento app:activate recibido (compatibilidad):', data);
      if (window.AppRegistry) {
        window.AppRegistry.activateApp(data.appId);
      }
    });
    
    this.eventBus.on('app:deactivate', (data) => {
      console.log('AppLoader: Evento app:deactivate recibido (compatibilidad):', data);
      if (window.AppRegistry) {
        window.AppRegistry.deactivateApp(data.appId);
      }
    });
    
    // Eventos de optimización del sistema
    this.eventBus.on('system:reduce-effects', (data) => {
      console.log('AppLoader: Evento system:reduce-effects recibido (compatibilidad):', data);
      if (window.AppOptimizer) {
        window.AppOptimizer.applyOptimization('reduce-effects', data);
      }
    });
    
    this.eventBus.on('system:disable-video-background', (data) => {
      console.log('AppLoader: Evento system:disable-video-background recibido (compatibilidad):', data);
      if (window.AppOptimizer) {
        window.AppOptimizer.applyOptimization('disable-video-background', data);
      }
    });
    
    this.eventBus.on('system:enable-low-power-mode', (data) => {
      console.log('AppLoader: Evento system:enable-low-power-mode recibido (compatibilidad):', data);
      if (window.AppOptimizer) {
        window.AppOptimizer.applyOptimization('enable-low-power-mode', data);
      }
    });
    
    this.eventBus.on('system:enable-tv-mode', (data) => {
      console.log('AppLoader: Evento system:enable-tv-mode recibido (compatibilidad):', data);
      if (window.AppOptimizer) {
        window.AppOptimizer.applyOptimization('enable-tv-mode', data);
      }
    });
  }
  
  /**
   * Carga una aplicación (método de compatibilidad)
   * @param {string} appId - ID de la aplicación
   */
  async loadApp(appId) {
    console.log(`[DEBUG] AppLoader: Cargando aplicación ${appId} (compatibilidad)`);
    
    if (window.AppRegistry) {
      return await window.AppRegistry.loadApp(appId);
    }
    
    console.error(`❌ AppLoader: AppRegistry no está disponible para cargar ${appId}`);
    return null;
  }
  
  /**
   * Activa una aplicación (método de compatibilidad)
   * @param {string} appId - ID de la aplicación
   */
  async activateApp(appId) {
    console.log(`[DEBUG] AppLoader: Activando aplicación ${appId} (compatibilidad)`);
    
    if (window.AppRegistry) {
      await window.AppRegistry.activateApp(appId);
    } else {
      console.error(`❌ AppLoader: AppRegistry no está disponible para activar ${appId}`);
    }
  }
  
  /**
   * Desactiva una aplicación (método de compatibilidad)
   * @param {string} appId - ID de la aplicación
   */
  deactivateApp(appId) {
    console.log(`AppLoader: Desactivando aplicación ${appId} (compatibilidad)`);
    
    if (window.AppRegistry) {
      window.AppRegistry.deactivateApp(appId);
    } else {
      console.error(`❌ AppLoader: AppRegistry no está disponible para desactivar ${appId}`);
    }
  }
  
  /**
   * Obtiene el contenedor de aplicaciones (método de compatibilidad)
   */
  ensureAppsContainer() {
    console.log('[DEBUG] AppLoader: Obteniendo contenedor de aplicaciones (compatibilidad)');
    
    if (window.AppContainerManager) {
      return window.AppContainerManager.getMainContainer();
    }
    
    // Fallback por si el gestor no está disponible
    let container = document.getElementById('black-bar');
    if (!container) {
      container = document.createElement('div');
      container.id = 'black-bar';
      container.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-size: contain;
        background-color: hsla(0, 0%, 0%, 0.2);
        padding: 1rem;
        display: flex;
        gap: 0.5rem;
        z-index: 641;
        transition: top 0.5s ease, left 0.5s ease, right 0.5s ease, bottom 0.5s ease;
        overflow: hidden;
        cursor: grab;
      `;
      document.body.appendChild(container);
    }
    return container;
  }
  
  /**
   * Obtiene el contenedor de aplicaciones persistentes (método de compatibilidad)
   */
  ensurePersistentAppsContainer() {
    console.log('[DEBUG] AppLoader: Obteniendo contenedor de aplicaciones persistentes (compatibilidad)');
    
    if (window.AppContainerManager) {
      return window.AppContainerManager.getPersistentContainer();
    }
    
    // Fallback por si el gestor no está disponible
    let container = document.getElementById('persistent-apps-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'persistent-apps-container';
      container.style.cssText = `
        position: absolute;
        top: -9999px;
        left: -9999px;
        width: 1px;
        height: 1px;
        overflow: hidden;
        z-index: 1;
        visibility: hidden;
      `;
      document.body.appendChild(container);
    }
    return container;
  }
  
  /**
   * Aplica optimización del sistema (método de compatibilidad)
   * @param {string} type - Tipo de optimización
   * @param {object} data - Datos de la optimización
   */
  applySystemOptimization(type, data) {
    console.log(`AppLoader: Aplicando optimización del sistema: ${type} (compatibilidad)`, data);
    
    if (window.AppOptimizer) {
      window.AppOptimizer.applyOptimization(type, data);
    } else {
      console.error(`❌ AppLoader: AppOptimizer no está disponible para aplicar ${type}`);
    }
  }
  
  /**
   * Verifica si una aplicación es persistente (método de compatibilidad)
   * @param {string} appId - ID de la aplicación
   */
  isPersistentApp(appId) {
    console.log(`[DEBUG] AppLoader: Verificando si ${appId} es persistente (compatibilidad)`);
    
    if (window.AppRegistry) {
      return window.AppRegistry.isPersistentApp(appId);
    }
    
    // Lista por defecto para compatibilidad
    const persistentApps = ['music', 'core'];
    return persistentApps.includes(appId);
  }
  
  /**
   * Obtiene el estado actual del sistema
   */
  getSystemStatus() {
    console.log('AppLoader: Obteniendo estado del sistema');
    
    if (this.systemBootstrap) {
      return this.systemBootstrap.getSystemStatus();
    }
    
    return {
      initialized: this.initialized,
      version: window.MIZU_VERSION || 'unknown',
      architecture: window.MIZU_ARCHITECTURE || 'unknown',
      error: 'SystemBootstrap not available'
    };
  }
  
  /**
   * Reinicia el sistema
   */
  async restart() {
    console.log('AppLoader: Reiniciando sistema');
    
    if (this.systemBootstrap) {
      await this.systemBootstrap.restart();
    } else {
      console.error('❌ AppLoader: SystemBootstrap no está disponible para reiniciar');
    }
  }
  
  /**
   * Registra manualmente una aplicación (para compatibilidad con apps sin bootstrap)
   * @param {string} appName - Nombre de la aplicación
   * @param {string} manifestUrl - URL del manifiesto
   * @param {string} appType - Tipo de aplicación
   */
  async registerAppManually(appName, manifestUrl, appType = 'web-app') {
    console.log(`AppLoader: Registrando manualmente aplicación ${appName}`);
    
    if (window.AppRegistry && window.LoaderFactory) {
      const loader = window.LoaderFactory.getLoader(appType, window.EventBus);
      return await window.AppRegistry.registerApp(appName, manifestUrl, loader.constructor);
    }
    
    console.error(`❌ AppLoader: No se puede registrar ${appName} - módulos no disponibles`);
    return false;
  }
  
  /**
   * Aplica un preset de optimización basado en el dispositivo
   */
  async applyDeviceOptimization() {
    console.log('AppLoader: Aplicando optimización basada en dispositivo');
    
    if (this.systemBootstrap) {
      await this.systemBootstrap.applyDeviceOptimization();
    } else {
      console.error('❌ AppLoader: SystemBootstrap no está disponible para optimización de dispositivo');
    }
  }
}
