/*
 * Mizu OS - Apps/UI
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
 * Interfaz de usuario de Mizu OS
 * Responsable de gestionar todos los componentes visuales del sistema
 * // docs/apps/ui/ui.js
 * Rol: Gestión de la interfaz de usuario
 * Filosofía: Proporcionar una experiencia de usuario consistente y responsive
 *Principios:
 *Cloud-Native: Ejecución 100% en navegador (GitHub Pages + jsDelivr) — sin build, sin bundlers, sin node_modules, sin servidores locales.
 *Extensible por diseño: cada app es un módulo independiente con su propio bootstrap.
 *Licencia libre: GNU AGPL-3.0 — cualquier modificación públicada en la red debe compartirse la fuente.
 *Stack Tecnológico/Zero Dependencies: ES6+ JavaScript vainilla (módulos nativos), CSS3 con Custom Properties, HTML5 APIs (Canvas, WebAudio, etc.). Sin frameworks, sin Tailwind.
*/

export default {
  name: 'UIApp',
  version: '1.0.0',
  
  async init() {
    console.log('UIApp: Inicializando interfaz de usuario...');
    
    // Crear elemento de estilos
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'mizu-os-styles';
    document.head.appendChild(this.styleElement);
    
    // Inyectar estilos
    this.injectStyles();
    
    // Crear estructura básica de la interfaz
    this.createAppStructure();
    
    // Configurar eventos de la interfaz
    this.setupEventListeners();
    
    // Actualizar fecha y hora
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);
    
    console.log('UIApp: Interfaz de usuario inicializada correctamente');
  },
  
  injectStyles() {
    console.log('UIApp: Inyectando estilos...');
    
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
      
      /* Estilos para el contenido de las aplicaciones */
      .app-content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        text-align: center;
      }
      
      .app-content h2 {
        margin-bottom: 1rem;
        font-size: 1.5rem;
      }
      
      .app-content p {
        margin-bottom: 0.5rem;
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
    console.log('UIApp: Estilos inyectados correctamente');
  },
  
  createAppStructure() {
    console.log('UIApp: Creando estructura básica de la aplicación...');
    
    // Crear contenedor principal si no existe
    if (!document.getElementById('app-container')) {
      const appContainer = document.createElement('div');
      appContainer.id = 'app-container';
      document.body.appendChild(appContainer);
    }
    
    // Crear estructura de la interfaz
    const appStructure = `
      <video class="video-background" autoplay loop muted>
        <source src="https://cdn.jsdelivr.net/gh/mizulegendsstudios/mizu-board@main/docs/assets/bibiye.webm" type="video/webm">
      </video>
      
      <div id="red-bar">
        <div class="music-controls-container">
          <button class="music-control-button" id="prev-button">
            <i class="fas fa-step-backward"></i>
          </button>
          <button class="music-control-button" id="play-pause-button">
            <i class="fas fa-play"></i>
          </button>
          <button class="music-control-button" id="next-button">
            <i class="fas fa-step-forward"></i>
          </button>
        </div>
        
        <div class="status-widgets-container">
          <div class="status-widget" id="time-widget">
            <i class="far fa-clock"></i>
            <span id="current-time">00:00</span>
          </div>
          
          <div id="separator-widget"></div>
          
          <div class="status-widget" id="date-widget">
            <i class="far fa-calendar"></i>
            <span id="current-date">01/01/2025</span>
          </div>
          
          <div id="separator-widget"></div>
          
          <div class="status-widget" id="system-widget">
            <i class="fas fa-microchip"></i>
            <span>Mizu OS v3.0.1</span>
          </div>
        </div>
      </div>
      
      <div id="blue-bar">
        <button class="app-button" data-app="home">
          <i class="fas fa-home"></i>
        </button>
        <button class="app-button" data-app="files">
          <i class="fas fa-folder"></i>
        </button>
        <button class="app-button" data-app="settings">
          <i class="fas fa-cog"></i>
        </button>
        <button class="app-button active" data-app="desktop">
          <i class="fas fa-desktop"></i>
        </button>
      </div>
      
      <div id="yellow-square">
        <div id="cube">
          <div id="hologram"></div>
        </div>
      </div>
      
      <div id="black-bar">
        <div class="app-content">
          <h2>Bienvenido a Mizu OS</h2>
          <p>Sistema operativo minimalista y modular</p>
          <p>Selecciona una aplicación para comenzar</p>
        </div>
      </div>
    `;
    
    document.getElementById('app-container').innerHTML = appStructure;
    console.log('UIApp: Estructura básica creada');
  },
  
  updateDateTime() {
    const now = new Date();
    
    // Formatear hora
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('current-time').textContent = `${hours}:${minutes}`;
    
    // Formatear fecha
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    document.getElementById('current-date').textContent = `${day}/${month}/${year}`;
  },
  
  setupEventListeners() {
    console.log('UIApp: Configurando eventos...');
    
    // Eventos de botones de aplicaciones
    document.querySelectorAll('.app-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const appName = e.currentTarget.getAttribute('data-app');
        this.openApp(appName);
      });
    });
    
    // Eventos de controles de música
    document.getElementById('play-pause-button').addEventListener('click', () => {
      this.togglePlayPause();
    });
    
    document.getElementById('prev-button').addEventListener('click', () => {
      this.playPrevious();
    });
    
    document.getElementById('next-button').addEventListener('click', () => {
      this.playNext();
    });
    
    console.log('UIApp: Eventos configurados');
  },
  
  openApp(appName) {
    console.log(`UIApp: Abriendo aplicación ${appName}`);
    
    // Actualizar botón activo
    document.querySelectorAll('.app-button').forEach(button => {
      button.classList.remove('active');
    });
    document.querySelector(`[data-app="${appName}"]`).classList.add('active');
    
    // Cargar contenido de la aplicación
    const blackBar = document.getElementById('black-bar');
    
    // Aquí se cargaría el contenido específico de cada aplicación
    switch(appName) {
      case 'home':
        blackBar.innerHTML = '<div class="app-content"><h2>Inicio</h2><p>Contenido de la aplicación de inicio</p></div>';
        break;
      case 'files':
        blackBar.innerHTML = '<div class="app-content"><h2>Archivos</h2><p>Contenido de la aplicación de archivos</p></div>';
        break;
      case 'settings':
        blackBar.innerHTML = '<div class="app-content"><h2>Configuración</h2><p>Contenido de la aplicación de configuración</p></div>';
        break;
      case 'desktop':
      default:
        blackBar.innerHTML = '<div class="app-content"><h2>Bienvenido a Mizu OS</h2><p>Sistema operativo minimalista y modular</p><p>Selecciona una aplicación para comenzar</p></div>';
        break;
    }
  },
  
  togglePlayPause() {
    const playPauseButton = document.getElementById('play-pause-button');
    const icon = playPauseButton.querySelector('i');
    
    if (icon.classList.contains('fa-play')) {
      icon.classList.remove('fa-play');
      icon.classList.add('fa-pause');
      console.log('UIApp: Reproduciendo');
    } else {
      icon.classList.remove('fa-pause');
      icon.classList.add('fa-play');
      console.log('UIApp: Pausado');
    }
  },
  
  playPrevious() {
    console.log('UIApp: Reproduciendo anterior');
  },
  
  playNext() {
    console.log('UIApp: Reproduciendo siguiente');
  },
  
  async destroy() {
    console.log('UIApp: Destruyendo interfaz de usuario...');
    
    // Eliminar event listeners
    document.querySelectorAll('.app-button').forEach(button => {
      button.removeEventListener('click', this.openApp);
    });
    
    document.getElementById('play-pause-button').removeEventListener('click', this.togglePlayPause);
    document.getElementById('prev-button').removeEventListener('click', this.playPrevious);
    document.getElementById('next-button').removeEventListener('click', this.playNext);
    
    // Limpiar estructura
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
      appContainer.innerHTML = '';
    }
    
    // Eliminar estilos
    if (this.styleElement && this.styleElement.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement);
    }
    
    console.log('UIApp: Interfaz de usuario destruida');
  }
};
