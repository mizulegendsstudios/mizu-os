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
        position: relative;
      }
      
      body {
        font-family: 'Segoe UI', sans-serif;
        background-color: #121212;
        color: #e0e0e0;
        position: relative;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
      
      /* Video de fondo corregido */
      .video-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        object-fit: cover;
        z-index: -1;
        transform: translateZ(0);
        will-change: transform;
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
        pointer-events: none;
      }
      
      #app-container > * {
        pointer-events: auto;
      }
      
      /* Sistema de barras */
      .system-bar {
        position: absolute;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 100;
      }
      
      /* Barra roja (superior) */
      #red-bar {
        top: 0;
        left: 0;
        width: 100%;
        height: 48px;
        background-color: rgba(136, 14, 14, 0.8);
        z-index: 1160;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 16px;
      }
      
      /* Barra azul (lateral) */
      #blue-bar {
        top: 48px;
        left: 0;
        width: 64px;
        height: calc(100% - 48px);
        background: linear-gradient(270deg, rgba(30, 0, 77, 0.8), rgba(59, 7, 100, 0.8));
        z-index: 920;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px 0;
        gap: 12px;
      }
      
      /* Barra negra (área de trabajo) */
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
      
      /* Holograma */
      #yellow-square {
        top: 8px;
        left: 8px;
        width: 32px;
        height: 32px;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        z-index: 2025;
        perspective: 100vh;
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
      
      @keyframes rotateCube {
        from { transform: rotateY(0deg); }
        to { transform: rotateY(360deg); }
      }
      
      /* Responsive */
      @media (max-width: 768px) {
        #blue-bar {
          width: 48px;
        }
        
        #black-bar {
          left: 48px;
        }
        
        .app-button {
          width: 36px;
          height: 36px;
          font-size: 16px;
        }
      }
    `;
  }
  
  // Obtener el CSS para un módulo específico
  getModuleCSS(moduleName) {
    const modules = {
      'status-widgets': `
        .status-widget-container {
          display: flex;
          align-items: center;
          gap: 20px;
          height: 100%;
        }
        
        .status-widget {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .status-widget-clock {
          flex-direction: column;
          align-items: center;
        }
        
        .status-time {
          font-size: 16px;
          font-weight: bold;
        }
        
        .status-date {
          font-size: 12px;
          opacity: 0.8;
        }
        
        .status-icon {
          font-size: 16px;
          width: 20px;
          text-align: center;
        }
      `,
      
      'app-buttons': `
        .apps-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
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
        
        .config-button {
          position: absolute;
          bottom: 16px;
        }
      `,
      
      'workspace': `
        #black-content-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
        }
        
        .workspace {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
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
      
      'hologram': `
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
      'status-widgets', 'app-buttons', 'workspace', 'hologram', 'loading'
    ];
    
    const loadPromises = moduleNames.map(module => this.loadModule(module));
    return Promise.all(loadPromises);
  }
  
  // Cargar módulos esenciales (mínimos para funcionamiento)
  loadEssentials() {
    return Promise.all([
      this.loadModule('status-widgets'),
      this.loadModule('app-buttons'),
      this.loadModule('workspace'),
      this.loadModule('hologram')
    ]);
  }
}

// Crear instancia global
window.CoreCSS = new CoreCSSLoader();
