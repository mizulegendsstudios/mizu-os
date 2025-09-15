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

// Importaciones de módulos del core
import { EventBus } from './modules/eventbus.js';
import { AppLoader } from './modules/app-loader.js';
import { SystemUI } from './modules/system-ui.js';
import { SystemConfig } from './modules/config.js';
import { StatusWidget } from './modules/status-widget.js';

// Importación explícita del CSS Loader
import { CoreCSSLoader } from './modules/css.js';

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
      
      // Cargar estilos esenciales
      console.log('CoreApp: Cargando estilos esenciales');
      
      // Verificar que CoreCSS esté disponible
      if (!window.CoreCSS) {
        console.error('CoreApp: CoreCSS no está disponible, creando instancia manualmente');
        window.CoreCSS = new CoreCSSLoader();
      }
      
      await window.CoreCSS.loadEssentials();
      console.log('CoreApp: Estilos esenciales cargados');
      
      // Verificar que los estilos se hayan cargado
      console.log('CoreApp: Verificando estilos cargados. Total de estilos en head:', document.head.querySelectorAll('style').length);
      document.head.querySelectorAll('style').forEach((style, index) => {
        console.log(`CoreApp: Estilo ${index}:`, style.id || 'sin id');
      });
      
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
    
    if (redBar) {
      console.log('CoreApp: redBar computed style:', window.getComputedStyle(redBar));
    }
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
      console.error('No se encontró el contenedor
