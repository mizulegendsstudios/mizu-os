/*
 * Mizu OS - Core/AppLoader
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
/*
 * Cargador de apps de Mizu OS
 * Responsable de cargar dinámicamente las apps del sistema desde la configuración
 * // docs/apps/core/appLoader.js
 * Rol: Carga dinámica de apps del sistema
 * Filosofía: Cargar solo las apps necesarias en el momento adecuado
 *Principios:
 *Cloud-Native: Ejecución 100% en navegador (GitHub Pages + jsDelivr) — sin build, sin bundlers, sin node_modules, sin servidores locales.
 *Extensible por diseño: cada app es un módulo independiente con su propio bootstrap.
 *Licencia libre: GNU AGPL-3.0 — cualquier modificación públicada en la red debe compartirse la fuente.
 *Stack Tecnológico/Zero Dependencies: ES6+ JavaScript vainilla (módulos nativos), CSS3 con Custom Properties, HTML5 APIs (Canvas, WebAudio, etc.). Sin frameworks, sin Tailwind.
*/

export class AppLoader {
  constructor() {
    this.loadedApps = new Map();
    this.appConfigs = new Map();
    console.log('AppLoader: Inicializado');
  }

  // Cargar las apps desde la configuración
  async loadAppsFromConfig() {
    try {
      console.log('AppLoader: Iniciando carga de apps desde configuración...');
      
      // Obtener la configuración de las apps
      await this.loadAppConfigs();
      
      // Ordenar las apps por prioridad
      const sortedApps = this.sortAppsByPriority();
      
      console.log('AppLoader: Orden de carga de apps:', sortedApps.map(app => app.name));
      
      // Cargar cada app en el orden correcto
      for (const appConfig of sortedApps) {
        if (appConfig.enabled) {
          await this.loadAppWithDependencies(appConfig.name);
        }
      }
      
      console.log('AppLoader: Carga de apps completada');
    } catch (error) {
      console.error('AppLoader: Error durante la carga de apps:', error);
      throw error;
    }
  }

  // Cargar la configuración de las apps desde el archivo JSON
  async loadAppConfigs() {
    try {
      const response = await fetch('./config/modules.json');
      const modulesConfig = await response.json();
      
      // Almacenar la configuración de cada app
      for (const [appName, config] of Object.entries(modulesConfig)) {
        this.appConfigs.set(appName, config);
      }
      
      console.log('AppLoader: Configuración de apps cargada');
    } catch (error) {
      console.error('AppLoader: Error cargando configuración de apps:', error);
      throw error;
    }
  }

  // Ordenar las apps por prioridad
  sortAppsByPriority() {
    return Array.from(this.appConfigs.entries())
      .map(([name, config]) => ({ name, ...config }))
      .sort((a, b) => a.priority - b.priority);
  }

  // Cargar una app y sus dependencias
  async loadAppWithDependencies(appName, loadingStack = []) {
    // Verificar si ya está cargada
    if (this.loadedApps.has(appName)) {
      console.log(`AppLoader: App '${appName}' ya está cargada`);
      return;
    }
    
    // Verificar dependencias circulares
    if (loadingStack.includes(appName)) {
      throw new Error(`AppLoader: Dependencia circular detectada: ${loadingStack.join(' -> ')} -> ${appName}`);
    }
    
    const appConfig = this.appConfigs.get(appName);
    if (!appConfig) {
      throw new Error(`AppLoader: Configuración no encontrada para la app '${appName}'`);
    }
    
    console.log(`AppLoader: Cargando app '${appName}' con dependencias:`, appConfig.dependencies || []);
    
    // Cargar dependencias primero
    if (appConfig.dependencies) {
      for (const dependency of appConfig.dependencies) {
        await this.loadAppWithDependencies(dependency, [...loadingStack, appName]);
      }
    }
    
    // Cargar la app actual
    await this.loadApp(appName);
  }

  // Cargar una app específica
  async loadApp(appName) {
    try {
      console.log(`AppLoader: Cargando app '${appName}'...`);
      
      // Construir la ruta de la app
      const appPath = `../${appName}/${appName}.js`;
      
      // Importar dinámicamente la app
      const app = await import(appPath);
      
      // Si la app tiene una función de inicialización, llamarla
      if (app.default && typeof app.default.init === 'function') {
        await app.default.init();
      }
      
      // Almacenar la app cargada
      this.loadedApps.set(appName, app);
      
      console.log(`AppLoader: App '${appName}' cargada correctamente`);
      return app;
    } catch (error) {
      console.error(`AppLoader: Error cargando app '${appName}':`, error);
      throw error;
    }
  }

  // Obtener una app cargada
  getApp(appName) {
    if (!this.loadedApps.has(appName)) {
      console.warn(`AppLoader: La app '${appName}' no está cargada`);
      return null;
    }
    
    return this.loadedApps.get(appName);
  }

  // Verificar si una app está cargada
  isAppLoaded(appName) {
    return this.loadedApps.has(appName);
  }

  // Descargar una app
  async unloadApp(appName) {
    if (!this.loadedApps.has(appName)) {
      console.warn(`AppLoader: La app '${appName}' no está cargada`);
      return false;
    }
    
    try {
      const app = this.loadedApps.get(appName);
      
      // Si la app tiene una función de destrucción, llamarla
      if (app.default && typeof app.default.destroy === 'function') {
        await app.default.destroy();
      }
      
      // Eliminar la app del mapa
      this.loadedApps.delete(appName);
      
      console.log(`AppLoader: App '${appName}' descargada correctamente`);
      return true;
    } catch (error) {
      console.error(`AppLoader: Error descargando app '${appName}':`, error);
      return false;
    }
  }

  // Recargar una app
  async reloadApp(appName) {
    console.log(`AppLoader: Recargando app '${appName}'...`);
    
    // Descargar la app si está cargada
    if (this.loadedApps.has(appName)) {
      await this.unloadApp(appName);
    }
    
    // Cargar la app nuevamente
    await this.loadAppWithDependencies(appName);
    
    console.log(`AppLoader: App '${appName}' recargada correctamente`);
  }

  // Obtener todas las apps cargadas
  getLoadedApps() {
    return Array.from(this.loadedApps.keys());
  }

  // Obtener la configuración de una app
  getAppConfig(appName) {
    return this.appConfigs.get(appName);
  }

  // Verificar si una app está habilitada en la configuración
  isAppEnabled(appName) {
    const config = this.appConfigs.get(appName);
    return config && config.enabled;
  }

  // Obtener todas las apps habilitadas
  getEnabledApps() {
    return Array.from(this.appConfigs.entries())
      .filter(([_, config]) => config.enabled)
      .map(([name, _]) => name);
  }

  // Obtener las dependencias de una app
  getAppDependencies(appName) {
    const config = this.appConfigs.get(appName);
    return config ? config.dependencies || [] : [];
  }

  // Verificar si todas las dependencias de una app están cargadas
  areDependenciesLoaded(appName) {
    const dependencies = this.getAppDependencies(appName);
    return dependencies.every(dep => this.isAppLoaded(dep));
  }

  // Obtener el estado de carga de todas las apps
  getAppsStatus() {
    const status = {};
    
    for (const [appName, config] of this.appConfigs.entries()) {
      status[appName] = {
        enabled: config.enabled,
        loaded: this.isAppLoaded(appName),
        dependencies: config.dependencies || [],
        dependenciesLoaded: this.areDependenciesLoaded(appName)
      };
    }
    
    return status;
  }
}
