/*
 * Mizu OS - Settings App
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
export default class SettingsApp {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.appContainer = null;
    this.isActive = false;
  }
  
  // Método init requerido por el AppLoader
  init() {
    console.log('SettingsApp: Inicializando aplicación de configuración');
    return Promise.resolve();
  }
  
  // Método render requerido por el AppLoader
  render() {
    console.log('SettingsApp: Renderizando interfaz de configuración');
    
    // Crear contenedor principal
    this.appContainer = document.createElement('div');
    this.appContainer.className = 'settings-app-container';
    this.appContainer.style.cssText = `
      width: 100%;
      height: 100%;
      position: relative;
      background-color: rgba(26, 26, 26, 0.8);
      border-radius: 8px;
      overflow-y: auto;
      color: white;
    `;
    
    // Crear contenido
    const content = document.createElement('div');
    content.style.cssText = 'padding: 20px;';
    
    // Título
    const title = document.createElement('h2');
    title.textContent = '⚙️ Configuración del Sistema';
    title.style.cssText = 'color: #bb86fc; margin-bottom: 20px;';
    
    // Sección de información del sistema
    const infoSection = this.createSection('Información del Sistema');
    
    const versionInfo = this.createInfoItem('Versión:', window.MIZU_VERSION || '3.0.0');
    const archInfo = this.createInfoItem('Arquitectura:', 'Híbrida Descentralizada');
    const licenseInfo = this.createInfoItem('Licencia:', 'GNU AGPL-3.0');
    
    infoSection.appendChild(versionInfo);
    infoSection.appendChild(archInfo);
    infoSection.appendChild(licenseInfo);
    
    // Sección de apariencia
    const appearanceSection = this.createSection('Apariencia');
    
    const themeSelector = this.createThemeSelector();
    const opacitySlider = this.createSlider('Opacidad de barras:', 0, 100, 80);
    
    appearanceSection.appendChild(themeSelector);
    appearanceSection.appendChild(opacitySlider);
    
    // Sección de holograma
    const hologramSection = this.createSection('Holograma');
    
    const speedSlider = this.createSlider('Velocidad de rotación:', 5, 60, 20);
    const showHologram = this.createCheckbox('Mostrar holograma', true);
    
    hologramSection.appendChild(speedSlider);
    hologramSection.appendChild(showHologram);
    
    // Sección de aplicaciones
    const appsSection = this.createSection('Aplicaciones');
    
    const appsLabel = document.createElement('p');
    appsLabel.textContent = 'Aplicaciones disponibles:';
    appsLabel.style.cssText = 'color: #e0e0e0; margin-bottom: 10px;';
    
    const appsGrid = this.createAppsGrid();
    
    appsSection.appendChild(appsLabel);
    appsSection.appendChild(appsGrid);
    
    // Ensamblar todo
    content.appendChild(title);
    content.appendChild(infoSection);
    content.appendChild(appearanceSection);
    content.appendChild(hologramSection);
    content.appendChild(appsSection);
    
    this.appContainer.appendChild(content);
    
    // Adjuntar eventos
    this.attachEvents();
    
    return this.appContainer;
  }
  
  // Método destroy requerido por el AppLoader
  destroy() {
    console.log('SettingsApp: Destruyendo aplicación de configuración');
    if (this.appContainer && this.appContainer.parentNode) {
      this.appContainer.parentNode.removeChild(this.appContainer);
    }
  }
  
  // Crear una sección con estilo
  createSection(title) {
    const section = document.createElement('div');
    section.style.cssText = `
      background: rgba(187, 134, 252, 0.1);
      border: 1px solid #bb86fc;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    `;
    
    const heading = document.createElement('h3');
    heading.textContent = title;
    heading.style.cssText = 'color: #bb86fc; margin-bottom: 15px;';
    
    section.appendChild(heading);
    return section;
  }
  
  // Crear un elemento de información
  createInfoItem(label, value) {
    const item = document.createElement('p');
    item.style.cssText = 'color: #e0e0e0; margin: 5px 0;';
    
    const strong = document.createElement('strong');
    strong.textContent = label;
    
    item.appendChild(strong);
    item.appendChild(document.createTextNode(value));
    
    return item;
  }
  
  // Crear selector de tema
  createThemeSelector() {
    const container = document.createElement('div');
    container.style.cssText = 'margin-bottom: 15px;';
    
    const label = document.createElement('label');
    label.textContent = 'Tema:';
    label.style.cssText = 'color: #e0e0e0; display: block; margin-bottom: 5px;';
    
    const select = document.createElement('select');
    select.style.cssText = `
      background: rgba(58, 58, 58, 0.7);
      border: 1px solid rgba(68, 68, 68, 0.7);
      border-radius: 4px;
      color: #fff;
      padding: 8px 12px;
      width: 100%;
    `;
    
    const darkOption = document.createElement('option');
    darkOption.textContent = 'Oscuro';
    
    const lightOption = document.createElement('option');
    lightOption.textContent = 'Claro';
    
    const autoOption = document.createElement('option');
    autoOption.textContent = 'Automático';
    
    select.appendChild(darkOption);
    select.appendChild(lightOption);
    select.appendChild(autoOption);
    
    container.appendChild(label);
    container.appendChild(select);
    
    return container;
  }
  
  // Crear slider
  createSlider(label, min, max, value) {
    const container = document.createElement('div');
    container.style.cssText = 'margin-bottom: 15px;';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.style.cssText = 'color: #e0e0e0; display: block; margin-bottom: 5px;';
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = min;
    slider.max = max;
    slider.value = value;
    slider.style.cssText = 'width: 100%;';
    
    container.appendChild(labelElement);
    container.appendChild(slider);
    
    return container;
  }
  
  // Crear checkbox
  createCheckbox(label, checked) {
    const container = document.createElement('div');
    container.style.cssText = 'margin-bottom: 15px;';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.style.cssText = 'color: #e0e0e0; display: flex; align-items: center; gap: 10px;';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checked;
    
    labelElement.appendChild(checkbox);
    container.appendChild(labelElement);
    
    return container;
  }
  
  // Crear cuadrícula de aplicaciones
  createAppsGrid() {
    const grid = document.createElement('div');
    grid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
    `;
    
    const apps = [
      { icon: '📊', name: 'Diagramas' },
      { icon: '📝', name: 'Editor' },
      { icon: '🎵', name: 'Música' },
      { icon: '📊', name: 'Hoja de Cálculo' }
    ];
    
    apps.forEach(app => {
      const appCard = document.createElement('div');
      appCard.style.cssText = `
        background: rgba(58, 58, 58, 0.7);
        border-radius: 4px;
        padding: 10px;
        text-align: center;
      `;
      
      const icon = document.createElement('div');
      icon.textContent = app.icon;
      icon.style.cssText = 'font-size: 24px; margin-bottom: 5px;';
      
      const name = document.createElement('div');
      name.textContent = app.name;
      name.style.cssText = 'color: #e0e0e0;';
      
      appCard.appendChild(icon);
      appCard.appendChild(name);
      grid.appendChild(appCard);
    });
    
    return grid;
  }
  
  // Adjuntar eventos a los elementos
  attachEvents() {
    // Eventos para el selector de tema
    const themeSelect = this.appContainer.querySelector('select');
    if (themeSelect) {
      themeSelect.addEventListener('change', (e) => {
        this.saveSetting('theme', e.target.value);
        this.showNotification(`Tema cambiado a: ${e.target.value}`);
      });
    }
    
    // Eventos para el slider de opacidad
    const opacitySlider = this.appContainer.querySelectorAll('input[type="range"]')[0];
    if (opacitySlider) {
      opacitySlider.addEventListener('input', (e) => {
        this.saveSetting('opacity', e.target.value);
      });
    }
    
    // Eventos para el slider de velocidad
    const speedSlider = this.appContainer.querySelectorAll('input[type="range"]')[1];
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        this.saveSetting('hologramSpeed', e.target.value);
      });
    }
    
    // Eventos para el checkbox de holograma
    const hologramCheckbox = this.appContainer.querySelector('input[type="checkbox"]');
    if (hologramCheckbox) {
      hologramCheckbox.addEventListener('change', (e) => {
        this.saveSetting('showHologram', e.target.checked);
        this.showNotification(`Holograma ${e.target.checked ? 'activado' : 'desactivado'}`);
      });
    }
  }
  
  // Guardar configuración
  saveSetting(key, value) {
    try {
      let settings = JSON.parse(localStorage.getItem('mizu-settings') || '{}');
      settings[key] = value;
      localStorage.setItem('mizu-settings', JSON.stringify(settings));
      console.log(`SettingsApp: Configuración guardada - ${key}: ${value}`);
    } catch (error) {
      console.error('SettingsApp: Error al guardar configuración:', error);
    }
  }
  
  // Mostrar notificación
  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'config-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}
