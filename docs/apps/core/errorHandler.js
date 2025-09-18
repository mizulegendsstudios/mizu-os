/*
 * Mizu OS - Core/ErrorHandler
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
/*
 * Gestor de errores de Mizu OS
 * Responsable de capturar errores críticos durante el arranque
 * y proporcionar retroalimentación clara cuando algo falla
 * // apps/core/errorHandler.js
 * Rol: Manejo de errores críticos durante el arranque
 * Filosofía: Proporcionar retroalimentación clara cuando algo falla
 *Principios:
 *Cloud-Native: Ejecución 100% en navegador (GitHub Pages + jsDelivr) — sin build, sin bundlers, sin node_modules, sin servidores locales.
 *Extensible por diseño: cada app es un módulo independiente con su propio bootstrap.
 *Licencia libre: GNU AGPL-3.0 — cualquier modificación públicada en la red debe compartirse la fuente.
 *Stack Tecnológico/Zero Dependencies: ES6+ JavaScript vainilla (módulos nativos), CSS3 con Custom Properties, HTML5 APIs (Canvas, WebAudio, etc.). Sin frameworks, sin Tailwind.
*/

export class ErrorHandler {
  constructor() {
    this.errorCallbacks = new Map();
    this.setupGlobalErrorHandler();
  }

  // Configurar manejador de errores global
  setupGlobalErrorHandler() {
    window.addEventListener('error', (event) => {
      this.handleGlobalError(event.error);
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      this.handleGlobalError(event.reason);
    });
    
    console.log('ErrorHandler: Manejador de errores global configurado');
  }

  // Registrar un callback para un tipo de error específico
  registerErrorCallback(errorType, callback) {
    this.errorCallbacks.set(errorType, callback);
    console.log(`ErrorHandler: Callback registrado para tipo de error '${errorType}'`);
  }

  // Manejar un error global
  handleGlobalError(error) {
    console.error('ErrorHandler: Error global capturado:', error);
    
    // Buscar un callback específico para este tipo de error
    const errorType = error.name || 'Error';
    if (this.errorCallbacks.has(errorType)) {
      this.errorCallbacks.get(errorType)(error);
    } else {
      this.handleGenericError(error);
    }
  }

  // Manejar un error genérico
  handleGenericError(error) {
    console.error('ErrorHandler: Error no manejado:', error);
    
    // Mostrar un mensaje de error amigable al usuario
    const errorMessage = document.createElement('div');
    errorMessage.style.position = 'fixed';
    errorMessage.style.top = '0';
    errorMessage.style.left = '0';
    errorMessage.style.width = '100%';
    errorMessage.style.padding = '10px';
    errorMessage.style.backgroundColor = '#f44336';
    errorMessage.style.color = 'white';
    errorMessage.style.textAlign = 'center';
    errorMessage.style.zIndex = '9999';
    errorMessage.textContent = `Error: ${error.message || 'Ha ocurrido un error inesperado'}`;
    
    document.body.appendChild(errorMessage);
    
    // Eliminar el mensaje después de 5 segundos
    setTimeout(() => {
      document.body.removeChild(errorMessage);
    }, 5000);
  }

  // Manejar un error durante el arranque
  handleBootError(error, context) {
    console.error(`ErrorHandler: Error durante el arranque en contexto '${context}':`, error);
    
    // Mostrar un mensaje de error crítico
    const errorMessage = document.createElement('div');
    errorMessage.style.position = 'fixed';
    errorMessage.style.top = '0';
    errorMessage.style.left = '0';
    errorMessage.style.width = '100%';
    errorMessage.style.padding = '20px';
    errorMessage.style.backgroundColor = '#d32f2f';
    errorMessage.style.color = 'white';
    errorMessage.style.textAlign = 'center';
    errorMessage.style.zIndex = '9999';
    errorMessage.innerHTML = `
      <h2>Error crítico durante el arranque</h2>
      <p>Contexto: ${context}</p>
      <p>Error: ${error.message || 'Ha ocurrido un error inesperado'}</p>
      <p>Por favor, recargue la página o contacte al soporte técnico.</p>
    `;
    
    document.body.appendChild(errorMessage);
  }
}
