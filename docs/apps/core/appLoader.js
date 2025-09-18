/*
 * Mizu OS - App Loader
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
 * Cargador dinámico de aplicaciones para Mizu OS
 * //docs/apps/core/appLoader.js
 */
class AppLoader {
  constructor() {
    console.log('AppLoader: Inicializado');
    
    // Verificar que el MessageBus esté disponible
    if (!window.MessageBus) {
      console.error('AppLoader: MessageBus no está disponible. Las aplicaciones no podrán comunicarse.');
      // Crear un MessageBus básico si no existe
      window.MessageBus = {
        subscribe: (event, callback) => console.warn(`MessageBus no inicializado. Evento '${event}' ignorado.`),
        publish: (event, data) => console.warn(`MessageBus no inicializado. Evento '${event}' no publicado.`)
      };
    }
    
    this.apps = {};
    this.loadedApps = new Set();
    this.appConfigs = null;
  }

  /**
   * Inicializa el cargador de aplicaciones
   */
  async init() {
    console.log('AppLoader: Inicializando cargador de aplicaciones...');
    
    try {
      // Cargar configuración de aplicaciones
      await this.loadAppConfigs();
      
      console.log('AppLoader: Cargador de aplicaciones inicializado correctamente');
      return true;
    } catch (error) {
      console.error('AppLoader: Error durante la inicialización:', error);
      throw error;
    }
  }

  /**
   * Carga la configuración de aplicaciones desde el sistema
   */
  async loadAppConfigs() {
    console.log('AppLoader: Cargando configuración de apps...');
    
    try {
      // Obtener la configuración de aplicaciones desde el ConfigManager
      const config = window.configManager.getConfig('modules');
      
      if (!config) {
        throw new Error('No se encontró la configuración de aplicaciones');
      }
      
      this.appConfigs = config;
      console.log('AppLoader: Configuración de apps cargada');
      
      // Determinar el orden de carga basado en prioridades y dependencias
      this.determineLoadOrder();
      
      return true;
    } catch (error) {
      console.error('AppLoader: Error cargando configuración de apps:', error);
      throw error;
    }
  }

  /**
   * Determina el orden de carga de las aplicaciones basado en dependencias y prioridades
   */
  determineLoadOrder() {
    console.log('AppLoader: Determinando orden de carga de apps...');
    
    // Convertir el objeto de configuración a un array
    const appsArray = Object.entries(this.appConfigs).map(([key, config]) => ({
      id: key,
      ...config
    }));
    
    // Filtrar solo las aplicaciones habilitadas
    const enabledApps = appsArray.filter(app => app.enabled);
    
    // Ordenar por prioridad
    enabledApps.sort((a, b) => a.priority - b.priority);
    
    // Resolver dependencias
    const loadOrder = [];
    const processedApps = new Set();
    
    const processApp = (app) => {
      if (processedApps.has(app.id)) return;
      
      // Procesar dependencias primero
      if (app.dependencies && app.dependencies.length > 0) {
        app.dependencies.forEach(depId => {
          const depApp = enabledApps.find(a => a.id === depId);
          if (depApp) {
            processApp(depApp);
          } else {
            console.warn(`AppLoader: Dependencia '${depId}' no encontrada para la app '${app.id}'`);
          }
        });
      }
      
      // Añadir la aplicación actual al orden de carga
      if (!processedApps.has(app.id)) {
        loadOrder.push(app);
        processedApps.add(app.id);
      }
    };
    
    // Procesar todas las aplicaciones
    enabledApps.forEach(app => processApp(app));
    
    this.loadOrder = loadOrder;
    
    console.log('AppLoader: Orden de carga de apps:');
    this.loadOrder.forEach(app => {
      console.log(`- ${app.name} (${app.id}) con dependencias:`, app.dependencies || []);
    });
  }

  /**
   * Carga todas las aplicaciones en el orden determinado
   */
  async loadApps() {
    console.log('AppLoader: Iniciando carga de apps desde configuración...');
    
    if (!this.loadOrder || this.loadOrder.length === 0) {
      console.warn('AppLoader: No hay aplicaciones para cargar');
      return;
    }
    
    try {
      // Cargar cada aplicación en orden
      for (const appConfig of this.loadOrder) {
        await this.loadApp(appConfig);
      }
      
      console.log('AppLoader: Todas las aplicaciones cargadas correctamente');
      return true;
    } catch (error) {
      console.error('AppLoader: Error durante la carga de apps:', error);
      throw error;
    }
  }

