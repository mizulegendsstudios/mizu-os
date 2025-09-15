// apps/core/modules/css.js
export default class CSSManager {
  constructor() {
    this.stylesInjected = false;
    this.styleElement = null;
  }

  async init() {
    console.log('CSSManager: Inicializando gestor de estilos');
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'mizu-os-styles';
    document.head.appendChild(this.styleElement);
    return true;
  }

  async loadEssentials() {
    console.log('CSSManager: Cargando estilos esenciales');
    
    if (!this.styleElement) {
      await this.init();
    }
    
    // Estilos esenciales para el sistema incluyendo loading
    const essentialStyles = `
      /* Estilos básicos del cuerpo */
      body {
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', sans-serif;
        background: #121212;
        color: #e0e0e0;
        opacity: 0;
        transition: opacity 0.8s ease;
        overflow: hidden;
        position: fixed;
        width: 100vw;
        height: 100vh;
      }
      
      body.loaded {
        opacity: 1;
      }
      
      /* Estilos del loading */
      #loading {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #121212;
        z-index: 1000;
      }
      
      .spinner {
        width: 50px;
        height: 50px;
        border: 5px solid rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        border-top-color: #bb86fc;
        animation: spin 1s ease-in-out infinite;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      /* Contenedor principal */
      #app-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        z-index: 1;
      }
      
      /* Estilos generales */
      .system-bar {
        position: fixed;
        z-index: 1000;
      }
      
      /* Video de fondo */
      #background-video {
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
      
      /* Barras del sistema */
      .top-bar {
        top: 0;
        left: 0;
        right: 0;
        height: 30px;
        background-color: rgba(255, 0, 0, 0.7);
        display: flex;
        align-items: center;
        padding: 0 10px;
      }
      
      .side-bar {
        top: 30px;
        left: 0;
        bottom: 0;
        width: 60px;
        background-color: rgba(0, 0, 255, 0.7);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 10px;
      }
      
      /* Área de trabajo */
      .workspace {
        position: fixed;
        top: 30px;
        left: 60px;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        overflow: auto;
      }
      
      /* Holograma */
      .hologram {
        position: fixed;
        top: 40px;
        left: 70px;
        width: 100px;
        height: 100px;
        background: linear-gradient(45deg, #00ffff, #ff00ff);
        border-radius: 50%;
        opacity: 0.7;
        animation: pulse 2s infinite;
        z-index: 100;
      }
      
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.7; }
        50% { transform: scale(1.1); opacity: 0.9; }
        100% { transform: scale(1); opacity: 0.7; }
      }
      
      /* Widgets de estado */
      .status-widget {
        margin-left: 10px;
        display: flex;
        align-items: center;
      }
      
      /* Botones de aplicaciones */
      .app-button {
        width: 40px;
        height: 40px;
        margin: 5px 0;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background-color 0.3s;
      }
      
      .app-button:hover {
        background-color: rgba(255, 255, 255, 0.4);
      }
      
      .app-button.active {
        background-color: rgba(255, 255, 255, 0.6);
      }
      
      /* Contenedor de aplicaciones */
      .app-container {
        width: 100%;
        height: 100%;
        display: none;
      }
      
      .app-container.active {
        display: block;
      }
    `;
    
    this.styleElement.innerHTML = essentialStyles;
    this.stylesInjected = true;
    
    // Verificar que los estilos se cargaron correctamente
    if (this.styleElement.sheet && this.styleElement.sheet.cssRules.length > 0) {
      console.log('✅ Estilos esenciales cargados correctamente');
      return true;
    } else {
      console.warn('⚠️ Los estilos esenciales no se cargaron correctamente');
      return false;
    }
  }

  createBasicUI() {
    console.log('CSSManager: Creando elementos básicos de UI');
    
    // Crear elementos de la interfaz
    const redBar = document.createElement('div');
    redBar.className = 'system-bar top-bar';
    redBar.id = 'red-bar';
    
    const blueBar = document.createElement('div');
    blueBar.className = 'system-bar side-bar';
    blueBar.id = 'blue-bar';
    
    const blackBar = document.createElement('div');
    blackBar.className = 'workspace';
    blackBar.id = 'black-bar';
    
    const yellowSquare = document.createElement('div');
    yellowSquare.className = 'hologram';
    yellowSquare.id = 'yellow-square';
    
    // Contenedor para el contenido de las aplicaciones
    const contentWrapper = document.createElement('div');
    contentWrapper.id = 'content-wrapper';
    contentWrapper.style.width = '100%';
    contentWrapper.style.height = '100%';
    blackBar.appendChild(contentWrapper);
    
    return {
      redBar,
      blueBar,
      blackBar,
      yellowSquare,
      contentWrapper
    };
  }
}
