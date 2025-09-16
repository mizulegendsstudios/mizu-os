// apps/core/modules/css.js
//Le falta Copying
export default class CSSManager {
  constructor() {
    this.styleElement = null;
  }
  
  init() {
    console.log('CSSManager: Inicializando gestor de estilos');
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'mizu-os-styles';
    document.head.appendChild(this.styleElement);
    return true;
  }
  
  injectStyles() {
    console.log('CSSManager: Inyectando estilos...');
    
    if (!this.styleElement) {
      this.init();
    }
    
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
      
      /* Contenedor para los controles de música */
      .music-controls-container {
        display: flex;
        align-items: center;
        height: 100%;
        gap: 5px;
        max-width: 50%; /* Limitar ancho para no ocupar demasiado espacio */
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
    `;
    
    this.styleElement.innerHTML = styles;
    console.log('Estilos inyectados correctamente');
  }
}
