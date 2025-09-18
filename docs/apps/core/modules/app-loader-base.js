/*
 * Mizu OS - App Loader Base Module
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
 * Clase base para loaders de aplicaciones en Mizu OS
 * Proporciona funcionalidad común para la carga de aplicaciones
 * // apps/core/modules/app-loader-base.js
 */
export default class AppLoaderBase {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.manifestCache = new Map();
    
    console.log('[DEBUG] AppLoaderBase: Constructor llamado con EventBus:', !!eventBus);
  }
  
  /**
   * Método principal para cargar una aplicación
   * Debe ser implementado por las clases hijas
   * @param {object} manifest - Manifiesto de la aplicación
   */
  async load(manifest) {
    throw new Error('El método load() debe ser implementado por la clase hija');
  }
  
  /**
   * Carga el manifiesto de una aplicación desde una URL
   * @param {string} manifestUrl - URL del manifiesto
   */
  async fetchManifest(manifestUrl) {
    console.log(`[DEBUG] AppLoaderBase: Cargando manifiesto desde ${manifestUrl}`);
    
    // Verificar caché primero
    if (this.manifestCache.has(manifestUrl)) {
      console.log(`[DEBUG] AppLoaderBase: Usando manifiesto en caché para ${manifestUrl}`);
      return this.manifestCache.get(manifestUrl);
    }
    
    try {
      const response = await fetch(manifestUrl);
      console.log(`[DEBUG] AppLoaderBase: Respuesta del manifiesto:`, response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} al cargar ${manifestUrl}`);
      }
      
      const manifest = await response.json();
      console.log(`[DEBUG] AppLoaderBase: Manifiesto cargado:`, manifest);
      
      // Guardar en caché
      this.manifestCache.set(manifestUrl, manifest);
      
      return manifest;
    } catch (error) {
      console.error(`[ERROR] AppLoaderBase: Error al cargar manifiesto desde ${manifestUrl}:`, error);
      throw error;
    }
  }
  
  /**
   * Carga dinámicamente un módulo JavaScript
   * @param {string} modulePath - Ruta del módulo
   */
  async loadModule(modulePath) {
    console.log(`[DEBUG] AppLoaderBase: Cargando módulo desde ${modulePath}`);
    
    return new Promise((resolve, reject) => {
      // Crear una variable global temporal para almacenar la clase
      const tempGlobalVar = `__temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Crear un script para cargar el módulo
      const script = document.createElement('script');
      script.type = 'module';
      
      script.textContent = `
        import('${modulePath}')
          .then(module => {
            window.${tempGlobalVar} = module.default;
            window.${tempGlobalVar}_loaded = true;
          })
          .catch(error => {
            console.error('Error loading module:', error);
            window.${tempGlobalVar}_error = error;
          });
      `;
      
      document.head.appendChild(script);
      
      // Esperar a que el módulo se cargue
      const checkInterval = setInterval(() => {
        if (window[`${tempGlobalVar}_loaded`]) {
          clearInterval(checkInterval);
          const moduleClass = window[tempGlobalVar];
          
          // Limpiar variables temporales
          delete window[tempGlobalVar];
          delete window[`${tempGlobalVar}_loaded`];
          document.head.removeChild(script);
          
          resolve(moduleClass);
        } else if (window[`${tempGlobalVar}_error`]) {
          clearInterval(checkInterval);
          const error = window[`${tempGlobalVar}_error`];
          
          // Limpiar variables temporales
          delete window[`${tempGlobalVar}_error`];
          document.head.removeChild(script);
          
          reject(error);
        }
      }, 50);
      
      // Timeout por si el módulo nunca carga
      setTimeout(() => {
        clearInterval(checkInterval);
        if (window[tempGlobalVar]) {
          delete window[tempGlobalVar];
        }
        if (window[`${tempGlobalVar}_loaded`]) {
          delete window[`${tempGlobalVar}_loaded`];
        }
        if (window[`${tempGlobalVar}_error`]) {
          delete window[`${tempGlobalVar}_error`];
        }
        if (script.parentNode) {
          document.head.removeChild(script);
        }
        reject(new Error(`Timeout al cargar módulo: ${modulePath}`));
      }, 10000); // 10 segundos de timeout
    });
  }
  
  /**
   * Carga hojas de estilo CSS
   * @param {Array<string>} cssUrls - Array de URLs de CSS
   */
  async loadCSS(cssUrls) {
    console.log(`[DEBUG] AppLoaderBase: Cargando CSS:`, cssUrls);
    
    if (!Array.isArray(cssUrls) || cssUrls.length === 0) {
      console.log(`[DEBUG] AppLoaderBase: No hay CSS para cargar`);
      return;
    }
    
    const loadPromises = cssUrls.map(url => {
      return new Promise((resolve, reject) => {
        // Verificar si ya está cargado
        const existingLink = document.querySelector(`link[href="${url}"]`);
        if (existingLink) {
          console.log(`[DEBUG] AppLoaderBase: CSS ya cargado: ${url}`);
          resolve();
          return;
        }
        
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        
        link.onload = () => {
          console.log(`[DEBUG] AppLoaderBase: CSS cargado: ${url}`);
          resolve();
        };
        
        link.onerror = () => {
          console.error(`[ERROR] AppLoaderBase: Error al cargar CSS: ${url}`);
          reject(new Error(`Error al cargar CSS: ${url}`));
        };
        
        document.head.appendChild(link);
      });
    });
    
    try {
      await Promise.all(loadPromises);
      console.log(`[DEBUG] AppLoaderBase: Todos los CSS cargados correctamente`);
    } catch (error) {
      console.error(`[ERROR] AppLoaderBase: Error al cargar CSS:`, error);
      throw error;
    }
  }
  
  /**
   * Carga scripts JavaScript adicionales
   * @param {Array<string>} scriptUrls - Array de URLs de scripts
   */
  async loadScripts(scriptUrls) {
    console.log(`[DEBUG] AppLoaderBase: Cargando scripts:`, scriptUrls);
    
    if (!Array.isArray(scriptUrls) || scriptUrls.length === 0) {
      console.log(`[DEBUG] AppLoaderBase: No hay scripts para cargar`);
      return;
    }
    
    const loadPromises = scriptUrls.map(url => {
      return new Promise((resolve, reject) => {
        // Verificar si ya está cargado
        const existingScript = document.querySelector(`script[src="${url}"]`);
        if (existingScript) {
          console.log(`[DEBUG] AppLoaderBase: Script ya cargado: ${url}`);
          resolve();
          return;
        }
        
        const script = document.createElement('script');
        script.src = url;
        
        script.onload = () => {
          console.log(`[DEBUG] AppLoaderBase: Script cargado: ${url}`);
          resolve();
        };
        
        script.onerror = () => {
          console.error(`[ERROR] AppLoaderBase: Error al cargar script: ${url}`);
          reject(new Error(`Error al cargar script: ${url}`));
        };
        
        document.head.appendChild(script);
      });
    });
    
    try {
      await Promise.all(loadPromises);
      console.log(`[DEBUG] AppLoaderBase: Todos los scripts cargados correctamente`);
    } catch (error) {
      console.error(`[ERROR] AppLoaderBase: Error al cargar scripts:`, error);
      throw error;
    }
  }
  
  /**
   * Carga recursos adicionales (imágenes, fuentes, etc.)
   * @param {object} resources - Objeto con recursos a cargar
   */
  async loadResources(resources) {
    console.log(`[DEBUG] AppLoaderBase: Cargando recursos adicionales:`, resources);
    
    if (!resources || typeof resources !== 'object') {
      console.log(`[DEBUG] AppLoaderBase: No hay recursos adicionales para cargar`);
      return;
    }
    
    const loadPromises = [];
    
    // Cargar imágenes
    if (resources.images && Array.isArray(resources.images)) {
      resources.images.forEach(url => {
        loadPromises.push(this.loadImage(url));
      });
    }
    
    // Cargar fuentes
    if (resources.fonts && Array.isArray(resources.fonts)) {
      resources.fonts.forEach(fontConfig => {
        loadPromises.push(this.loadFont(fontConfig));
      });
    }
    
    try {
      await Promise.allSettled(loadPromises);
      console.log(`[DEBUG] AppLoaderBase: Recursos adicionales procesados`);
    } catch (error) {
      console.error(`[ERROR] AppLoaderBase: Error al cargar recursos adicionales:`, error);
      // No lanzamos error para no bloquear la carga de la app
    }
  }
  
  /**
   * Carga una imagen
   * @param {string} url - URL de la imagen
   */
  loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Error al cargar imagen: ${url}`));
      img.src = url;
    });
  }
  
  /**
   * Carga una fuente
   * @param {object} fontConfig - Configuración de la fuente
   */
  loadFont(fontConfig) {
    return new Promise((resolve, reject) => {
      const font = new FontFace(
        fontConfig.family,
        fontConfig.source,
        fontConfig.descriptors || {}
      );
      
      font.load()
        .then(loadedFont => {
          document.fonts.add(loadedFont);
          resolve();
        })
        .catch(error => {
          console.error(`Error al cargar fuente ${fontConfig.family}:`, error);
          reject(error);
        });
    });
  }
  
  /**
   * Crea una instancia de una aplicación
   * @param {class} AppClass - Clase de la aplicación
   * @param {object} manifest - Manifiesto de la aplicación
   */
  createAppInstance(AppClass, manifest) {
    console.log(`[DEBUG] AppLoaderBase: Creando instancia de aplicación`);
    
    try {
      const appInstance = new AppClass(this.eventBus);
      console.log(`[DEBUG] AppLoaderBase: Instancia de aplicación creada:`, typeof appInstance);
      
      return {
        instance: appInstance,
        manifest: manifest
      };
    } catch (error) {
      console.error(`[ERROR] AppLoaderBase: Error al crear instancia de aplicación:`, error);
      throw error;
    }
  }
  
  /**
   * Valida un manifiesto de aplicación
   * @param {object} manifest - Manifiesto a validar
   */
  validateManifest(manifest) {
    console.log(`[DEBUG] AppLoaderBase: Validando manifiesto:`, manifest);
    
    if (!manifest || typeof manifest !== 'object') {
      throw new Error('Manifiesto inválido: no es un objeto');
    }
    
    // Verificar nombre
    if (!manifest.name || typeof manifest.name !== 'string') {
      throw new Error('Manifiesto inválido: falta nombre o no es string');
    }
    
    // Verificar punto de entrada (entry o main)
    const entryPoint = manifest.entry || manifest.main;
    if (!entryPoint || typeof entryPoint !== 'string') {
      throw new Error('Manifiesto inválido: falta punto de entrada (entry o main)');
    }
    
    console.log(`[DEBUG] AppLoaderBase: Manifiesto válido para: ${manifest.name}`);
    return true;
  }
  
  /**
   * Limpia la caché de manifiestos
   */
  clearManifestCache() {
    this.manifestCache.clear();
    console.log('AppLoaderBase: Caché de manifiestos limpiada');
  }
  
  /**
   * Obtiene información de la caché
   * @returns {object} Información de la caché
   */
  getCacheInfo() {
    return {
      manifestCacheSize: this.manifestCache.size,
      manifestCacheKeys: Array.from(this.manifestCache.keys())
    };
  }
}
