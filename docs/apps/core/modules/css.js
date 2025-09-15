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
        console.log('Estilos base del core cargados');
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
        if (this.loadedModules.has(moduleName)) {
            console.log(`Módulo ${moduleName} ya está cargado`);
            return Promise.resolve();
        }
        
        return new Promise((resolve, reject) => {
            const cssText = this.getModuleCSS(moduleName);
            if (!cssText) {
                reject(new Error(`Módulo ${moduleName} no encontrado`));
                return;
            }
            
            const styleId = `css-module-${moduleName}`;
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = cssText;
            
            document.head.appendChild(style);
            this.loadedModules.add(moduleName);
            
            // Si es para una app específica, registrarla
            if (appName) {
                if (!this.appStyles.has(appName)) {
                    this.appStyles.set(appName, new Set());
                }
                this.appStyles.get(appName).add(styleId);
            }
            
            console.log(`Módulo ${moduleName} cargado`);
            resolve();
        });
    }
    
    // Descargar un módulo CSS
    unloadModule(moduleName, appName = null) {
        const styleElement = document.getElementById(`css-module-${moduleName}`);
        if (styleElement) {
            styleElement.remove();
            this.loadedModules.delete(moduleName);
            
            // Si es para una app específica, eliminar del registro
            if (appName && this.appStyles.has(appName)) {
                this.appStyles.get(appName).delete(`css-module-${moduleName}`);
            }
            
            console.log(`Módulo ${moduleName} descargado`);
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
            
            /* Sistema de barras */
            .system-bar {
                position: absolute;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                z-index: 100;
            }
        `;
    }
    
    // Obtener el CSS para un módulo específico
    getModuleCSS(moduleName) {
        const modules = {
            'reset': `
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
            `,
            
            'base': `
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
            `,
            
            'video-bg': `
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
            `,
            
            'red-bar': `
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
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                }
            `,
            
            'blue-bar': `
                #blue-bar {
                    position: absolute;
                    width: 5rem;
                    height: calc(100% - 3rem);
                    top: 3rem;
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
                
                #blue-bar .square:nth-child(1) { 
                    background-color: rgba(255, 255, 255, 0.5);
                }
                
                #blue-bar .square:nth-child(2) { 
                    background-color: rgba(156, 163, 175, 0.5);
                }
                
                #blue-bar .square:nth-child(3) { 
                    background-color: rgba(31, 41, 55, 0.5);
                }
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
            `,
            
            'yellow-square': `
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
                    to   { transform: rotateY(360deg); }
                }
            `,
            
            'black-bar': `
                #black-bar {
                    position: absolute;
                    top: 3rem;
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
            `,
            
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
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `,
            
            'responsive': `
                @media (max-width: 768px) {
                    .system-widget {
                        gap: 10px;
                        font-size: 10px;
                    }
                    
                    .battery-icon {
                        width: 20px;
                        height: 10px;
                    }
                    
                    .connection-icon,
                    .volume-icon {
                        width: 14px;
                        height: 14px;
                    }
                    
                    .status-time-value {
                        font-size: 12px;
                    }
                    
                    .status-date-value {
                        font-size: 8px;
                    }
                }
                @media (max-width: 480px) {
                    .system-widget {
                        gap: 8px;
                        right: 10px;
                    }
                    
                    .status-date-value {
                        display: none;
                    }
                }
            `
        };
        return modules[moduleName] || null;
    }
    
    // Cargar todos los módulos principales
    loadAll() {
        const moduleNames = [
            'reset', 'base', 'video-bg', 'red-bar', 'blue-bar', 
            'yellow-square', 'black-bar', 'status-widgets', 'app-buttons', 
            'workspace', 'loading', 'responsive'
        ];
        
        const loadPromises = moduleNames.map(module => this.loadModule(module));
        return Promise.all(loadPromises);
    }
    
    // Cargar módulos esenciales (mínimos para funcionamiento)
    loadEssentials() {
        return Promise.all([
            this.loadModule('reset'),
            this.loadModule('base'),
            this.loadModule('video-bg'),
            this.loadModule('red-bar'),
            this.loadModule('blue-bar'),
            this.loadModule('yellow-square'),
            this.loadModule('black-bar'),
            this.loadModule('status-widgets'),
            this.loadModule('app-buttons'),
            this.loadModule('workspace')
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
        
        // Forzar la reproducción
        video.play().catch(error => {
            console.log('Error al reproducir video:', error);
        });
        
        console.log('Video de fondo creado');
        
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
        systemWidget.className = 'status-widget-container';
        
        // Crear elementos del widget
        const timeWidget = document.createElement('div');
        timeWidget.className = 'status-widget status-widget-clock';
        timeWidget.innerHTML = `
            <div id="widget-hora" class="status-time">00:00</div>
            <div id="widget-fecha" class="status-date">01/01/2025</div>
        `;
        
        const batteryWidget = document.createElement('div');
        batteryWidget.className = 'status-widget status-widget-battery';
        batteryWidget.innerHTML = `
            <i class="widget-icon fas fa-battery-three-quarters"></i>
            <span id="widget-battery">100%</span>
        `;
        
        const wifiWidget = document.createElement('div');
        wifiWidget.className = 'status-widget status-widget-wifi';
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
        
        // Crear contenedor para botones de aplicaciones
        const appsContainer = document.createElement('div');
        appsContainer.id = 'apps-container';
        appsContainer.className = 'apps-container';
        blueBar.appendChild(appsContainer);
        
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
