// docs/apps/core/appcore.js - Core App para Mizu OS v3.0.0
/*
 * Mizu OS - Core App
 * Copyright (C) 2025 Mizu Legends Studios
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */
// apps/core/appcore.js
import CSSManager from './modules/css.js';
import UIBuilder from './modules/ui-builder.js';

class CoreApp {
  constructor() {
    console.log('CoreApp: Constructor iniciado');
  }

  async initializeSystem() {
    try {
      console.log('Iniciando Mizu OS v3.0.0...');
      
      // 1. Inyectar estilos primero
      const cssManager = new CSSManager();
      cssManager.injectStyles();
      
      // 2. Esperar un frame para asegurar que los estilos se aplicaron
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      // 3. Construir la interfaz
      const uiBuilder = new UIBuilder();
      uiBuilder.buildUI();
      
      console.log('Mizu OS inicializado correctamente');
      
    } catch (error) {
      console.error('Error en inicialización:', error);
      // Mostrar error en pantalla para depuración
      document.body.innerHTML = `
        <div style="padding: 20px; background: #ff0000; color: white;">
          <h2>Error al iniciar Mizu OS</h2>
          <p>${error.message}</p>
          <pre>${error.stack}</pre>
        </div>
      `;
    }
  }
}

// Inicialización principal
window.addEventListener('load', async () => {
  console.log('window.load: Iniciando CoreApp');
  const coreApp = new CoreApp();
  await coreApp.initializeSystem();
  window.MizuOS = coreApp;
});

