/*
 * Mizu OS - App Specialized Loaders Module
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
 * Loaders especializados para diferentes tipos de aplicaciones en Mizu OS
 * Cada loader está optimizado para un tipo específico de aplicación
 * // apps/core/modules/app-specialized-loaders.js
 */
import AppLoaderBase from './app-loader-base.js';

/**
 * Loader para aplicaciones web estándar
 * Maneja aplicaciones con HTML, CSS y JavaScript tradicionales
 */
export class WebAppLoader extends AppLoaderBase {
  constructor(eventBus) {
    super(eventBus);
    console.log('[DEBUG] WebAppLoader: Constructor llamado');
  }
  
  /**
   * Carga una aplicación web
   * @param {object} manifest - Manifiesto de la aplicación
   */
  async load(manifest) {
    console.log(`[DEBUG] WebAppLoader: Cargando aplicación web: ${manifest.name}`);
    
    try {
      // Validar manifiesto
      this.validateManifest(manifest);
      
      // Obtener punto de entrada
      const entryPoint = manifest.entry || manifest.main;
      const scriptPath = `./apps/${manifest.name}/${entryPoint}`;
      console.log(`[DEBUG] WebAppLoader: Punto de entrada: ${scriptPath}`);
      
      // Cargar recursos CSS si existen
      if (manifest.styles && Array.isArray(manifest.styles)) {
        await this.loadCSS(manifest.styles);
      }
      
      // Cargar scripts adicionales si existen
      if (manifest.scripts && Array.isArray(manifest.scripts)) {
        await this.loadScripts(manifest.scripts);
      }
      
      // Cargar recursos adicionales si existen
      if (manifest.resources) {
        await this.loadResources(manifest.resources);
      }
      
      // Cargar el módulo principal
      const AppClass = await this.loadModule(scriptPath);
      
      // Crear instancia de la aplicación
      const appData = this.createAppInstance(AppClass, manifest);
      
      console.log(`✅ WebAppLoader: Aplicación ${manifest.name} cargada correctamente`);
      return appData;
    } catch (error) {
      console.error(`❌ WebAppLoader: Error al cargar aplicación ${manifest.name}:`, error);
      throw error;
    }
  }
}

/**
 * Loader para aplicaciones persistentes (como música)
 * Maneja aplicaciones que deben permanecer activas en segundo plano
 */
export class PersistentAppLoader extends AppLoaderBase {
  constructor(eventBus) {
    super(eventBus);
    console.log('[DEBUG] PersistentAppLoader: Constructor llamado');
  }
  
  /**
   * Carga una aplicación persistente
   * @param {object} manifest - Manifiesto de la aplicación
   */
  async load(manifest) {
    console.log(`[DEBUG] PersistentAppLoader: Cargando aplicación persistente: ${manifest.name}`);
    
    try {
      // Validar manifiesto
      this.validateManifest(manifest);
      
      // Obtener punto de entrada
      const entryPoint = manifest.entry || manifest.main;
      const scriptPath = `./apps/${manifest.name}/${entryPoint}`;
      
      // Cargar CSS específico para apps persistentes
      if (manifest.persistentStyles && Array.isArray(manifest.persistentStyles)) {
        await this.loadCSS(manifest.persistentStyles);
      }
      
      // Cargar el módulo principal
      const AppClass = await this.loadModule(scriptPath);
      
      // Crear instancia de la aplicación
      const appData = this.createAppInstance(AppClass, manifest);
      
      // Marcar como persistente
      appData.isPersistent = true;
      
      console.log(`✅ PersistentAppLoader: Aplicación persistente ${manifest.name} cargada correctamente`);
      return appData;
    } catch (error) {
      console.error(`❌ PersistentAppLoader: Error al cargar aplicación persistente ${manifest.name}:`, error);
      throw error;
    }
  }
}

/**
 * Loader para widgets del sistema
 * Maneja componentes pequeños y ligeros
 */
