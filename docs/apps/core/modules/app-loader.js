/*
 * Mizu OS - App Loader Module
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
 * Sistema de carga dinámica de aplicaciones para Mizu OS
 * Gestiona la activación, desactivación y carga de aplicaciones
 */
// apps/core/modules/app-loader.js
export default class AppLoader {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.loadedApps = new Map();
    this.activeApps = new Map();
    this.appsContainer = null;
    
    console.log('[DEBUG] AppLoader: Constructor llamado con EventBus:', !!eventBus);
  }
  
  init() {
    console.log('AppLoader: Inicializando cargador de aplicaciones');
    
    // Asegurarse de que el contenedor de aplicaciones exista
    this.ensureAppsContainer();
    
    // Suscribirse al evento de activación de aplicaciones
    console.log('[DEBUG] AppLoader: Suscribiéndose al evento app:activate');
    this.eventBus.on('app:activate', (data) => {
      console.log('[DEBUG] AppLoader: Evento app:activate recibido:', data);
      console.log('[DEBUG] AppLoader: Tipo de datos:', typeof data);
      console.log('[DEBUG] AppLoader: appId:', data ? data.appId : 'undefined');
      
      this.activateApp(data.appId);
    });
    
    // Suscribirse al evento de desactivación de aplicaciones
    this.eventBus.on('app:deactivate', (data) => {
      console.log('AppLoader: Evento app:deactivate recibido:', data);
      this.deactivateApp(data.appId);
    });
    
    // NUEVO: Suscribirse a eventos de optimización del sistema
    this.eventBus.on('system:reduce-effects', (data) => {
      console.log('AppLoader: Evento system:reduce-effects recibido:', data);
      this.applySystemOptimization('reduce-effects', data);
    });
    
    this.eventBus.on('system:disable-video-background', (data) => {
      console.log('AppLoader: Evento system:disable-video-background recibido:', data);
      this.applySystemOptimization('disable-video-background', data);
    });
    
    this.eventBus.on('system:enable-low-power-mode', (data) => {
      console.log('AppLoader: Evento system:enable-low-power-mode recibido:', data);
      this.applySystemOptimization('enable-low-power-mode', data);
    });
    
    this.eventBus.on('system:enable-tv-mode', (data) => {
      console.log('AppLoader: Evento system:enable-tv-mode recibido:', data);
      this.applySystemOptimization('enable-tv-mode', data);
    });
    
    console.log('AppLoader: Cargador de aplicaciones inicializado correctamente');
    return true;
  }
  
  ensureAppsContainer() {
    console.log('[DEBUG] AppLoader: Verificando contenedor de aplicaciones');
    
    // Verificar si el contenedor ya existe
    this.appsContainer = document.getElementById('black-bar');
    console.log('[DEBUG] AppLoader: Contenedor encontrado:', !!this.appsContainer);
    
    if (!this.appsContainer) {
      console.log('AppLoader: Creando contenedor de aplicaciones');
      
      // Crear el contenedor si no existe
      this.appsContainer = document.createElement('div');
      this.appsContainer.id = 'black-bar';
      this.appsContainer.style.cssText = `
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
      
      // Añadir el contenedor al body
      document.body.appendChild(this.appsContainer);
      console.log('AppLoader: Contenedor de aplicaciones creado correctamente');
    } else {
      console.log('AppLoader: Contenedor de aplicaciones ya existe');
      
      // CORREGIDO: Si el contenedor ya existe, asegurar que tenga el z-index correcto
      // para no bloquear la interacción con otros elementos
      this.appsContainer.style.zIndex = '641';
      this.appsContainer.style.cursor = 'grab';
      
      // CORREGIDO: Eliminar cualquier otro black-bar duplicado
      const allBlackBars = document.querySelectorAll('#black-bar');
      if (allBlackBars.length > 1) {
        console.log(`AppLoader: Se encontraron ${allBlackBars.length} elementos black-bar, eliminando duplicados`);
        for (let i = 1; i < allBlackBars.length; i++) {
          if (allBlackBars[i] !== this.appsContainer) {
            allBlackBars[i].parentNode.removeChild(allBlackBars[i]);
            console.log('AppLoader: Elemento black-bar duplicado eliminado');
          }
        }
      }
    }
    
    return this.appsContainer;
  }
  
  async loadApp(appId) {
    console.log(`[DEBUG] AppLoader: Cargando aplicación ${appId}`);
    console.log(`[DEBUG] AppLoader: ¿Aplicación ya cargada?`, this.loadedApps.has(appId));
    
    // Verificar si la aplicación ya está cargada
    if (this.loadedApps.has(appId)) {
      console.log(`[DEBUG] AppLoader: La aplicación ${appId} ya está cargada`);
      return this.loadedApps.get(appId);
    }
    
    try {
      // Cargar el manifiesto de la aplicación
      const manifestPath = `./apps/${appId}/manifest.json`;
      console.log(`[DEBUG] AppLoader: Cargando manifiesto desde ${manifestPath}`);
      
      const manifestResponse = await fetch(manifestPath);
      console.log(`[DEBUG] AppLoader: Respuesta del manifiesto:`, manifestResponse.status);
      
      if (!manifestResponse.ok) {
        // Para depuración: intentar cargar un manifiesto alternativo
        console.log(`[ERROR] AppLoader: No se pudo cargar el manifiesto desde ${manifestPath}`);
        
        // Si es la aplicación de settings, intentar con un manifiesto integrado
        if (appId === 'settings') {
          console.log(`[DEBUG] AppLoader: Intentando cargar manifiesto integrado para settings`);
          const manifest = {
            name: "Configuración",
            version: "1.0.0",
            description: "Configuración del sistema",
            icon: "⚙️",
            entry: "appcore.js"
          };
          console.log(`[DEBUG] AppLoader: Manifiesto integrado para settings:`, manifest);
          
          // Continuar con la carga usando el manifiesto integrado
          return await this.loadAppFromManifest(appId, manifest);
        } 
        // NUEVO: Si es la aplicación de rendimiento, intentar con un manifiesto integrado
        else if (appId === 'performance') {
          console.log(`[DEBUG] AppLoader: Intentando cargar manifiesto integrado para performance`);
          const manifest = {
            name: "Performance",
            version: "1.0.0",
            description: "Herramienta de diagnóstico y optimización del sistema",
            icon: "⚡",
            entry: "appcore.js",
            styles: [],
            scripts: [],
            permissions: ["system.info", "system.performance", "system.optimization"],
            dependencies: [],
            author: "Mizu Legends Studios",
            license: "GNU AGPL-3.0"
          };
          console.log(`[DEBUG] AppLoader: Manifiesto integrado para performance:`, manifest);
          
          // Continuar con la carga usando el manifiesto integrado
          return await this.loadAppFromManifest(appId, manifest);
        }
        else {
          throw new Error(`No se pudo cargar el manifiesto de ${appId}`);
        }
      }
      
      const manifest = await manifestResponse.json();
      console.log(`[DEBUG] AppLoader: Manifiesto de ${appId} cargado:`, manifest);
      
      // NUEVO: Extraer la lógica de carga a un método separado para reutilización
      return await this.loadAppFromManifest(appId, manifest);
    } catch (error) {
      console.error(`[ERROR] AppLoader: Error al cargar la aplicación ${appId}:`, error);
      return null;
    }
  }
  
  // NUEVO: Método separado para cargar una aplicación desde un manifiesto
  async loadAppFromManifest(appId, manifest) {
    console.log(`[DEBUG] AppLoader: Cargando aplicación ${appId} desde manifiesto`);
    
    try {
      // Compatibilidad con ambos formatos: "entry" y "main"
      const entryPoint = manifest.entry || manifest.main;
      if (!entryPoint) {
        throw new Error(`El manifiesto de ${appId} no especifica un punto de entrada (entry o main)`);
      }
      
      const scriptPath = `./apps/${appId}/${entryPoint}`;
      console.log(`[DEBUG] AppLoader: Cargando script desde ${scriptPath}`);
      
      // Crear una promesa para cargar el módulo dinámicamente
      const loadModule = new Promise((resolve, reject) => {
        // Crear un elemento de script para cargar el módulo
        const script = document.createElement('script');
        script.type = 'module';
        
        // Crear una variable global para almacenar la clase de la aplicación
        const tempGlobalVar = `__temp_${appId}_app`;
        
        // Crear el código que importará el módulo y lo asignará a una variable global
        script.textContent = `
          import('${scriptPath}')
            .then(module => {
              window.${tempGlobalVar} = module.default;
              window.${tempGlobalVar}_loaded = true;
            })
            .catch(error => {
              console.error('Error loading module:', error);
              window.${tempGlobalVar}_error = error;
            });
        `;
        
        // Añadir el script al documento
        document.head.appendChild(script);
        
        // Esperar a que el módulo se cargue
        const checkInterval = setInterval(() => {
          if (window[`${tempGlobalVar}_loaded`]) {
            clearInterval(checkInterval);
            resolve(window[tempGlobalVar]);
            // Limpiar variables temporales
            delete window[tempGlobalVar];
            delete window[`${tempGlobalVar}_loaded`];
            document.head.removeChild(script);
          } else if (window[`${tempGlobalVar}_error`]) {
            clearInterval(checkInterval);
            reject(window[`${tempGlobalVar}_error`]);
            // Limpiar variables temporales
            delete window[`${tempGlobalVar}_error`];
            document.head.removeChild(script);
          }
        }, 50);
      });
      
      // Esperar a que el módulo se cargue
      const AppClass = await loadModule;
      console.log(`[DEBUG] AppLoader: Clase de aplicación obtenida:`, typeof AppClass);
      
      // Crear una instancia de la aplicación
      const appInstance = new AppClass(this.eventBus);
      console.log(`[DEBUG] AppLoader: Instancia de aplicación creada:`, typeof appInstance);
      
      // Guardar la aplicación cargada
      this.loadedApps.set(appId, {
        instance: appInstance,
        manifest: manifest
      });
      
      console.log(`[DEBUG] AppLoader: Aplicación ${appId} cargada correctamente`);
      return this.loadedApps.get(appId);
    } catch (error) {
      console.error(`[ERROR] AppLoader: Error al cargar la aplicación ${appId} desde manifiesto:`, error);
      return null;
    }
  }
  
  async activateApp(appId) {
    console.log(`[DEBUG] AppLoader: Activando aplicación ${appId}`);
    
    // Verificar si la aplicación ya está activa
    if (this.activeApps.has(appId)) {
      console.log(`[DEBUG] AppLoader: La aplicación ${appId} ya está activa`);
      return;
    }
    
    // Cargar la aplicación si no está cargada
    console.log(`[DEBUG] AppLoader: Llamando a loadApp para ${appId}`);
    const appData = await this.loadApp(appId);
    console.log(`[DEBUG] AppLoader: Resultado de loadApp:`, !!appData);
    
    if (!appData) {
      console.error(`[ERROR] AppLoader: No se pudo cargar la aplicación ${appId}`);
      return;
    }
    
    try {
      // Asegurarse de que el contenedor de aplicaciones exista
      console.log(`[DEBUG] AppLoader: Verificando contenedor de aplicaciones`);
      this.ensureAppsContainer();
      
      // Limpiar el contenedor antes de renderizar
      console.log(`[DEBUG] AppLoader: Limpiando contenedor`);
      this.appsContainer.innerHTML = '';
      
      // Inicializar la aplicación
      if (typeof appData.instance.init === 'function') {
        console.log(`[DEBUG] AppLoader: Inicializando aplicación ${appId}`);
        await appData.instance.init();
      }
      
      // Renderizar la aplicación
      if (typeof appData.instance.render === 'function') {
        console.log(`[DEBUG] AppLoader: Renderizando aplicación ${appId}`);
        // Renderizar la aplicación
        const appElement = appData.instance.render();
        console.log(`[DEBUG] AppLoader: Elemento de aplicación obtenido:`, !!appElement);
        
        this.appsContainer.appendChild(appElement);
        console.log(`[DEBUG] AppLoader: Aplicación ${appId} renderizada en el contenedor`);
      }
      
      // Guardar la aplicación activa
      this.activeApps.set(appId, appData);
      console.log(`[DEBUG] AppLoader: Aplicación ${appId} guardada como activa`);
      
      // Emitir evento de aplicación activada
      this.eventBus.emit('app:activated', { appId });
      console.log(`[DEBUG] AppLoader: Evento app:activated emitido para ${appId}`);
      
      console.log(`[DEBUG] AppLoader: Aplicación ${appId} activada correctamente`);
    } catch (error) {
      console.error(`[ERROR] AppLoader: Error al activar la aplicación ${appId}:`, error);
    }
  }
  
  deactivateApp(appId) {
    console.log(`AppLoader: Desactivando aplicación ${appId}`);
    
    // Verificar si la aplicación está activa
    if (!this.activeApps.has(appId)) {
      console.log(`AppLoader: La aplicación ${appId} no está activa`);
      return;
    }
    
    try {
      const appData = this.activeApps.get(appId);
      
      // Destruir la aplicación si tiene un método destroy
      if (typeof appData.instance.destroy === 'function') {
        appData.instance.destroy();
      }
      
      // Eliminar la aplicación de las aplicaciones activas
      this.activeApps.delete(appId);
      
      // Limpiar el contenedor
      this.appsContainer.innerHTML = '';
      
      // Emitir evento de aplicación desactivada
      this.eventBus.emit('app:deactivated', { appId });
      
      console.log(`AppLoader: Aplicación ${appId} desactivada correctamente`);
    } catch (error) {
      console.error(`AppLoader: Error al desactivar la aplicación ${appId}:`, error);
    }
  }
  
  // NUEVO: Método para aplicar optimizaciones del sistema
  applySystemOptimization(type, data) {
    console.log(`AppLoader: Aplicando optimización del sistema: ${type}`, data);
    
    try {
      switch (type) {
        case 'reduce-effects':
          // Reducir efectos visuales en todo el sistema
          document.body.style.setProperty('--animation-speed', '0');
          document.body.style.setProperty('--blur-intensity', '0');
          document.body.style.setProperty('--transition-duration', '0ms');
          
          // Notificar a todas las aplicaciones activas
          this.activeApps.forEach((appData, appId) => {
            if (typeof appData.instance.onSystemOptimization === 'function') {
              appData.instance.onSystemOptimization(type, data);
            }
          });
          break;
          
        case 'disable-video-background':
          // Desactivar video de fondo
          const videoBackground = document.getElementById('background-video');
          if (videoBackground) {
            videoBackground.style.display = 'none';
          }
          
          // Notificar a todas las aplicaciones activas
          this.activeApps.forEach((appData, appId) => {
            if (typeof appData.instance.onSystemOptimization === 'function') {
              appData.instance.onSystemOptimization(type, data);
            }
          });
          break;
          
        case 'enable-low-power-mode':
          // Activar modo de bajo consumo
          document.body.classList.add('low-power-mode');
          
          // Notificar a todas las aplicaciones activas
          this.activeApps.forEach((appData, appId) => {
            if (typeof appData.instance.onSystemOptimization === 'function') {
              appData.instance.onSystemOptimization(type, data);
            }
          });
          break;
          
        case 'enable-tv-mode':
          // Activar modo TV
          document.body.classList.add('tv-mode');
          
          // Notificar a todas las aplicaciones activas
          this.activeApps.forEach((appData, appId) => {
            if (typeof appData.instance.onSystemOptimization === 'function') {
              appData.instance.onSystemOptimization(type, data);
            }
          });
          break;
          
        default:
          console.warn(`AppLoader: Tipo de optimización desconocido: ${type}`);
      }
      
      // Emitir evento de optimización aplicada
      this.eventBus.emit('system:optimization-applied', { type, data });
    } catch (error) {
      console.error(`AppLoader: Error al aplicar optimización del sistema ${type}:`, error);
    }
  }
}
