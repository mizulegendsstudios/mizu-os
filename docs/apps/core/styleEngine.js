/*
 * Mizu OS - Core/StyleEngine
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
 * Motor de estilos de Mizu OS
 * Responsable de generar dinámicamente los estilos CSS del sistema
 * // docs/apps/core/styleEngine.js
 * Rol: Generación dinámica de estilos CSS
 * Filosofía: Crear estilos de forma programática sin archivos CSS estáticos
 *Principios:
 *Cloud-Native: Ejecución 100% en navegador (GitHub Pages + jsDelivr) — sin build, sin bundlers, sin node_modules, sin servidores locales.
 *Extensible por diseño: cada app es un módulo independiente con su propio bootstrap.
 *Licencia libre: GNU AGPL-3.0 — cualquier modificación públicada en la red debe compartirse la fuente.
 *Stack Tecnológico/Zero Dependencies: ES6+ JavaScript vainilla (módulos nativos), CSS3 con Custom Properties, HTML5 APIs (Canvas, WebAudio, etc.). Sin frameworks, sin Tailwind.
*/

export class StyleEngine {
  constructor() {
    this.styleElement = document.createElement('style');
    document.head.appendChild(this.styleElement);
    this.themes = new Map();
    this.currentTheme = 'default';
    console.log('StyleEngine: Inicializado');
  }

  // Generar los estilos base del sistema
  generateBaseStyles() {
    console.log('StyleEngine: Generando estilos base...');
    
    const baseStyles = `
      :root {
        /* Paleta de colores principal */
        --primary-color: #3498db;
        --primary-dark: #2980b9;
        --primary-light: #5dade2;
        
        --secondary-color: #2ecc71;
        --secondary-dark: #27ae60;
        --secondary-light: #58d68d;
        
        --accent-color: #e74c3c;
        --accent-dark: #c0392b;
        --accent-light: #ec7063;
        
        /* Colores neutros */
        --background-color: #f5f7fa;
        --background-dark: #e1e8ed;
        --background-light: #ffffff;
        
        --text-color: #2c3e50;
        --text-light: #7f8c8d;
        --text-dark: #1a252f;
        
        --border-color: #dcdde1;
        --shadow-color: rgba(0, 0, 0, 0.1);
        
        /* Espaciado y dimensiones */
        --border-radius: 8px;
        --border-radius-small: 4px;
        --border-radius-large: 12px;
        
        --spacing-xs: 4px;
        --spacing-sm: 8px;
        --spacing-md: 16px;
        --spacing-lg: 24px;
        --spacing-xl: 32px;
        
        /* Tipografía */
        --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        --font-size-xs: 12px;
        --font-size-sm: 14px;
        --font-size-md: 16px;
        --font-size-lg: 18px;
        --font-size-xl: 20px;
        --font-size-xxl: 24px;
        
        /* Transiciones */
        --transition-speed: 0.3s;
        --transition-speed-fast: 0.15s;
        --transition-speed-slow: 0.5s;
        
        /* Sombras */
        --shadow-sm: 0 2px 4px var(--shadow-color);
        --shadow-md: 0 4px 8px var(--shadow-color);
        --shadow-lg: 0 8px 16px var(--shadow-color);
      }
      
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      body {
        font-family: var(--font-family);
        background-color: var(--background-color);
        color: var(--text-color);
        line-height: 1.6;
        font-size: var(--font-size-md);
      }
      
      /* Clases de utilidad */
      .container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 var(--spacing-md);
      }
      
      .flex {
        display: flex;
      }
      
      .flex-column {
        flex-direction: column;
      }
      
      .flex-center {
        justify-content: center;
        align-items: center;
      }
      
      .text-center {
        text-align: center;
      }
      
      .hidden {
        display: none;
      }
      
      .mt-sm { margin-top: var(--spacing-sm); }
      .mt-md { margin-top: var(--spacing-md); }
      .mt-lg { margin-top: var(--spacing-lg); }
      
      .mb-sm { margin-bottom: var(--spacing-sm); }
      .mb-md { margin-bottom: var(--spacing-md); }
      .mb-lg { margin-bottom: var(--spacing-lg); }
      
      .p-sm { padding: var(--spacing-sm); }
      .p-md { padding: var(--spacing-md); }
      .p-lg { padding: var(--spacing-lg); }
      
      .btn {
        display: inline-block;
        padding: var(--spacing-sm) var(--spacing-md);
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-size: var(--font-size-md);
        transition: background-color var(--transition-speed);
      }
      
      .btn:hover {
        background-color: var(--primary-dark);
      }
      
      .btn-secondary {
        background-color: var(--secondary-color);
      }
      
      .btn-secondary:hover {
        background-color: var(--secondary-dark);
      }
      
      .card {
        background-color: var(--background-light);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-md);
        padding: var(--spacing-md);
        margin-bottom: var(--spacing-md);
      }
    `;
    
    this.updateStyles(baseStyles);
    console.log('StyleEngine: Estilos base generados correctamente');
  }

  // Actualizar los estilos en el DOM
  updateStyles(css) {
    this.styleElement.textContent += css;
  }

  // Registrar un tema personalizado
  registerTheme(name, themeVariables) {
    this.themes.set(name, themeVariables);
    console.log(`StyleEngine: Tema '${name}' registrado`);
  }

  // Aplicar un tema
  applyTheme(name) {
    if (!this.themes.has(name)) {
      console.warn(`StyleEngine: El tema '${name}' no existe`);
      return false;
    }
    
    const themeVariables = this.themes.get(name);
    let themeCSS = ':root {';
    
    for (const [variable, value] of Object.entries(themeVariables)) {
      themeCSS += `${variable}: ${value};`;
    }
    
    themeCSS += '}';
    
    this.updateStyles(themeCSS);
    this.currentTheme = name;
    console.log(`StyleEngine: Tema '${name}' aplicado`);
    
    return true;
  }

  // Generar estilos para un componente específico
  generateComponentStyles(componentName, styles) {
    const componentCSS = `
      [data-component="${componentName}"] {
        ${styles}
      }
    `;
    
    this.updateStyles(componentCSS);
    console.log(`StyleEngine: Estilos generados para componente '${componentName}'`);
  }

  // Generar estilos para un módulo específico
  generateModuleStyles(moduleName, styles) {
    const moduleCSS = `
      [data-module="${moduleName}"] {
        ${styles}
      }
    `;
    
    this.updateStyles(moduleCSS);
    console.log(`StyleEngine: Estilos generados para módulo '${moduleName}'`);
  }

  // Crear una animación CSS
  createAnimation(name, keyframes) {
    const animationCSS = `
      @keyframes ${name} {
        ${keyframes}
      }
    `;
    
    this.updateStyles(animationCSS);
    console.log(`StyleEngine: Animación '${name}' creada`);
  }

  // Limpiar todos los estilos
  clearStyles() {
    this.styleElement.textContent = '';
    console.log('StyleEngine: Estilos limpiados');
  }

  // Obtener el tema actual
  getCurrentTheme() {
    return this.currentTheme;
  }

  // Obtener todos los temas registrados
  getRegisteredThemes() {
    return Array.from(this.themes.keys());
  }
}
