/*
 * Mizu OS - System Bootstrap Module
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
 * Sistema de arranque descentralizado para Mizu OS
 * Inicializa los módulos del sistema y descubre aplicaciones automáticamente
 * // apps/core/modules/system-bootstrap.js
 */
import EventBus from './eventbus.js';
import AppRegistry from './app-registry.js';
import AppContainerManager from './app-container-manager.js';
import AppOptimizer from './app-optimizer.js';
import { LoaderFactory } from './app-specialized-loaders.js';

export default class SystemBootstrap {
  constructor(eventBus = null) {
    this.eventBus = eventBus;
    this.appRegistry = null;
    this.containerManager = null;
    this.appOptimizer = null;
    this.initialized = false;
    
    console.log('[DEBUG] SystemBootstrap: Constructor llamado con EventBus:', !!eventBus);
  }
  
  /**
   * Inicializa el sistema completo
   */
  async init() {
    console.log('SystemBootstrap: Inicializando sistema Mizu OS v3.0.1');
    
    if (this.initialized) {
      console.log('SystemBootstrap: El sistema ya está inicializado');
      return;
    }
    
    try {
      // 1. Inicializar EventBus (sistema de comunicación)
      await this.initializeEventBus();
      
      // 2. Inicializar gestores del sistema
      await this.initializeSystemManagers();
      
      // 3. Descubrir y registrar aplicaciones
      await this.discoverAndRegisterApps();
      
      // 4. Configurar manejadores de eventos globales
      this.setupGlobalEventHandlers();
      
      // 5. Exponer módulos globalmente para compatibilidad
      this.exposeModulesGlobally();
      
      this.initialized = true;
      console.log('✅ SystemBootstrap: Sistema Mizu OS inicializado correctamente');
      
      // Emitir evento de sistema listo
      this.eventBus.emit('system:ready', {
        version: '3.0.1',
        architecture: 'hybrid-decentralized',
        timestamp: Date.now()
      });
      
    } catch (error) {
      console.error('❌ SystemBootstrap: Error al inicializar el sistema:', error);
      throw error;
    }
  }
  
  /**
   * Inicializa el EventBus del sistema
   */
  async initializeEventBus() {
    console.log('SystemBootstrap: Inicializando EventBus');
    
    // Si no hay un EventBus asignado, crear uno nuevo
    if (!this.eventBus) {
      this.eventBus = new EventBus();
    }
    
    await this.eventBus.init();
    
    console.log('✅ SystemBootstrap: EventBus inicializado');
  }
  
  /**
   * Inicializa los gestores del sistema
   */
  async initializeSystemManagers() {
    console.log('SystemBootstrap: Inicializando gestores del sistema');
    
    // Inicializar AppRegistry
    this.appRegistry = new AppRegistry(this.eventBus);
    await this.appRegistry.init();
    
    // Inicializar AppContainerManager con EventBus
    this.containerManager = new AppContainerManager(this.eventBus);
    await this.containerManager.init();
    
    // Inicializar AppOptimizer
    this.appOptimizer = new AppOptimizer(this.eventBus);
    await this.appOptimizer.init();
    
    console.log('✅ SystemBootstrap: Gestores del sistema inicializados');
  }
  
  /**
   * Descubre y registra automáticamente las aplicaciones
   */
  async discoverAndRegisterApps() {
    console.log('SystemBootstrap: Descubriendo aplicaciones');
    
    // Lista de aplicaciones conocidas (podría ser dinámica en el futuro)
    const knownApps = [
      { name: 'music', type: 'persistent', manifest: './apps/music/manifest.json' },
      { name: 'settings', type: 'web-app', manifest: './apps/settings/manifest.json' },
      { name: 'performance', type: 'web-app', manifest: './apps/performance/manifest.json' },
      { name: 'diagram', type: 'web-app', manifest: './apps/diagram/manifest.json' },
      { name: 'editor', type: 'web-app', manifest: './apps/editor/manifest.json' },
      { name: 'spreadsheet', type: 'web-app', manifest: './apps/spreadsheet/manifest.json' }
    ];
    
    const registrationPromises = knownApps.map(async (appInfo) => {
      try {
        // Obtener el loader adecuado para el tipo de aplicación
        const loader = LoaderFactory.getLoader(appInfo.type, this.eventBus);
        
        // Registrar la aplicación
        const success = await this.appRegistry.registerApp(
          appInfo.name,
          appInfo.manifest,
          loader.constructor
        );
        
        if (success) {
          console.log(`✅ SystemBootstrap: Aplicación ${appInfo.name} registrada`);
        } else {
          console.warn(`⚠️ SystemBootstrap: No se pudo registrar ${appInfo.name}`);
        }
      } catch (error) {
        console.error(`❌ SystemBootstrap: Error al registrar ${appInfo.name}:`, error);
      }
    });
    
    // Esperar a que todas las aplicaciones intenten registrarse
    await Promise.allSettled(registrationPromises);
    
    console.log(`✅ SystemBootstrap: Descubrimiento completado. Apps registradas: ${this.appRegistry.getRegisteredApps().join(', ')}`);
  }
  
