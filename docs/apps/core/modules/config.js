//docs/apps/core/modules/config.js
/*
 * Mizu OS - Config Module
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
 * Sistema de configuración para Mizu OS
 * Gestiona la configuración del sistema y de las aplicaciones
 */
class SystemConfig {
  constructor() {
    this.config = {};
    this.defaults = {};
    this.storageKey = 'mizu_os_config';
    this.version = '1.0.0';
    this.isLoaded = false;
  }

  /**
   * Inicializa el sistema de configuración
   */
  async init() {
    try {
      // Definir valores por defecto
      this.setDefaults();
      
      // Cargar configuración guardada
      await this.load();
      
      this.isLoaded = true;
      console.log('Sistema de configuración inicializado');
    } catch (error) {
      console.error('Error al inicializar configuración:', error);
      this.loadDefaults();
    }
  }

  /**
   * Define los valores por defecto de la configuración
   */
  setDefaults() {
    this.defaults = {
      version: this.version,
      system: {
        theme: 'dark',
        language: 'es',
        animations: true,
        debug: false,
        autoSave: true,
        autoSaveInterval: 30000, // 30 segundos
        showTooltips: true,
        confirmExit: true
      },
      ui: {
        showSystemBars: true,
        showHologram: true,
        showBattery: true,
        showWiFi: true,
        showVolume: true,
        showClock: true,
        barOpacity: 0.8,
        fontSize: 14,
        fontFamily: 'Segoe UI'
      },
      apps: {
        defaultApp: 'diagram',
        rememberLastApp: true,
        lastApp: null,
        appSettings: {} // Configuración específica por app
      },
      hologram: {
        rotationSpeed: 20,
        size: 40,
        opacity: 0.8,
        color: '#bb86fc'
      },
      editor: {
        theme: 'vs-dark',
        fontSize: 14,
        wordWrap: true,
        lineNumbers: true,
        minimap: false,
        autoSave: true
      },
      spreadsheet: {
        autoSave: true,
        autoCalculate: true,
        showGrid: true,
        showHeaders: true,
        defaultColumnWidth: 100,
        defaultRowHeight: 25
      }
    };
  }

