// apps/core/modules/ui-builder.js
import StatusWidget from './status-widget.js';

export default class UIBuilder {
  constructor() {
    this.body = document.body;
    this.statusWidget = new StatusWidget();
  }

  buildUI() {
    console.log('UIBuilder: Construyendo interfaz de usuario');
    
    // Video de fondo
    const video = document.createElement('video');
    video.className = 'video-background';
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.src = 'https://assets.mixkit.co/videos/preview/mixkit-wavy-green-abstract-background-2729-large.mp4';
    video.onerror = () => console.log('Error al cargar el video de fondo.');
    this.body.appendChild(video);
    
    // Barra roja superior
    const redBar = document.createElement('div');
    redBar.id = 'red-bar';
    
    // Añadir título del sistema
    const systemTitle = document.createElement('div');
    systemTitle.textContent = 'Mizu OS v3.0.0';
    systemTitle.style.marginRight = 'auto';
    systemTitle.style.paddingLeft = '10px';
    redBar.appendChild(systemTitle);
    
    // Añadir widgets de estado
    const widgetsContainer = this.statusWidget.createAllWidgets();
    redBar.appendChild(widgetsContainer);
    
    this.body.appendChild(redBar);
    
    // Barra azul izquierda
    const blueBar = document.createElement('div');
    blueBar.id = 'blue-bar';
    this.body.appendChild(blueBar);
    
    // Cuadrados en la barra azul
    for(let i = 0; i < 3; i++) {
      const square = document.createElement('div');
      square.className = 'square';
      blueBar.appendChild(square);
    }
    
    const footSquare = document.createElement('div');
    footSquare.className = 'foot-square';
    blueBar.appendChild(footSquare);
    
    // Cuadrado amarillo con holograma
    const yellowSquare = document.createElement('div');
    yellowSquare.id = 'yellow-square';
    this.body.appendChild(yellowSquare);
    
    const cube = document.createElement('div');
    cube.id = 'cube';
    yellowSquare.appendChild(cube);
    
    const hologram = document.createElement('div');
    hologram.id = 'hologram';
    cube.appendChild(hologram);
    
    // Barra negra principal
    const blackBar = document.createElement('div');
    blackBar.id = 'black-bar';
    this.body.appendChild(blackBar);
    
    const blackContentWrapper = document.createElement('div');
    blackContentWrapper.id = 'black-content-wrapper';
    blackBar.appendChild(blackContentWrapper);
    
    const panelWhite = document.createElement('div');
    panelWhite.id = 'panel-white';
    panelWhite.textContent = 'Panel Blanco';
    blackContentWrapper.appendChild(panelWhite);
    
    const panelPurple = document.createElement('div');
    panelPurple.id = 'panel-purple';
    panelPurple.textContent = 'Panel Púrpura';
    blackContentWrapper.appendChild(panelPurple);
    
    console.log('UIBuilder: Interfaz construida correctamente');
  }
}
