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
 * Sistema de eventos para Mizu OS
 * Gestiona la comunicación entre componentes mediante un sistema de publicación/suscripción
 */
// apps/core/modules/eventbus.js
export default class EventBus {
  constructor() {
    this.events = {};
    console.log('[DEBUG] EventBus: Constructor llamado');
  }

  init() {
    console.log('[DEBUG] EventBus: Inicializando');
    return true;
  }

  on(eventName, callback) {
    console.log(`[DEBUG] EventBus: Suscribiéndose al evento ${eventName}`);
    
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    
    this.events[eventName].push(callback);
    console.log(`[DEBUG] EventBus: Suscripción a ${eventName} completada`);
  }

  off(eventName, callback) {
    console.log(`[DEBUG] EventBus: Cancelando suscripción al evento ${eventName}`);
    
    if (!this.events[eventName]) {
      return;
    }
    
    this.events[eventName] = this.events[eventName].filter(
      eventCallback => eventCallback !== callback
    );
    
    console.log(`[DEBUG] EventBus: Suscripción a ${eventName} cancelada`);
  }

  emit(eventName, data) {
    console.log(`[DEBUG] EventBus: Emitiendo evento ${eventName} con datos:`, data);
    
    if (!this.events[eventName]) {
      console.log(`[DEBUG] EventBus: No hay suscriptores para ${eventName}`);
      return;
    }
    
    this.events[eventName].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`[ERROR] EventBus: Error al ejecutar callback para ${eventName}:`, error);
      }
    });
    
    console.log(`[DEBUG] EventBus: Evento ${eventName} emitido a ${this.events[eventName].length} suscriptores`);
  }
}
