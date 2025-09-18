/*
 * Mizu OS - Core/Bootstrap
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
 * Sistema principal de Mizu OS
 * Punto de entrada para inicializar todos los componentes del sistema
 * // docs/apps/core/bootstrap.js
 * Rol: Presentador minimalista que inicia el sistema y desaparece
 * Filosofía: Solo orquesta la llamada inicial sin gestionar dependencias, errores o secuenciamiento
 *Principios:
 *Cloud-Native: Ejecución 100% en navegador (GitHub Pages + jsDelivr) — sin build, sin bundlers, sin node_modules, sin servidores locales.
 *Extensible por diseño: cada app es un módulo independiente con su propio bootstrap.
 *Licencia libre: GNU AGPL-3.0 — cualquier modificación públicada en la red debe compartirse la fuente.
 *Stack Tecnológico/Zero Dependencies: ES6+ JavaScript vainilla (módulos nativos), CSS3 con Custom Properties, HTML5 APIs (Canvas, WebAudio, etc.). Sin frameworks, sin Tailwind.
*/

// Importación de módulos esenciales
import { BootSequence } from './bootSequence.js';
import { MessageBus } from './messageBus.js';

class Bootstrap {
  constructor() {
    console.log('Mizu OS: Iniciando sistema...');
    
    // El MessageBus ya se inicializa al importarse
    console.log('MessageBus: Sistema de mensajería inicializado');
  }

  // Método para ejecutar el arranque
  async execute() {
    try {
      const bootSequence = new BootSequence();
      await bootSequence.execute();
    } catch (error) {
      console.error('Mizu OS: Error no manejado:', error);
      throw error;
    }
  }
}

// Punto de entrada: Bootstrap solo activa el sistema cuando está listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('Mizu OS: DOM listo, iniciando bootstrap...');
  
  const bootstrap = new Bootstrap();
  bootstrap.execute().catch(error => {
    console.error('Mizu OS: Error no manejado:', error);
  });
});
