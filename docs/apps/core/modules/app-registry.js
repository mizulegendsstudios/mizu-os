/*
 * Mizu OS - App Registry Module
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
 * Sistema de registro descentralizado de aplicaciones para Mizu OS
 * Permite que las aplicaciones se auto-registren y se carguen bajo demanda
 * // apps/core/modules/app-registry.js
 */
export default class AppRegistry {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.registeredApps = new Map(); // Mapa de aplicaciones registradas
    this.manifestCache = new Map(); // Caché de manifiestos
    this.loadedApps = new Map(); // Aplicaciones cargadas
    this.activeApps = new Map(); // Aplicaciones activas
    this.persistentApps = ['music', 'core']; // Aplicaciones que deben persistir
    this.persistentAppState = new Map(); // Almacena el estado de las aplicaciones persistentes
    
    console.log('[DEBUG] AppRegistry: Constructor llamado con EventBus:', !!eventBus);
  }
  
  /**
   * Inicializa el registro de aplicaciones
   */
  init() {
    console.log('AppRegistry: Inicializando registro de aplicaciones');
    
    // Suscribirse a eventos del sistema
    this.eventBus.on('app:activate', (data) => {
      console.log('[DEBUG] AppRegistry: Evento app:activate recibido:', data);
      this.activateApp(data.appId);
    });
    
    this.eventBus.on('app:deactivate', (data) => {
      console.log('AppRegistry: Evento app:deactivate recibido:', data);
      this.deactivateApp(data.appId);
    });
    
    // Eventos de optimización del sistema
    this.eventBus.on('system:reduce-effects', (data) => {
      console.log('AppRegistry: Evento system:reduce-effects recibido:', data);
      this.applySystemOptimization('reduce-effects', data);
    });
    
    this.eventBus.on('system:disable-video-background', (data) => {
      console.log('AppRegistry: Evento system:disable-video-background recibido:', data);
      this.applySystemOptimization('disable-video-background', data);
    });
    
    this.eventBus.on('system:enable-low-power-mode', (data) => {
      console.log('AppRegistry: Evento system:enable-low-power-mode recibido:', data);
      this.applySystemOptimization('enable-low-power-mode', data);
    });
    
    this.eventBus.on('system:enable-tv-mode', (data) => {
      console.log('AppRegistry: Evento system:enable-tv-mode recibido:', data);
      this.applySystemOptimization('enable-tv-mode', data);
    });
    
    console.log('AppRegistry: Registro de aplicaciones inicializado correctamente');
    return true;
  }
  
  /**
   * Permite que una aplicación se registre a sí misma
   * @param {string} appName - Nombre de la aplicación
   * @param {string} manifestUrl - URL del manifiesto
   * @param {class} loaderClass - Clase del loader especializado
   */
  async registerApp(appName, manifestUrl, loaderClass) {
    try {
      console.log(`[DEBUG] AppRegistry: Registrando aplicación ${appName}`);
      
      const manifest = await this.fetchManifest(manifestUrl);
      this.registeredApps.set(appName, {
        manifest,
        loader: loaderClass,
        status: 'registered'
      });
      
      console.log(`✅ App ${appName} registrada correctamente`);
      this.eventBus.emit('app:registered', { appName, manifest });
      return true;
    } catch (error) {
      console.error(`❌ Error registrando ${appName}:`, error);
      return false;
    }
  }
  
  /**
   * Obtiene el manifiesto de una aplicación, usando caché si está disponible
   * @param {string} url - URL del manifiesto
   */
  async fetchManifest(url) {
    if (this.manifestCache.has(url)) {
      console.log(`[DEBUG] AppRegistry: Usando manifiesto en caché para ${url}`);
      return this.manifestCache.get(url);
    }

    console.log(`[DEBUG] AppRegistry: Cargando manifiesto desde ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} al cargar ${url}`);
    }
    
    const manifest = await response.json();
    this.manifestCache.set(url, manifest);
    return manifest;
  }
  
  /**
   * Carga una aplicación bajo demanda
   * @param {string} appName - Nombre de la aplicación
   */
  async loadApp(appName) {
    console.log(`[DEBUG] AppRegistry: Cargando aplicación ${appName}`);
    
    // Verificar si ya está cargada
    if (this.loadedApps.has(appName)) {
      console.log(`[DEBUG] AppRegistry: La aplicación ${appName} ya está cargada`);
      return this.loadedApps.get(appName);
    }
    
    const appInfo = this.registeredApps.get(appName);
    if (!appInfo) {
      console.error(`❌ App ${appName} no está registrada`);
      return null;
    }
    
    try {
      const loader = new appInfo.loader(this.eventBus);
      const appData = await loader.load(appInfo.manifest, appName);
      
      if (appData) {
        this.loadedApps.set(appName, appData);
        console.log(`✅ App ${appName} cargada correctamente`);
        this.eventBus.emit('app:loaded', { appName });
      }
      
      return appData;
    } catch (error) {
      console.error(`❌ Error cargando ${appName}:`, error);
      return null;
    }
  }
  
  /**
   * Activa una aplicación
   * @param {string} appName - Nombre de la aplicación
   */
  async activateApp(appName) {
    console.log(`[DEBUG] AppRegistry: Activando aplicación ${appName}`);
    
    // Verificar si ya está activa
    if (this.activeApps.has(appName)) {
      console.log(`[DEBUG] AppRegistry: La aplicación ${appName} ya está activa, alternando visibilidad`);
      
      if (this.persistentApps.includes(appName)) {
        this.showPersistentApp(appName);
      } else {
        this.eventBus.emit(`${appName}:toggleVisibility`, { appName });
      }
      return;
    }
    
    // Si hay una aplicación activa, ocultarla
    if (this.activeApps.size > 0) {
      const currentActiveAppId = Array.from(this.activeApps.keys())[0];
      if (currentActiveAppId && currentActiveAppId !== appName) {
        console.log(`[DEBUG] AppRegistry: Ocultando aplicación activa actual: ${currentActiveAppId}`);
        
        if (this.persistentApps.includes(currentActiveAppId)) {
          this.hidePersistentApp(currentActiveAppId);
        } else {
          this.deactivateApp(currentActiveAppId);
        }
      }
    }
    
    // Cargar la aplicación si no está cargada
    const appData = await this.loadApp(appName);
    if (!appData) {
      console.error(`❌ No se pudo cargar la aplicación ${appName}`);
      return;
    }
    
    try {
      // Inicializar la aplicación
      if (typeof appData.instance.init === 'function') {
        await appData.instance.init();
      }
      
      // Para aplicaciones persistentes, verificar si ya tenemos estado guardado
      if (this.persistentApps.includes(appName) && this.persistentAppState.has(appName)) {
        console.log(`[DEBUG] AppRegistry: Restaurando estado persistente para ${appName}`);
        // Restaurar el estado en lugar de renderizar desde cero
        this.restorePersistentApp(appName, appData);
      } else {
        // Renderizar la aplicación normalmente
        if (typeof appData.instance.render === 'function') {
          const appElement = appData.instance.render();
          appElement.setAttribute('data-app-id', appName);
          
          // Determinar contenedor según persistencia
          const container = this.persistentApps.includes(appName) 
            ? this.getPersistentContainer() 
            : this.getMainContainer();
          
          container.appendChild(appElement);
          
          // Si es una aplicación persistente, guardar su estado inicial
          if (this.persistentApps.includes(appName)) {
            this.savePersistentAppState(appName, appData);
          }
        }
      }
      
      this.activeApps.set(appName, appData);
      this.eventBus.emit('app:activated', { appName });
      console.log(`✅ App ${appName} activada correctamente`);
    } catch (error) {
      console.error(`❌ Error activando ${appName}:`, error);
    }
  }
  
  /**
   * Guarda el estado de una aplicación persistente
   * @param {string} appName - Nombre de la aplicación
   * @param {object} appData - Datos de la aplicación
   */
  savePersistentAppState(appName, appData) {
    console.log(`[DEBUG] AppRegistry: Guardando estado persistente para ${appName}`);
    
    // Para la aplicación de música, guardar la playlist y el estado actual
    if (appName === 'music' && appData.instance.playlist) {
      const state = {
        playlist: appData.instance.playlist,
        currentTrackIndex: appData.instance.currentTrackIndex,
        isPlaying: appData.instance.isPlaying,
        defaultTrackLoaded: appData.instance.defaultTrackLoaded
      };
      
      this.persistentAppState.set(appName, state);
      console.log(`[DEBUG] AppRegistry: Estado guardado para ${appName}:`, state);
    }
  }
  
  /**
   * Restaura el estado de una aplicación persistente
   * @param {string} appName - Nombre de la aplicación
   * @param {object} appData - Datos de la aplicación
   */
  restorePersistentApp(appName, appData) {
    console.log(`[DEBUG] AppRegistry: Restaurando aplicación persistente ${appName}`);
    
    // Obtener el estado guardado
    const savedState = this.persistentAppState.get(appName);
    if (!savedState) {
      console.log(`[DEBUG] AppRegistry: No hay estado guardado para ${appName}, renderizando normalmente`);
      
      // Si no hay estado guardado, renderizar normalmente
      if (typeof appData.instance.render === 'function') {
        const appElement = appData.instance.render();
        appElement.setAttribute('data-app-id', appName);
        this.getPersistentContainer().appendChild(appElement);
      }
      return;
    }
    
    // Para la aplicación de música, restaurar la playlist y el estado
    if (appName === 'music') {
      console.log(`[DEBUG] AppRegistry: Restaurando estado de música:`, savedState);
      
      // Restaurar el estado en la instancia
      appData.instance.playlist = savedState.playlist || [];
      appData.instance.currentTrackIndex = savedState.currentTrackIndex || -1;
      appData.instance.isPlaying = savedState.isPlaying || false;
      appData.instance.defaultTrackLoaded = savedState.defaultTrackLoaded || false;
      
      // Renderizar la interfaz
      if (typeof appData.instance.render === 'function') {
        const appElement = appData.instance.render();
        appElement.setAttribute('data-app-id', appName);
        
        // Añadir al contenedor principal
        this.getMainContainer().appendChild(appElement);
        
        // Actualizar la interfaz con el estado restaurado
        if (typeof appData.instance.updateTrackInfo === 'function') {
          appData.instance.updateTrackInfo();
        }
        
        if (typeof appData.instance.updatePlaylist === 'function') {
          appData.instance.updatePlaylist();
        }
        
        if (typeof appData.instance.updatePlayPauseButton === 'function') {
          appData.instance.updatePlayPauseButton();
        }
        
        // Si estaba reproduciendo, reanudar la reproducción
        if (savedState.isPlaying && savedState.currentTrackIndex >= 0) {
          setTimeout(() => {
            if (typeof appData.instance.playTrack === 'function') {
              appData.instance.playTrack(savedState.currentTrackIndex);
            }
          }, 100);
        }
      }
    }
  }
  
  /**
   * Desactiva una aplicación
   * @param {string} appName - Nombre de la aplicación
   */
  deactivateApp(appName) {
    console.log(`AppRegistry: Desactivando aplicación ${appName}`);
    
    if (!this.activeApps.has(appName)) {
      console.log(`AppRegistry: La aplicación ${appName} no está activa`);
      return;
    }
    
    try {
      if (this.persistentApps.includes(appName)) {
        // Para aplicaciones persistentes, guardar el estado antes de ocultar
        const appData = this.activeApps.get(appName);
        this.savePersistentAppState(appName, appData);
        this.hidePersistentApp(appName);
      } else {
        this.eventBus.emit(`${appName}:toggleVisibility`, { appName, hide: true });
        this.activeApps.delete(appName);
        this.getMainContainer().innerHTML = '';
      }
      
      this.eventBus.emit('app:deactivated', { appName });
      console.log(`✅ App ${appName} desactivada correctamente`);
    } catch (error) {
      console.error(`❌ Error desactivando ${appName}:`, error);
    }
  }
  
  /**
   * Muestra una aplicación persistente
   * @param {string} appName - Nombre de la aplicación
   */
  showPersistentApp(appName) {
    console.log(`[DEBUG] AppRegistry: Mostrando aplicación persistente ${appName}`);
    
    if (!this.activeApps.has(appName)) return;
    
    const mainContainer = this.getMainContainer();
    mainContainer.innerHTML = '';
    
    // Buscar la aplicación en el contenedor persistente
    const appElement = this.getPersistentContainer().querySelector(`[data-app-id="${appName}"]`);
    
    if (appElement) {
      // Mover la aplicación al contenedor principal
      mainContainer.appendChild(appElement);
      appElement.style.display = '';
      appElement.style.visibility = 'visible';
      appElement.style.opacity = '1';
      
      console.log(`[DEBUG] AppRegistry: Aplicación persistente ${appName} movida al contenedor principal`);
    } else {
      console.log(`[DEBUG] AppRegistry: No se encontró el elemento de la aplicación persistente ${appName}`);
      
      // Si no se encuentra el elemento, intentar restaurar el estado
      const appData = this.activeApps.get(appName);
      if (appData) {
        this.restorePersistentApp(appName, appData);
      }
    }
    
    this.eventBus.emit(`${appName}:toggleVisibility`, { appName, hide: false });
  }
  
  /**
   * Oculta una aplicación persistente
   * @param {string} appName - Nombre de la aplicación
   */
  hidePersistentApp(appName) {
    console.log(`[DEBUG] AppRegistry: Ocultando aplicación persistente ${appName}`);
    
    if (!this.activeApps.has(appName)) return;
    
    const mainContainer = this.getMainContainer();
    mainContainer.innerHTML = '';
    
    // Buscar la aplicación en el contenedor principal
    const appElement = mainContainer.querySelector(`[data-app-id="${appName}"]`);
    
    if (appElement) {
      // Mover la aplicación al contenedor persistente
      this.getPersistentContainer().appendChild(appElement);
      console.log(`[DEBUG] AppRegistry: Aplicación persistente ${appName} movida al contenedor persistente`);
    } else {
      console.log(`[DEBUG] AppRegistry: No se encontró el elemento de la aplicación persistente ${appName} en el contenedor principal`);
    }
    
    this.eventBus.emit(`${appName}:toggleVisibility`, { appName, hide: true });
  }
  
  /**
   * Aplica optimizaciones del sistema
   * @param {string} type - Tipo de optimización
   * @param {object} data - Datos de la optimización
   */
  applySystemOptimization(type, data) {
    console.log(`AppRegistry: Aplicando optimización del sistema: ${type}`, data);
    
    try {
      switch (type) {
        case 'reduce-effects':
          document.body.style.setProperty('--animation-speed', '0');
          document.body.style.setProperty('--blur-intensity', '0');
          document.body.style.setProperty('--transition-duration', '0ms');
          break;
          
        case 'disable-video-background':
          const videoBackground = document.getElementById('background-video');
          if (videoBackground) videoBackground.style.display = 'none';
          break;
          
        case 'enable-low-power-mode':
          document.body.classList.add('low-power-mode');
          break;
          
        case 'enable-tv-mode':
          document.body.classList.add('tv-mode');
          break;
      }
      
      // Notificar a todas las aplicaciones activas
      this.activeApps.forEach((appData, appName) => {
        if (typeof appData.instance.onSystemOptimization === 'function') {
          appData.instance.onSystemOptimization(type, data);
        }
      });
      
      this.eventBus.emit('system:optimization-applied', { type, data });
    } catch (error) {
      console.error(`❌ Error aplicando optimización ${type}:`, error);
    }
  }
  
  /**
   * Obtiene el contenedor principal de aplicaciones
   */
  getMainContainer() {
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
   * Obtiene el contenedor de aplicaciones persistentes
   */
  getPersistentContainer() {
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
   * Verifica si una aplicación es persistente
   * @param {string} appName - Nombre de la aplicación
   */
  isPersistentApp(appName) {
    return this.persistentApps.includes(appName);
  }
  
  /**
   * Obtiene la lista de aplicaciones registradas
   */
  getRegisteredApps() {
    return Array.from(this.registeredApps.keys());
  }
  
  /**
   * Obtiene la información de una aplicación registrada
   * @param {string} appName - Nombre de la aplicación
   */
  getAppInfo(appName) {
    return this.registeredApps.get(appName);
  }
}