  /**
   * Configura manejadores de eventos globales del sistema
   */
  setupGlobalEventHandlers() {
    console.log('SystemBootstrap: Configurando manejadores de eventos globales');
    
    // Manejar errores no capturados
    window.addEventListener('error', (event) => {
      console.error('SystemBootstrap: Error global no capturado:', event.error);
      this.eventBus.emit('system:error', {
        message: event.error.message,
        stack: event.error.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });
    
    // Manejar promesas rechazadas no capturadas
    window.addEventListener('unhandledrejection', (event) => {
      console.error('SystemBootstrap: Promesa rechazada no capturada:', event.reason);
      this.eventBus.emit('system:promise-rejection', {
        reason: event.reason
      });
    });
    
    // Manejar cambios de visibilidad de la página
    document.addEventListener('visibilitychange', () => {
      this.eventBus.emit('system:visibility-change', {
        hidden: document.hidden,
        state: document.visibilityState
      });
    });
    
    // Manejar cambios de orientación
    window.addEventListener('orientationchange', () => {
      this.eventBus.emit('system:orientation-change', {
        orientation: window.orientation
      });
    });
    
    // Manejar cambios de tamaño de ventana
    window.addEventListener('resize', () => {
      this.eventBus.emit('system:resize', {
        width: window.innerWidth,
        height: window.innerHeight
      });
    });
    
    // Manejar eventos de teclado para accesibilidad
    document.addEventListener('keydown', (event) => {
      // Combinaciones especiales para desarrollo
      if (event.ctrlKey && event.shiftKey && event.key === 'R') {
        event.preventDefault();
        this.eventBus.emit('system:force-reload', {});
      }
      
      // Combinación para abrir configuración
      if (event.ctrlKey && event.key === '.') {
        event.preventDefault();
        this.eventBus.emit('app:activate', { appId: 'settings' });
      }
    });
    
    console.log('✅ SystemBootstrap: Manejadores de eventos globales configurados');
  }
  
  /**
   * Expone los módulos principales globalmente para compatibilidad
   */
  exposeModulesGlobally() {
    console.log('SystemBootstrap: Exponiendo módulos globalmente');
    
    // Exponer para compatibilidad con código existente
    window.EventBus = this.eventBus;
    window.AppRegistry = this.appRegistry;
    window.AppContainerManager = this.containerManager;
    window.AppOptimizer = this.appOptimizer;
    window.LoaderFactory = LoaderFactory;
    
    // Exponer información del sistema
    window.MIZU_VERSION = '3.0.1';
    window.MIZU_ARCHITECTURE = 'hybrid-decentralized';
    window.MIZU_BOOTSTRAP_COMPLETE = true;
    
    console.log('✅ SystemBootstrap: Módulos expuestos globalmente');
  }
  
  /**
   * Obtiene el estado actual del sistema
   */
  getSystemStatus() {
    return {
      initialized: this.initialized,
      version: window.MIZU_VERSION,
      architecture: window.MIZU_ARCHITECTURE,
      registeredApps: this.appRegistry ? this.appRegistry.getRegisteredApps() : [],
      activeOptimizations: this.appOptimizer ? this.appOptimizer.getActiveOptimizations() : [],
      uptime: this.initialized ? Date.now() - (this.initializationTime || Date.now()) : 0
    };
  }
  
  /**
   * Reinicia el sistema (con cuidado)
   */
  async restart() {
    console.log('SystemBootstrap: Reiniciando sistema');
    
    try {
      // Emitir evento de reinicio
      this.eventBus.emit('system:restart-initiated', {});
      
      // Limpiar módulos
      if (this.appRegistry) {
        // Desactivar todas las aplicaciones activas
        const activeApps = this.appRegistry.activeApps;
        for (const [appId] of activeApps) {
          await this.appRegistry.deactivateApp(appId);
        }
      }
      
      // Reinicializar
      this.initialized = false;
      await this.init();
      
      console.log('✅ SystemBootstrap: Sistema reiniciado correctamente');
    } catch (error) {
      console.error('❌ SystemBootstrap: Error al reiniciar el sistema:', error);
      throw error;
    }
  }
  
  /**
   * Aplica un preset de optimización basado en las capacidades del dispositivo
   */
  async applyDeviceOptimization() {
    console.log('SystemBootstrap: Aplicando optimización basada en dispositivo');
    
    try {
      // Detectar capacidades del dispositivo
      const deviceInfo = this.detectDeviceCapabilities();
      
      // Seleccionar preset basado en capacidades
      let presetName = 'default';
      
      if (deviceInfo.isLowEnd) {
        presetName = 'low-end-device';
      } else if (deviceInfo.isTV) {
        presetName = 'smart-tv';
      } else if (deviceInfo.batteryLevel < 20) {
        presetName = 'battery-saver';
      }
      
      // Aplicar preset si no es el default
      if (presetName !== 'default' && this.appOptimizer) {
        await this.appOptimizer.applyPreset(presetName);
        console.log(`✅ SystemBootstrap: Preset ${presetName} aplicado`);
      }
      
    } catch (error) {
      console.error('❌ SystemBootstrap: Error al aplicar optimización de dispositivo:', error);
    }
  }
  
  /**
   * Detecta las capacidades del dispositivo
   */
  detectDeviceCapabilities() {
    const deviceInfo = {
      isLowEnd: false,
      isTV: false,
      batteryLevel: 100,
      memoryInfo: null,
      cores: navigator.hardwareConcurrency || 4
    };
    
    // Detectar si es un dispositivo de gama baja
    if (deviceInfo.cores <= 2) {
      deviceInfo.isLowEnd = true;
    }
    
    // Detectar si es una Smart TV
    if (navigator.userAgent.includes('TV') || navigator.userAgent.includes('SmartTV')) {
      deviceInfo.isTV = true;
    }
    
    // Obtener información de batería si está disponible
    if (navigator.getBattery) {
      navigator.getBattery().then(battery => {
        deviceInfo.batteryLevel = battery.level * 100;
      });
    }
    
    // Obtener información de memoria si está disponible
    if (performance.memory) {
      deviceInfo.memoryInfo = {
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        usedJSHeapSize: performance.memory.usedJSHeapSize
      };
    }
    
    return deviceInfo;
  }
}
