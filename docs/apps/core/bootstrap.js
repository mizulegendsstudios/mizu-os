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
 * // apps/core/bootstrap.js
 * Rol: Presentador minimalista que inicia el sistema y desaparece
 * Filosofía: Solo orquesta la llamada inicial sin gestionar dependencias, errores o secuenciamiento
 *Principios:
 *Cloud-Native: Ejecución 100% en navegador (GitHub Pages + jsDelivr) — sin build, sin bundlers, sin node_modules, sin servidores locales.
 *Extensible por diseño: cada app es un módulo independiente con su propio bootstrap.
 *Licencia libre: GNU AGPL-3.0 — cualquier modificación públicada en la red debe compartirse la fuente.
 *Stack Tecnológico/Zero Dependencies: ES6+ JavaScript vainilla (módulos nativos), CSS3 con Custom Properties, HTML5 APIs (Canvas, WebAudio, etc.). Sin frameworks, sin Tailwind.
*/

// 1. Importación: Bootstrap presenta los módulos que se usarán
// Cada módulo es autónomo y maneja sus propias responsabilidades
import { ConfigManager } from './configManager.js';
import { StyleEngine } from './styleEngine.js';
import { ModuleLoader } from './moduleLoader.js';

// 2. Instanciación: Bootstrap crea las instancias pero no gestiona su estado
// Bootstrap solo presenta los módulos, no gestiona su interacción
const config = new ConfigManager();
const styleEngine = new StyleEngine();
const moduleLoader = new ModuleLoader();

// 3. Inicialización: Bootstrap solo llama a los métodos iniciales
// Bootstrap solo inicia el proceso, no controla el flujo interno
async function initializeSystem() {
  console.log('Mizu OS: Iniciando sistema...');
  
  // 3.1 ConfigManager maneja su propia carga y errores
  // Cada módulo maneja su propia inicialización y errores
  console.log('Mizu OS: Solicitando carga de configuración...');
  await config.load();
  
  // 3.2 StyleEngine maneja su propia generación de estilos
  console.log('Mizu OS: Solicitando generación de estilos...');
  styleEngine.generateBaseStyles();

  // 3.3 ModuleLoader maneja su propia carga de módulos
  console.log('Mizu OS: Solicitando carga de módulos...');
  await moduleLoader.loadCoreModules();
  
  console.log(`Mizu OS v${config.get('version')} inicializado`);
}

// 4. Punto de entrada: Bootstrap solo activa el sistema cuando está listo
// Bootstrap solo activa el sistema cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('Mizu OS: DOM listo, iniciando bootstrap...');
  
  // 4.1 Bootstrap delega cualquier error no manejado por los módulos
  // Bootstrap delega completamente el manejo de errores
  initializeSystem().catch(error => {
    console.error('Mizu OS: Error no manejado por los módulos:', error);
  });
});
