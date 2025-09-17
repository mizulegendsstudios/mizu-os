/*
 * Mizu OS - Performance App - UI Module
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
 * Módulo para crear y gestionar la interfaz de usuario
 * docs/apps/performance/modules/ui.js
 */
export default class UI {
  constructor() {
    this.container = null;
    this.fpsElement = null;
    this.ramElement = null;
    this.cpuElement = null;
    this.videoElement = null;
    this.recommendationsList = null;
    this.optimizationsSection = null;
    this.optimizationsList = null;
  }
  
  // Renderizar la interfaz de usuario
  render() {
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
    const deviceSection = this.createDeviceSection();
    
    // Sección de métricas de rendimiento
    const metricsSection = this.createMetricsSection();
    
    // Sección de recomendaciones
    const recommendationsSection = this.createRecommendationsSection();
    
    // Sección de optimizaciones aplicadas
    this.optimizationsSection = this.createOptimizationsSection();
    
    // Botones de acción
    const actionsSection = this.createActionsSection();
    
    // Ensamblar todo
    container.appendChild(title);
    container.appendChild(deviceSection);
    container.appendChild(metricsSection);
    container.appendChild(recommendationsSection);
    container.appendChild(this.optimizationsSection);
    container.appendChild(actionsSection);
    
    // Guardar referencia al contenedor
    this.container = container;
    
    return container;
  }
  
