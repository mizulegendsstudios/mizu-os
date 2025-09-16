/*
 * Mizu OS - System UI Module
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
 * Sistema de interfaz de usuario para Mizu OS
 * Gestiona la creación y manipulación de elementos de la interfaz
 */
// apps/core/modules/system-ui.js
export default class SystemUI {
  constructor(eventBus, statusWidget) {
    this.eventBus = eventBus;
    this.statusWidget = statusWidget;
    this.elements = {};
  }

  init() {
    console.log('SystemUI: Inicializando interfaz de usuario');
    
    // Crear elementos de la interfaz
    this.createRedBar();
    this.createBlueBar();
    this.createYellowSquare();
    this.createBlackBar();
    
    console.log('SystemUI: Interfaz de usuario inicializada correctamente');
    return true;
  }

  createRedBar() {
    console.log('SystemUI: Creando barra roja');
    
    const redBar = document.createElement('div');
    redBar.id = 'red-bar';
    
    // Añadir controles de música
    const musicControls = this.statusWidget.createMusicControls();
    redBar.appendChild(musicControls);
    
    // Añadir widgets de estado
    const statusWidgets = this.statusWidget.createAllWidgets();
    redBar.appendChild(statusWidgets);
    
    // Guardar referencia al elemento
    this.elements.redBar = redBar;
    
    // Añadir al body
    document.body.appendChild(redBar);
    
    console.log('SystemUI: Barra roja creada correctamente');
  }

  createBlueBar() {
    console.log('SystemUI: Creando barra azul');
    
    const blueBar = document.createElement('div');
    blueBar.id = 'blue-bar';
    
    // Crear botón para la aplicación de música
    const musicAppButton = this.createAppButton('music', 'Música', 'fa-music');
    blueBar.appendChild(musicAppButton);
    
    // Crear botón para la aplicación de diagram
    const diagramAppButton = this.createAppButton('diagram', 'Diagrama', 'fa-project-diagram');
    blueBar.appendChild(diagramAppButton);
    
    // Crear botón para la aplicación de editor
    const editorAppButton = this.createAppButton('editor', 'Editor', 'fa-edit');
    blueBar.appendChild(editorAppButton);
    
    // Crear botón para la aplicación de settings
    const settingsAppButton = this.createAppButton('settings', 'Configuración', 'fa-cog');
    blueBar.appendChild(settingsAppButton);
    
    // Crear botón para la aplicación de spreadsheet
    const spreadsheetAppButton = this.createAppButton('spreadsheet', 'Hoja de cálculo', 'fa-table');
    blueBar.appendChild(spreadsheetAppButton);
    
    // Guardar referencia al elemento
    this.elements.blueBar = blueBar;
    
    // Añadir al body
    document.body.appendChild(blueBar);
    
    console.log('SystemUI: Barra azul creada correctamente');
  }

  createAppButton(appId, title, iconClass) {
    console.log(`SystemUI: Creando botón para aplicación ${appId}`);
    
    const button = document.createElement('button');
    button.className = 'app-button';
    button.title = title;
    button.dataset.appId = appId;
    
    const icon = document.createElement('i');
    icon.className = `fas ${iconClass}`;
    
    button.appendChild(icon);
    
    // Añadir evento de clic para activar la aplicación
    button.addEventListener('click', () => {
      console.log(`[DEBUG] Botón de aplicación ${appId} presionado`);
      console.log(`[DEBUG] EventBus disponible:`, !!this.eventBus);
      console.log(`[DEBUG] Tipo de EventBus:`, typeof this.eventBus);
      
      // Verificar que el EventBus esté disponible
      if (this.eventBus) {
        console.log(`[DEBUG] Preparando para emitir evento app:activate para ${appId}`);
        const eventData = { appId };
        console.log(`[DEBUG] Datos del evento:`, eventData);
        
        try {
          this.eventBus.emit('app:activate', eventData);
          console.log(`[DEBUG] Evento app:activate emitido correctamente para ${appId}`);
        } catch (error) {
          console.error(`[ERROR] Error al emitir evento:`, error);
        }
      } else {
        console.error('[ERROR] EventBus no disponible en SystemUI');
        console.log('[DEBUG] window.MizuOS:', window.MizuOS);
        console.log('[DEBUG] window.MizuOS.eventBus:', window.MizuOS ? window.MizuOS.eventBus : 'undefined');
      }
    });
    
    console.log(`[DEBUG] Botón para aplicación ${appId} creado correctamente`);
    return button;
  }

  createYellowSquare() {
    console.log('SystemUI: Creando cuadrado amarillo');
    
    const yellowSquare = document.createElement('div');
    yellowSquare.id = 'yellow-square';
    
    const cube = document.createElement('div');
    cube.id = 'cube';
    
    const hologram = document.createElement('div');
    hologram.id = 'hologram';
    
    cube.appendChild(hologram);
    yellowSquare.appendChild(cube);
    
    // Guardar referencia al elemento
    this.elements.yellowSquare = yellowSquare;
    
    // Añadir al body
    document.body.appendChild(yellowSquare);
    
    console.log('SystemUI: Cuadrado amarillo creado correctamente');
  }

  createBlackBar() {
    console.log('SystemUI: Creando barra negra');
    
    const blackBar = document.createElement('div');
    blackBar.id = 'black-bar';
    
    // Guardar referencia al elemento
    this.elements.blackBar = blackBar;
    
    // Añadir al body
    document.body.appendChild(blackBar);
    
    console.log('SystemUI: Barra negra creada correctamente');
  }

  // Método para obtener referencias a los elementos de la interfaz
  getElement(elementId) {
    return this.elements[elementId];
  }
}
