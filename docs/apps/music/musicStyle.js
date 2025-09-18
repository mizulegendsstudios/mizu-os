/*
 * Mizu OS - Music App Styles
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
 * Motor de estilos dinámicos para la aplicación de música
 */
class MusicStyleEngine {
  constructor() {
    this.styleId = 'music-app-styles';
    this.styles = this.generateStyles();
    this.theme = 'dark'; // Tema por defecto
    this.accentColor = '#6366f1'; // Color de acento por defecto
    this.isApplied = false;
  }

  /**
   * Genera las reglas CSS para la aplicación de música
   */
  generateStyles() {
    return `
      /* Animaciones para notificaciones */
      @keyframes slideIn {
        from { transform: translateY(100px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }

      @keyframes slideOut {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(100px); opacity: 0; }
      }

      /* Estilos para la aplicación de música */
      .music-player-panel {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: white;
        box-sizing: border-box;
        background: ${this.getThemeBackground()};
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 0.5rem;
        padding: 20px;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
      }

      /* Estilos para los elementos de la playlist */
      #playlist-container > div {
        transition: background 0.2s ease;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
      }

      #playlist-container > div:hover {
        background: rgba(255, 255, 255, 0.15) !important;
      }

      #playlist-container > div.active {
        background: ${this.getAccentColorWithOpacity(0.3)} !important;
        border-left: 3px solid ${this.accentColor};
      }

      #playlist-container > div button:hover {
        background: rgba(231, 76, 60, 0.5);
        color: white;
      }

      /* Estilos para los botones de control */
      .music-player-panel button {
        transition: all 0.2s ease;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }

      .music-player-panel button:hover {
        background: rgba(255, 255, 255, 0.2) !important;
        transform: scale(1.05);
      }

      /* Estilos para inputs */
      .music-player-panel input[type="text"] {
        transition: all 0.2s ease;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        outline: none;
      }

      .music-player-panel input[type="text"]:focus {
        border-color: ${this.accentColor};
        box-shadow: 0 0 0 2px ${this.getAccentColorWithOpacity(0.3)};
      }

      /* Estilos para las notificaciones */
      .config-notification {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
      }

      /* Estilos para las secciones */
      .music-player-panel > div {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 20px;
      }

      /* Estilos para el reproductor de medios */
      #media-player-container {
        width: 100%;
        height: 200px;
        border-radius: 10px;
        overflow: hidden;
        display: none;
      }

      /* Estilos para los controles */
      .music-player-panel .controls-container {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-bottom: 20px;
      }

      /* Estilos para los botones de control */
      .control-button {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        pointer-events: auto;
      }

      /* Estilos para la información de la pista actual */
      #current-track-info {
        text-align: center;
      }

      #current-track-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 5px;
      }

      #current-track-source {
        font-size: 14px;
        opacity: 0.8;
      }

      /* Estilos para la sección de añadir música */
      .add-music-section h3,
      .playlist-section h3 {
        color: white;
        margin-bottom: 10px;
        font-size: 16px;
      }

      /* Estilos para la playlist */
      .playlist-section {
        flex-grow: 1;
        overflow-y: auto;
      }

      #playlist-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      #playlist-container .empty-message {
        color: rgba(255, 255, 255, 0.5);
        text-align: center;
        padding: 20px;
      }
    `;
  }

  /**
   * Aplica los estilos al documento
   */
  applyStyles() {
    if (this.isApplied) return;
    
    let styleElement = document.getElementById(this.styleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = this.styleId;
      styleElement.type = 'text/css';
      document.head.appendChild(styleElement);
    }
    
    styleElement.innerHTML = this.styles;
    this.isApplied = true;
  }

  /**
   * Actualiza los estilos con nuevas reglas
   * @param {string} newStyles - Nuevas reglas CSS para agregar
   */
  updateStyles(newStyles) {
    this.styles += newStyles;
    if (this.isApplied) {
      this.applyStyles();
    }
  }

  /**
   * Elimina los estilos del documento
   */
  removeStyles() {
    const styleElement = document.getElementById(this.styleId);
    if (styleElement) {
      styleElement.remove();
      this.isApplied = false;
    }
  }

  /**
   * Cambia el tema de la aplicación
   * @param {string} theme - Nombre del tema ('dark', 'light', 'blue', etc.)
   */
  setTheme(theme) {
    this.theme = theme;
    this.styles = this.generateStyles();
    if (this.isApplied) {
      this.applyStyles();
    }
  }

  /**
   * Cambia el color de acento
   * @param {string} color - Color en formato hexadecimal
   */
  setAccentColor(color) {
    this.accentColor = color;
    this.styles = this.generateStyles();
    if (this.isApplied) {
      this.applyStyles();
    }
  }

  /**
   * Obtiene el color de fondo según el tema
   */
  getThemeBackground() {
    switch (this.theme) {
      case 'light':
        return 'rgba(255, 255, 255, 0.95)';
      case 'blue':
        return 'rgba(30, 60, 114, 0.95)';
      case 'green':
        return 'rgba(30, 80, 60, 0.95)';
      case 'purple':
        return 'rgba(80, 30, 114, 0.95)';
      case 'dark':
      default:
        return 'rgba(30, 30, 30, 0.95)';
    }
  }

  /**
   * Obtiene el color de acento con opacidad
   * @param {number} opacity - Valor de opacidad (0-1)
   */
  getAccentColorWithOpacity(opacity) {
    // Convertir hex a RGB
    const r = parseInt(this.accentColor.slice(1, 3), 16);
    const g = parseInt(this.accentColor.slice(3, 5), 16);
    const b = parseInt(this.accentColor.slice(5, 7), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  /**
   * Aplica un tema predefinido
   * @param {string} themeName - Nombre del tema predefinido
   */
  applyPresetTheme(themeName) {
    const themes = {
      'default': { theme: 'dark', accentColor: '#6366f1' },
      'ocean': { theme: 'blue', accentColor: '#0ea5e9' },
      'forest': { theme: 'green', accentColor: '#10b981' },
      'sunset': { theme: 'purple', accentColor: '#8b5cf6' },
      'minimal': { theme: 'light', accentColor: '#64748b' }
    };
    
    if (themes[themeName]) {
      this.setTheme(themes[themeName].theme);
      this.setAccentColor(themes[themeName].accentColor);
    }
  }
}

// Exportar la clase para su uso en la aplicación
export default MusicStyleEngine;
