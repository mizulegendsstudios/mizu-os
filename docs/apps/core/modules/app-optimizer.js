/*
 * Mizu OS - App Optimizer Module
 * Copyright (C) 2025 Mizu Legends Studios.
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Gestor de optimizaciones del sistema para Mizu OS
 * Maneja la aplicación de optimizaciones de rendimiento y ahorro de energía
 * // apps/core/modules/app-optimizer.js
 */
export default class AppOptimizer {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.activeOptimizations = new Set();
    this.optimizationPresets = new Map();
    
    console.log('[DEBUG] AppOptimizer: Constructor llamado con EventBus:', !!eventBus);
    
    // Inicializar presets de optimización
    this.initializePresets();
  }
  
  /**
   * Inicializa el optimizador del sistema
   */
  init() {
    console.log('AppOptimizer: Inicializando optimizador del sistema');
    
    // Suscribirse a eventos de optimización
    this.eventBus.on('system:reduce-effects', (data) => {
      console.log('AppOptimizer: Evento system:reduce-effects recibido:', data);
      this.applyOptimization('reduce-effects', data);
    });
    
    this.eventBus.on('system:disable-video-background', (data) => {
      console.log('AppOptimizer: Evento system:disable-video-background recibido:', data);
      this.applyOptimization('disable-video-background', data);
    });
    
    this.eventBus.on('system:enable-low-power-mode', (data) => {
      console.log('AppOptimizer: Evento system:enable-low-power-mode recibido:', data);
      this.applyOptimization('enable-low-power-mode', data);
    });
    
    this.eventBus.on('system:enable-tv-mode', (data) => {
      console.log('AppOptimizer: Evento system:enable-tv-mode recibido:', data);
      this.applyOptimization('enable-tv-mode', data);
    });
    
    // Eventos para desactivar optimizaciones
    this.eventBus.on('system:restore-effects', (data) => {
      console.log('AppOptimizer: Evento system:restore-effects recibido:', data);
      this.removeOptimization('reduce-effects');
    });
    
    this.eventBus.on('system:enable-video-background', (data) => {
      console.log('AppOptimizer: Evento system:enable-video-background recibido:', data);
      this.removeOptimization('disable-video-background');
    });
    
    this.eventBus.on('system:disable-low-power-mode', (data) => {
      console.log('AppOptimizer: Evento system:disable-low-power-mode recibido:', data);
      this.removeOptimization('enable-low-power-mode');
    });
    
    this.eventBus.on('system:disable-tv-mode', (data) => {
      console.log('AppOptimizer: Evento system:disable-tv-mode recibido:', data);
      this.removeOptimization('enable-tv-mode');
    });
    
    console.log('AppOptimizer: Optimizador del sistema inicializado correctamente');
    return true;
  }
  
  /**
   * Inicializa los presets de optimización predefinidos
   */
  initializePresets() {
    console.log('AppOptimizer: Inicializando presets de optimización');
    
    // Preset para dispositivos de gama baja
    this.optimizationPresets.set('low-end-device', {
      name: 'Dispositivo de gama baja',
      optimizations: ['reduce-effects', 'disable-video-background'],
      priority: 'high'
    });
    
    // Preset para modo de bajo consumo
    this.optimizationPresets.set('battery-saver', {
      name: 'Ahorro de batería',
      optimizations: ['reduce-effects', 'disable-video-background', 'enable-low-power-mode'],
      priority: 'high'
    });
    
    // Preset para Smart TVs
    this.optimizationPresets.set('smart-tv', {
      name: 'Smart TV',
      optimizations: ['enable-tv-mode'],
      priority: 'medium'
    });
    
    // Preset para modo gaming
    this.optimizationPresets.set('gaming-mode', {
      name: 'Modo gaming',
      optimizations: ['reduce-effects'],
      priority: 'medium'
    });
    
    console.log(`AppOptimizer: ${this.optimizationPresets.size} presets inicializados`);
  }
  
  /**
   * Aplica una optimización específica
   * @param {string} type - Tipo de optimización
   * @param {object} data - Datos adicionales de la optimización
   */
  applyOptimization(type, data = {}) {
    console.log(`AppOptimizer: Aplicando optimización: ${type}`, data);
    
    try {
      // Verificar si ya está activa
      if (this.activeOptimizations.has(type)) {
        console.log(`AppOptimizer: La optimización ${type} ya está activa`);
        return;
      }
      
      let success = false;
      
      switch (type) {
        case 'reduce-effects':
          success = this.reduceEffects(data);
          break;
          
        case 'disable-video-background':
          success = this.disableVideoBackground(data);
          break;
          
        case 'enable-low-power-mode':
          success = this.enableLowPowerMode(data);
          break;
          
        case 'enable-tv-mode':
          success = this.enableTVMode(data);
          break;
          
        default:
          console.warn(`AppOptimizer: Tipo de optimización desconocido: ${type}`);
          return;
      }
      
      if (success) {
        this.activeOptimizations.add(type);
        console.log(`✅ AppOptimizer: Optimización ${type} aplicada correctamente`);
        
        // Emitir evento de optimización aplicada
        this.eventBus.emit('system:optimization-applied', { type, data });
        
        // Notificar a las aplicaciones activas
        this.notifyAppsAboutOptimization(type, data);
      }
    } catch (error) {
      console.error(`❌ AppOptimizer: Error al aplicar optimización ${type}:`, error);
    }
  }
  
  /**
   * Elimina una optimización activa
   * @param {string} type - Tipo de optimización
   */
  removeOptimization(type) {
    console.log(`AppOptimizer: Eliminando optimización: ${type}`);
    
    try {
      // Verificar si está activa
      if (!this.activeOptimizations.has(type)) {
        console.log(`AppOptimizer: La optimización ${type} no está activa`);
        return;
      }
      
      let success = false;
      
      switch (type) {
        case 'reduce-effects':
          success = this.restoreEffects();
          break;
          
        case 'disable-video-background':
          success = this.enableVideoBackground();
          break;
          
        case 'enable-low-power-mode':
          success = this.disableLowPowerMode();
          break;
          
        case 'enable-tv-mode':
          success = this.disableTVMode();
          break;
          
        default:
          console.warn(`AppOptimizer: Tipo de optimización desconocido: ${type}`);
          return;
      }
      
      if (success) {
        this.activeOptimizations.delete(type);
        console.log(`✅ AppOptimizer: Optimización ${type} eliminada correctamente`);
        
        // Emitir evento de optimización eliminada
        this.eventBus.emit('system:optimization-removed', { type });
        
        // Notificar a las aplicaciones activas
        this.notifyAppsAboutOptimizationRemoval(type);
      }
    } catch (error) {
      console.error(`❌ AppOptimizer: Error al eliminar optimización ${type}:`, error);
    }
  }
  
  /**
   * Aplica un preset de optimización completo
   * @param {string} presetName - Nombre del preset
   */
  applyPreset(presetName) {
    console.log(`AppOptimizer: Aplicando preset: ${presetName}`);
    
    const preset = this.optimizationPresets.get(presetName);
    if (!preset) {
      console.error(`❌ AppOptimizer: Preset no encontrado: ${presetName}`);
      return;
    }
    
    // Aplicar cada optimización del preset
    preset.optimizations.forEach(optType => {
      this.applyOptimization(optType, { preset: presetName });
    });
    
    console.log(`✅ AppOptimizer: Preset ${presetName} aplicado correctamente`);
  }
  
  /**
   * Reduce los efectos visuales del sistema
   */
  reduceEffects(data) {
    console.log('AppOptimizer: Reduciendo efectos visuales');
    
    // Aplicar variables CSS para reducir efectos
    document.body.style.setProperty('--animation-speed', '0');
    document.body.style.setProperty('--blur-intensity', '0');
    document.body.style.setProperty('--transition-duration', '0ms');
    document.body.style.setProperty('--box-shadow-intensity', '0');
    document.body.style.setProperty('--border-radius-intensity', '0');
    
    // Añadir clase para estilos adicionales
    document.body.classList.add('reduced-effects');
    
    return true;
  }
  
  /**
   * Restaura los efectos visuales del sistema
   */
  restoreEffects() {
    console.log('AppOptimizer: Restaurando efectos visuales');
    
    // Restaurar variables CSS por defecto
    document.body.style.removeProperty('--animation-speed');
    document.body.style.removeProperty('--blur-intensity');
    document.body.style.removeProperty('--transition-duration');
    document.body.style.removeProperty('--box-shadow-intensity');
    document.body.style.removeProperty('--border-radius-intensity');
    
    // Eliminar clase
    document.body.classList.remove('reduced-effects');
    
    return true;
  }
  
  /**
   * Desactiva el video de fondo
   */
  disableVideoBackground(data) {
    console.log('AppOptimizer: Desactivando video de fondo');
    
    const videoBackground = document.getElementById('background-video');
    if (videoBackground) {
      videoBackground.style.display = 'none';
      videoBackground.pause();
      
      // Guardar estado original para poder restaurarlo
      if (!videoBackground.dataset.originalState) {
        videoBackground.dataset.originalState = JSON.stringify({
          display: videoBackground.style.display,
          currentTime: videoBackground.currentTime,
          paused: videoBackground.paused
        });
      }
    }
    
    // Añadir clase para estilos alternativos de fondo
    document.body.classList.add('no-video-background');
    
    return true;
  }
  
  /**
   * Activa el video de fondo
   */
  enableVideoBackground() {
    console.log('AppOptimizer: Activando video de fondo');
    
    const videoBackground = document.getElementById('background-video');
    if (videoBackground) {
      // Restaurar estado original si existe
      if (videoBackground.dataset.originalState) {
        const originalState = JSON.parse(videoBackground.dataset.originalState);
        videoBackground.style.display = originalState.display || '';
        videoBackground.currentTime = originalState.currentTime || 0;
        
        if (!originalState.paused) {
          videoBackground.play().catch(error => {
            console.warn('AppOptimizer: No se pudo reproducir el video:', error);
          });
        }
        
        delete videoBackground.dataset.originalState;
      } else {
        videoBackground.style.display = '';
        videoBackground.play().catch(error => {
          console.warn('AppOptimizer: No se pudo reproducir el video:', error);
        });
      }
    }
    
    // Eliminar clase
    document.body.classList.remove('no-video-background');
    
    return true;
  }
  
  /**
   * Activa el modo de bajo consumo
   */
  enableLowPowerMode(data) {
    console.log('AppOptimizer: Activando modo de bajo consumo');
    
    // Añadir clase principal
    document.body.classList.add('low-power-mode');
    
    // Reducir frecuencia de actualización de animaciones
    if (window.requestAnimationFrame) {
      // Implementar throttle para animaciones
      this.throttleAnimations();
    }
    
    // Reducir brillo si es posible (en dispositivos que lo soporten)
    this.reduceScreenBrightness();
    
    return true;
  }
  
  /**
   * Desactiva el modo de bajo consumo
   */
  disableLowPowerMode() {
    console.log('AppOptimizer: Desactivando modo de bajo consumo');
    
    // Eliminar clase principal
    document.body.classList.remove('low-power-mode');
    
    // Restaurar animaciones normales
    this.restoreAnimations();
    
    // Restaurar brillo
    this.restoreScreenBrightness();
    
    return true;
  }
  
  /**
   * Activa el modo TV
   */
  enableTVMode(data) {
    console.log('AppOptimizer: Activando modo TV');
    
    // Añadir clase principal
    document.body.classList.add('tv-mode');
    
    // Aumentar tamaño de fuentes y elementos interactivos
    document.body.style.setProperty('--ui-scale-factor', '1.2');
    document.body.style.setProperty('--touch-target-size', '48px');
    
    // Optimizar para control remoto
    this.optimizeForRemoteControl();
    
    return true;
  }
  
  /**
   * Desactiva el modo TV
   */
  disableTVMode() {
    console.log('AppOptimizer: Desactivando modo TV');
    
    // Eliminar clase principal
    document.body.classList.remove('tv-mode');
    
    // Restaurar escala por defecto
    document.body.style.removeProperty('--ui-scale-factor');
    document.body.style.removeProperty('--touch-target-size');
    
    // Restaurar navegación normal
    this.restoreNormalNavigation();
    
    return true;
  }
  
  /**
   * Notifica a las aplicaciones activas sobre una optimización
   * @param {string} type - Tipo de optimización
   * @param {object} data - Datos de la optimización
   */
  notifyAppsAboutOptimization(type, data) {
    console.log(`AppOptimizer: Notificando a aplicaciones sobre optimización: ${type}`);
    
    // Emitir evento general para todas las aplicaciones
    this.eventBus.emit('system:optimization', { type, data });
    
    // Obtener aplicaciones activas desde el AppRegistry si está disponible
    if (window.AppRegistry && window.AppRegistry.activeApps) {
      window.AppRegistry.activeApps.forEach((appData, appName) => {
        if (typeof appData.instance.onSystemOptimization === 'function') {
          try {
            appData.instance.onSystemOptimization(type, data);
          } catch (error) {
            console.error(`❌ AppOptimizer: Error al notificar a ${appName}:`, error);
          }
        }
      });
    }
  }
  
  /**
   * Notifica a las aplicaciones activas sobre la eliminación de una optimización
   * @param {string} type - Tipo de optimización
   */
  notifyAppsAboutOptimizationRemoval(type) {
    console.log(`AppOptimizer: Notificando a aplicaciones sobre eliminación de optimización: ${type}`);
    
    // Emitir evento general para todas las aplicaciones
    this.eventBus.emit('system:optimization-removed', { type });
    
    // Obtener aplicaciones activas desde el AppRegistry si está disponible
    if (window.AppRegistry && window.AppRegistry.activeApps) {
      window.AppRegistry.activeApps.forEach((appData, appName) => {
        if (typeof appData.instance.onSystemOptimizationRemoved === 'function') {
          try {
            appData.instance.onSystemOptimizationRemoved(type);
          } catch (error) {
            console.error(`❌ AppOptimizer: Error al notificar a ${appName}:`, error);
          }
        }
      });
    }
  }
  
  /**
   * Limita las animaciones para ahorrar energía
   */
  throttleAnimations() {
    console.log('AppOptimizer: Limitando animaciones');
    
    // Implementar throttling de requestAnimationFrame
    if (!this.originalRequestAnimationFrame) {
      this.originalRequestAnimationFrame = window.requestAnimationFrame;
      this.lastFrameTime = 0;
      this.frameInterval = 1000 / 30; // 30 FPS en lugar de 60
      
      window.requestAnimationFrame = (callback) => {
        const now = performance.now();
        const elapsed = now - this.lastFrameTime;
        
        if (elapsed > this.frameInterval) {
          this.lastFrameTime = now - (elapsed % this.frameInterval);
          return this.originalRequestAnimationFrame(callback);
        }
        
        return setTimeout(() => {
          this.lastFrameTime = performance.now();
          callback(performance.now());
        }, this.frameInterval - elapsed);
      };
    }
  }
  
  /**
   * Restaura las animaciones normales
   */
  restoreAnimations() {
    console.log('AppOptimizer: Restaurando animaciones');
    
    if (this.originalRequestAnimationFrame) {
      window.requestAnimationFrame = this.originalRequestAnimationFrame;
      this.originalRequestAnimationFrame = null;
      this.lastFrameTime = 0;
    }
  }
  
  /**
   * Reduce el brillo de la pantalla (si es posible)
   */
  reduceScreenBrightness() {
    console.log('AppOptimizer: Reduciendo brillo de pantalla');
    
    // Esta función solo funcionará en dispositivos que soporten la Screen Brightness API
    if ('screen' in window && 'brightness' in window.screen) {
      try {
        // Guardar brillo actual
        this.originalBrightness = window.screen.brightness;
        
        // Reducir brillo al 70%
        window.screen.brightness = 0.7;
      } catch (error) {
        console.warn('AppOptimizer: No se pudo ajustar el brillo:', error);
      }
    }
  }
  
  /**
   * Restaura el brillo de la pantalla
   */
  restoreScreenBrightness() {
    console.log('AppOptimizer: Restaurando brillo de pantalla');
    
    if ('screen' in window && 'brightness' in window.screen && this.originalBrightness) {
      try {
        window.screen.brightness = this.originalBrightness;
        this.originalBrightness = null;
      } catch (error) {
        console.warn('AppOptimizer: No se pudo restaurar el brillo:', error);
      }
    }
  }
  
  /**
   * Optimiza la interfaz para control remoto
   */
  optimizeForRemoteControl() {
    console.log('AppOptimizer: Optimizando para control remoto');
    
    // Aumentar el tamaño de los elementos enfocables
    const style = document.createElement('style');
    style.id = 'tv-mode-optimizations';
    style.textContent = `
      .tv-mode button,
      .tv-mode input,
      .tv-mode select,
      .tv-mode a[role="button"] {
        min-width: 48px !important;
        min-height: 48px !important;
        margin: 4px !important;
      }
      
      .tv-mode *:focus {
        outline: 3px solid #00ff00 !important;
        outline-offset: 2px !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * Restaura la navegación normal
   */
  restoreNormalNavigation() {
    console.log('AppOptimizer: Restaurando navegación normal');
    
    const style = document.getElementById('tv-mode-optimizations');
    if (style) {
      document.head.removeChild(style);
    }
  }
  
  /**
   * Obtiene la lista de optimizaciones activas
   */
  getActiveOptimizations() {
    return Array.from(this.activeOptimizations);
  }
  
  /**
   * Verifica si una optimización está activa
   * @param {string} type - Tipo de optimización
   */
  isOptimizationActive(type) {
    return this.activeOptimizations.has(type);
  }
  
  /**
   * Obtiene los presets disponibles
   */
  getAvailablePresets() {
    const presets = {};
    this.optimizationPresets.forEach((preset, name) => {
      presets[name] = {
        name: preset.name,
        optimizations: preset.optimizations,
        priority: preset.priority
      };
    });
    return presets;
  }
}
