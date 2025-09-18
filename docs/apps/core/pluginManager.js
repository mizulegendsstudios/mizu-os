/*
 * Mizu OS - Core/PluginManager
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
 * Interfaz que deben implementar todos los plugins
 * docs/apps/core/pluginManager.js
 */
export class PluginInterface {
  constructor() {
    if (new.target === PluginInterface) {
      throw new TypeError("No se puede instanciar la interfaz PluginInterface directamente");
    }
  }
  
  // Método de inicialización
  async init() {
    throw new Error("El método init() debe ser implementado por el plugin");
  }
  
  // Método de destrucción
  async destroy() {
    throw new Error("El método destroy() debe ser implementado por el plugin");
  }
  
  // Obtener información del plugin
  getInfo() {
    throw new Error("El método getInfo() debe ser implementado por el plugin");
  }
}

/**
 * Gestor de plugins del sistema
 */
export class PluginManager {
  constructor() {
    this.plugins = new Map();
    this.loadedPlugins = new Map(); // Almacenar instancias de plugins cargados
    console.log('PluginManager: Inicializado');
  }
  
  // Registrar un plugin
  register(pluginId, pluginClass) {
    if (!(pluginClass.prototype instanceof PluginInterface)) {
      throw new Error(`El plugin '${pluginId}' debe implementar la interfaz PluginInterface`);
    }
    
    this.plugins.set(pluginId, pluginClass);
    console.log(`PluginManager: Plugin '${pluginId}' registrado`);
  }
  
  // Cargar un plugin
  async load(pluginId) {
    if (!this.plugins.has(pluginId)) {
      throw new Error(`Plugin '${pluginId}' no registrado`);
    }
    
    if (this.loadedPlugins.has(pluginId)) {
      console.log(`PluginManager: Plugin '${pluginId}' ya está cargado`);
      return this.loadedPlugins.get(pluginId);
    }
    
    const PluginClass = this.plugins.get(pluginId);
    const pluginInstance = new PluginClass();
    
    await pluginInstance.init();
    
    this.loadedPlugins.set(pluginId, pluginInstance);
    console.log(`PluginManager: Plugin '${pluginId}' cargado correctamente`);
    
    return pluginInstance;
  }
  
  // Descargar un plugin
  async unload(pluginId) {
    if (!this.loadedPlugins.has(pluginId)) {
      console.log(`PluginManager: Plugin '${pluginId}' no está cargado`);
      return;
    }
    
    const pluginInstance = this.loadedPlugins.get(pluginId);
    
    if (pluginInstance && typeof pluginInstance.destroy === 'function') {
      await pluginInstance.destroy();
    }
    
    this.loadedPlugins.delete(pluginId);
    console.log(`PluginManager: Plugin '${pluginId}' descargado correctamente`);
  }
  
  // Obtener instancia de un plugin
  getPlugin(pluginId) {
    return this.loadedPlugins.get(pluginId);
  }
  
  // Verificar si un plugin está cargado
  isLoaded(pluginId) {
    return this.loadedPlugins.has(pluginId);
  }
  
  // Obtener lista de plugins cargados
  getLoadedPlugins() {
    return Array.from(this.loadedPlugins.keys());
  }
}
