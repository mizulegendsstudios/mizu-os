/*
 * Mizu OS - Core App
 * Copyright (C) 2025 Mizu Legends Studios
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

// Importaciones de módulos del core
import { EventBus } from './modules/eventbus.js';
import { AppLoader } from './modules/app-loader.js';
import { SystemUI } from './modules/system-ui.js';
import { SystemConfig } from './modules/config.js';
import { StatusWidget } from './modules/status-widget.js';

class CoreApp {
  constructor() {
    this.container = document.getElementById('app-container');
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
    // Inicializar EventBus global
    if (!window.eventBus) {
      window.eventBus = new EventBus();
    }
    
    // Inicializar AppLoader global
    if (!window.appLoader) {
      window.appLoader = new AppLoader();
    }
    
    // Inicializar módulos del sistema
    this.systemUI = new SystemUI();
    this.config = new SystemConfig();
    this.statusWidget = new StatusWidget();
  }

  createBasicUI() {
    // Limpiar contenedor
    this.container.innerHTML = '';
    
    // Crear estructura básica del sistema
    this.systemUI.createSystemStructure(this.container);
    
    // Crear video de fondo
    this.systemUI.createVideoBackground();
    
    console.log('UI básica del sistema creada');
  }

  async loadSystemConfig() {
    try {
      await this.config.load();
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
    
    // Cargar manifiestos y crear botones para cada app
    for (const appName of availableApps) {
      try {
        const manifest = await window.appLoader.fetchManifest(appName);
        this.registerApp(appName, manifest);
      } catch (error) {
        console.error(`Error al descubrir app ${appName}:`, error);
      }
    }
    
    console.log(`${this.apps.size} aplicaciones descubiertas`);
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
    const blueBar = document.getElementById('blue-bar');
    if (!blueBar) return;
    
    const button = document.createElement('button');
    button.className = 'app-button';
    button.title = manifest.name;
    button.innerHTML = manifest.icon || '📱';
    button.dataset.app = appName;
    
    button.addEventListener('click', () => {
      this.activateApp(appName);
    });
    
    blueBar.appendChild(button);
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
