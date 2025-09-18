/*
 * Mizu OS - Apps/CSS
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
 * App de estilos CSS de Mizu OS
 * Responsable de inyectar dinámicamente los estilos del sistema
 * // docs/apps/css/css.js
 * Rol: Gestión centralizada de estilos CSS
 * Filosofía: Proporcionar una forma unificada de gestionar los estilos del sistema
 *Principios:
 *Cloud-Native: Ejecución 100% en navegador (GitHub Pages + jsDelivr) — sin build, sin bundlers, sin node_modules, sin servidores locales.
 *Extensible por diseño: cada app es un módulo independiente con su propio bootstrap.
 *Licencia libre: GNU AGPL-3.0 — cualquier modificación públicada en la red debe compartirse la fuente.
 *Stack Tecnológico/Zero Dependencies: ES6+ JavaScript vainilla (módulos nativos), CSS3 con Custom Properties, HTML5 APIs (Canvas, WebAudio, etc.). Sin frameworks, sin Tailwind.
*/

export default {
  name: 'CSSApp',
  version: '1.0.0',
  
  async init() {
    console.log('CSSApp: Inicializando app de estilos...');
    
    // Crear elemento de estilos
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'mizu-os-styles';
    document.head.appendChild(this.styleElement);
    
    // Inyectar estilos
    this.injectStyles();
    
    // Configurar eventos para cambios de tema
    this.setupThemeListeners();
    
    console.log('CSSApp: App de estilos inicializada correctamente');
  },
  
  injectStyles() {
    console.log('CSSApp: Inyectando estilos...');
    
    const styles = `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      html, body {
        height: 100%;
        transition: opacity 2s ease-in;
      }
      
      body {
        font-family: 'Inter', sans-serif;
        background-color: hsla(0, 0%, 0%, 1);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        position: relative;
        overflow: hidden;
        color: black;
      }
      
      body::before {
        content: "";
        position: absolute;
        inset: 0;
        background-color: hsla(0, 0%, 0%, 0.1);
        z-index: 0;
      }
      
      .video-background {
        position: fixed;
        right: 0;
        bottom: 0;
        min-width: 100%;
        min-height: 100%;
        width: auto;
        height: auto;
        z-index: -1;
        object-fit: cover;
      }
      
      #red-bar {
        position: absolute;
        width: calc(100vw - 4px);
        height: calc(2vh + 1rem);
        top: 2px;
        left: 2px;
        right: 2px;
        background: linear-gradient(180deg,hsla(0, 0%, 0%, 0.1),hsl(0, 100%, 0.3));
        z-index: 1160;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        transition: transform 0.5s ease, opacity 0.5s ease;
        color: white;
        padding: 0 8px;
        backdrop-filter: blur(10px);
        border: 1px solid hsla(255, 100%, 100%, 0.2);
        border-radius: 2rem;
        display: flex;
        overflow: hidden;
      }
      
      /* Contenedor para los controles de música - MODIFICADO PARA CENTRAR */
      .music-controls-container {
        display: flex;
        align-items: center;
        justify-content: center; /* CENTRAR HORIZONTALMENTE */
        height: 100%;
        gap: 5px;
        width: 100%; /* OCUPAR TODO EL ANCHO DISPONIBLE */
        position: absolute; /* POSICIÓN ABSOLUTA PARA CENTRAR */
        left: 0;
        right: 0;
      }
      
      /* Botones individuales del reproductor */
      .music-control-button {
        width: 24px !important;
        height: 24px !important;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        padding: 0;
        flex-shrink: 0; /* Evitar que se encojan */
      }
      
      .music-control-button i {
        font-size: 12px !important;
      }
      
      /* Contenedor para los widgets de estado */
      .status-widgets-container {
        display: flex;
        align-items: center;
        height: 100%;
        gap: 10px;
        margin-left: auto;
        margin-right: 0;
        flex-shrink: 0; /* Evitar que se encojan */
        z-index: 1; /* ASEGURAR QUE LOS WIDGETS ESTÉN ENCIMA */
      }
      
      /* Widgets individuales */
      .status-widget {
        display: flex;
        align-items: center;
        height: 100%;
        gap: 5px;
        font-size: 0.8rem;
        color: white;
        white-space: nowrap; /* Evitar que el texto se divida */
      }
      
      .status-widget i {
        font-size: 0.8rem;
      }
      
      /* Separador */
      #separator-widget {
        width: 1px;
        height: 16px;
        background-color: rgba(255, 255, 255, 0.5);
        margin: 0 5px;
        align-self: center;
      }
      
      #blue-bar {
        position: absolute;
        width: calc(2vw + 2rem);
        height: 100%;
        top: 0;
        left: 0;
        background: linear-gradient(90deg,hsla(0, 0%, 0%, 0.8),hsla(0, 0%, 0%, 0));
        color: white;
        padding: 2px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        z-index: 920;
        transition: transform 0.5s ease, opacity 0.5s ease;
      }
          
      /* Botones de aplicaciones */
      .app-button {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        padding: 0;
      }
      
      .app-button:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
      }
      
      .app-button.active {
        background: rgba(99, 102, 241, 0.5);
        border-color: rgba(99, 102, 241, 0.8);
        box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
      }
      
      #yellow-square {
        position: absolute;
        top: 0.2rem;
        left: 0.2rem;
        width: calc(2vh + 1rem - 2px);
        height: calc(2vh + 1rem - 2px);
        background-color: hsla(0, 0%, 0%, 0.01);
        backdrop-filter: blur(10px);
        border-radius: 2rem;
        z-index: 2025;
        perspective: 100vh;
      }
      
      #cube {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        position: relative;
        transform-style: preserve-3d;
        animation: rotateCube 20s infinite linear;
        z-index: 1025;
      }
      
      #hologram {
        position: absolute;
        width: 100%;
        height: 100%;
        background: hsla(0, 0%, 0%, 0);
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        background-size: contain;
        background-image: url('https://cdn.jsdelivr.net/gh/mizulegendsstudios/mizu-axiscore@main/src/images/png/svgmls.png');
        transform: rotateY(0deg) translateZ(0px);
        z-index: 1026;
      }
      
      @keyframes rotateCube {
        from { transform: rotateY(0deg); }
        to { transform: rotateY(360deg); }
      }
      
      #black-bar {
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
      }
      
      /* Estilos para modo oscuro */
      body.dark-mode {
        background-color: hsla(0, 0%, 10%, 1);
        color: hsla(0, 0%, 90%, 1);
      }
      
      body.dark-mode .app-button {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      body.dark-mode .app-button:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      
      /* Estilos para modo claro */
      body.light-mode {
        background-color: hsla(0, 0%, 95%, 1);
        color: hsla(0, 0%, 10%, 1);
      }
      
      body.light-mode #red-bar {
        background: linear-gradient(180deg,hsla(0, 0%, 100%, 0.9),hsl(0, 0%, 90%, 0.9));
        color: black;
      }
      
      body.light-mode #blue-bar {
        background: linear-gradient(90deg,hsla(0, 0%, 100%, 0.9),hsla(0, 0%, 95%, 0));
      }
      
      /* Estilos responsivos */
      @media (max-width: 768px) {
        #blue-bar {
          width: calc(3vw + 2rem);
        }
        
        .app-button {
          width: 35px;
          height: 35px;
        }
        
        #red-bar {
          height: calc(1.5vh + 1rem);
        }
      }
      
      @media (max-width: 480px) {
        #blue-bar {
          width: calc(4vw + 1.5rem);
        }
        
        .app-button {
          width: 30px;
          height: 30px;
        }
        
        .status-widget {
          font-size: 0.7rem;
        }
        
        #red-bar {
          height: calc(1vh + 1rem);
        }
      }
    `;
    
    this.styleElement.innerHTML = styles;
    console.log('CSSApp: Estilos inyectados correctamente');
  },
  
  setupThemeListeners() {
    console.log('CSSApp: Configurando listeners de tema...');
    
    // Escuchar cambios de tema
    document.addEventListener('theme-changed', (event) => {
      this.applyTheme(event.detail.theme);
    });
    
    console.log('CSSApp: Listeners de tema configurados');
  },
  
  applyTheme(theme) {
    console.log(`CSSApp: Aplicando tema '${theme}'`);
    
    // Eliminar clases de tema existentes
    document.body.classList.remove('light-mode', 'dark-mode');
    
    // Aplicar nueva clase de tema
    if (theme === 'light' || theme === 'dark') {
      document.body.classList.add(`${theme}-mode`);
    }
    
    // Guardar preferencia de tema
    try {
      localStorage.setItem('mizu-os-theme', theme);
    } catch (error) {
      console.warn('CSSApp: No se pudo guardar la preferencia de tema:', error);
    }
  },
  
  loadSavedTheme() {
    console.log('CSSApp: Cargando tema guardado...');
    
    try {
      const savedTheme = localStorage.getItem('mizu-os-theme') || 'dark';
      this.applyTheme(savedTheme);
      
      // Disparar evento para notificar a otras apps
      document.dispatchEvent(new CustomEvent('theme-changed', {
        detail: { theme: savedTheme }
      }));
    } catch (error) {
      console.warn('CSSApp: No se pudo cargar el tema guardado:', error);
    }
  },
  
  updateStyles(newStyles) {
    console.log('CSSApp: Actualizando estilos...');
    
    if (!this.styleElement) {
      this.init();
    }
    
    this.styleElement.innerHTML += newStyles;
    console.log('CSSApp: Estilos actualizados correctamente');
  },
  
  clearStyles() {
    console.log('CSSApp: Limpiando estilos...');
    
    if (this.styleElement) {
      this.styleElement.innerHTML = '';
    }
    
    console.log('CSSApp: Estilos limpiados');
  },
  
  async destroy() {
    console.log('CSSApp: Destruyendo app de estilos...');
    
    // Eliminar listeners de eventos
    document.removeEventListener('theme-changed', this.applyTheme);
    
    // Eliminar el elemento de estilos
    if (this.styleElement && this.styleElement.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement);
    }
    
    console.log('CSSApp: App de estilos destruida');
  }
};
