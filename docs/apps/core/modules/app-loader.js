//docs/apps/core/modules/app-loader.js
/*
 * Mizu OS - App Loader Module
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
 * Sistema de carga dinámica de aplicaciones para Mizu OS
 * Gestiona el descubrimiento, carga y descarga de aplicaciones de forma modular
 */
class AppLoader {
  constructor() {
    this.loadedApps = new Map(); // Mapa de aplicaciones cargadas { appName: { instance, manifest, isActive } }
    this.activeApp = null; // Aplicación actualmente activa
    this.loadingPromises = new Map(); // Promesas de carga en curso
    this.appCache = new Map(); // Caché de manifiestos de aplicaciones
    this.permissions = new Set(); // Permisos del sistema
  }

  /**
   * Inicializa el cargador de aplicaciones
   */
  init() {
    // Inicializar permisos básicos del sistema
    this.permissions.add('storage');
    this.permissions.add('network');
    this.permissions.add('ui');
    
    console.log('AppLoader inicializado');
  }

  /**
   * Carga una aplicación dinámicamente
   * @param {string} appName - Nombre de la aplicación
   * @returns {Promise<Object>} Instancia de la aplicación cargada
   */
  async loadApp(appName) {
    // Verificar si ya está cargada
    if (this.loadedApps.has(appName)) {
      return this.activateApp(appName);
    }

    // Verificar si ya hay una carga en curso
    if (this.loadingPromises.has(appName)) {
      return this.loadingPromises.get(appName);
    }

    // Crear promesa de carga
    const loadPromise = this._loadAppInternal(appName);
    this.loadingPromises.set(appName, loadPromise);

    try {
      const appInstance = await loadPromise;
      return appInstance;
    } finally {
      // Limpiar promesa de carga
      this.loadingPromises.delete(appName);
    }
  }

  /**
   * Implementación interna de carga de aplicación
   * @param {string} appName - Nombre de la aplicación
   * @returns {Promise<Object>} Instancia de la aplicación cargada
   * @private
   */
  async _loadAppInternal(appName) {
    try {
      console.log(`Cargando aplicación: ${appName}`);
      
      // Cargar el manifiesto de la aplicación
      const manifest = await this.fetchManifest(appName);
      
      // Verificar permisos
      if (!this.checkPermissions(manifest.permissions)) {
        throw new Error(`Permisos insuficientes para cargar ${appName}`);
      }
      
      // Cargar estilos
      await this.loadStyles(appName, manifest.styles);
      
      // Cargar módulos en orden
      await this.loadModules(appName, manifest.scripts);
      
      // Cargar el orquestador principal
      await this.loadAppCore(appName, manifest.entry);
      
      // Crear instancia de la aplicación
      const AppClass = window[appName + 'App'];
      if (!AppClass) {
        throw new Error(`Clase ${appName}App no encontrada`);
      }
      
      const container = document.getElementById('workspace');
      const appInstance = new AppClass(container, manifest);
      
      // Guardar referencia
      this.loadedApps.set(appName, {
        instance: appInstance,
        manifest,
        isActive: false
      });
      
      // Activar la aplicación
      this.activateApp(appName);
      
      // Notificar al sistema
      if (window.eventBus) {
        window.eventBus.emit('appLoaded', { appName, manifest });
      }
      
      console.log(`Aplicación ${appName} cargada correctamente`);
      return appInstance;
      
    } catch (error) {
      console.error(`Error al cargar la aplicación ${appName}:`, error);
      throw error;
    }
  }

  /**
   * Activa una aplicación ya cargada
   * @param {string} appName - Nombre de la aplicación
   * @returns {Object} Instancia de la aplicación
   */
  activateApp(appName) {
    // Desactivar la aplicación actual
    if (this.activeApp && this.activeApp !== appName) {
      const currentApp = this.loadedApps.get(this.activeApp);
      if (currentApp) {
        currentApp.instance.hide();
        currentApp.isActive = false;
      }
    }
    
    // Activar la nueva aplicación
    const appData = this.loadedApps.get(appName);
    if (appData) {
      appData.instance.show();
      appData.isActive = true;
      this.activeApp = appName;
      
      // Actualizar UI
      if (window.coreApp && window.coreApp.systemUI) {
        window.coreApp.systemUI.setAppButtonActive(appName, true);
      }
      
      // Notificar al sistema
      if (window.eventBus) {
        window.eventBus.emit('appActivated', { appName });
      }
      
      return appData.instance;
    }
    
    throw new Error(`Aplicación ${appName} no está cargada`);
  }

  /**
   * Descarga una aplicación
   * @param {string} appName - Nombre de la aplicación
   * @returns {boolean} True si se descargó correctamente
   */
  unloadApp(appName) {
    if (!this.loadedApps.has(appName)) return false;
    
    const appData = this.loadedApps.get(appName);
    
    // Limpiar suscripciones al EventBus
    if (window.eventBus) {
      window.eventBus.cleanupApp(appName);
    }
    
    // Destruir instancia
    if (appData.instance.destroy) {
      appData.instance.destroy();
    }
    
    // Remover estilos
    document.querySelectorAll(`style[data-app="${appName}"]`).forEach(style => {
      style.remove();
    });
    
    // Remover del mapa
    this.loadedApps.delete(appName);
    
    // Si era la aplicación activa, limpiar referencia
    if (this.activeApp === appName) {
      this.activeApp = null;
    }
    
    // Actualizar UI
    if (window.coreApp && window.coreApp.systemUI) {
      window.coreApp.systemUI.setAppButtonActive(appName, false);
    }
    
    // Notificar al sistema
    if (window.eventBus) {
      window.eventBus.emit('appUnloaded', { appName });
    }
    
    console.log(`Aplicación ${appName} descargada`);
    return true;
  }