  /**
   * Carga una aplicación específica
   * @param {Object} appConfig - Configuración de la aplicación
   */
  async loadApp(appConfig) {
    console.log(`AppLoader: Cargando app '${appConfig.id}' (${appConfig.name}) con dependencias:`, appConfig.dependencies || []);
    
    try {
      // Verificar si la aplicación ya está cargada
      if (this.loadedApps.has(appConfig.id)) {
        console.log(`AppLoader: App '${appConfig.id}' ya está cargada`);
        return;
      }
      
      // Verificar dependencias
      if (appConfig.dependencies && appConfig.dependencies.length > 0) {
        for (const depId of appConfig.dependencies) {
          if (!this.loadedApps.has(depId)) {
            console.warn(`AppLoader: Dependencia '${depId}' no está cargada para la app '${appConfig.id}'`);
            // Intentar cargar la dependencia
            const depConfig = this.loadOrder.find(app => app.id === depId);
            if (depConfig) {
              await this.loadApp(depConfig);
            } else {
              throw new Error(`No se pudo encontrar la dependencia '${depId}' para la app '${appConfig.id}'`);
            }
          } else {
            console.log(`AppLoader: App '${depId}' ya está cargada`);
          }
        }
      }
      
      console.log(`AppLoader: Cargando app '${appConfig.id}'...`);
      
      // Construir la URL del script de la aplicación
      const scriptUrl = `apps/${appConfig.id}/${appConfig.id}.js`;
      
      // Cargar el script de la aplicación
      const appModule = await this.loadScript(scriptUrl);
      
      // Inicializar la aplicación si tiene un método init
      let appInstance = null;
      if (appModule && typeof appModule.init === 'function') {
        await appModule.init();
        appInstance = appModule;
      } else if (appModule && appModule.default) {
        // Si es un módulo ES6 con exportación por defecto
        if (typeof appModule.default.init === 'function') {
          await appModule.default.init();
          appInstance = appModule.default;
        } else {
          // Si no tiene método init, asumimos que la clase ya se inicializa en el constructor
          appInstance = new appModule.default();
        }
      } else if (appModule && typeof appModule === 'function') {
        // Si es una función constructora
        appInstance = new appModule();
        if (typeof appInstance.init === 'function') {
          await appInstance.init();
        }
      } else {
        // Si no es un módulo válido, intentar cargarlo como script global
        appInstance = window[appConfig.id];
        if (appInstance && typeof appInstance.init === 'function') {
          await appInstance.init();
        }
      }
      
      // Almacenar la instancia de la aplicación
      if (appInstance) {
        this.apps[appConfig.id] = appInstance;
      }
      
      // Marcar la aplicación como cargada
      this.loadedApps.add(appConfig.id);
      
      console.log(`AppLoader: App '${appConfig.id}' cargada correctamente`);
      
      // Notificar que la aplicación ha sido cargada
      if (window.MessageBus) {
        window.MessageBus.publish('app:loaded', {
          appId: appConfig.id,
          appName: appConfig.name
        });
      }
      
      return appInstance;
    } catch (error) {
      console.error(`AppLoader: Error cargando app '${appConfig.id}':`, error);
      throw error;
    }
  }

  /**
   * Carga un script dinámicamente
   * @param {string} url - URL del script a cargar
   * @returns {Promise} - Promesa que se resuelve cuando el script se carga
   */
  loadScript(url) {
    return new Promise((resolve, reject) => {
      // Verificar si el script ya está cargado
      const existingScript = document.querySelector(`script[src="${url}"]`);
      if (existingScript) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = url;
      script.type = 'module';
      
      script.onload = () => {
        console.log(`AppLoader: Script cargado: ${url}`);
        resolve();
      };
      
      script.onerror = () => {
        console.error(`AppLoader: Error cargando script: ${url}`);
        reject(new Error(`No se pudo cargar el script: ${url}`));
      };
      
      document.head.appendChild(script);
    });
  }

  /**
   * Obtiene una instancia de aplicación cargada
   * @param {string} appId - ID de la aplicación
   * @returns {Object} - Instancia de la aplicación
   */
  getApp(appId) {
    return this.apps[appId];
  }

  /**
   * Verifica si una aplicación está cargada
   * @param {string} appId - ID de la aplicación
   * @returns {boolean} - True si la aplicación está cargada
   */
  isAppLoaded(appId) {
    return this.loadedApps.has(appId);
  }

  /**
   * Obtiene la lista de aplicaciones cargadas
   * @returns {string[]} - Lista de IDs de aplicaciones cargadas
   */
  getLoadedApps() {
    return Array.from(this.loadedApps);
  }
}

// Exportar la clase
export default AppLoader;
