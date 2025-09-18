/*
 * Mizu OS - App Container Manager Module
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
 * Gestor de contenedores de aplicaciones para Mizu OS
 * Maneja la creación y gestión de contenedores para aplicaciones principales y persistentes
 * // apps/core/modules/app-container-manager.js
 */
export default class AppContainerManager {
  constructor() {
    this.mainContainer = null;
    this.persistentContainer = null;
    
    console.log('[DEBUG] AppContainerManager: Constructor llamado');
  }
  
  /**
   * Inicializa el gestor de contenedores
   */
  init() {
    console.log('AppContainerManager: Inicializando gestor de contenedores');
    
    // Asegurarse de que ambos contenedores existan
    this.ensureMainContainer();
    this.ensurePersistentContainer();
    
    console.log('AppContainerManager: Gestor de contenedores inicializado correctamente');
    return true;
  }
  
  /**
   * Asegura que el contenedor principal de aplicaciones exista
   */
  ensureMainContainer() {
    console.log('[DEBUG] AppContainerManager: Verificando contenedor principal de aplicaciones');
    
    // Verificar si el contenedor ya existe
    this.mainContainer = document.getElementById('black-bar');
    console.log('[DEBUG] AppContainerManager: Contenedor principal encontrado:', !!this.mainContainer);
    
    if (!this.mainContainer) {
      console.log('AppContainerManager: Creando contenedor principal de aplicaciones');
      
      // Crear el contenedor si no existe
      this.mainContainer = document.createElement('div');
      this.mainContainer.id = 'black-bar';
      this.mainContainer.style.cssText = `
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
      document.body.appendChild(this.mainContainer);
      console.log('AppContainerManager: Contenedor principal creado correctamente');
    } else {
      console.log('AppContainerManager: Contenedor principal ya existe');
      
      // Asegurar que tenga el z-index correcto
      this.mainContainer.style.zIndex = '641';
      this.mainContainer.style.cursor = 'grab';
      
      // Eliminar cualquier black-bar duplicado
      this.removeDuplicateContainers('black-bar', this.mainContainer);
    }
    
    return this.mainContainer;
  }
  
  /**
   * Asegura que el contenedor de aplicaciones persistentes exista
   */
  ensurePersistentContainer() {
    console.log('[DEBUG] AppContainerManager: Verificando contenedor de aplicaciones persistentes');
    
    // Verificar si el contenedor ya existe
    this.persistentContainer = document.getElementById('persistent-apps-container');
    console.log('[DEBUG] AppContainerManager: Contenedor persistente encontrado:', !!this.persistentContainer);
    
    if (!this.persistentContainer) {
      console.log('AppContainerManager: Creando contenedor de aplicaciones persistentes');
      
      // Crear el contenedor si no existe
      this.persistentContainer = document.createElement('div');
      this.persistentContainer.id = 'persistent-apps-container';
      this.persistentContainer.style.cssText = `
        position: absolute;
        top: -9999px;
        left: -9999px;
        width: 1px;
        height: 1px;
        overflow: hidden;
        z-index: 1;
        visibility: hidden;
      `;
      
      // Añadir el contenedor al body
      document.body.appendChild(this.persistentContainer);
      console.log('AppContainerManager: Contenedor de aplicaciones persistentes creado correctamente');
    }
    
    return this.persistentContainer;
  }
  
  /**
   * Elimina contenedores duplicados con el mismo ID
   * @param {string} containerId - ID del contenedor
   * @param {HTMLElement} validContainer - Contenedor válido que debe mantenerse
   */
  removeDuplicateContainers(containerId, validContainer) {
    const allContainers = document.querySelectorAll(`#${containerId}`);
    if (allContainers.length > 1) {
      console.log(`AppContainerManager: Se encontraron ${allContainers.length} elementos ${containerId}, eliminando duplicados`);
      for (let i = 0; i < allContainers.length; i++) {
        if (allContainers[i] !== validContainer) {
          allContainers[i].parentNode.removeChild(allContainers[i]);
          console.log(`AppContainerManager: Elemento ${containerId} duplicado eliminado`);
        }
      }
    }
  }
  
  /**
   * Obtiene el contenedor principal de aplicaciones
   * @returns {HTMLElement} Contenedor principal
   */
  getMainContainer() {
    if (!this.mainContainer) {
      this.ensureMainContainer();
    }
    return this.mainContainer;
  }
  
  /**
   * Obtiene el contenedor de aplicaciones persistentes
   * @returns {HTMLElement} Contenedor persistente
   */
  getPersistentContainer() {
    if (!this.persistentContainer) {
      this.ensurePersistentContainer();
    }
    return this.persistentContainer;
  }
  
  /**
   * Limpia el contenedor principal
   */
  clearMainContainer() {
    const container = this.getMainContainer();
    container.innerHTML = '';
    console.log('AppContainerManager: Contenedor principal limpiado');
  }
  
  /**
   * Mueve un elemento al contenedor principal
   * @param {HTMLElement} element - Elemento a mover
   */
  moveToMainContainer(element) {
    const container = this.getMainContainer();
    container.appendChild(element);
    console.log('AppContainerManager: Elemento movido al contenedor principal');
  }
  
  /**
   * Mueve un elemento al contenedor persistente
   * @param {HTMLElement} element - Elemento a mover
   */
  moveToPersistentContainer(element) {
    const container = this.getPersistentContainer();
    container.appendChild(element);
    console.log('AppContainerManager: Elemento movido al contenedor persistente');
  }
  
  /**
   * Busca una aplicación por su ID en un contenedor específico
   * @param {string} appId - ID de la aplicación
   * @param {HTMLElement} container - Contenedor donde buscar
   * @returns {HTMLElement|null} Elemento encontrado o null
   */
  findAppElement(appId, container) {
    return container.querySelector(`[data-app-id="${appId}"]`);
  }
  
  /**
   * Busca una aplicación por su ID en el contenedor principal
   * @param {string} appId - ID de la aplicación
   * @returns {HTMLElement|null} Elemento encontrado o null
   */
  findAppInMainContainer(appId) {
    return this.findAppElement(appId, this.getMainContainer());
  }
  
  /**
   * Busca una aplicación por su ID en el contenedor persistente
   * @param {string} appId - ID de la aplicación
   * @returns {HTMLElement|null} Elemento encontrado o null
   */
  findAppInPersistentContainer(appId) {
    return this.findAppElement(appId, this.getPersistentContainer());
  }
  
  /**
   * Hace visible un elemento de aplicación
   * @param {HTMLElement} element - Elemento a hacer visible
   */
  showAppElement(element) {
    if (element) {
      element.style.display = '';
      element.style.visibility = 'visible';
      element.style.opacity = '1';
      console.log('AppContainerManager: Elemento de aplicación hecho visible');
    }
  }
  
  /**
   * Oculta un elemento de aplicación
   * @param {HTMLElement} element - Elemento a ocultar
   */
  hideAppElement(element) {
    if (element) {
      element.style.display = 'none';
      element.style.visibility = 'hidden';
      element.style.opacity = '0';
      console.log('AppContainerManager: Elemento de aplicación ocultado');
    }
  }
  
  /**
   * Actualiza los estilos del contenedor principal según el modo del sistema
   * @param {string} mode - Modo del sistema (tv-mode, low-power-mode, etc.)
   */
  updateContainerStyles(mode) {
    const container = this.getMainContainer();
    
    switch (mode) {
      case 'tv-mode':
        container.style.padding = '2rem';
        container.style.gap = '1rem';
        break;
        
      case 'low-power-mode':
        container.style.transition = 'none';
        container.style.backgroundColor = 'hsla(0, 0%, 0%, 0.1)';
        break;
        
      default:
        // Restaurar estilos por defecto
        container.style.padding = '1rem';
        container.style.gap = '0.5rem';
        container.style.transition = 'top 0.5s ease, left 0.5s ease, right 0.5s ease, bottom 0.5s ease';
        container.style.backgroundColor = 'hsla(0, 0%, 0%, 0.2)';
        break;
    }
    
    console.log(`AppContainerManager: Estilos del contenedor actualizados para modo: ${mode}`);
  }
}
