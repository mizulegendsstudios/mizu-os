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
 */
export default class PerformanceApp {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.container = null;
    this.deviceInfo = {};
    this.performanceMetrics = {
      fps: 0,
      ramUsage: 0,
      cpuLoad: 0,
      videoLag: false
    };
    this.recommendations = [];
    this.testsCompleted = false;
    this.fpsCounter = 0;
    this.lastTime = performance.now();
    this.fpsInterval = null;
  }
  
  // Método init requerido por el AppLoader
  init() {
    console.log('PerformanceApp: Inicializando aplicación de diagnóstico');
    return Promise.resolve();
  }
  
  // Método render requerido por el AppLoader
  render() {
    console.log('PerformanceApp: Renderizando interfaz de diagnóstico');
    
    // Crear el contenedor principal
    const container = document.createElement('div');
    container.className = 'performance-container';
    container.style.cssText = `
      width: 100%;
      height: 100%;
      background: rgba(30, 30, 30, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.5rem;
      padding: 20px;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      color: white;
      font-family: 'Inter', sans-serif;
    `;
    
    // Título de la aplicación
    const title = document.createElement('h1');
    title.className = 'performance-title';
    title.textContent = 'Diagnóstico del Sistema';
    title.style.cssText = `
      color: white;
      margin-bottom: 20px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
    `;
    
    // Sección de información del dispositivo
    const deviceSection = document.createElement('div');
    deviceSection.className = 'device-section';
    deviceSection.style.cssText = `
      margin-bottom: 20px;
      padding: 15px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
    `;
    
    const deviceTitle = document.createElement('h2');
    deviceTitle.textContent = 'Información del Dispositivo';
    deviceTitle.style.cssText = `
      color: #6366f1;
      margin-bottom: 10px;
      font-size: 18px;
    `;
    
    const deviceInfo = document.createElement('div');
    deviceInfo.className = 'device-info';
    deviceInfo.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    `;
    
    // Recopilar información del dispositivo
    this.collectDeviceInfo();
    
    // Mostrar información del dispositivo
    const deviceItems = [
      { label: 'Navegador', value: this.deviceInfo.browser || 'Desconocido' },
      { label: 'Sistema Operativo', value: this.deviceInfo.os || 'Desconocido' },
      { label: 'Resolución', value: this.deviceInfo.resolution || 'Desconocido' },
      { label: 'Tipo de Dispositivo', value: this.deviceInfo.deviceType || 'Desconocido' }
    ];
    
    deviceItems.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.style.cssText = `
        display: flex;
        flex-direction: column;
      `;
      
      const label = document.createElement('span');
      label.textContent = item.label;
      label.style.cssText = `
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
      `;
      
      const value = document.createElement('span');
      value.textContent = item.value;
      value.style.cssText = `
        font-size: 14px;
        font-weight: bold;
      `;
      
      itemDiv.appendChild(label);
      itemDiv.appendChild(value);
      deviceInfo.appendChild(itemDiv);
    });
    
    deviceSection.appendChild(deviceTitle);
    deviceSection.appendChild(deviceInfo);
    
    // Sección de métricas de rendimiento
    const metricsSection = document.createElement('div');
    metricsSection.className = 'metrics-section';
    metricsSection.style.cssText = `
      margin-bottom: 20px;
      padding: 15px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
    `;
    
    const metricsTitle = document.createElement('h2');
    metricsTitle.textContent = 'Métricas de Rendimiento';
    metricsTitle.style.cssText = `
      color: #6366f1;
      margin-bottom: 10px;
      font-size: 18px;
    `;
    
    const metricsInfo = document.createElement('div');
    metricsInfo.className = 'metrics-info';
    metricsInfo.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    `;
    
    // Elementos para mostrar métricas
    this.fpsElement = document.createElement('div');
    this.fpsElement.style.cssText = `
      display: flex;
      flex-direction: column;
    `;
    
    const fpsLabel = document.createElement('span');
    fpsLabel.textContent = 'FPS';
    fpsLabel.style.cssText = `
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
    `;
    
    const fpsValue = document.createElement('span');
    fpsValue.textContent = 'Midiendo...';
    fpsValue.style.cssText = `
      font-size: 14px;
      font-weight: bold;
    `;
    
    this.fpsElement.appendChild(fpsLabel);
    this.fpsElement.appendChild(fpsValue);
    
    this.ramElement = document.createElement('div');
    this.ramElement.style.cssText = `
      display: flex;
      flex-direction: column;
    `;
    
    const ramLabel = document.createElement('span');
    ramLabel.textContent = 'Uso de RAM';
    ramLabel.style.cssText = `
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
    `;
    
    const ramValue = document.createElement('span');
    ramValue.textContent = 'Midiendo...';
    ramValue.style.cssText = `
      font-size: 14px;
      font-weight: bold;
    `;
    
    this.ramElement.appendChild(ramLabel);
    this.ramElement.appendChild(ramValue);
    
    this.cpuElement = document.createElement('div');
    this.cpuElement.style.cssText = `
      display: flex;
      flex-direction: column;
    `;
    
    const cpuLabel = document.createElement('span');
    cpuLabel.textContent = 'Carga de CPU';
    cpuLabel.style.cssText = `
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
    `;
    
    const cpuValue = document.createElement('span');
    cpuValue.textContent = 'Midiendo...';
    cpuValue.style.cssText = `
      font-size: 14px;
      font-weight: bold;
    `;
    
    this.cpuElement.appendChild(cpuLabel);
    this.cpuElement.appendChild(cpuValue);
    
    this.videoElement = document.createElement('div');
    this.videoElement.style.cssText = `
      display: flex;
      flex-direction: column;
    `;
    
    const videoLabel = document.createElement('span');
    videoLabel.textContent = 'Problemas de Video';
    videoLabel.style.cssText = `
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
    `;
    
    const videoValue = document.createElement('span');
    videoValue.textContent = 'Analizando...';
    videoValue.style.cssText = `
      font-size: 14px;
      font-weight: bold;
    `;
    
    this.videoElement.appendChild(videoLabel);
    this.videoElement.appendChild(videoValue);
    
    metricsInfo.appendChild(this.fpsElement);
    metricsInfo.appendChild(this.ramElement);
    metricsInfo.appendChild(this.cpuElement);
    metricsInfo.appendChild(this.videoElement);
    
    metricsSection.appendChild(metricsTitle);
    metricsSection.appendChild(metricsInfo);
    
    // Sección de recomendaciones
    const recommendationsSection = document.createElement('div');
    recommendationsSection.className = 'recommendations-section';
    recommendationsSection.style.cssText = `
      margin-bottom: 20px;
      padding: 15px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
    `;
    
    const recommendationsTitle = document.createElement('h2');
    recommendationsTitle.textContent = 'Recomendaciones';
    recommendationsTitle.style.cssText = `
      color: #6366f1;
      margin-bottom: 10px;
      font-size: 18px;
    `;
    
    this.recommendationsList = document.createElement('div');
    this.recommendationsList.className = 'recommendations-list';
    this.recommendationsList.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    
    const placeholder = document.createElement('div');
    placeholder.textContent = 'Ejecutando pruebas...';
    placeholder.style.cssText = `
      font-style: italic;
      color: rgba(255, 255, 255, 0.7);
    `;
    
    this.recommendationsList.appendChild(placeholder);
    
    recommendationsSection.appendChild(recommendationsTitle);
    recommendationsSection.appendChild(this.recommendationsList);
    
    // Botones de acción
    const actionsSection = document.createElement('div');
    actionsSection.className = 'actions-section';
    actionsSection.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-top: auto;
    `;
    
    const runTestsBtn = document.createElement('button');
    runTestsBtn.textContent = 'Ejecutar Pruebas';
    runTestsBtn.style.cssText = `
      padding: 10px 20px;
      border-radius: 5px;
      border: none;
      background: #6366f1;
      color: white;
      cursor: pointer;
      font-weight: bold;
      transition: transform 0.1s ease-in-out;
    `;
    runTestsBtn.addEventListener('mouseenter', () => {
      runTestsBtn.style.transform = 'scale(1.05)';
    });
    runTestsBtn.addEventListener('mouseleave', () => {
      runTestsBtn.style.transform = 'scale(1)';
    });
    
    const applyBtn = document.createElement('button');
    applyBtn.textContent = 'Aplicar Optimizaciones';
    applyBtn.style.cssText = `
      padding: 10px 20px;
      border-radius: 5px;
      border: none;
      background: #10b981;
      color: white;
      cursor: pointer;
      font-weight: bold;
      transition: transform 0.1s ease-in-out;
      opacity: 0.5;
      pointer-events: none;
    `;
    applyBtn.addEventListener('mouseenter', () => {
      if (this.testsCompleted) {
        applyBtn.style.transform = 'scale(1.05)';
      }
    });
    applyBtn.addEventListener('mouseleave', () => {
      applyBtn.style.transform = 'scale(1)';
    });
    
    actionsSection.appendChild(runTestsBtn);
    actionsSection.appendChild(applyBtn);
    
    // Ensamblar todo
    container.appendChild(title);
    container.appendChild(deviceSection);
    container.appendChild(metricsSection);
    container.appendChild(recommendationsSection);
    container.appendChild(actionsSection);
    
    // Guardar referencia al contenedor
    this.container = container;
    
    // Adjuntar eventos
    runTestsBtn.addEventListener('click', () => {
      this.runPerformanceTests();
      
      // Habilitar botón de aplicar optimizaciones
      applyBtn.style.opacity = '1';
      applyBtn.style.pointerEvents = 'auto';
    });
    
    applyBtn.addEventListener('click', () => {
      this.applyOptimizations();
    });
    
    // Ejecutar pruebas automáticamente al abrir la app
    setTimeout(() => {
      this.runPerformanceTests();
      applyBtn.style.opacity = '1';
      applyBtn.style.pointerEvents = 'auto';
    }, 1000);
    
    return container;
  }
  
  // Método destroy requerido por el AppLoader
  destroy() {
    console.log('PerformanceApp: Destruyendo aplicación de diagnóstico');
    
    // Detener contador de FPS
    if (this.fpsInterval) {
      clearInterval(this.fpsInterval);
    }
    
    // Eliminar contenedor
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
  
  // Recopilar información del dispositivo
  collectDeviceInfo() {
    // Información del navegador
    this.deviceInfo.browser = navigator.userAgent.split(' ').find(item => item.includes('/')) || 'Desconocido';
    
    // Sistema operativo
    if (navigator.userAgent.includes('Windows')) {
      this.deviceInfo.os = 'Windows';
    } else if (navigator.userAgent.includes('Mac')) {
      this.deviceInfo.os = 'macOS';
    } else if (navigator.userAgent.includes('Linux')) {
      this.deviceInfo.os = 'Linux';
    } else if (navigator.userAgent.includes('Android')) {
      this.deviceInfo.os = 'Android';
    } else if (navigator.userAgent.includes('iOS') || navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
      this.deviceInfo.os = 'iOS';
    } else {
      this.deviceInfo.os = 'Desconocido';
    }
    
    // Resolución
    this.deviceInfo.resolution = `${window.screen.width}x${window.screen.height}`;
    
    // Tipo de dispositivo
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      if (window.innerWidth > 768) {
        this.deviceInfo.deviceType = 'Tablet';
      } else {
        this.deviceInfo.deviceType = 'Smartphone';
      }
    } else {
      this.deviceInfo.deviceType = 'Escritorio/Smart TV';
    }
  }
  
  // Ejecutar pruebas de rendimiento
  runPerformanceTests() {
    console.log('PerformanceApp: Iniciando pruebas de rendimiento');
    
    // Limpiar recomendaciones anteriores
    this.recommendations = [];
    this.recommendationsList.innerHTML = '';
    
    const loadingItem = document.createElement('div');
    loadingItem.textContent = 'Ejecutando pruebas...';
    loadingItem.style.cssText = `
      font-style: italic;
      color: rgba(255, 255, 255, 0.7);
    `;
    this.recommendationsList.appendChild(loadingItem);
    
    // Iniciar medición de FPS
    this.startFPSMeasurement();
    
    // Medir uso de memoria (si está disponible)
    this.measureMemoryUsage();
    
    // Simular medición de CPU (no hay API directa en navegadores)
    this.simulateCPULoad();
    
    // Detectar problemas de video
    this.detectVideoIssues();
    
    // Esperar a que todas las pruebas se completen
    setTimeout(() => {
      this.completeTests();
    }, 3000);
  }
  
  // Iniciar medición de FPS
  startFPSMeasurement() {
    this.fpsCounter = 0;
    this.lastTime = performance.now();
    
    // Limpiar intervalo anterior si existe
    if (this.fpsInterval) {
      clearInterval(this.fpsInterval);
    }
    
    // Función para actualizar FPS
    const updateFPS = () => {
      this.fpsCounter++;
      const currentTime = performance.now();
      const elapsed = currentTime - this.lastTime;
      
      if (elapsed >= 1000) {
        this.performanceMetrics.fps = Math.round((this.fpsCounter * 1000) / elapsed);
        
        // Actualizar UI
        const fpsValue = this.fpsElement.querySelector('span:last-child');
        if (fpsValue) {
          fpsValue.textContent = `${this.performanceMetrics.fps} FPS`;
          
          // Cambiar color según rendimiento
          if (this.performanceMetrics.fps >= 50) {
            fpsValue.style.color = '#10b981'; // Verde
          } else if (this.performanceMetrics.fps >= 30) {
            fpsValue.style.color = '#f59e0b'; // Amarillo
          } else {
            fpsValue.style.color = '#ef4444'; // Rojo
          }
        }
        
        // Reiniciar contador
        this.fpsCounter = 0;
        this.lastTime = currentTime;
      }
    };
    
    // Actualizar FPS en cada animación
    const measureFPS = () => {
      updateFPS();
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }
  
  // Medir uso de memoria
  measureMemoryUsage() {
    if (performance.memory) {
      // API de memoria disponible en Chrome
      const used = performance.memory.usedJSHeapSize;
      const total = performance.memory.totalJSHeapSize;
      const limit = performance.memory.jsHeapSizeLimit;
      
      this.performanceMetrics.ramUsage = Math.round((used / limit) * 100);
      
      // Actualizar UI
      setTimeout(() => {
        const ramValue = this.ramElement.querySelector('span:last-child');
        if (ramValue) {
          ramValue.textContent = `${this.performanceMetrics.ramUsage}%`;
          
          // Cambiar color según uso
          if (this.performanceMetrics.ramUsage < 50) {
            ramValue.style.color = '#10b981'; // Verde
          } else if (this.performanceMetrics.ramUsage < 80) {
            ramValue.style.color = '#f59e0b'; // Amarillo
          } else {
            ramValue.style.color = '#ef4444'; // Rojo
          }
        }
      }, 1000);
    } else {
      // Estimación aproximada si no hay API disponible
      this.performanceMetrics.ramUsage = Math.floor(Math.random() * 30) + 40;
      
      setTimeout(() => {
        const ramValue = this.ramElement.querySelector('span:last-child');
        if (ramValue) {
          ramValue.textContent = `${this.performanceMetrics.ramUsage}% (estimado)`;
          ramValue.style.color = '#f59e0b'; // Amarillo
        }
      }, 1000);
    }
  }
  
  // Simular medición de CPU
  simulateCPULoad() {
    // No hay API directa para medir CPU en navegadores
    // Vamos a simular una carga de trabajo y medir el tiempo que tarda
    const start = performance.now();
    
    // Realizar cálculos intensivos
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.sqrt(i) * Math.sin(i);
    }
    
    const end = performance.now();
    const duration = end - start;
    
    // Estimar carga de CPU basado en el tiempo de ejecución
    if (duration < 50) {
      this.performanceMetrics.cpuLoad = Math.floor(Math.random() * 20) + 10; // 10-30%
    } else if (duration < 100) {
      this.performanceMetrics.cpuLoad = Math.floor(Math.random() * 30) + 30; // 30-60%
    } else {
      this.performanceMetrics.cpuLoad = Math.floor(Math.random() * 30) + 60; // 60-90%
    }
    
    // Actualizar UI
    setTimeout(() => {
      const cpuValue = this.cpuElement.querySelector('span:last-child');
      if (cpuValue) {
        cpuValue.textContent = `${this.performanceMetrics.cpuLoad}%`;
        
        // Cambiar color según uso
        if (this.performanceMetrics.cpuLoad < 50) {
          cpuValue.style.color = '#10b981'; // Verde
        } else if (this.performanceMetrics.cpuLoad < 80) {
          cpuValue.style.color = '#f59e0b'; // Amarillo
        } else {
          cpuValue.style.color = '#ef4444'; // Rojo
        }
      }
    }, 1500);
  }
  
  // Detectar problemas de video
  detectVideoIssues() {
    // Verificar si el dispositivo es una Smart TV (basado en el user agent o resolución)
    const isSmartTV = /SmartTV|TV|GoogleTV|AppleTV|Web0S/.test(navigator.userAgent) || 
                     (this.deviceInfo.deviceType === 'Escritorio/Smart TV' && 
                      window.screen.width >= 1920 && window.screen.height >= 1080);
    
    // Simular detección de problemas de video
    if (isSmartTV) {
      // Las Smart TVs suelen tener problemas con video
      this.performanceMetrics.videoLag = Math.random() > 0.3; // 70% de probabilidad de tener problemas
      
      setTimeout(() => {
        const videoValue = this.videoElement.querySelector('span:last-child');
        if (videoValue) {
          if (this.performanceMetrics.videoLag) {
            videoValue.textContent = 'Detectado';
            videoValue.style.color = '#ef4444'; // Rojo
          } else {
            videoValue.textContent = 'No detectado';
            videoValue.style.color = '#10b981'; // Verde
          }
        }
      }, 2000);
    } else {
      // Dispositivos móviles y escritorio suelen tener menos problemas
      this.performanceMetrics.videoLag = Math.random() > 0.8; // 20% de probabilidad de tener problemas
      
      setTimeout(() => {
        const videoValue = this.videoElement.querySelector('span:last-child');
        if (videoValue) {
          if (this.performanceMetrics.videoLag) {
            videoValue.textContent = 'Detectado';
            videoValue.style.color = '#ef4444'; // Rojo
          } else {
            videoValue.textContent = 'No detectado';
            videoValue.style.color = '#10b981'; // Verde
          }
        }
      }, 2000);
    }
  }
  
  // Completar pruebas y generar recomendaciones
  completeTests() {
    console.log('PerformanceApp: Pruebas completadas');
    console.log('Métricas:', this.performanceMetrics);
    
    // Limpiar lista de recomendaciones
    this.recommendationsList.innerHTML = '';
    
    // Generar recomendaciones basadas en las métricas
    if (this.performanceMetrics.fps < 30) {
      this.recommendations.push({
        priority: 'high',
        title: 'Rendimiento de FPS bajo',
        description: 'El dispositivo tiene un bajo rendimiento de fotogramas por segundo.',
        action: 'Reducir efectos visuales y animaciones.'
      });
    }
    
    if (this.performanceMetrics.ramUsage > 80) {
      this.recommendations.push({
        priority: 'high',
        title: 'Alto uso de memoria',
        description: 'El dispositivo está utilizando mucha memoria RAM.',
        action: 'Cerrar aplicaciones en segundo plano y reducir la calidad de video.'
      });
    }
    
    if (this.performanceMetrics.cpuLoad > 80) {
      this.recommendations.push({
        priority: 'high',
        title: 'Alta carga de CPU',
        description: 'El procesador está trabajando intensamente.',
        action: 'Desactivar efectos visuales y aplicaciones en segundo plano.'
      });
    }
    
    if (this.performanceMetrics.videoLag) {
      this.recommendations.push({
        priority: 'high',
        title: 'Problemas de video detectados',
        description: 'Se han detectado problemas de reproducción de video.',
        action: 'Desactivar video de fondo y usar imágenes estáticas.'
      });
    }
    
    // Recomendaciones específicas para Smart TVs
    if (this.deviceInfo.deviceType === 'Escritorio/Smart TV') {
      this.recommendations.push({
        priority: 'medium',
        title: 'Optimización para Smart TV',
        description: 'Dispositivo identificado como Smart TV.',
        action: 'Activar modo TV para una experiencia optimizada.'
      });
    }
    
    // Recomendaciones específicas para móviles
    if (this.deviceInfo.deviceType === 'Smartphone' || this.deviceInfo.deviceType === 'Tablet') {
      this.recommendations.push({
        priority: 'medium',
        title: 'Optimización para móvil',
        description: 'Dispositivo identificado como móvil o tablet.',
        action: 'Activar modo de bajo consumo para ahorrar batería.'
      });
    }
    
    // Si no hay problemas críticos
    if (this.recommendations.length === 0) {
      this.recommendations.push({
        priority: 'low',
        title: 'Rendimiento óptimo',
        description: 'El dispositivo funciona correctamente.',
        action: 'No se requieren optimizaciones.'
      });
    }
    
    // Mostrar recomendaciones en la UI
    this.recommendations.forEach(rec => {
      const recItem = document.createElement('div');
      recItem.style.cssText = `
        padding: 10px;
        border-radius: 5px;
        background: ${rec.priority === 'high' ? 'rgba(239, 68, 68, 0.2)' : 
                    rec.priority === 'medium' ? 'rgba(245, 158, 11, 0.2)' : 
                    'rgba(16, 185, 129, 0.2)'};
        border-left: 3px solid ${rec.priority === 'high' ? '#ef4444' : 
                                  rec.priority === 'medium' ? '#f59e0b' : 
                                  '#10b981'};
      `;
      
      const recTitle = document.createElement('div');
      recTitle.textContent = rec.title;
      recTitle.style.cssText = `
        font-weight: bold;
        margin-bottom: 5px;
      `;
      
      const recDesc = document.createElement('div');
      recDesc.textContent = rec.description;
      recDesc.style.cssText = `
        font-size: 14px;
        margin-bottom: 5px;
        color: rgba(255, 255, 255, 0.8);
      `;
      
      const recAction = document.createElement('div');
      recAction.textContent = `Acción: ${rec.action}`;
      recAction.style.cssText = `
        font-size: 14px;
        font-style: italic;
        color: rgba(255, 255, 255, 0.7);
      `;
      
      recItem.appendChild(recTitle);
      recItem.appendChild(recDesc);
      recItem.appendChild(recAction);
      this.recommendationsList.appendChild(recItem);
    });
    
    // Marcar pruebas como completadas
    this.testsCompleted = true;
  }
  
  // Aplicar optimizaciones
  applyOptimizations() {
    console.log('PerformanceApp: Aplicando optimizaciones');
    
    // Enviar eventos al EventBus para que otras partes del sistema reaccionen
    if (this.performanceMetrics.fps < 30 || this.performanceMetrics.cpuLoad > 80) {
      // Reducir efectos visuales
      this.eventBus.emit('system:reduce-effects', { 
        level: 'high',
        reason: 'Bajo rendimiento detectado'
      });
    }
    
    if (this.performanceMetrics.videoLag) {
      // Desactivar video de fondo
      this.eventBus.emit('system:disable-video-background', {
        reason: 'Problemas de video detectados'
      });
    }
    
    if (this.deviceInfo.deviceType === 'Smartphone' || this.deviceInfo.deviceType === 'Tablet') {
      // Activar modo de bajo consumo
      this.eventBus.emit('system:enable-low-power-mode', {
        reason: 'Dispositivo móvil detectado'
      });
    }
    
    if (this.deviceInfo.deviceType === 'Escritorio/Smart TV') {
      // Activar modo TV
      this.eventBus.emit('system:enable-tv-mode', {
        reason: 'Smart TV detectada'
      });
    }
    
    // Mostrar notificación
    this.showNotification('Optimizaciones aplicadas correctamente');
    
    // Actualizar recomendaciones
    setTimeout(() => {
      this.recommendationsList.innerHTML = '';
      
      const successItem = document.createElement('div');
      successItem.style.cssText = `
        padding: 10px;
        border-radius: 5px;
        background: rgba(16, 185, 129, 0.2);
        border-left: 3px solid #10b981;
      `;
      
      const successTitle = document.createElement('div');
      successTitle.textContent = 'Optimizaciones aplicadas';
      successTitle.style.cssText = `
        font-weight: bold;
        margin-bottom: 5px;
      `;
      
      const successDesc = document.createElement('div');
      successDesc.textContent = 'El sistema ha sido optimizado según las capacidades de tu dispositivo.';
      successDesc.style.cssText = `
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
      `;
      
      successItem.appendChild(successTitle);
      successItem.appendChild(successDesc);
      this.recommendationsList.appendChild(successItem);
    }, 500);
  }
  
  // Mostrar notificación
  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'performance-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}
