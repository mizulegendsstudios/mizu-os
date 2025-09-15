// apps/settings/appcore.js
/*
 * Mizu OS - Settings App
 * Copyright (C) 2025 Mizu Legends Studios
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

class SettingsApp {
  constructor(container, manifest) {
    this.container = container;
    this.manifest = manifest;
    this.isActive = false;
    this.init();
  }

  init() {
    // Crear contenedor aislado para la app
    this.appContainer = document.createElement('div');
    this.appContainer.className = 'settings-app-container';
    this.appContainer.style.cssText = `
      width: 100%;
      height: 100%;
      position: relative;
      background-color: rgba(26, 26, 26, 0.8);
      border-radius: 8px;
      display: none;
      overflow-y: auto;
    `;
    this.container.appendChild(this.appContainer);
    
    // Crear contenido básico
    this.createContent();
    
    console.log('Settings App inicializada');
  }

  createContent() {
    const content = document.createElement('div');
    content.innerHTML = `
      <div style="padding: 20px;">
        <h2 style="color: #bb86fc; margin-bottom: 20px;">⚙️ Configuración del Sistema</h2>
        
        <div style="background: rgba(187, 134, 252, 0.1); border: 1px solid #bb86fc; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #bb86fc; margin-bottom: 15px;">Información del Sistema</h3>
          <p style="color: #e0e0e0; margin: 5px 0;"><strong>Versión:</strong> ${window.MIZU_VERSION || '3.0.0'}</p>
          <p style="color: #e0e0e0; margin: 5px 0;"><strong>Arquitectura:</strong> Híbrida Descentralizada</p>
          <p style="color: #e0e0e0; margin: 5px 0;"><strong>Licencia:</strong> GNU AGPL-3.0</p>
        </div>
        
        <div style="background: rgba(187, 134, 252, 0.1); border: 1px solid #bb86fc; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #bb86fc; margin-bottom: 15px;">Apariencia</h3>
          <div style="margin-bottom: 15px;">
            <label style="color: #e0e0e0; display: block; margin-bottom: 5px;">Tema:</label>
            <select style="background: rgba(58, 58, 58, 0.7); border: 1px solid rgba(68, 68, 68, 0.7); border-radius: 4px; color: #fff; padding: 8px 12px; width: 100%;">
              <option>Oscuro</option>
              <option>Claro</option>
              <option>Automático</option>
            </select>
          </div>
          <div style="margin-bottom: 15px;">
            <label style="color: #e0e0e0; display: block; margin-bottom: 5px;">Opacidad de barras:</label>
            <input type="range" min="0" max="100" value="80" style="width: 100%;">
          </div>
        </div>
        
        <div style="background: rgba(187, 134, 252, 0.1); border: 1px solid #bb86fc; border-radius: 8px; padding: 20px;">
          <h3 style="color: #bb86fc; margin-bottom: 15px;">Holograma</h3>
          <div style="margin-bottom: 15px;">
            <label style="color: #e0e0e0; display: block; margin-bottom: 5px;">Velocidad de rotación:</label>
            <input type="range" min="5" max="60" value="20" style="width: 100%;">
          </div>
          <div style="margin-bottom: 15px;">
            <label style="color: #e0e0e0; display: flex; align-items: center; gap: 10px;">
              <input type="checkbox" checked> Mostrar holograma
            </label>
          </div>
        </div>
        
        <div style="background: rgba(187, 134, 252, 0.1); border: 1px solid #bb86fc; border-radius: 8px; padding: 20px;">
          <h3 style="color: #bb86fc; margin-bottom: 15px;">Aplicaciones</h3>
          <p style="color: #e0e0e0; margin-bottom: 10px;">Aplicaciones disponibles:</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
            <div style="background: rgba(58, 58, 58, 0.7); border-radius: 4px; padding: 10px; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 5px;">📊</div>
              <div style="color: #e0e0e0;">Diagramas</div>
            </div>
            <div style="background: rgba(58, 58, 58, 0.7); border-radius: 4px; padding: 10px; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 5px;">📝</div>
              <div style="color: #e0e0e0;">Editor</div>
            </div>
            <div style="background: rgba(58, 58, 58, 0.7); border-radius: 4px; padding: 10px; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 5px;">🎵</div>
              <div style="color: #e0e0e0;">Música</div>
            </div>
            <div style="background: rgba(58, 58, 58, 0.7); border-radius: 4px; padding: 10px; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 5px;">📊</div>
              <div style="color: #e0e0e0;">Hoja de Cálculo</div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.appContainer.appendChild(content);
  }

  show() {
    this.appContainer.style.display = 'block';
    this.isActive = true;
    console.log('Settings App mostrada');
  }

  hide() {
    this.appContainer.style.display = 'none';
    this.isActive = false;
    console.log('Settings App oculta');
  }

  destroy() {
    this.appContainer.remove();
    console.log('Settings App destruida');
  }
}

// Registrar la clase globalmente
window.SettingsApp = SettingsApp;
