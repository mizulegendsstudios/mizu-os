/*
 * Mizu OS - Performance App - Recommendations Module
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
 * Módulo para generar recomendaciones basadas en métricas de rendimiento
 * docs/apps/performance/modules/recommendations.js
 */
export default class Recommendations {
  constructor() {
    this.recommendations = [];
  }
  
  // Generar recomendaciones basadas en las métricas
  generateRecommendations(performanceMetrics, deviceInfo) {
    this.recommendations = [];
    
    // Generar recomendaciones basadas en las métricas
    if (performanceMetrics.fps < 30) {
      this.recommendations.push({
        priority: 'high',
        title: 'Rendimiento de FPS bajo',
        description: `El dispositivo tiene un bajo rendimiento de fotogramas por segundo (${performanceMetrics.fps} FPS).`,
        action: 'Reducir efectos visuales y animaciones.',
        optimization: 'reduce-effects'
      });
    }
    
    if (performanceMetrics.ramUsage > 80 && performanceMetrics.ramUsage !== -1) {
      this.recommendations.push({
        priority: 'high',
        title: 'Alto uso de memoria',
        description: `El dispositivo está utilizando mucha memoria RAM (${performanceMetrics.ramUsage}%).`,
        action: 'Cerrar aplicaciones en segundo plano y reducir la calidad de video.',
        optimization: 'reduce-memory'
      });
    } else if (performanceMetrics.ramUsage === -1) {
      this.recommendations.push({
        priority: 'medium',
        title: 'Información de memoria no disponible',
        description: 'No se puede medir el uso de memoria en este navegador.',
        action: 'Intentar con un navegador compatible para obtener esta información.',
        optimization: null
      });
    }
    
    if (performanceMetrics.cpuLoad > 80 && performanceMetrics.cpuLoad !== -1) {
      this.recommendations.push({
        priority: 'high',
        title: 'Alta carga de CPU',
        description: `El procesador está trabajando intensamente (${performanceMetrics.cpuLoad}%).`,
        action: 'Desactivar efectos visuales y aplicaciones en segundo plano.',
        optimization: 'reduce-cpu'
      });
    } else if (performanceMetrics.cpuLoad === -1) {
      this.recommendations.push({
        priority: 'medium',
        title: 'Información de CPU no disponible',
        description: 'No se puede medir la carga del procesador en este navegador.',
        action: 'Intentar con un navegador compatible para obtener esta información.',
        optimization: null
      });
    }
    
    if (performanceMetrics.videoLag) {
      if (performanceMetrics.videoLoadTime === -1) {
        this.recommendations.push({
          priority: 'high',
          title: 'Error al cargar video',
          description: 'No se pudo cargar el video de prueba.',
          action: 'Verificar la conexión a internet y los permisos del navegador.',
          optimization: 'disable-video-background'
        });
      } else {
        this.recommendations.push({
          priority: 'high',
          title: 'Problemas de video detectados',
          description: `Se han detectado problemas de reproducción de video (tiempo de carga: ${performanceMetrics.videoLoadTime}ms).`,
          action: 'Desactivar video de fondo y usar imágenes estáticas.',
          optimization: 'disable-video-background'
        });
      }
    }
    
    // Recomendaciones específicas según el tipo de dispositivo
    if (deviceInfo.deviceType === 'Smart TV') {
      this.recommendations.push({
        priority: 'medium',
        title: 'Optimización para Smart TV',
        description: 'Dispositivo identificado como Smart TV.',
        action: 'Activar modo TV para una experiencia optimizada.',
        optimization: 'enable-tv-mode'
      });
    } else if (deviceInfo.deviceType === 'Smartphone' || deviceInfo.deviceType === 'Tablet') {
      this.recommendations.push({
        priority: 'medium',
        title: 'Optimización para móvil',
        description: 'Dispositivo identificado como móvil o tablet.',
        action: 'Activar modo de bajo consumo para ahorrar batería.',
        optimization: 'enable-low-power-mode'
      });
    } else if (deviceInfo.deviceType === 'Escritorio') {
      this.recommendations.push({
        priority: 'medium',
        title: 'Optimización para escritorio',
        description: 'Dispositivo identificado como computadora de escritorio.',
        action: 'Ajustar la configuración para un rendimiento óptimo.',
        optimization: 'desktop-optimization'
      });
    }
    
    // Si no hay problemas críticos
    if (this.recommendations.length === 0) {
      this.recommendations.push({
        priority: 'low',
        title: 'Rendimiento óptimo',
        description: 'El dispositivo funciona correctamente.',
        action: 'No se requieren optimizaciones.',
        optimization: null
      });
    }
    
    return this.recommendations;
  }
}
