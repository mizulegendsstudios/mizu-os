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
    console.log('UIBuilder: Creando elemento de video');
    const video = document.createElement('video');
    video.className = 'video-background';
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    
    // ACTUALIZADO: Nueva URL del video
    video.src = 'https://cdn.jsdelivr.net/gh/mizulegendsstudios/mizu-board@main/docs/assets/bibiye.webm';
    
    // Añadir manejador de carga exitosa
    video.onloadeddata = () => {
      console.log('UIBuilder: Video cargado correctamente');
      console.log('UIBuilder: Elemento de video:', video);
      console.log('UIBuilder: Video tiene src:', video.src);
      console.log('UIBuilder: Video está en el DOM:', document.body.contains(video));
    };
    
    video.onerror = () => {
      console.error('UIBuilder: Error al cargar el video de fondo');
      console.error('UIBuilder: URL del video:', video.src);
    };
    
    // Verificar que el body existe antes de añadir el video
    if (!this.body) {
      console.error('UIBuilder: document.body no existe');
      return;
    }
    
    console.log('UIBuilder: Añadiendo video al DOM');
    this.body.appendChild(video);
    console.log('UIBuilder: Video añadido al DOM. Elementos en body:', this.body.children.length);
    
    // Verificar que el video se añadió correctamente
    setTimeout(() => {
      const videoElement = document.querySelector('.video-background');
      console.log('UIBuilder: Verificación posterior - Video encontrado en DOM:', !!videoElement);
      if (videoElement) {
        console.log('UIBuilder: Estado del video:', {
          readyState: videoElement.readyState,
          networkState: videoElement.networkState,
          paused: videoElement.paused,
          ended: videoElement.ended,
          currentTime: videoElement.currentTime,
          duration: videoElement.duration
        });
      }
    }, 1000);
    
    // Barra roja superior
    console.log('UIBuilder: Creando barra roja');
    const redBar = document.createElement('div');
    redBar.id = 'red-bar';
    
    // Añadir controles del reproductor
    const musicControls = this.statusWidget.createMusicControls();
    redBar.appendChild(musicControls);
    
    // Añadir widgets de estado
    const widgetsContainer = this.statusWidget.createAllWidgets();
    redBar.appendChild(widgetsContainer);
    
    this.body.appendChild(redBar);
    console.log('UIBuilder: Barra roja añadida al DOM');
    
    // Barra azul izquierda
    console.log('UIBuilder: Creando barra azul');
    const blueBar = document.createElement('div');
    blueBar.id = 'blue-bar';
    this.body.appendChild(blueBar);
    console.log('UIBuilder: Barra azul añadida al DOM');
    
    // Botón para abrir la aplicación de música
    const musicAppButton = this.createMusicAppButton();
    blueBar.appendChild(musicAppButton);
    console.log('UIBuilder: Botón de música añadido a la barra azul');
    
    // Cuadrado amarillo con holograma
    console.log('UIBuilder: Creando cuadrado amarillo');
    const yellowSquare = document.createElement('div');
    yellowSquare.id = 'yellow-square';
    this.body.appendChild(yellowSquare);
    console.log('UIBuilder: Cuadrado amarillo añadido al DOM');
    
    const cube = document.createElement('div');
    cube.id = 'cube';
    yellowSquare.appendChild(cube);
    
    const hologram = document.createElement('div');
    hologram.id = 'hologram';
    cube.appendChild(hologram);
    console.log('UIBuilder: Holograma creado y añadido');
    
    // Barra negra principal
    console.log('UIBuilder: Creando barra negra');
    const blackBar = document.createElement('div');
    blackBar.id = 'black-bar';
    this.body.appendChild(blackBar);
    console.log('UIBuilder: Barra negra añadida al DOM');
    
    console.log('UIBuilder: Interfaz construida correctamente');
    console.log('UIBuilder: Total de elementos en body:', this.body.children.length);
    
    // Listar todos los elementos en el body para depuración
    console.log('UIBuilder: Elementos en body:');
    Array.from(this.body.children).forEach((child, index) => {
      console.log(`UIBuilder: Elemento ${index}:`, child.tagName, child.id || child.className);
    });
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
