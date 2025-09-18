/*
 * Mizu OS - Core Application
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
 * Aplicación principal de Mizu OS v3.0.1
 * Integra el sistema descentralizado y mantiene compatibilidad con la versión anterior
 * // apps/core/core.js
 */
import EventBus from './modules/eventbus.js';
import AppLoader from './modules/app-loader.js';
import CSSManager from './modules/css.js';
import Config from './modules/config.js';
import StatusWidget from './modules/status-widget.js';
import SystemUI from './modules/system-ui.js';

export default class CoreApp {
  constructor() {
    this.eventBus = null;
    this.appLoader = null;
    this.cssManager = null;
    this.config = null;
    this.statusWidget = null;
    this.systemUI = null;
    this.initialized = false;
    
    console.log('[DEBUG] CoreApp: Constructor llamado');
  }
  
  /**
   * Inicializa la aplicación principal del sistema
   */
  async init() {
    console.log('CoreApp: Inicializando Mizu OS v3.0.1 - Arquitectura Híbrida Descentralizada');
    
    if (this.initialized) {
      console.log('CoreApp: El sistema ya está inicializado');
      return;
    }
    
    try {
      // 1. Inicializar EventBus (sistema de comunicación central)
      console.log('CoreApp: Paso 1 - Inicializando EventBus');
      this.eventBus = new EventBus();
      await this.eventBus.init();
      
      // 2. Inicializar configuración del sistema
      console.log('CoreApp: Paso 2 - Inicializando Config');
      this.config = new Config(this.eventBus);
      await this.config.init();
      
      // 3. Inicializar gestor de CSS
      console.log('CoreApp: Paso 3 - Inicializando CSSManager');
      this.cssManager = new CSSManager(this.eventBus);
      await this.cssManager.init();
      
      // 4. Inicializar UI del sistema
      console.log('CoreApp: Paso 4 - Inicializando SystemUI');
      this.systemUI = new SystemUI(this.eventBus);
      await this.systemUI.init();
      
      // 5. Inicializar widgets de estado
      console.log('CoreApp: Paso 5 - Inicializando StatusWidget');
      this.statusWidget = new StatusWidget(this.eventBus);
      await this.statusWidget.init();
      
      // 6. Inicializar el orquestador de aplicaciones (nuevo sistema descentralizado)
      console.log('CoreApp: Paso 6 - Inicializando AppLoader (v2.0 descentralizado)');
      this.appLoader = new AppLoader(this.eventBus);
      await this.appLoader.init();
      
      // 7. Configurar manejadores de eventos del sistema
      console.log('CoreApp: Paso 7 - Configurando manejadores de eventos');
      this.setupSystemEventHandlers();
      
      // 8. Cargar bootstraps de aplicaciones
      console.log('CoreApp: Paso 8 - Cargando bootstraps de aplicaciones');
      await this.loadAppBootstraps();
      
      // 9. Aplicar optimizaciones basadas en el dispositivo
      console.log('CoreApp: Paso 9 - Aplicando optimizaciones de dispositivo');
      await this.appLoader.applyDeviceOptimization();
      
      // 10. Exponer módulos globalmente para compatibilidad
      console.log('CoreApp: Paso 10 - Exponiendo módulos globalmente');
      this.exposeModulesGlobally();
      
      this.initialized = true;
      console.log('✅ CoreApp: Mizu OS v3.0.1 inicializado correctamente');
      
      // Emitir evento de sistema listo
      this.eventBus.emit('core:ready', {
        version: '3.0.1',
        architecture: 'hybrid-decentralized',
        timestamp: Date.now(),
        modules: {
          eventBus: !!this.eventBus,
          appLoader: !!this.appLoader,
          cssManager: !!this.cssManager,
          config: !!this.config,
          statusWidget: !!this.statusWidget,
          systemUI: !!this.systemUI
        }
      });
      
    } catch (error) {
      console.error('❌ CoreApp: Error crítico al inicializar el sistema:', error);
      this.showSystemError('Error al inicializar el sistema', error);
      throw error;
    }
  }
  