  /**
   * Obtiene el manifiesto de una aplicación
   * @param {string} appName - Nombre de la aplicación
   * @returns {Promise<Object>} Manifiesto de la aplicación
   */
  async fetchManifest(appName) {
    // Verificar caché
    if (this.appCache.has(appName)) {
      return this.appCache.get(appName);
    }
    
    try {
      const response = await fetch(`apps/${appName}/manifest.json`);
      if (!response.ok) {
        throw new Error(`No se pudo cargar el manifiesto de ${appName}`);
      }
      
      const manifest = await response.json();
      
      // Validar manifiesto
      if (!manifest.name || !manifest.entry) {
        throw new Error(`Manifiesto inválido para ${appName}`);
      }
      
      // Guardar en caché
      this.appCache.set(appName, manifest);
      
      return manifest;
    } catch (error) {
      console.error(`Error al obtener manifiesto de ${appName}:`, error);
      throw error;
    }
  }

  /**
   * Verifica permisos de una aplicación
   * @param {Array<string>} requestedPermissions - Permisos solicitados
   * @returns {boolean} True si se conceden todos los permisos
   */
  checkPermissions(requestedPermissions = []) {
    if (!requestedPermissions || requestedPermissions.length === 0) {
      return true;
    }
    
    return requestedPermissions.every(permission => 
      this.permissions.has(permission)
    );
  }

  /**
   * Carga estilos de una aplicación
   * @param {string} appName - Nombre de la aplicación
   * @param {Array<string>} styles - Lista de archivos CSS
   * @returns {Promise<void>}
   */
  async loadStyles(appName, styles = []) {
    for (const styleFile of styles) {
      try {
        const response = await fetch(`apps/${appName}/${styleFile}`);
        if (!response.ok) {
          throw new Error(`No se pudo cargar ${styleFile}`);
        }
        
        const cssText = await response.text();
        
        const style = document.createElement('style');
        style.setAttribute('data-app', appName);
        style.textContent = cssText;
        document.head.appendChild(style);
        
        // Registrar en el sistema de CSS si existe
        if (window.CoreCSS) {
          window.CoreCSS.registerAppStyles(appName, cssText);
        }
      } catch (error) {
        console.error(`Error al cargar estilo ${styleFile} para ${appName}:`, error);
        throw error;
      }
    }
  }

  /**
   * Carga módulos de una aplicación en orden
   * @param {string} appName - Nombre de la aplicación
   * @param {Array<string>} scripts - Lista de archivos JS
   * @returns {Promise<void>}
   */
  async loadModules(appName, scripts = []) {
    for (const scriptFile of scripts) {
      await this.loadScript(`apps/${appName}/${scriptFile}`);
    }
  }

  /**
   * Carga el orquestador principal de una aplicación
   * @param {string} appName - Nombre de la aplicación
   * @param {string} entryFile - Archivo de entrada
   * @returns {Promise<void>}
   */
  async loadAppCore(appName, entryFile) {
    await this.loadScript(`apps/${appName}/${entryFile}`);
  }

  /**
   * Carga un script dinámicamente
   * @param {string} src - URL del script
   * @returns {Promise<void>}
   */
  loadScript(src) {
    return new Promise((resolve, reject) => {
      // Verificar si ya está cargado
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = src;
      script.type = 'module';
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Error al cargar ${src}`));
      document.head.appendChild(script);
    });
  }

  /**
   * Obtiene una aplicación cargada
   * @param {string} appName - Nombre de la aplicación
   * @returns {Object|null} Datos de la aplicación o null si no está cargada
   */
  getApp(appName) {
    return this.loadedApps.get(appName) || null;
  }

  /**
   * Obtiene la aplicación activa
   * @returns {Object|null} Datos de la aplicación activa o null
   */
  getActiveApp() {
    if (!this.activeApp) return null;
    return this.getApp(this.activeApp);
  }

  /**
   * Obtiene todas las aplicaciones cargadas
   * @returns {Map} Mapa de aplicaciones cargadas
   */
  getLoadedApps() {
    return new Map(this.loadedApps);
  }

  /**
   * Descarga todas las aplicaciones
   */
  unloadAllApps() {
    const appNames = Array.from(this.loadedApps.keys());
    appNames.forEach(appName => this.unloadApp(appName));
  }

  /**
   * Recarga una aplicación
   * @param {string} appName - Nombre de la aplicación
   * @returns {Promise<Object>} Instancia de la aplicación recargada
   */
  async reloadApp(appName) {
    const wasActive = this.activeApp === appName;
    
    // Descargar si está cargada
    if (this.loadedApps.has(appName)) {
      this.unloadApp(appName);
    }
    
    // Limpiar caché del manifiesto
    this.appCache.delete(appName);
    
    // Volver a cargar
    await this.loadApp(appName);
    
    // Si estaba activa, activarla de nuevo
    if (wasActive) {
      this.activateApp(appName);
    }
    
    return this.getApp(appName);
  }

  /**
   * Agrega un permiso al sistema
   * @param {string} permission - Permiso a agregar
   */
  addPermission(permission) {
    this.permissions.add(permission);
  }

  /**
   * Elimina un permiso del sistema
   * @param {string} permission - Permiso a eliminar
   */
  removePermission(permission) {
    this.permissions.delete(permission);
  }

  /**
   * Obtiene los permisos del sistema
   * @returns {Set} Conjunto de permisos
   */
  getPermissions() {
    return new Set(this.permissions);
  }
}

// Exportar la clase
export { AppLoader };

// Crear instancia global si no existe
if (typeof window !== 'undefined' && !window.appLoader) {
  window.appLoader = new AppLoader();
}
