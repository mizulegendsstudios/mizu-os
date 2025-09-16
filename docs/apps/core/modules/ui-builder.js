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
    
    // Añadir controles del reproductor
    const musicControls = this.statusWidget.createMusicControls();
    redBar.appendChild(musicControls);
    
    // Añadir widgets de estado
    const widgetsContainer = this.statusWidget.createAllWidgets();
    redBar.appendChild(widgetsContainer);
    
    this.body.appendChild(redBar);
    
    // Barra azul izquierda
    const blueBar = document.createElement('div');
    blueBar.id = 'blue-bar';
    this.body.appendChild(blueBar);
    
    // Botón para abrir la aplicación de música
    const musicAppButton = this.createMusicAppButton();
    blueBar.appendChild(musicAppButton);
    
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
  
  createMusicAppButton() {
    const button = document.createElement('button');
    button.className = 'app-button';
    button.title = 'Reproductor de Música';
    button.innerHTML = '<i class="fas fa-music"></i>';
    
    button.addEventListener('click', () => {
      // Emitir evento para activar la aplicación de música
      if (window.MizuOS && window.MizuOS.eventBus) {
        window.MizuOS.eventBus.emit('app:activate', 'music');
      }
    });
    
    return button;
  }
}