  /**
   * Configura los manejadores de eventos del sistema
   */
  setupSystemEventHandlers() {
    console.log('CoreApp: Configurando manejadores de eventos del sistema');
    
    // Manejar errores del sistema
    this.eventBus.on('system:error', (data) => {
      console.error('CoreApp: Error del sistema:', data);
      this.showSystemError('Error del sistema', data.message);
    });
    
    // Manejar promesas rechazadas
    this.eventBus.on('system:promise-rejection', (data) => {
      console.error('CoreApp: Promesa rechazada:', data);
      this.showSystemError('Error de promesa', data.reason?.message || 'Promesa rechazada');
    });
    
    // Manejar reinicio forzado
    this.eventBus.on('system:force-reload', () => {
      console.log('CoreApp: Reinicio forzado solicitado');
      this.forceReload();
    });
    
    // Manejar aplicaciones listas
    this.eventBus.on('app:bootstrap-complete', (data) => {
      console.log(`CoreApp: Aplicación ${data.appId} lista (${data.timestamp})`);
    });
    
    // Manejar cambios de visibilidad de aplicaciones
    this.eventBus.on('app:visibilityChanged', (data) => {
      console.log(`CoreApp: Visibilidad de ${data.appId} cambiada a ${data.isVisible}`);
    });
    
    console.log('✅ CoreApp: Manejadores de eventos configurados');
  }
  
  /**
   * Carga los bootstraps de las aplicaciones
   */
  async loadAppBootstraps() {
    console.log('CoreApp: Cargando bootstraps de aplicaciones');
    
    // Lista de aplicaciones con bootstrap
    const appBootstraps = [
      './apps/music/bootstrap.js'
      // Aquí se añadirán más bootstraps cuando se creen
      // './apps/settings/bootstrap.js'
      // './apps/performance/bootstrap.js'
      // etc.
    ];
    
    const loadPromises = appBootstraps.map(async (bootstrapPath) => {
      try {
        // Crear un elemento script para cargar el bootstrap
        const script = document.createElement('script');
        script.type = 'module';
        script.src = bootstrapPath;
        
        // Promesa para esperar a que el script se cargue
        return new Promise((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error(`Error al cargar ${bootstrapPath}`));
          
          document.head.appendChild(script);
        });
      } catch (error) {
        console.error(`❌ CoreApp: Error al cargar bootstrap ${bootstrapPath}:`, error);
        // No lanzamos error para no bloquear otras aplicaciones
      }
    });
    
    // Esperar a que todos los bootstraps se carguen (con tolerancia a fallos)
    await Promise.allSettled(loadPromises);
    
