/*
 * Mizu OS - Message Bus
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
 * Sistema de mensajería global para comunicación entre aplicaciones
 */
class MessageBus {
  constructor() {
    this.events = {};
    this.debug = true;
  }

  /**
   * Suscribirse a un evento
   * @param {string} event - Nombre del evento
   * @param {function} callback - Función a ejecutar cuando ocurra el evento
   */
  subscribe(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    
    this.events[event].push(callback);
    
    if (this.debug) {
      console.log(`MessageBus: Suscrito al evento '${event}'`);
    }
  }

  /**
   * Publicar un evento
   * @param {string} event - Nombre del evento
   * @param {*} data - Datos a pasar a los suscriptores
   */
  publish(event, data) {
    if (this.debug) {
      console.log(`MessageBus: Publicando evento '${event}' con datos:`, data);
    }
    
    if (this.events[event]) {
      this.events[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`MessageBus: Error ejecutando callback para evento '${event}':`, error);
        }
      });
    }
  }

  /**
   * Eliminar suscripción a un evento
   * @param {string} event - Nombre del evento
   * @param {function} callback - Función a eliminar de la suscripción
   */
  unsubscribe(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
      
      if (this.debug) {
        console.log(`MessageBus: Eliminada suscripción al evento '${event}'`);
      }
    }
  }

  /**
   * Eliminar todas las suscripciones a un evento
   * @param {string} event - Nombre del evento
   */
  unsubscribeAll(event) {
    if (this.events[event]) {
      delete this.events[event];
      
      if (this.debug) {
        console.log(`MessageBus: Eliminadas todas las suscripciones al evento '${event}'`);
      }
    }
  }

  /**
   * Obtener lista de eventos registrados
   * @returns {string[]} Lista de nombres de eventos
   */
  getEvents() {
    return Object.keys(this.events);
  }

  /**
   * Obtener número de suscriptores para un evento
   * @param {string} event - Nombre del evento
   * @returns {number} Número de suscriptores
   */
  getSubscriberCount(event) {
    return this.events[event] ? this.events[event].length : 0;
  }

  /**
   * Limpiar todos los eventos
   */
  clear() {
    this.events = {};
    
    if (this.debug) {
      console.log('MessageBus: Todos los eventos eliminados');
    }
  }
}

// Crear instancia global
const messageBus = new MessageBus();

// Hacerlo disponible globalmente
window.MessageBus = messageBus;

// También proporcionar métodos de compatibilidad para código existente
window.MessageBus.on = window.MessageBus.subscribe;
window.MessageBus.emit = window.MessageBus.publish;
window.MessageBus.off = window.MessageBus.unsubscribe;

export { messageBus as MessageBus };
