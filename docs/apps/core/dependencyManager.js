/*
 * Mizu OS - Core/DependencyManager
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
 * Gestor de dependencias de Mizu OS
 * Responsable de importar explícitamente solo los componentes necesarios
 * y garantizar que las dependencias estén disponibles antes de usarlas
 * // apps/core/dependencyManager.js
 * Rol: Gestión de dependencias entre módulos
 * Filosofía: Asegurar que todos los componentes estén disponibles antes de su uso
 *Principios:
 *Cloud-Native: Ejecución 100% en navegador (GitHub Pages + jsDelivr) — sin build, sin bundlers, sin node_modules, sin servidores locales.
 *Extensible por diseño: cada app es un módulo independiente con su propio bootstrap.
 *Licencia libre: GNU AGPL-3.0 — cualquier modificación públicada en la red debe compartirse la fuente.
 *Stack Tecnológico/Zero Dependencies: ES6+ JavaScript vainilla (módulos nativos), CSS3 con Custom Properties, HTML5 APIs (Canvas, WebAudio, etc.). Sin frameworks, sin Tailwind.
*/

export class DependencyManager {
  constructor() {
    this.dependencies = new Map();
    this.loadedDependencies = new Set();
  }

  // Registrar una dependencia
  register(name, module) {
    this.dependencies.set(name, module);
    console.log(`DependencyManager: Dependencia '${name}' registrada`);
  }

  // Verificar si una dependencia está cargada
  isLoaded(name) {
    return this.loadedDependencies.has(name);
  }

  // Marcar una dependencia como cargada
  markAsLoaded(name) {
    this.loadedDependencies.add(name);
    console.log(`DependencyManager: Dependencia '${name}' marcada como cargada`);
  }

  // Obtener una dependencia
  get(name) {
    if (!this.dependencies.has(name)) {
      throw new Error(`DependencyManager: Dependencia '${name}' no registrada`);
    }
    return this.dependencies.get(name);
  }

  // Verificar que todas las dependencias necesarias estén cargadas
  checkDependencies(requiredDependencies) {
    const missingDependencies = requiredDependencies.filter(
      dep => !this.isLoaded(dep)
    );
    
    if (missingDependencies.length > 0) {
      throw new Error(`DependencyManager: Dependencias faltantes: ${missingDependencies.join(', ')}`);
    }
    
    console.log('DependencyManager: Todas las dependencias requeridas están cargadas');
  }
}
