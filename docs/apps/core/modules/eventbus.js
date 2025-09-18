/*
 * Mizu OS - EventBus Module
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
 * Sistema de eventos para Mizu OS
 * Gestiona la comunicación entre componentes mediante un sistema de publicación/suscripción
 * // apps/core/modules/eventbus.js
 */
export default class EventBus {
  constructor() {
    this.events = {};
    this.initialized = false;
    this.eventHistory = []; // Para depuración
    this.maxHistorySize = 50; // Límite de historial para evitar consumo excesivo de memoria
    console.log('[DEBUG] EventBus: Constructor llamado');
  }

  init() {
    console.log('[DEBUG] EventBus: Inicializando');
    this.initialized = true;
    
    // Suscribirse a eventos del sistema para depuración
    this.on('eventbus:subscribe', (data) => {
      console.log(`[DEBUG] EventBus: Suscripción registrada: ${data.eventName} por ${data.component}`);
    });
    
    this.on('eventbus:unsubscribe', (data) => {
      console.log(`[DEBUG] EventBus: Suscripción cancelada: ${data.eventName} por ${data.component}`);
    });
    
    return true;
  }

  on(eventName, callback) {
    if (!this.initialized) {
      console.warn(`[WARN] EventBus: Intento de suscripción a ${eventName} antes de inicializar`);
      return false;
    }
    
    console.log(`[DEBUG] EventBus: Suscribiéndose al evento ${eventName}`);
    
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    
    // Evitar duplicados
    if (!this.events[eventName].includes(callback)) {
      this.events[eventName].push(callback);
      
      // Emitir evento de depuración solo si no es un evento de depuración para evitar recursión
      if (!eventName.startsWith('eventbus:')) {
        this.emit('eventbus:subscribe', {
          eventName,
          component: this.getCallbackName(callback),
          timestamp: Date.now()
        });
      }
    }
    
    console.log(`[DEBUG] EventBus: Suscripción a ${eventName} completada. Total suscriptores: ${this.events[eventName].length}`);
    return true;
  }

  off(eventName, callback) {
    if (!this.initialized) {
      console.warn(`[WARN] EventBus: Intento de cancelar suscripción a ${eventName} antes de inicializar`);
      return false;
    }
    
    console.log(`[DEBUG] EventBus: Cancelando suscripción al evento ${eventName}`);
    
    if (!this.events[eventName]) {
      console.warn(`[WARN] EventBus: Intento de cancelar suscripción a ${eventName} que no existe`);
      return false;
    }
    
    const initialLength = this.events[eventName].length;
    this.events[eventName] = this.events[eventName].filter(
      eventCallback => eventCallback !== callback
    );
    
    // Emitir evento de depuración si se canceló alguna suscripción
    if (this.events[eventName].length < initialLength && !eventName.startsWith('eventbus:')) {
      this.emit('eventbus:unsubscribe', {
        eventName,
        component: this.getCallbackName(callback),
        timestamp: Date.now()
      });
    }
    
    console.log(`[DEBUG] EventBus: Suscripción a ${eventName} cancelada. Suscriptores restantes: ${this.events[eventName].length}`);
    return true;
  }

  emit(eventName, data) {
    if (!this.initialized) {
      console.warn(`[WARN] EventBus: Intento de emitir evento ${eventName} antes de inicializar`);
      return false;
    }
    
    console.log(`[DEBUG] EventBus: Emitiendo evento ${eventName} con datos:`, data);
    
    // Guardar en el historial para depuración
    this.addToHistory(eventName, data);
    
    if (!this.events[eventName] || this.events[eventName].length === 0) {
      console.log(`[DEBUG] EventBus: No hay suscriptores para ${eventName}`);
      return false;
    }
    
    // Crear una copia del array de callbacks para evitar problemas si se modifica durante la ejecución
    const callbacks = [...this.events[eventName]];
    let successfulCallbacks = 0;
    
    callbacks.forEach(callback => {
      try {
        callback(data);
        successfulCallbacks++;
      } catch (error) {
        console.error(`[ERROR] EventBus: Error al ejecutar callback para ${eventName}:`, error);
        
        // Evitar recursión infinita al emitir eventos de error
        if (eventName !== 'eventbus:error') {
          try {
            // Emitir evento de error para que otros componentes puedan manejarlo
            this.emit('eventbus:error', {
              eventName,
              error: error.message,
              component: this.getCallbackName(callback),
              timestamp: Date.now()
            });
          } catch (innerError) {
            console.error(`[ERROR] EventBus: Error al emitir evento de error:`, innerError);
          }
        }
      }
    });
    
    console.log(`[DEBUG] EventBus: Evento ${eventName} emitido a ${successfulCallbacks}/${callbacks.length} suscriptores`);
    return successfulCallbacks > 0;
  }
  
  /**
   * Suscribe a un evento y se desuscribe automáticamente después de la primera ejecución
   */
  once(eventName, callback) {
    const wrappedCallback = (data) => {
      callback(data);
      this.off(eventName, wrappedCallback);
    };
    
    return this.on(eventName, wrappedCallback);
  }
  
  /**
   * Obtiene la lista de eventos registrados
   */
  getRegisteredEvents() {
    return Object.keys(this.events);
  }
  
  /**
   * Obtiene el número de suscriptores para un evento específico
   */
  getSubscriberCount(eventName) {
    return this.events[eventName] ? this.events[eventName].length : 0;
  }
  
  /**
   * Limpia todos los suscriptores de un evento específico
   */
  clearEvent(eventName) {
    if (this.events[eventName]) {
      const count = this.events[eventName].length;
      this.events[eventName] = [];
      console.log(`[DEBUG] EventBus: Evento ${eventName} limpiado. ${count} suscriptores eliminados`);
      return count;
    }
    return 0;
  }
  
  /**
   * Limpia todos los eventos y suscriptores
   */
  clearAllEvents() {
    const eventCount = Object.keys(this.events).length;
    let totalSubscribers = 0;
    
    Object.keys(this.events).forEach(eventName => {
      totalSubscribers += this.events[eventName].length;
    });
    
    this.events = {};
    console.log(`[DEBUG] EventBus: Todos los eventos limpiados. ${eventCount} eventos con ${totalSubscribers} suscriptores eliminados`);
    return { eventCount, totalSubscribers };
  }
  
  /**
   * Agrega un evento al historial para depuración
   */
  addToHistory(eventName, data) {
    this.eventHistory.push({
      eventName,
      data,
      timestamp: Date.now()
    });
    
    // Mantener el tamaño del historial dentro de los límites
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }
  }
  
  /**
   * Obtiene el historial de eventos
   */
  getEventHistory() {
    return [...this.eventHistory];
  }
  
  /**
   * Obtiene el nombre de un callback para depuración
   */
  getCallbackName(callback) {
    if (callback.name) {
      return callback.name;
    }
    // Si la función no tiene nombre, intentamos obtenerla del toString
    const callbackStr = callback.toString();
    const match = callbackStr.match(/^function\s*([^\s(]+)/);
    return match ? match[1] : 'anonymous';
  }
}
