// apps/core/modules/css.js
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
        background-color: #f3f4f6;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        position: relative;
        overflow: hidden;
      }
      
      body::before {
        content: "";
        position: absolute;
        inset: 0;
        background-color: rgba(34, 197, 94, 0.5);
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
        width: 100%;
        height: calc(1vh + 2rem);
        top: 0;
        left: 0;
        background-color: linear-gradient(90deg,hsla(0, 0%, 0%, 0.1),hsl(0, 100%, 0.3));
        z-index: 1160;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: transform 0.5s ease, opacity 0.5s ease;
        color: white;
        padding: 2px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      #blue-bar {
        position: absolute;
        width: calc(2vw + 3rem);
        height: 100%;
        top: 0;
        left: 0;
        background: linear-gradient(270deg,hsla(0, 0%, 0%, 0.5),hsla(0, 0%, 0%, 0));
        color: white;
        padding: 2px;
        backdrop-filter: blur(10px);
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
        width: 2rem;
        height: 2rem;
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
        background-color: hsla(0, 0%, 0%, 0.05);
        border-radius: 0rem;
        padding: 1rem;
        display: flex;
        gap: 0.5rem;
        z-index: 641;
        transition: top 0.5s ease, left 0.5s ease, right 0.5s ease, bottom 0.5s ease;
        overflow: hidden;
        cursor: grab;
      }
      
    `;

    this.styleElement.innerHTML = styles;
    console.log('Estilos inyectados correctamente');
  }
}