  /**
   * Carga la configuración desde el almacenamiento local
   */
  async load() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        this.loadDefaults();
        return;
      }

      const parsed = JSON.parse(stored);
      
      // Verificar versión de la configuración
      if (parsed.version !== this.version) {
        console.log('Migrando configuración a nueva versión');
        this.migrateConfig(parsed);
      }
      
      // Fusionar con valores por defecto
      this.config = this.mergeDeep(this.defaults, parsed);
      
      console.log('Configuración cargada correctamente');
    } catch (error) {
      console.error('Error al cargar configuración:', error);
      this.loadDefaults();
    }
  }

  /**
   * Guarda la configuración en el almacenamiento local
   */
  async save() {
    try {
      const toSave = {
        version: this.version,
        ...this.config
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(toSave));
      
      // Notificar al sistema que la configuración cambió
      if (window.eventBus) {
        window.eventBus.emit('config:changed', { config: this.config });
      }
      
      console.log('Configuración guardada correctamente');
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      throw error;
    }
  }

  /**
   * Carga los valores por defecto
   */
  loadDefaults() {
    this.config = JSON.parse(JSON.stringify(this.defaults));
    
    if (window.eventBus) {
      window.eventBus.emit('config:reset', { config: this.config });
    }
  }

  /**
   * Obtiene un valor de configuración
   * @param {string} key - Clave de configuración (soporta notación de puntos, ej: 'system.theme')
   * @returns {*} Valor de configuración
   */
  get(key) {
    if (!key) return this.config;
    
    const keys = key.split('.');
    let value = this.config;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return undefined;
      }
    }
    
    return value;
  }

  /**
   * Establece un valor de configuración
   * @param {string} key - Clave de configuración (soporta notación de puntos)
   * @param {*} value - Valor a establecer
   * @param {boolean} [autoSave=true] - Si se debe guardar automáticamente
   */
  async set(key, value, autoSave = true) {
    if (!key) return;
    
    const keys = key.split('.');
    const lastKey = keys.pop();
    let target = this.config;
    
    // Navegar hasta el objeto padre
    for (const k of keys) {
      if (!(k in target) || typeof target[k] !== 'object') {
        target[k] = {};
      }
      target = target[k];
    }
    
    // Establecer el valor
    target[lastKey] = value;
    
    // Notificar cambio específico
    if (window.eventBus) {
      window.eventBus.emit('config:changed', { key, value });
    }
    
    // Guardar automáticamente
    if (autoSave) {
      await this.save();
    }
  }

  /**
   * Elimina una clave de configuración
   * @param {string} key - Clave a eliminar
   * @param {boolean} [autoSave=true] - Si se debe guardar automáticamente
   */
  async delete(key, autoSave = true) {
    if (!key) return;
    
    const keys = key.split('.');
    const lastKey = keys.pop();
    let target = this.config;
    
    // Navegar hasta el objeto padre
    for (const k of keys) {
      if (!(k in target) || typeof target[k] !== 'object') {
        return;
      }
      target = target[k];
    }
    
    // Eliminar la clave
    delete target[lastKey];
    
    // Notificar eliminación
    if (window.eventBus) {
      window.eventBus.emit('config:deleted', { key });
    }
    
    // Guardar automáticamente
    if (autoSave) {
      await this.save();
    }
  }

  /**
   * Restablece la configuración a los valores por defecto
   * @param {boolean} [save=true] - Si se debe guardar después de restablecer
   */
  async reset(save = true) {
    this.loadDefaults();
    
    if (save) {
      await this.save();
    }
  }

  /**
   * Obtiene la configuración de una aplicación específica
   * @param {string} appName - Nombre de la aplicación
   * @returns {Object} Configuración de la aplicación
   */
  getAppConfig(appName) {
    const appSettings = this.get('apps.appSettings') || {};
    return appSettings[appName] || {};
  }

  /**
   * Establece la configuración de una aplicación específica
   * @param {string} appName - Nombre de la aplicación
   * @param {Object} config - Configuración de la aplicación
   * @param {boolean} [autoSave=true] - Si se debe guardar automáticamente
   */
  async setAppConfig(appName, config, autoSave = true) {
    const appSettings = this.get('apps.appSettings') || {};
    appSettings[appName] = { ...appSettings[appName], ...config };
    
    await this.set('apps.appSettings', appSettings, autoSave);
  }

  /**
   * Fusiona dos objetos profundamente
   * @param {Object} target - Objeto destino
   * @param {Object} source - Objeto fuente
   * @returns {Object} Objeto fusionado
   * @private
   */
  mergeDeep(target, source) {
    const output = Object.assign({}, target);
    
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this.mergeDeep(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    
    return output;
  }

  /**
   * Verifica si un valor es un objeto
   * @param {*} item - Valor a verificar
   * @returns {boolean} True si es un objeto
   * @private
   */
  isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  /**
   * Migra la configuración a una nueva versión
   * @param {Object} oldConfig - Configuración antigua
   * @private
   */
  migrateConfig(oldConfig) {
    // Implementar migraciones según sea necesario
    // Por ejemplo, si cambiamos la estructura de la configuración
    
    console.log('Migrando configuración de versión', oldConfig.version, 'a', this.version);
    
    // Ejemplo de migración:
    if (oldConfig.version === '0.9.0') {
      // Migrar configuración específica de la versión 0.9.0
      if (oldConfig.theme) {
        oldConfig.system = oldConfig.system || {};
        oldConfig.system.theme = oldConfig.theme;
        delete oldConfig.theme;
      }
    }
    
    // Actualizar versión
    oldConfig.version = this.version;
  }

  /**
   * Exporta la configuración a un archivo JSON
   */
  exportConfig() {
    const dataStr = JSON.stringify(this.config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `mizu-os-config-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  /**
   * Importa configuración desde un archivo JSON
   * @param {File} file - Archivo de configuración
   * @returns {Promise<void>}
   */
  async importConfig(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          
          // Validar estructura básica
          if (!imported || typeof imported !== 'object') {
            throw new Error('Formato de configuración inválido');
          }
          
          // Fusionar con configuración actual
          this.config = this.mergeDeep(this.config, imported);
          
          // Guardar
          await this.save();
          
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };
      
      reader.readAsText(file);
    });
  }

  /**
   * Obtiene estadísticas de uso de la configuración
   * @returns {Object} Estadísticas
   */
  getStats() {
    return {
      version: this.version,
      isLoaded: this.isLoaded,
      storageSize: new Blob([localStorage.getItem(this.storageKey)]).size,
      keys: this.countKeys(this.config)
    };
  }

  /**
   * Cuenta las claves en un objeto
   * @param {Object} obj - Objeto a contar
   * @returns {number} Número de claves
   * @private
   */
  countKeys(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return 0;
    }
    
    return Object.keys(obj).reduce((count, key) => {
      return count + 1 + this.countKeys(obj[key]);
    }, 0);
  }
}

// Exportar la clase
export { SystemConfig };

// Crear instancia global si no existe
if (typeof window !== 'undefined' && !window.systemConfig) {
  window.systemConfig = new SystemConfig();
}
