/*
 * Mizu OS - Performance App
 * Copyright (C) 2025 Mizu Legends Studios
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
 * Aplicación de diagnóstico y optimización del sistema para Mizu OS
 * Detecta capacidades del dispositivo y ofrece recomendaciones automáticas
 * docs/apps/performance/appcore.js
 */
import DeviceInfo from './modules/device-info.js';
import MetricsCollector from './modules/metrics-collector.js';
import Recommendations from './modules/recommendations.js';
import Optimizations from './modules/optimizations.js';
import UI from './modules/ui.js';

export default class PerformanceApp {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.container = null;
    this.deviceInfo = {};
    this.performanceMetrics = {
      fps: 0,
      ramUsage: 0,
      cpuLoad: 0,
      videoLag: false,
      videoLoadTime: 0
    };
    this.recommendations = [];
    this.testsCompleted = false;
    this.optimizationsApplied = false;
    
    // Inicializar módulos
    this.deviceInfoModule = new DeviceInfo();
    this.metricsCollector = new MetricsCollector();
    this.recommendationsModule = new Recommendations();
    this.optimizationsModule = new Optimizations(eventBus);
    this.uiModule = new UI();
  }
  
  // Método init requerido por el AppLoader
  init() {
    console.log('PerformanceApp: Inicializando aplicación de diagnóstico');
    return Promise.resolve();
  }
  
  // Método render requerido por el AppLoader
  render() {
    console.log('PerformanceApp: Renderizando interfaz de diagnóstico');
    
    // Crear la interfaz de usuario
    this.container = this.uiModule.render();
    
    // Adjuntar eventos
    this.attachEvents();
    
    // Ejecutar pruebas automáticamente al abrir la app
    setTimeout(() => {
      this.runPerformanceTests();
      this.uiModule.enableApplyButton();
    }, 1000);
    
    return this.container;
  }
  
  // Adjuntar eventos de la interfaz
  attachEvents() {
    const runTestsBtn = this.container.querySelector('.run-tests-btn');
    const applyBtn = this.container.querySelector('.apply-btn');
    
    if (runTestsBtn) {
      runTestsBtn.addEventListener('click', () => {
        this.runPerformanceTests();
        this.uiModule.enableApplyButton();
      });
    }
    
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        this.applyOptimizations();
      });
    }
  }
  
  // Ejecutar pruebas de rendimiento
  runPerformanceTests() {
    console.log('PerformanceApp: Iniciando pruebas de rendimiento');
    
    // Limpiar estado anterior
    this.testsCompleted = false;
    this.optimizationsApplied = false;
    this.recommendations = [];
    
    // Actualizar UI
    this.uiModule.showLoading();
    this.uiModule.hideOptimizations();
    
    // Recopilar información del dispositivo
    this.deviceInfo = this.deviceInfoModule.collectDeviceInfo();
    this.uiModule.updateDeviceInfo(this.deviceInfo);
    
    // Iniciar medición de FPS
    this.metricsCollector.startFPSMeasurement((fps) => {
      this.performanceMetrics.fps = fps;
      this.uiModule.updateFPS(fps);
    });
    
    // Medir uso de memoria
    this.metricsCollector.measureMemoryUsage((ramUsage) => {
      this.performanceMetrics.ramUsage = ramUsage;
      this.uiModule.updateRAM(ramUsage);
    });
    
    // Medir carga de CPU (cambiado de simulateCPULoad a measureCPULoad)
    this.metricsCollector.measureCPULoad((cpuLoad) => {
      this.performanceMetrics.cpuLoad = cpuLoad;
      this.uiModule.updateCPU(cpuLoad);
    });
    
    // Detectar problemas de video
    this.metricsCollector.detectVideoIssues((videoLag, videoLoadTime) => {
      this.performanceMetrics.videoLag = videoLag;
      this.performanceMetrics.videoLoadTime = videoLoadTime;
      this.uiModule.updateVideo(videoLag, videoLoadTime);
    });
    
    // Esperar a que todas las pruebas se completen
    setTimeout(() => {
      this.completeTests();
    }, 3000);
  }
  
  // Completar pruebas y generar recomendaciones
  completeTests() {
    console.log('PerformanceApp: Pruebas completadas');
    console.log('Métricas:', this.performanceMetrics);
    
    // Generar recomendaciones
    this.recommendations = this.recommendationsModule.generateRecommendations(
      this.performanceMetrics,
      this.deviceInfo
    );
    
    // Mostrar recomendaciones en la UI
    this.uiModule.showRecommendations(this.recommendations);
    
    // Marcar pruebas como completadas
    this.testsCompleted = true;
  }
  
  // Aplicar optimizaciones
  applyOptimizations() {
    console.log('PerformanceApp: Aplicando optimizaciones');
    
    if (this.optimizationsApplied) {
      this.uiModule.showNotification('Las optimizaciones ya han sido aplicadas');
      return;
    }
    
    // Aplicar optimizaciones
    const optimizationsApplied = this.optimizationsModule.applyOptimizations(
      this.recommendations
    );
    
    // Mostrar optimizaciones aplicadas en la UI
    this.uiModule.showOptimizations(optimizationsApplied);
    
    // Marcar optimizaciones como aplicadas
    this.optimizationsApplied = true;
    
    // Mostrar notificación
    this.uiModule.showNotification('Optimizaciones aplicadas correctamente');
    
    // Actualizar recomendaciones
    setTimeout(() => {
      this.uiModule.showOptimizationsSuccess();
    }, 500);
  }
  
  // Método destroy requerido por el AppLoader
  destroy() {
    console.log('PerformanceApp: Destruyendo aplicación de diagnóstico');
    
    // Detener contador de FPS
    this.metricsCollector.stopFPSMeasurement();
    
    // Eliminar contenedor
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
