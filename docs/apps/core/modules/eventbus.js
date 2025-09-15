//docs/apps/core/modules/eventbus.js 
/*
 * Mizu OS - EventBus Module
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
 * Sistema de eventos global para comunicación entre aplicaciones
 * Implementa el patrón Publicar/Suscribirse (Pub/Sub)
 */
class EventBus {
  constructor() {
    // Mapa de eventos: { eventName: [subscription1, subscription2, ...] }
    this.events = new Map();
    
    // Mapa de suscripciones por aplicación: { appId: [subscription1, subscription2, ...] }
    this.appSubscriptions = new Map();
    
    // Contador para generar IDs únicos de suscripción
    this.subscriptionIdCounter = 0;
    
    // Configuración
    this.config = {
      // Máximo número de suscriptores por evento (para prevenir memory leaks)
      maxSubscribersPerEvent: 100,
      
      // Habilitar logging detallado
      debug: false,
      
      // Tiempo máximo de ejecución para un manejador de eventos (en ms)
      maxHandlerExecutionTime: 1000
    };
    
    // Estadísticas
    this.stats = {
      eventsEmitted: 0,
      subscriptionsCreated: 0,
      subscriptionsRemoved: 0,
      errors: 0
    };
  }

  /**
   * Suscribirse a un evento
   * @param {string} eventName - Nombre del evento
   * @param {Function} callback - Función a ejecutar cuando se emita el evento
   * @param {string} [appId] - ID de la aplicación (opcional, para limpieza)
   * @returns {Function} Función para cancelar la suscripción
   */
  on(eventName, callback, appId = null) {
    if (typeof callback !== 'function') {
      throw new Error('El callback debe ser una función');
    }
    
    // Crear entrada para el evento si no existe
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    
    // Verificar límite de suscriptores
    const subscribers = this.events.get(eventName);
    if (subscribers.length >= this.config.maxSubscribersPerEvent) {
      console.warn(`EventBus: Se alcanzó el máximo de suscriptores para el evento "${eventName}"`);
      return () => {}; // Devolver función vacía
    }
    
    // Crear objeto de suscripción
    const subscriptionId = ++this.subscriptionIdCounter;
    const subscription = {
      id: subscriptionId,
      callback,
      appId,
      eventName,
      once: false,
      createdAt: Date.now()
    };
    
    // Agregar suscripción
    subscribers.push(subscription);
    
    // Registrar suscripción por app si se especificó
    if (appId) {
      if (!this.appSubscriptions.has(appId)) {
        this.appSubscriptions.set(appId, []);
      }
      this.appSubscriptions.get(appId).push(subscription);
    }
    
    // Actualizar estadísticas
    this.stats.subscriptionsCreated++;
    
    // Logging
    if (this.config.debug) {
      console.log(`EventBus: Suscripción creada - Evento: ${eventName}, ID: ${subscriptionId}, App: ${appId || 'global'}`);
    }
    
    // Devolver función para cancelar la suscripción
    return () => this.off(eventName, subscriptionId);
  }

  /**
   * Suscribirse a un evento una sola vez
   * @param {string} eventName - Nombre del evento
   * @param {Function} callback - Función a ejecutar cuando se emita el evento
   * @param {string} [appId] - ID de la aplicación (opcional)
   * @returns {Function} Función para cancelar la suscripción
   */
  once(eventName, callback, appId = null) {
    if (typeof callback !== 'function') {
      throw new Error('El callback debe ser una función');
    }
    
    // Crear wrapper que se auto-remueve después de la primera ejecución
    const onceWrapper = (data) => {
      callback(data);
      this.off(eventName, onceWrapper.subscriptionId);
    };
    
    // Suscribirse con el wrapper
    const unsubscribe = this.on(eventName, onceWrapper, appId);
    
    // Guardar referencia al ID de suscripción para poder removerlo
    onceWrapper.subscriptionId = this.subscriptionIdCounter;
    
    return unsubscribe;
  }

  /**
   * Cancelar una suscripción
   * @param {string} eventName - Nombre del evento
   * @param {number|Function} subscriptionIdOrCallback - ID de suscripción o función callback
   * @returns {boolean} True si se canceló la suscripción, false si no se encontró
   */
  off(eventName, subscriptionIdOrCallback) {
    if (!this.events.has(eventName)) {
      return false;
    }
    
    const subscribers = this.events.get(eventName);
    let removed = false;
    
    // Buscar y remover la suscripción
    for (let i = subscribers.length - 1; i >= 0; i--) {
      const subscription = subscribers[i];
      
      // Verificar si coincide por ID o por callback
      const matches = typeof subscriptionIdOrCallback === 'number' 
        ? subscription.id === subscriptionIdOrCallback
        : subscription.callback === subscriptionIdOrCallback;
      
      if (matches) {
        // Remover de la lista de suscriptores
        subscribers.splice(i, 1);
        
        // Remover del registro por app si existe
        if (subscription.appId && this.appSubscriptions.has(subscription.appId)) {
          const appSubs = this.appSubscriptions.get(subscription.appId);
          const index = appSubs.findIndex(sub => sub.id === subscription.id);
          if (index !== -1) {
            appSubs.splice(index, 1);
          }
        }
        
        removed = true;
        this.stats.subscriptionsRemoved++;
        
        // Logging
        if (this.config.debug) {
          console.log(`EventBus: Suscripción cancelada - Evento: ${eventName}, ID: ${subscription.id}`);
        }
        
        break; // Solo remover la primera coincidencia
      }
    }
    
    // Si no hay más suscriptores, limpiar el evento
    if (subscribers.length === 0) {
      this.events.delete(eventName);
    }
    
    return removed;
  }