export class WidgetLoader extends AppLoaderBase {
  constructor(eventBus) {
    super(eventBus);
    console.log('[DEBUG] WidgetLoader: Constructor llamado');
  }
  
  /**
   * Carga un widget
   * @param {object} manifest - Manifiesto del widget
   */
  async load(manifest) {
    console.log(`[DEBUG] WidgetLoader: Cargando widget: ${manifest.name}`);
    
    try {
      // Validar manifiesto
      this.validateManifest(manifest);
      
      // Obtener punto de entrada
      const entryPoint = manifest.entry || manifest.main;
      const scriptPath = `./apps/${manifest.name}/${entryPoint}`;
      
      // Los widgets suelen tener CSS minimalista
      if (manifest.widgetStyles && Array.isArray(manifest.widgetStyles)) {
        await this.loadCSS(manifest.widgetStyles);
      }
      
      // Cargar el módulo principal
      const WidgetClass = await this.loadModule(scriptPath);
      
      // Crear instancia del widget
      const widgetData = this.createAppInstance(WidgetClass, manifest);
      
      // Marcar como widget
      widgetData.isWidget = true;
      
      console.log(`✅ WidgetLoader: Widget ${manifest.name} cargado correctamente`);
      return widgetData;
    } catch (error) {
      console.error(`❌ WidgetLoader: Error al cargar widget ${manifest.name}:`, error);
      throw error;
    }
  }
}

/**
 * Loader para servicios del sistema
 * Maneja aplicaciones que corren en segundo plano sin interfaz
 */
export class ServiceLoader extends AppLoaderBase {
  constructor(eventBus) {
    super(eventBus);
    this.runningServices = new Map();
    console.log('[DEBUG] ServiceLoader: Constructor llamado');
  }
  
  /**
   * Carga un servicio
   * @param {object} manifest - Manifiesto del servicio
   */
  async load(manifest) {
    console.log(`[DEBUG] ServiceLoader: Cargando servicio: ${manifest.name}`);
    
    try {
      // Validar manifiesto
      this.validateManifest(manifest);
      
      // Verificar si el servicio ya está corriendo
      if (this.runningServices.has(manifest.name)) {
        console.log(`[DEBUG] ServiceLoader: Servicio ${manifest.name} ya está corriendo`);
        return this.runningServices.get(manifest.name);
      }
      
      // Obtener punto de entrada
      const entryPoint = manifest.entry || manifest.main;
      const scriptPath = `./apps/${manifest.name}/${entryPoint}`;
      
      // Los servicios no suelen tener CSS
      // Cargar el módulo principal
      const ServiceClass = await this.loadModule(scriptPath);
      
      // Crear instancia del servicio
      const serviceData = this.createAppInstance(ServiceClass, manifest);
      
      // Marcar como servicio
      serviceData.isService = true;
      
      // Guardar en servicios corriendo
      this.runningServices.set(manifest.name, serviceData);
      
      console.log(`✅ ServiceLoader: Servicio ${manifest.name} cargado correctamente`);
      return serviceData;
    } catch (error) {
      console.error(`❌ ServiceLoader: Error al cargar servicio ${manifest.name}:`, error);
      throw error;
    }
  }
  
  /**
   * Detiene un servicio
   * @param {string} serviceName - Nombre del servicio
   */
  stopService(serviceName) {
    console.log(`[DEBUG] ServiceLoader: Deteniendo servicio: ${serviceName}`);
    
    const serviceData = this.runningServices.get(serviceName);
    if (serviceData) {
      // Llamar al método stop si existe
      if (typeof serviceData.instance.stop === 'function') {
        serviceData.instance.stop();
      }
      
      // Eliminar de servicios corriendo
      this.runningServices.delete(serviceName);
      
      console.log(`✅ ServiceLoader: Servicio ${serviceName} detenido`);
    }
  }
  
  /**
   * Obtiene la lista de servicios corriendo
   */
  getRunningServices() {
    return Array.from(this.runningServices.keys());
  }
}

