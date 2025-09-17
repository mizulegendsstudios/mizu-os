/*
 * Mizu OS - Performance App - Metrics Collector Module
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
 * Módulo para recopilar métricas de rendimiento
 * docs/apps/performance/modules/metrics-collector.js
 */
export default class MetricsCollector {
  constructor() {
    this.fpsCounter = 0;
    this.lastTime = performance.now();
    this.fpsCallback = null;
    this.fpsAnimationId = null;
  }
  
  // Iniciar medición de FPS
  startFPSMeasurement(callback) {
    // Detener cualquier medición anterior
    this.stopFPSMeasurement();
    
    this.fpsCallback = callback;
    this.fpsCounter = 0;
    this.lastTime = performance.now();
    
    // Función para actualizar FPS
    const updateFPS = () => {
      this.fpsCounter++;
      const currentTime = performance.now();
      const elapsed = currentTime - this.lastTime;
      
      if (elapsed >= 1000) {
        const fps = Math.round((this.fpsCounter * 1000) / elapsed);
        
        // Llamar al callback con el valor de FPS
        if (this.fpsCallback) {
          this.fpsCallback(fps);
        }
        
        // Reiniciar contador
        this.fpsCounter = 0;
        this.lastTime = currentTime;
      }
      
      // Continuar la animación
      this.fpsAnimationId = requestAnimationFrame(updateFPS);
    };
    
    // Iniciar la animación
    this.fpsAnimationId = requestAnimationFrame(updateFPS);
  }
  
  // Detener medición de FPS
  stopFPSMeasurement() {
    if (this.fpsAnimationId) {
      cancelAnimationFrame(this.fpsAnimationId);
      this.fpsAnimationId = null;
    }
    this.fpsCallback = null;
  }
  
  // Medir uso de memoria
  measureMemoryUsage(callback) {
    if (performance.memory) {
      // API de memoria disponible en navegadores basados en Chromium
      const used = performance.memory.usedJSHeapSize;
      const total = performance.memory.totalJSHeapSize;
      const limit = performance.memory.jsHeapSizeLimit;
      
      const ramUsage = Math.round((used / limit) * 100);
      
      // Llamar al callback con el valor de uso de RAM
      setTimeout(() => {
        if (callback) {
          callback(ramUsage);
        }
      }, 1000);
    } else {
      // Si no hay API disponible, informar explícitamente
      setTimeout(() => {
        if (callback) {
          callback(-1); // Usamos -1 para indicar que no se puede medir
        }
      }, 1000);
    }
  }
  
  // Medir carga de CPU
  measureCPULoad(callback) {
    // Intentar usar la API de Navigation Timing para medir el rendimiento
    if (window.performance && performance.timing) {
      const timing = performance.timing;
      
      // Calcular el tiempo que tardó la página en cargar
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      
      // Calcular el tiempo que tardó en estar lista para la interacción
      const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;
      
      // Calcular un índice de rendimiento basado en estos tiempos
      // Valores más altos indican peor rendimiento
      const performanceIndex = (pageLoadTime + domReadyTime) / 2;
      
      // Convertir a un porcentaje (valores típicos entre 0-100)
      // Asumimos que un tiempo de carga de 5000ms es 100% de uso
      const cpuLoad = Math.min(100, Math.round((performanceIndex / 5000) * 100));
      
      // Llamar al callback con el valor de carga de CPU
      setTimeout(() => {
        if (callback) {
          callback(cpuLoad);
        }
      }, 1000);
    } else {
      // Si no hay API disponible, informar explícitamente
      setTimeout(() => {
        if (callback) {
          callback(-1); // Usamos -1 para indicar que no se puede medir
        }
      }, 1000);
    }
  }
  
  // Detectar problemas de video
  detectVideoIssues(callback) {
    // Medir el tiempo de carga de un video de prueba
    const videoTest = document.createElement('video');
    videoTest.preload = 'auto';
    videoTest.src = 'https://cdn.jsdelivr.net/gh/mizulegendsstudios/mizu-board@main/docs/assets/bibiye.webm';
    
    const startTime = performance.now();
    let videoLag = false;
    let videoLoadTime = 0;
    let callbackCalled = false;
    
    videoTest.onloadeddata = () => {
      if (callbackCalled) return;
      callbackCalled = true;
      
      const endTime = performance.now();
      videoLoadTime = endTime - startTime;
      
      // Determinar si hay problemas de video basado en el tiempo de carga
      // Si el video tarda más de 1 segundo en cargar, consideramos que hay problemas
      videoLag = videoLoadTime > 1000;
      
      // Llamar al callback con los valores
      if (callback) {
        callback(videoLag, videoLoadTime);
      }
      
      // Limpiar el elemento de video de prueba
      setTimeout(() => {
        if (videoTest.parentNode) {
          videoTest.parentNode.removeChild(videoTest);
        }
      }, 100);
    };
    
    videoTest.onerror = () => {
      if (callbackCalled) return;
      callbackCalled = true;
      
      // Si hay un error al cargar el video, consideramos que hay problemas
      videoLag = true;
      videoLoadTime = -1; // Usamos -1 para indicar error de carga
      
      // Llamar al callback con los valores
      if (callback) {
        callback(videoLag, videoLoadTime);
      }
      
      // Limpiar el elemento de video de prueba
      setTimeout(() => {
        if (videoTest.parentNode) {
          videoTest.parentNode.removeChild(videoTest);
        }
      }, 100);
    };
    
    // Si el video no carga después de 5 segundos, asumimos que hay problemas
    setTimeout(() => {
      if (callbackCalled) return;
      callbackCalled = true;
      
      videoLag = true;
      videoLoadTime = -1; // Usamos -1 para indicar tiempo de espera agotado
      
      // Llamar al callback con los valores
      if (callback) {
        callback(videoLag, videoLoadTime);
      }
      
      // Limpiar el elemento de video de prueba
      if (videoTest.parentNode) {
        videoTest.parentNode.removeChild(videoTest);
      }
    }, 5000);
  }
}
