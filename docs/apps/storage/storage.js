/*
 * Mizu OS - Modules/Storage
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
 * Módulo de almacenamiento de Mizu OS
 * Responsable de gestionar el almacenamiento local de datos
 * // docs/apps/core/modules/storage/storage.js
 * Rol: Gestión de almacenamiento local
 * Filosofía: Proporcionar una API unificada para diferentes tipos de almacenamiento
 *Principios:
 *Cloud-Native: Ejecución 100% en navegador (GitHub Pages + jsDelivr) — sin build, sin bundlers, sin node_modules, sin servidores locales.
 *Extensible por diseño: cada app es un módulo independiente con su propio bootstrap.
 *Licencia libre: GNU AGPL-3.0 — cualquier modificación públicada en la red debe compartirse la fuente.
 *Stack Tecnológico/Zero Dependencies: ES6+ JavaScript vainilla (módulos nativos), CSS3 con Custom Properties, HTML5 APIs (Canvas, WebAudio, etc.). Sin frameworks, sin Tailwind.
*/

export default {
  name: 'StorageModule',
  version: '1.0.0',
  
  async init() {
    console.log('StorageModule: Inicializando módulo de almacenamiento...');
    
    // Verificar disponibilidad de diferentes tipos de almacenamiento
    this.checkStorageAvailability();
    
    // Inicializar base de datos IndexedDB si está disponible
    if (this.storageTypes.indexedDB) {
      await this.initIndexedDB();
    }
    
    console.log('StorageModule: Módulo de almacenamiento inicializado correctamente');
  },
  
  storageTypes: {
    localStorage: false,
    sessionStorage: false,
    indexedDB: false
  },
  
  db: null,
  dbName: 'MizuOS_DB',
  dbVersion: 1,
  
  checkStorageAvailability() {
    console.log('StorageModule: Verificando disponibilidad de almacenamiento...');
    
    // Verificar localStorage
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      this.storageTypes.localStorage = true;
      console.log('StorageModule: localStorage disponible');
    } catch (e) {
      console.warn('StorageModule: localStorage no disponible:', e);
    }
    
    // Verificar sessionStorage
    try {
      sessionStorage.setItem('test', 'test');
      sessionStorage.removeItem('test');
      this.storageTypes.sessionStorage = true;
      console.log('StorageModule: sessionStorage disponible');
    } catch (e) {
      console.warn('StorageModule: sessionStorage no disponible:', e);
    }
    
    // Verificar IndexedDB
    if ('indexedDB' in window) {
      this.storageTypes.indexedDB = true;
      console.log('StorageModule: IndexedDB disponible');
    } else {
      console.warn('StorageModule: IndexedDB no disponible');
    }
    
    // Actualizar UI con información de almacenamiento
    this.updateStorageInfo();
  },
  
  async initIndexedDB() {
    console.log('StorageModule: Inicializando IndexedDB...');
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = (event) => {
        console.error('StorageModule: Error al abrir IndexedDB:', event.target.error);
        reject(event.target.error);
      };
      
      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('StorageModule: IndexedDB inicializada correctamente');
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Crear almacenes de objetos necesarios
        if (!db.objectStoreNames.contains('settings')) {
          const settingsStore = db.createObjectStore('settings', { keyPath: 'key' });
          console.log('StorageModule: Almacén de objetos "settings" creado');
        }
        
        if (!db.objectStoreNames.contains('cache')) {
          const cacheStore = db.createObjectStore('cache', { keyPath: 'id', autoIncrement: true });
          console.log('StorageModule: Almacén de objetos "cache" creado');
        }
      };
    });
  },
  
  // Métodos para localStorage
  setLocalStorage(key, value) {
    if (!this.storageTypes.localStorage) {
      console.error('StorageModule: localStorage no disponible');
      return false;
    }
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
      console.log(`StorageModule: Guardado en localStorage: ${key}`);
      return true;
    } catch (e) {
      console.error(`StorageModule: Error al guardar en localStorage (${key}):`, e);
      return false;
    }
  },
  
  getLocalStorage(key) {
    if (!this.storageTypes.localStorage) {
      console.error('StorageModule: localStorage no disponible');
      return null;
    }
    
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.error(`StorageModule: Error al leer de localStorage (${key}):`, e);
      return null;
    }
  },
  
  removeLocalStorage(key) {
    if (!this.storageTypes.localStorage) {
      console.error('StorageModule: localStorage no disponible');
      return false;
    }
    
    try {
      localStorage.removeItem(key);
      console.log(`StorageModule: Eliminado de localStorage: ${key}`);
      return true;
    } catch (e) {
      console.error(`StorageModule: Error al eliminar de localStorage (${key}):`, e);
      return false;
    }
  },
  
  // Métodos para IndexedDB
  async saveToIndexedDB(storeName, data) {
    if (!this.storageTypes.indexedDB || !this.db) {
      console.error('StorageModule: IndexedDB no disponible');
      return false;
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onsuccess = () => {
        console.log(`StorageModule: Guardado en IndexedDB (${storeName}):`, data);
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error(`StorageModule: Error al guardar en IndexedDB (${storeName}):`, event.target.error);
        reject(event.target.error);
      };
    });
  },
  
  async getFromIndexedDB(storeName, key) {
    if (!this.storageTypes.indexedDB || !this.db) {
      console.error('StorageModule: IndexedDB no disponible');
      return null;
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onsuccess = (event) => {
        console.log(`StorageModule: Leído de IndexedDB (${storeName}):`, key);
        resolve(event.target.result);
      };
      
      request.onerror = (event) => {
        console.error(`StorageModule: Error al leer de IndexedDB (${storeName}):`, event.target.error);
        reject(event.target.error);
      };
    });
  },
  
  updateStorageInfo() {
    // Actualizar información de almacenamiento en la UI
    const storageUsedEl = document.getElementById('storage-used');
    const storageAvailableEl = document.getElementById('storage-available');
    
    if (storageUsedEl && storageAvailableEl) {
      if (this.storageTypes.localStorage) {
        // Calcular espacio usado (aproximado)
        let totalSize = 0;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          const value = localStorage.getItem(key);
          totalSize += key.length + value.length;
        }
        
        storageUsedEl.textContent = `${(totalSize / 1024).toFixed(2)} KB`;
        storageAvailableEl.textContent = `${((5120 - totalSize / 1024)).toFixed(2)} KB`; // Asumiendo 5MB límite
      } else {
        storageUsedEl.textContent = 'No disponible';
        storageAvailableEl.textContent = 'No disponible';
      }
    }
  },
  
  async destroy() {
    console.log('StorageModule: Destruyendo módulo de almacenamiento...');
    
    // Cerrar conexión a IndexedDB si está abierta
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log('StorageModule: Conexión a IndexedDB cerrada');
    }
    
    console.log('StorageModule: Módulo de almacenamiento destruido');
  }
};