    console.log('✅ CoreApp: Bootstraps de aplicaciones cargados');
  }
  
  /**
   * Expone los módulos principales globalmente para compatibilidad
   */
  exposeModulesGlobally() {
    console.log('CoreApp: Exponiendo módulos globalmente');
    
    // Exponer módulos principales
    window.CoreApp = this;
    window.EventBus = this.eventBus;
    window.AppLoader = this.appLoader;
    window.CSSManager = this.cssManager;
    window.Config = this.config;
    window.StatusWidget = this.statusWidget;
    window.SystemUI = this.systemUI;
    
    // Exponer información del sistema
    window.MIZU_VERSION = '3.0.1';
    window.MIZU_ARCHITECTURE = 'hybrid-decentralized';
    window.MIZU_CORE_READY = true;
    
    console.log('✅ CoreApp: Módulos expuestos globalmente');
  }
  
  /**
   * Muestra un error del sistema en la interfaz
   */
  showSystemError(title, error) {
    console.error(`CoreApp: Mostrando error - ${title}:`, error);
    
    // Crear elemento de error
    const errorElement = document.createElement('div');
    errorElement.id = 'system-error';
    errorElement.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(220, 38, 38, 0.95);
      color: white;
      padding: 20px;
      border-radius: 10px;
      max-width: 80%;
      z-index: 9999;
      font-family: monospace;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    `;
    
    errorElement.innerHTML = `
      <h3 style="margin: 0 0 10px 0; color: #fecaca;">${title}</h3>
      <p style="margin: 0; font-size: 14px; opacity: 0.9;">${error?.message || error || 'Error desconocido'}</p>
      <button onclick="this.parentElement.remove()" style="
        margin-top: 15px;
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
      ">Cerrar</button>
    `;
    
    document.body.appendChild(errorElement);
    
    // Auto-eliminar después de 10 segundos
    setTimeout(() => {
      if (errorElement.parentNode) {
        errorElement.remove();
      }
    }, 10000);
  }
  
  /**
   * Fuerza la recarga de la página
   */
  forceReload() {
    console.log('CoreApp: Forzando recarga de la página');
    
    if (confirm('¿Estás seguro de que quieres recargar el sistema? Se perderán los datos no guardados.')) {
      window.location.reload(true);
    }
  }
  
  /**
   * Obtiene el estado actual del sistema
   */
  getSystemStatus() {
    return {
      initialized: this.initialized,
      version: window.MIZU_VERSION,
      architecture: window.MIZU_ARCHITECTURE,
      timestamp: Date.now(),
      uptime: this.initialized ? Date.now() - (this.initializationTime || Date.now()) : 0,
      modules: {
        eventBus: !!this.eventBus,
        appLoader: !!this.appLoader,
        cssManager: !!this.cssManager,
        config: !!this.config,
        statusWidget: !!this.statusWidget,
        systemUI: !!this.systemUI
      },
      apps: window.AppRegistry ? window.AppRegistry.getRegisteredApps() : [],
      optimizations: window.AppOptimizer ? window.AppOptimizer.getActiveOptimizations() : []
    };
  }
  
  /**
   * Reinicia el sistema
   */
  async restart() {
    console.log('CoreApp: Reiniciando el sistema');
    
    try {
      if (this.appLoader) {
        await this.appLoader.restart();
      } else {
        // Fallback: recargar la página
        this.forceReload();
      }
    } catch (error) {
      console.error('❌ CoreApp: Error al reiniciar:', error);
      this.forceReload();
    }
  }
  
  /**
   * Método para depuración - muestra información del sistema en consola
   */
  debug() {
    console.group('🔍 Mizu OS Debug Information');
    console.log('Versión:', window.MIZU_VERSION);
    console.log('Arquitectura:', window.MIZU_ARCHITECTURE);
    console.log('Inicializado:', this.initialized);
    console.log('Módulos:', {
      eventBus: !!this.eventBus,
      appLoader: !!this.appLoader,
      cssManager: !!this.cssManager,
      config: !!this.config,
      statusWidget: !!this.statusWidget,
      systemUI: !!this.systemUI
    });
    
    if (window.AppRegistry) {
      console.log('Apps registradas:', window.AppRegistry.getRegisteredApps());
      console.log('Apps activas:', Array.from(window.AppRegistry.activeApps.keys()));
    }
    
    if (window.AppOptimizer) {
      console.log('Optimizaciones activas:', window.AppOptimizer.getActiveOptimizations());
    }
    
    console.groupEnd();
  }
}

// Auto-inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Mizu OS: DOM listo, iniciando sistema...');
  
  try {
    const coreApp = new CoreApp();
    await coreApp.init();
    
    // Exponer globalmente para depuración
    window.MizuOS = coreApp;
    
    console.log('✅ Mizu OS: Sistema listo y operativo');
    
    // Mostrar mensaje de bienvenida
    setTimeout(() => {
      if (window.EventBus) {
        window.EventBus.emit('system:welcome', {
          message: 'Bienvenido a Mizu OS v3.0.1',
          timestamp: Date.now()
        });
      }
    }, 1000);
    
  } catch (error) {
    console.error('❌ Mizu OS: Error fatal al iniciar:', error);
    
    // Mostrar error crítico en pantalla
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      font-family: monospace;
      text-align: center;
      padding: 20px;
    `;
    
    errorDiv.innerHTML = `
      <h1 style="color: #ef4444; margin-bottom: 20px;">❌ Error Crítico</h1>
      <p style="margin-bottom: 20px; max-width: 600px;">No se pudo iniciar Mizu OS. Por favor, recarga la página o contacta al soporte técnico.</p>
      <pre style="background: rgba(255, 255, 255, 0.1); padding: 10px; border-radius: 5px; overflow-x: auto; max-width: 80%;">${error.stack || error.message || error}</pre>
      <button onclick="window.location.reload()" style="
        margin-top: 20px;
        padding: 10px 20px;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
      ">Recargar Página</button>
    `;
    
    document.body.appendChild(errorDiv);
  }
});