  /**
   * Emitir un evento
   * @param {string} eventName - Nombre del evento
   * @param {*} [data] - Datos a pasar a los suscriptores
   * @returns {number} Número de suscriptores que recibieron el evento
   */
  emit(eventName, data = {}) {
    if (!this.events.has(eventName)) {
      return 0;
    }
    
    const subscribers = [...this.events.get(eventName)]; // Copiar para evitar problemas durante la iteración
    let executedCount = 0;
    
    // Logging
    if (this.config.debug) {
      console.log(`EventBus: Emitiendo evento "${eventName}" con datos:`, data);
    }
    
    // Ejecutar cada suscripción
    for (const subscription of subscribers) {
      try {
        // Configurar timeout para prevenir manejadores que se ejecutan por mucho tiempo
        const timeoutId = setTimeout(() => {
          console.warn(`EventBus: El manejador para el evento "${eventName}" tardó demasiado tiempo y fue cancelado`);
        }, this.config.maxHandlerExecutionTime);
        
        // Ejecutar callback
        subscription.callback(data);
        
        // Limpiar timeout
        clearTimeout(timeoutId);
        
        executedCount++;
        
        // Si es una suscripción "once", removerla después de ejecutar
        if (subscription.once) {
          this.off(eventName, subscription.id);
        }
      } catch (error) {
        this.stats.errors++;
        console.error(`EventBus: Error en el manejador del evento "${eventName}":`, error);
        
        // Emitir evento de error
        this.emit('eventbus:error', {
          eventName,
          error,
          subscription: subscription.id,
          appId: subscription.appId
        });
      }
    }
    
    // Actualizar estadísticas
    this.stats.eventsEmitted++;
    
    return executedCount;
  }

  /**
   * Limpiar todas las suscripciones de una aplicación
   * @param {string} appId - ID de la aplicación
   * @returns {number} Número de suscripciones eliminadas
   */
  cleanupApp(appId) {
    if (!this.appSubscriptions.has(appId)) {
      return 0;
    }
    
    const subscriptions = [...this.appSubscriptions.get(appId)];
    let removedCount = 0;
    
    // Remover cada suscripción
    for (const subscription of subscriptions) {
      if (this.off(subscription.eventName, subscription.id)) {
        removedCount++;
      }
    }
    
    // Limpiar el registro de la app
    this.appSubscriptions.delete(appId);
    
    // Logging
    if (this.config.debug) {
      console.log(`EventBus: Limpiadas ${removedCount} suscripciones de la app "${appId}"`);
    }
    
    return removedCount;
  }

  /**
   * Obtener todas las suscripciones de una aplicación
   * @param {string} appId - ID de la aplicación
   * @returns {Array} Lista de suscripciones
   */
  getAppSubscriptions(appId) {
    return this.appSubscriptions.get(appId) || [];
  }

  /**
   * Obtener todos los eventos registrados
   * @returns {Array} Lista de nombres de eventos
   */
  getEventNames() {
    return Array.from(this.events.keys());
  }

  /**
   * Obtener el número de suscriptores para un evento
   * @param {string} eventName - Nombre del evento
   * @returns {number} Número de suscriptores
   */
  getSubscriberCount(eventName) {
    return this.events.has(eventName) ? this.events.get(eventName).length : 0;
  }

  /**
   * Obtener estadísticas del EventBus
   * @returns {Object} Estadísticas de uso
   */
  getStats() {
    return {
      ...this.stats,
      activeEvents: this.events.size,
      activeSubscriptions: Array.from(this.events.values()).reduce((total, subs) => total + subs.length, 0),
      registeredApps: this.appSubscriptions.size
    };
  }

  /**
   * Limpiar todos los eventos y suscripciones
   */
  clear() {
    this.events.clear();
    this.appSubscriptions.clear();
    this.stats = {
      eventsEmitted: 0,
      subscriptionsCreated: 0,
      subscriptionsRemoved: 0,
      errors: 0
    };
    
    if (this.config.debug) {
      console.log('EventBus: Todos los eventos y suscripciones han sido limpiados');
    }
  }

  /**
   * Configurar opciones del EventBus
   * @param {Object} options - Opciones de configuración
   */
  configure(options) {
    this.config = { ...this.config, ...options };
  }

  /**
   * Crear un middleware para eventos
   * @param {Function} middleware - Función middleware (eventName, data, next)
   * @returns {Object} Objeto con métodos emit y on
   */
  createMiddleware(middleware) {
    const eventBus = this;
    
    return {
      /**
       * Emitir evento a través del middleware
       */
      emit(eventName, data) {
        middleware(eventName, data, (modifiedEventName, modifiedData) => {
          eventBus.emit(modifiedEventName, modifiedData);
        });
      },
      
      /**
       * Suscribirse a eventos a través del middleware
       */
      on(eventName, callback, appId) {
        const wrappedCallback = (data) => {
          middleware(eventName, data, (modifiedEventName, modifiedData) => {
            callback(modifiedData);
          });
        };
        
        return eventBus.on(eventName, wrappedCallback, appId);
      }
    };
  }
}

// Exportar la clase
export { EventBus };

// Crear instancia global si no existe
if (typeof window !== 'undefined' && !window.eventBus) {
  window.eventBus = new EventBus();
  
  // Configurar eventos del sistema
  window.eventBus.on('system:shutdown', () => {
    console.log('EventBus: Limpiando recursos...');
    window.eventBus.clear();
  });
}