/**
 * Loader para aplicaciones de sistema (core)
 * Maneja aplicaciones esenciales del sistema
 */
export class SystemAppLoader extends AppLoaderBase {
  constructor(eventBus) {
    super(eventBus);
    console.log('[DEBUG] SystemAppLoader: Constructor llamado');
  }
  
  /**
   * Carga una aplicación de sistema
   * @param {object} manifest - Manifiesto de la aplicación
   */
  async load(manifest) {
    console.log(`[DEBUG] SystemAppLoader: Cargando aplicación de sistema: ${manifest.name}`);
    
    try {
      // Validar manifiesto
      this.validateManifest(manifest);
      
      // Obtener punto de entrada
      const entryPoint = manifest.entry || manifest.main;
      const scriptPath = `./apps/${manifest.name}/${entryPoint}`;
      
      // Las apps de sistema tienen prioridad en la carga de recursos
      if (manifest.systemStyles && Array.isArray(manifest.systemStyles)) {
        await this.loadCSS(manifest.systemStyles);
      }
      
      if (manifest.systemScripts && Array.isArray(manifest.systemScripts)) {
        await this.loadScripts(manifest.systemScripts);
      }
      
      // Cargar el módulo principal
      const SystemAppClass = await this.loadModule(scriptPath);
      
      // Crear instancia de la aplicación
      const appData = this.createAppInstance(SystemAppClass, manifest);
      
      // Marcar como aplicación de sistema
      appData.isSystemApp = true;
      
      console.log(`✅ SystemAppLoader: Aplicación de sistema ${manifest.name} cargada correctamente`);
      return appData;
    } catch (error) {
      console.error(`❌ SystemAppLoader: Error al cargar aplicación de sistema ${manifest.name}:`, error);
      throw error;
    }
  }
}

/**
 * Fábrica de loaders
 * Proporciona el loader adecuado según el tipo de aplicación
 */
export class LoaderFactory {
  /**
   * Obtiene el loader adecuado según el tipo de aplicación
   * @param {string} appType - Tipo de aplicación
   * @param {object} eventBus - EventBus del sistema
   */
  static getLoader(appType, eventBus) {
    console.log(`[DEBUG] LoaderFactory: Obteniendo loader para tipo: ${appType}`);
    
    switch (appType) {
      case 'web-app':
      case 'web':
        return new WebAppLoader(eventBus);
        
      case 'persistent':
      case 'music':
        return new PersistentAppLoader(eventBus);
        
      case 'widget':
        return new WidgetLoader(eventBus);
        
      case 'service':
        return new ServiceLoader(eventBus);
        
      case 'system':
      case 'core':
        return new SystemAppLoader(eventBus);
        
      default:
        console.log(`[DEBUG] LoaderFactory: Tipo no reconocido, usando WebAppLoader por defecto`);
        return new WebAppLoader(eventBus);
    }
  }
  
  /**
   * Obtiene el loader adecuado según el manifiesto de la aplicación
   * @param {object} manifest - Manifiesto de la aplicación
   * @param {object} eventBus - EventBus del sistema
   */
  static getLoaderFromManifest(manifest, eventBus) {
    console.log(`[DEBUG] LoaderFactory: Determinando loader desde manifiesto para: ${manifest.name}`);
    
    // Determinar tipo basado en el manifiesto
    let appType = manifest.type || 'web-app';
    
    // Si es una aplicación persistente conocida
    if (manifest.name === 'music' || manifest.persistent) {
      appType = 'persistent';
    }
    
    // Si es una aplicación de sistema
    if (manifest.name === 'core' || manifest.system) {
      appType = 'system';
    }
    
    // Si es un widget
    if (manifest.widget || manifest.category === 'widget') {
      appType = 'widget';
    }
    
    // Si es un servicio
    if (manifest.service || manifest.category === 'service') {
      appType = 'service';
    }
    
    return this.getLoader(appType, eventBus);
  }
}
