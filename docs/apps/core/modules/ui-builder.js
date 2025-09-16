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
    video.src = 'https://cdn.jsdelivr.net/gh/mizulegendsstudios/mizu-board@main/docs/core/assets/bibiye.webm';
    video.onerror = () => console.log('Error al cargar el video de fondo.');
    this.body.appendChild(video);
    
    // Barra roja superior
    const redBar = document.createElement('div');
    redBar.id = 'red-bar';
       
    // Añadir widgets de estado
    const widgetsContainer = this.statusWidget.createAllWidgets();
    redBar.appendChild(widgetsContainer);
    
    this.body.appendChild(redBar);
    
    // Barra azul izquierda
    const blueBar = document.createElement('div');
    blueBar.id = 'blue-bar';
    this.body.appendChild(blueBar);
    
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
    
    console.log('UIBuilder: Interfaz construida correctamente');
  }
}
