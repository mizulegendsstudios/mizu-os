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
      
      #mouse-monitor {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background-color: rgba(30, 0, 0, 0.6);
        color: #ff0000;
        padding: 0.5rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        white-space: nowrap;
        backdrop-filter: blur(10px);
        z-index: 5000;
      }
      
      #red-bar {
        position: absolute;
        width: 100%;
        height: 3rem;
        top: 0;
        left: 0;
        background-color: rgba(30, 0, 0, 0.6);
        z-index: 1160;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: transform 0.5s ease, opacity 0.5s ease;
        color: white;
        padding: 15px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      #blue-bar {
        position: absolute;
        width: 5rem;
        height: 100%;
        top: 0;
        left: 0;
        background: linear-gradient(270deg,hsla(240, 100%, 6%, 0.6),hsl(250, 95%, 30%));
        color: white;
        padding: 15px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 0.5rem;
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        z-index: 920;
        transition: transform 0.5s ease, opacity 0.5s ease;
      }
      
      #blue-bar .square {
        width: 4rem;
        height: 4rem;
        border-radius: 0.5rem;
      }
      #blue-bar .square:nth-child(1) { background-color: rgba(255, 255, 255, 0.5);}
      #blue-bar .square:nth-child(2) { background-color: rgba(156, 163, 175, 0.5);}
      #blue-bar .square:nth-child(3) { background-color: rgba(31, 41, 55, 0.5);}
      
      #blue-bar .foot-square {
        position: absolute;
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
        width: 4rem;
        height: 4rem;
        background-color: rgba(168, 85, 247, 0.5);
        border-radius: 0.5rem;
      }
      
      #yellow-square {
        position: absolute;
        top: 0.2rem;
        left: 0.2rem;
        width: 2rem;
        height: 2rem;
        background-color: rgba(0, 0, 0, 0.01);
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
        background: rgba(0, 0, 0, 0);
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
        top: 5rem;
        left: 5rem;
        right: 0;
        bottom: 0;
        background-size: contain;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 0.5rem;
        padding: 1rem;
        display: flex;
        gap: 0.5rem;
        z-index: 641;
        transition: top 0.5s ease, left 0.5s ease, right 0.5s ease, bottom 0.5s ease;
        overflow: hidden;
        cursor: grab;
      }
      
      #black-content-wrapper {
        transform: translate(0, 0) scale(1);
        transition: transform 0.2s ease-out;
        width: 100%;
        height: 100%;
        display: flex;
        gap: 1rem;
        padding: 1rem;
        position: relative;
      }
      
      #panel-white {
        flex: 1 1 0%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.5);
        border-radius: 0.5rem;
        z-index: 642;
        color: white;
        padding: 15px;
        backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      #panel-purple {
        flex: 1 1 0%;
        height: 100%;
        background-color: rgba(168, 85, 247, 0.5);
        border-radius: 0.5rem;
        z-index: 643;
        color: white;
        padding: 15px;
        backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
    `;

    this.styleElement.innerHTML = styles;
    console.log('Estilos inyectados correctamente');
  }
}
