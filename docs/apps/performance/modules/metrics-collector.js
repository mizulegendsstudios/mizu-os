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
 */
export default class MetricsCollector {
  constructor() {
    this.fpsCounter = 0;
    this.lastTime = performance.now();
    this.fpsCallback = null;
  }
  
  // Iniciar medición de FPS
  startFPSMeasurement(callback) {
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
      
      requestAnimationFrame(updateFPS);
    };
    
    requestAnimationFrame(updateFPS);
  }
  
  // Detener medición de FPS
  stopFPSMeasurement() {
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
    // Intentar usar PerformanceObserver para medir el rendimiento
    if (window.PerformanceObserver) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          let totalDuration = 0;
          let count = 0;
          
          entries.forEach(entry => {
            if (entry.entryType === 'measure') {
              totalDuration += entry.duration;
              count++;
            }
          });
          
          if (count > 0) {
            // Calcular un porcentaje basado en el tiempo de ejecución
            // Esto es una aproximación, pero no usa Math.random()
            const avgDuration = totalDuration / count;
            // Convertir a un porcentaje (valores típicos entre 0-100)
            const cpuLoad = Math.min(100, Math.round(avgDuration / 10));
            
            if (callback) {
              callback(cpuLoad);
            }
            observer.disconnect();
          }
        });
        
        observer.observe({ entryTypes: ['measure'] });
        
        // Realizar una tarea medible
        performance.mark('cpu-test-start');
        
        // Tarea intensiva para medir
        let result = 0;
        for (let i = 0; i < 100000; i++) {
          result += Math.sqrt(i);
        }
        
        performance.mark('cpu-test-end');
        performance.measure('cpu-test', 'cpu-test-start', 'cpu-test-end');
        
        // Si no recibimos resultados en 2 segundos, informar que no se puede medir
        setTimeout(() => {
          if (callback) {
            callback(-1); // Usamos -1 para indicar que no se puede medir
          }
          observer.disconnect();
        }, 2000);
        
      } catch (e) {
        // Si hay un error con PerformanceObserver, informar explícitamente
        setTimeout(() => {
          if (callback) {
            callback(-1); // Usamos -1 para indicar que no se puede medir
          }
        }, 1000);
      }
    } else {
      // Si no hay PerformanceObserver, informar explícitamente
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