  // Crear sección de información del dispositivo
  createDeviceSection() {
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
    deviceInfo.id = 'device-info';
    deviceInfo.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    `;
    
    deviceSection.appendChild(deviceTitle);
    deviceSection.appendChild(deviceInfo);
    
    return deviceSection;
  }
  
  // Crear sección de métricas de rendimiento
  createMetricsSection() {
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
    this.fpsElement = this.createMetricElement('FPS', 'Midiendo...');
    this.ramElement = this.createMetricElement('Uso de RAM', 'Midiendo...');
    this.cpuElement = this.createMetricElement('Carga de CPU', 'Midiendo...');
    this.videoElement = this.createMetricElement('Problemas de Video', 'Analizando...');
    
    metricsInfo.appendChild(this.fpsElement);
    metricsInfo.appendChild(this.ramElement);
    metricsInfo.appendChild(this.cpuElement);
    metricsInfo.appendChild(this.videoElement);
    
    metricsSection.appendChild(metricsTitle);
    metricsSection.appendChild(metricsInfo);
    
    return metricsSection;
  }
  
  // Crear elemento de métrica
  createMetricElement(label, value) {
    const element = document.createElement('div');
    element.style.cssText = `
      display: flex;
      flex-direction: column;
    `;
    
    const labelElement = document.createElement('span');
    labelElement.textContent = label;
    labelElement.style.cssText = `
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
    `;
    
    const valueElement = document.createElement('span');
    valueElement.textContent = value;
    valueElement.style.cssText = `
      font-size: 14px;
      font-weight: bold;
    `;
    
    element.appendChild(labelElement);
    element.appendChild(valueElement);
    
    return element;
  }
  
  // Crear sección de recomendaciones
  createRecommendationsSection() {
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
    
    return recommendationsSection;
  }
  
  // Crear sección de optimizaciones aplicadas
  createOptimizationsSection() {
    const optimizationsSection = document.createElement('div');
    optimizationsSection.className = 'optimizations-section';
    optimizationsSection.style.cssText = `
      margin-bottom: 20px;
      padding: 15px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      display: none;
    `;
    
    const optimizationsTitle = document.createElement('h2');
    optimizationsTitle.textContent = 'Optimizaciones Aplicadas';
    optimizationsTitle.style.cssText = `
      color: #10b981;
      margin-bottom: 10px;
      font-size: 18px;
    `;
    
    this.optimizationsList = document.createElement('div');
    this.optimizationsList.className = 'optimizations-list';
    this.optimizationsList.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    
    optimizationsSection.appendChild(optimizationsTitle);
    optimizationsSection.appendChild(this.optimizationsList);
    
    return optimizationsSection;
  }
  
  // Crear sección de botones de acción
  createActionsSection() {
    const actionsSection = document.createElement('div');
    actionsSection.className = 'actions-section';
    actionsSection.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-top: auto;
    `;
    
    const runTestsBtn = document.createElement('button');
    runTestsBtn.className = 'run-tests-btn';
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
    applyBtn.className = 'apply-btn';
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
      if (applyBtn.style.opacity === '1') {
        applyBtn.style.transform = 'scale(1.05)';
      }
    });
    applyBtn.addEventListener('mouseleave', () => {
      applyBtn.style.transform = 'scale(1)';
    });
    
    actionsSection.appendChild(runTestsBtn);
    actionsSection.appendChild(applyBtn);
    
    return actionsSection;
  }
  
  // Actualizar información del dispositivo
  updateDeviceInfo(deviceInfo) {
    const deviceInfoElement = document.getElementById('device-info');
    if (deviceInfoElement) {
      deviceInfoElement.innerHTML = '';
      
      const deviceItems = [
        { label: 'Navegador', value: deviceInfo.browser || 'Desconocido' },
        { label: 'Sistema Operativo', value: deviceInfo.os || 'Desconocido' },
        { label: 'Resolución', value: deviceInfo.resolution || 'Desconocido' },
        { label: 'Tipo de Dispositivo', value: deviceInfo.deviceType || 'Desconocido' }
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
        deviceInfoElement.appendChild(itemDiv);
      });
    }
  }
  
  // Actualizar FPS
  updateFPS(fps) {
    const fpsValue = this.fpsElement.querySelector('span:last-child');
    if (fpsValue) {
      fpsValue.textContent = `${fps} FPS`;
      
      // Cambiar color según rendimiento
      if (fps >= 50) {
        fpsValue.style.color = '#10b981'; // Verde
      } else if (fps >= 30) {
        fpsValue.style.color = '#f59e0b'; // Amarillo
      } else {
        fpsValue.style.color = '#ef4444'; // Rojo
      }
    }
  }
  
  // Actualizar uso de RAM
  updateRAM(ramUsage) {
    const ramValue = this.ramElement.querySelector('span:last-child');
    if (ramValue) {
      if (ramUsage === -1) {
        ramValue.textContent = 'No disponible';
        ramValue.style.color = '#f59e0b'; // Amarillo
      } else {
        ramValue.textContent = `${ramUsage}%`;
        
        // Cambiar color según uso
        if (ramUsage < 50) {
          ramValue.style.color = '#10b981'; // Verde
        } else if (ramUsage < 80) {
          ramValue.style.color = '#f59e0b'; // Amarillo
        } else {
          ramValue.style.color = '#ef4444'; // Rojo
        }
      }
    }
  }
  
  // Actualizar carga de CPU
  updateCPU(cpuLoad) {
    const cpuValue = this.cpuElement.querySelector('span:last-child');
    if (cpuValue) {
      if (cpuLoad === -1) {
        cpuValue.textContent = 'No disponible';
        cpuValue.style.color = '#f59e0b'; // Amarillo
      } else {
        cpuValue.textContent = `${cpuLoad}%`;
        
        // Cambiar color según uso
        if (cpuLoad < 50) {
          cpuValue.style.color = '#10b981'; // Verde
        } else if (cpuLoad < 80) {
          cpuValue.style.color = '#f59e0b'; // Amarillo
        } else {
          cpuValue.style.color = '#ef4444'; // Rojo
        }
      }
    }
  }
  
  // Actualizar problemas de video
  updateVideo(videoLag, videoLoadTime) {
    const videoValue = this.videoElement.querySelector('span:last-child');
    if (videoValue) {
      if (videoLoadTime === -1) {
        videoValue.textContent = 'Error de carga';
        videoValue.style.color = '#ef4444'; // Rojo
      } else if (videoLag) {
        videoValue.textContent = `Detectado (${videoLoadTime}ms)`;
        videoValue.style.color = '#ef4444'; // Rojo
      } else {
        videoValue.textContent = `No detectado (${videoLoadTime}ms)`;
        videoValue.style.color = '#10b981'; // Verde
      }
    }
  }
  
  // Mostrar estado de carga
  showLoading() {
    this.recommendationsList.innerHTML = '';
    
    const loadingItem = document.createElement('div');
    loadingItem.textContent = 'Ejecutando pruebas...';
    loadingItem.style.cssText = `
      font-style: italic;
      color: rgba(255, 255, 255, 0.7);
    `;
    
    this.recommendationsList.appendChild(loadingItem);
  }
  
  // Mostrar recomendaciones
  showRecommendations(recommendations) {
    this.recommendationsList.innerHTML = '';
    
    recommendations.forEach(rec => {
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
  }
  
  // Mostrar optimizaciones aplicadas
  showOptimizations(optimizationsApplied) {
    this.optimizationsSection.style.display = 'block';
    this.optimizationsList.innerHTML = '';
    
    if (optimizationsApplied.length > 0) {
      optimizationsApplied.forEach(opt => {
        const optItem = document.createElement('div');
        optItem.style.cssText = `
          padding: 10px;
          border-radius: 5px;
          background: rgba(16, 185, 129, 0.2);
          border-left: 3px solid #10b981;
        `;
        
        const optTitle = document.createElement('div');
        optTitle.textContent = opt.title;
        optTitle.style.cssText = `
          font-weight: bold;
          margin-bottom: 5px;
        `;
        
        const optDesc = document.createElement('div');
        optDesc.textContent = opt.description;
        optDesc.style.cssText = `
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        `;
        
        optItem.appendChild(optTitle);
        optItem.appendChild(optDesc);
        this.optimizationsList.appendChild(optItem);
      });
    } else {
      const noOptItem = document.createElement('div');
      noOptItem.textContent = 'No se requirieron optimizaciones.';
      noOptItem.style.cssText = `
        font-style: italic;
        color: rgba(255, 255, 255, 0.7);
      `;
      this.optimizationsList.appendChild(noOptItem);
    }
  }
  
  // Ocultar sección de optimizaciones
  hideOptimizations() {
    this.optimizationsSection.style.display = 'none';
    this.optimizationsList.innerHTML = '';
  }
  
  // Mostrar éxito de optimizaciones
  showOptimizationsSuccess() {
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
  }
  
  // Habilitar botón de aplicar optimizaciones
  enableApplyButton() {
    const applyBtn = this.container.querySelector('.apply-btn');
    if (applyBtn) {
      applyBtn.style.opacity = '1';
      applyBtn.style.pointerEvents = 'auto';
    }
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