/*
// Importaciones de módulos del core
import { EventBus } from './modules/eventbus.js';
import { AppLoader } from './modules/app-loader.js';
import { SystemUI } from './modules/system-ui.js';
import { SystemConfig } from './modules/config.js';
import { StatusWidget } from './modules/status-widget.js';

console.log('appcore.js: Módulos importados correctamente');

class CoreApp {
  constructor() {
    console.log('CoreApp: Constructor iniciado');
    this.container = document.getElementById('app-container');
    console.log('CoreApp: Contenedor encontrado:', this.container);
    this.apps = new Map();
    this.activeApp = null;
    this.systemUI = null;
    this.config = null;
    this.statusWidget = null;
    this.init();
  }

  async init() {
    try {
      console.log(`Iniciando Mizu OS v${window.MIZU_VERSION}...`);
      
      // Inicializar módulos del sistema
      this.initSystemModules();
      
      // Crear UI básica del sistema
      this.createBasicUI();
      
      // Cargar configuración del sistema
      await this.loadSystemConfig();
      
      // Inicializar widget de estado
      this.initStatusWidget();
      
      // Descubrir y registrar aplicaciones disponibles
      await this.discoverApps();
      
      // Configurar event listeners
      this.setupEventListeners();
      
      // Ocultar pantalla de carga
      this.hideLoadingScreen();
      
      console.log('Mizu OS inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar Mizu OS:', error);
      this.showError(error);
    }
  }

  initSystemModules() {
    console.log('CoreApp: Inicializando módulos del sistema');
    
    // Inicializar EventBus global
    if (!window.eventBus) {
      window.eventBus = new EventBus();
      console.log('CoreApp: EventBus creado');
    }
    
    // Inicializar AppLoader global
    if (!window.appLoader) {
      window.appLoader = new AppLoader();
      console.log('CoreApp: AppLoader creado');
    }
    
    // Inicializar módulos del sistema
    this.systemUI = new SystemUI();
    this.config = new SystemConfig();
    this.statusWidget = new StatusWidget();
    
    console.log('CoreApp: Módulos del sistema inicializados');
  }

  createBasicUI() {
    console.log('CoreApp: Creando UI básica');
    console.log('CoreApp: Contenedor antes de limpiar:', this.container.innerHTML);
    
    // Limpiar contenedor
    this.container.innerHTML = '';
    
    // Crear estructura básica del sistema
    this.systemUI.createSystemStructure(this.container);
    
    console.log('CoreApp: Contenedor después de crear estructura:', this.container.innerHTML);
    console.log('CoreApp: UI básica del sistema creada');
    
    // Verificar que los elementos existan
    const redBar = document.getElementById('red-bar');
    const blueBar = document.getElementById('blue-bar');
    const blackBar = document.getElementById('black-bar');
    const yellowSquare = document.getElementById('yellow-square');
    
    console.log('CoreApp: Verificación de elementos:');
    console.log('CoreApp: redBar existe:', !!redBar);
    console.log('CoreApp: blueBar existe:', !!blueBar);
    console.log('CoreApp: blackBar existe:', !!blackBar);
    console.log('CoreApp: yellowSquare existe:', !!yellowSquare);
  }

  async loadSystemConfig() {
    try {
      await this.config.init();
      console.log('Configuración del sistema cargada');
    } catch (error) {
      console.error('Error al cargar configuración:', error);
      // Usar configuración por defecto
      this.config.loadDefaults();
    }
  }

  initStatusWidget() {
    // Inicializar widget de estado en la barra roja
    const redBar = document.getElementById('red-bar');
    if (redBar) {
      this.statusWidget.init(redBar);
      console.log('Widget de estado inicializado');
    } else {
      console.error('No se encontró la barra roja para inicializar el widget');
    }
  }

  async discoverApps() {
    // Lista de aplicaciones disponibles
    const availableApps = [
      'diagram',
      'editor',
      'music',
      'settings',
      'spreadsheet'
    ];
    
    let discoveredCount = 0;
    
    // Cargar manifiestos y crear botones para cada app
    for (const appName of availableApps) {
      try {
        const manifest = await window.appLoader.fetchManifest(appName);
        this.registerApp(appName, manifest);
        discoveredCount++;
      } catch (error) {
        console.warn(`No se pudo cargar la app ${appName}:`, error.message);
        // Continuar con las demás apps
      }
    }
    
    console.log(`${discoveredCount} aplicaciones descubiertas de ${availableApps.length}`);
    
    // Si no se descubrió ninguna app, mostrar mensaje
    if (discoveredCount === 0) {
      console.warn('No se pudo descubrir ninguna aplicación');
      this.showNoAppsWarning();
    }
  }

  showNoAppsWarning() {
    const warning = document.createElement('div');
    warning.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      z-index: 1000;
    `;
    warning.innerHTML = `
      <h3>⚠️ Advertencia</h3>
      <p>No se encontraron aplicaciones disponibles.</p>
      <p>Verifica que los archivos manifest.json existan.</p>
    `;
    document.body.appendChild(warning);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
      warning.remove();
    }, 5000);
  }

  registerApp(appName, manifest) {
    // Guardar información de la app
    this.apps.set(appName, {
      manifest,
      loaded: false,
      instance: null
    });
    
    // Crear botón en la barra lateral
    this.createAppButton(appName, manifest);
    
    console.log(`App ${appName} registrada`);
  }

  createAppButton(appName, manifest) {
    // Buscar el contenedor de aplicaciones
    const appsContainer = document.getElementById('apps-container');
    if (!appsContainer) {
      console.error('No se encontró el contenedor de aplicaciones');
      return;
    }
    
    const button = document.createElement('button');
    button.className = 'app-button';
    button.title = manifest.name;
    button.innerHTML = manifest.icon || '📱';
    button.dataset.app = appName;
    
    button.addEventListener('click', () => {
      this.activateApp(appName);
    });
    
    appsContainer.appendChild(button);
    console.log(`Botón para app ${appName} creado`);
  }

  async activateApp(appName) {
    if (!this.apps.has(appName)) {
      console.error(`App ${appName} no está registrada`);
      return;
    }
    
    const appData = this.apps.get(appName);
    
    // Desactivar app actual
    if (this.activeApp && this.activeApp !== appName) {
      const currentApp = this.apps.get(this.activeApp);
      if (currentApp && currentApp.instance) {
        currentApp.instance.hide();
      }
      
      // Actualizar estado de botones
      document.querySelectorAll('.app-button').forEach(btn => {
        btn.classList.remove('active');
      });
    }
    
    // Cargar la app si no está cargada
    if (!appData.loaded) {
      try {
        appData.instance = await window.appLoader.loadApp(appName);
        appData.loaded = true;
      } catch (error) {
        console.error(`Error al cargar app ${appName}:`, error);
        return;
      }
    }
    
    // Activar la app
    if (appData.instance) {
      appData.instance.show();
      this.activeApp = appName;
      
      // Actualizar estado del botón
      const button = document.querySelector(`.app-button[data-app="${appName}"]`);
      if (button) {
        button.classList.add('active');
      }
      
      // Notificar al sistema
      window.eventBus.emit('appActivated', { appName });
    }
  }

  setupEventListeners() {
    // Escuchar eventos globales
    window.eventBus.on('systemError', (data) => {
      console.error('Error del sistema:', data.error);
      this.showError(data.error);
    });
    
    window.eventBus.on('appLoaded', (data) => {
      console.log(`App ${data.appName} cargada correctamente`);
    });
    
    // Configurar evento del holograma
    const hologram = document.getElementById('yellow-square');
    if (hologram) {
      hologram.addEventListener('click', () => {
        this.activateApp('settings');
      });
    }
    
    // Configurar evento del botón de configuración
    const configButton = document.getElementById('config-button');
    if (configButton) {
      configButton.addEventListener('click', () => {
        this.activateApp('settings');
      });
    }
  }

  hideLoadingScreen() {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.style.opacity = '0';
      setTimeout(() => {
        loading.style.display = 'none';
      }, 500);
    }
    
    // Hacer visible el HTML
    document.body.classList.add('loaded');
  }

  showError(error) {
    console.error('Mostrando error:', error);
    
    // Crear contenedor de error
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-container';
    errorContainer.style.position = 'fixed';
    errorContainer.style.top = '0';
    errorContainer.style.left = '0';
    errorContainer.style.width = '100%';
    errorContainer.style.height = '100%';
    errorContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    errorContainer.style.display = 'flex';
    errorContainer.style.flexDirection = 'column';
    errorContainer.style.justifyContent = 'center';
    errorContainer.style.alignItems = 'center';
    errorContainer.style.zIndex = '10000';
    errorContainer.style.color = 'white';
    errorContainer.style.padding = '20px';
    errorContainer.style.textAlign = 'center';
    
    errorContainer.innerHTML = `
      <h2 style="color: #bb86fc; margin-bottom: 20px;">Error al iniciar Mizu OS</h2>
      <p style="margin-bottom: 20px; max-width: 600px;">${error.message || 'Error desconocido'}</p>
      <button id="retry-button" class="btn">Reintentar</button>
    `;
    
    document.body.appendChild(errorContainer);
    
    // Configurar botón de reintentar
    const retryButton = document.getElementById('retry-button');
    if (retryButton) {
      retryButton.addEventListener('click', () => {
        location.reload();
      });
    }
  }

  // Métodos públicos
  getApp(appName) {
    return this.apps.get(appName);
  }

  getActiveApp() {
    return this.activeApp;
  }

  getConfig() {
    return this.config;
  }
}

// Inicializar el sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('DOMContentLoaded: Iniciando CoreApp');
    
    // Crear instancia del CoreApp
    window.coreApp = new CoreApp();
    
    // Exportar para depuración
    window.MizuOS = {
      version: window.MIZU_VERSION,
      coreApp: window.coreApp,
      eventBus: window.eventBus,
      appLoader: window.appLoader,
      config: window.coreApp.getConfig()
    };
    
    console.log('Mizu OS Core App inicializado');
  } catch (error) {
    console.error('Error crítico al inicializar Mizu OS:', error);
    
    // Mostrar error crítico
    const errorContainer = document.createElement('div');
    errorContainer.style.position = 'fixed';
    errorContainer.style.top = '0';
    errorContainer.style.left = '0';
    errorContainer.style.width = '100%';
    errorContainer.style.height = '100%';
    errorContainer.style.backgroundColor = '#121212';
    errorContainer.style.color = '#e0e0e0';
    errorContainer.style.display = 'flex';
    errorContainer.style.flexDirection = 'column';
    errorContainer.style.justifyContent = 'center';
    errorContainer.style.alignItems = 'center';
    errorContainer.style.zIndex = '10000';
    errorContainer.style.padding = '20px';
    errorContainer.style.textAlign = 'center';
    
    errorContainer.innerHTML = `
      <h1 style="color: #ff5252; margin-bottom: 20px;">Error Crítico</h1>
      <p style="margin-bottom: 20px; max-width: 600px;">No se pudo iniciar Mizu OS. Por favor, recarga la página.</p>
      <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 4px; overflow: auto; max-width: 80%;">${error.stack}</pre>
      <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #bb86fc; border: none; border-radius: 4px; color: white; cursor: pointer;">Recargar</button>
    `;
    
    document.body.appendChild(errorContainer);
  }
});
*/
