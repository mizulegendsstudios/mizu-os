// docs/apps/core/modules/css.js - Sistema de carga dinámica de CSS modular
/*
 * Mizu OS - CSS Loader Module
 * Copyright (C) 2025 Mizu Legends Studios
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

class CoreCSSLoader {
  constructor() {
    this.loadedModules = new Set();
    this.appStyles = new Map(); // Almacena estilos por app
    this.coreStyles = this.getCoreStyles(); // Estilos base del sistema
    this.videoBackgroundUrl = 'https://cdn.jsdelivr.net/gh/mizulegendsstudios/mizu-board@main/docs/core/assets/bibiye.webm';
  }

  // Inicializar el sistema de estilos
  init() {
    // Cargar estilos base del core
    this.loadCoreStyles();
    
    // Crear video de fondo
    this.createVideoBackground();
    
    console.log('Sistema de estilos inicializado');
  }

  // Cargar estilos base del core
  loadCoreStyles() {
    const style = document.createElement('style');
    style.id = 'core-base-styles';
    style.textContent = this.coreStyles;
    document.head.appendChild(style);
  }

  // Registrar estilos de una aplicación
  registerAppStyles(appName, styles) {
    if (!this.appStyles.has(appName)) {
      this.appStyles.set(appName, new Set());
    }
    
    const appStyleId = `app-styles-${appName}`;
    let styleElement = document.getElementById(appStyleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = appStyleId;
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = styles;
    this.appStyles.get(appName).add(appStyleId);
    
    console.log(`Estilos para la app ${appName} registrados`);
  }

  // Cargar un módulo CSS específico
  loadModule(moduleName, appName = null) {
    const moduleId = appName ? `${appName}-${moduleName}` : moduleName;
    
    if (this.loadedModules.has(moduleId)) {
      console.log(`Módulo ${moduleId} ya está cargado`);
      return Promise.resolve();
    }
    
    return new Promise((resolve, reject) => {
      const cssText = this.getModuleCSS(moduleName);
      if (!cssText) {
        reject(new Error(`Módulo ${moduleName} no encontrado`));
        return;
      }
      
      const styleId = `css-module-${moduleId}`;
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = cssText;
      
      document.head.appendChild(style);
      this.loadedModules.add(moduleId);
      
      // Si es para una app específica, registrarla
      if (appName) {
        if (!this.appStyles.has(appName)) {
          this.appStyles.set(appName, new Set());
        }
        this.appStyles.get(appName).add(styleId);
      }
      
      console.log(`Módulo ${moduleId} cargado`);
      resolve();
    });
  }

  // Descargar un módulo CSS
  unloadModule(moduleName, appName = null) {
    const moduleId = appName ? `${appName}-${moduleName}` : moduleName;
    const styleElement = document.getElementById(`css-module-${moduleId}`);
    
    if (styleElement) {
      styleElement.remove();
      this.loadedModules.delete(moduleId);
      
      // Si es para una app específica, eliminar del registro
      if (appName && this.appStyles.has(appName)) {
        this.appStyles.get(appName).delete(`css-module-${moduleId}`);
      }
      
      console.log(`Módulo ${moduleId} descargado`);
      return true;
    }
    return false;
  }

  // Descargar todos los estilos de una aplicación
  unloadAppStyles(appName) {
    if (!this.appStyles.has(appName)) return false;
    
    const styleIds = this.appStyles.get(appName);
    styleIds.forEach(styleId => {
      const styleElement = document.getElementById(styleId);
      if (styleElement) {
        styleElement.remove();
      }
    });
    
    this.appStyles.delete(appName);
    console.log(`Estilos de la app ${appName} descargados`);
    return true;
  }

  // Obtener estilos base del sistema
  getCoreStyles() {
    return `
      /* Reset y estilos base */
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      html, body {
        height: 100%;
        width: 100%;
        overflow: hidden;
      }
      
      body {
        font-family: 'Segoe UI', sans-serif;
        background-color: #121212;
        color: #e0e0e0;
        position: relative;
      }
      
      /* Video de fondo */
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
      
      /* Sistema de barras */
      .system-bar {
        position: absolute;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 100;
      }
      
      /* Clases comunes para apps */
      .btn {
        background-color: rgba(58, 58, 58, 0.7);
        border: 1px solid rgba(68, 68, 68, 0.7);
        border-radius: 4px;
        color: #fff;
        padding: 8px 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 14px;
      }
      
      .btn:hover {
        background-color: rgba(74, 74, 74, 0.8);
      }
      
      .panel {
        background-color: rgba(42, 42, 42, 0.7);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
      }
      
      .input {
        background-color: rgba(58, 58, 58, 0.7);
        border: 1px solid rgba(68, 68, 68, 0.7);
        border-radius: 4px;
        color: #fff;
        padding: 8px 12px;
        width: 100%;
        font-size: 14px;
      }
      
      /* Utilidades */
      .flex {
        display: flex;
      }
      
      .flex-col {
        flex-direction: column;
      }
      
      .items-center {
        align-items: center;
      }
      
      .justify-center {
        justify-content: center;
      }
      
      .gap-2 {
        gap: 8px;
      }
      
      .gap-4 {
        gap: 16px;
      }
      
      .w-full {
        width: 100%;
      }
      
      .h-full {
        height: 100%;
      }
      
      .relative {
        position: relative;
      }
      
      .absolute {
        position: absolute;
      }
      
      .hidden {
        display: none;
      }
      
      /* Animaciones */
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      /* Responsive */
      @media (max-width: 768px) {
        .system-widget {
          gap: 10px;
          font-size: 12px;
        }
      }
    `;
  }

  // Obtener el CSS para un módulo específico
  getModuleCSS(moduleName) {
    const modules = {
      'red-bar': `
        #red-bar {
          top: 0;
          left: 0;
          width: 100%;
          height: 48px;
          background-color: rgba(136, 14, 14, 0.7);
          z-index: 1160;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 16px;
        }
        
        #system-widget {
          display: flex;
          align-items: center;
          gap: 16px;
          height: 100%;
        }
        
        .widget-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
        }
        
        .widget-icon {
          font-size: 16px;
        }
      `,
      
      'blue-bar': `
        #blue-bar {
          top: 0;
          left: 0;
          width: 64px;
          height: 100%;
          background: linear-gradient(270deg, rgba(30, 0, 77, 0.8), rgba(59, 7, 100, 0.8));
          z-index: 920;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px 0;
          gap: 12px;
        }
        
        .app-button {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .app-button:hover {
          background-color: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }
        
        .app-button.active {
          background-color: rgba(187, 134, 252, 0.5);
          border-color: #bb86fc;
        }
      `,
      
      'yellow-square': `
        #yellow-square {
          top: 16px;
          left: 16px;
          width: 40px;
          height: 40px;
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 50%;
          z-index: 2025;
          perspective: 100vh;
        }
        
        #cube {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          animation: rotateCube 20s infinite linear;
        }
        
        #hologram {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-size: contain;
          background-image: url('https://cdn.jsdelivr.net/gh/mizulegendsstudios/mizu-axiscore@main/src/images/png/svgmls.png');
          background-repeat: no-repeat;
          background-position: center;
          transform: rotateY(0deg) translateZ(0px);
        }
        
        @keyframes rotateCube {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
      `,
      
      'black-bar': `
        #black-bar {
          top: 48px;
          left: 64px;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 8px 0 0 0;
          z-index: 641;
          overflow: hidden;
        }
        
        #black-content-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
        }
        
        .app-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: none;
          padding: 16px;
        }
        
        .app-container.active {
          display: block;
        }
      `,
      
      'loading': `
        .loading {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #121212;
          z-index: 9999;
        }
        
        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          border-top-color: #bb86fc;
          animation: spin 1s ease-in-out infinite;
        }
      `
    };
    
    return modules[moduleName] || null;
  }

  // Cargar todos los módulos principales
  loadAll() {
    const moduleNames = [
      'red-bar', 'blue-bar', 'yellow-square', 'black-bar', 'loading'
    ];
    
    const loadPromises = moduleNames.map(module => this.loadModule(module));
    return Promise.all(loadPromises);
  }

  // Cargar módulos esenciales (mínimos para funcionamiento)
  loadEssentials() {
    return Promise.all([
      this.loadModule('red-bar'),
      this.loadModule('blue-bar'),
      this.loadModule('black-bar')
    ]);
  }

  // Crear elemento de video de fondo
  createVideoBackground() {
    const video = document.createElement('video');
    video.className = 'video-background';
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    
    const source = document.createElement('source');
    source.src = this.videoBackgroundUrl;
    source.type = 'video/webm';
    
    video.appendChild(source);
    document.body.appendChild(video);
    
    return video;
  }

  // Crear elementos de UI básicos
  createBasicUI() {
    // Crear barra superior (roja)
    const redBar = document.createElement('div');
    redBar.id = 'red-bar';
    redBar.className = 'system-bar';
    
    // Crear widget de sistema
    const systemWidget = document.createElement('div');
    systemWidget.id = 'system-widget';
    
    // Crear elementos del widget
    const timeWidget = document.createElement('div');
    timeWidget.className = 'widget-item';
    timeWidget.innerHTML = `
      <div id="widget-hora" class="widget-time">00:00</div>
      <div id="widget-fecha" class="widget-date">01/01/2025</div>
    `;
    
    const batteryWidget = document.createElement('div');
    batteryWidget.className = 'widget-item';
    batteryWidget.innerHTML = `
      <i class="widget-icon fas fa-battery-three-quarters"></i>
      <span id="widget-battery">100%</span>
    `;
    
    const wifiWidget = document.createElement('div');
    wifiWidget.className = 'widget-item';
    wifiWidget.innerHTML = `
      <i class="widget-icon fas fa-wifi"></i>
      <span id="widget-wifi">Conectado</span>
    `;
    
    // Añadir widgets al contenedor
    systemWidget.appendChild(timeWidget);
    systemWidget.appendChild(batteryWidget);
    systemWidget.appendChild(wifiWidget);
    redBar.appendChild(systemWidget);
    
    // Crear barra lateral (azul)
    const blueBar = document.createElement('div');
    blueBar.id = 'blue-bar';
    blueBar.className = 'system-bar';
    
    // Crear barra inferior (negra)
    const blackBar = document.createElement('div');
    blackBar.id = 'black-bar';
    
    // Crear contenedor de contenido
    const contentWrapper = document.createElement('div');
    contentWrapper.id = 'black-content-wrapper';
    blackBar.appendChild(contentWrapper);
    
    // Crear holograma
    const yellowSquare = document.createElement('div');
    yellowSquare.id = 'yellow-square';
    yellowSquare.innerHTML = `
      <div id="cube">
        <div id="hologram"></div>
      </div>
    `;
    
    // Añadir todo al body
    document.body.appendChild(redBar);
    document.body.appendChild(blueBar);
    document.body.appendChild(blackBar);
    document.body.appendChild(yellowSquare);
    
    return {
      redBar,
      blueBar,
      blackBar,
      contentWrapper,
      yellowSquare
    };
  }
}

// Crear instancia global
window.CoreCSS = new CoreCSSLoader();
