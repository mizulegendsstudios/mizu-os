/**
 * @fileoverview Archivo principal que orquesta la lógica de la aplicación.
 * @author Gemini
 */
//STABLE
//import { initializeNodeManager } from "./dev/node_manager.js"; // Importa el nuevo módulo

/**
 * Versión de la aplicación.
 * @constant {string}
 */
const VERSION = '2.10.01';

document.addEventListener('DOMContentLoaded', () => {
    // Registra la versión de la aplicación en la consola.
    console.log(`Aplicación Mizulegends iniciada. Versión: ${VERSION}`);
// Cargar nodos.js
    const script = document.createElement('script');
    script.src = 'dev/nodos.js';
    document.head.appendChild(script);
    // Inicializa todos los módulos.
    //initializeNodeManager(); // Se inicializa el módulo de gestión de nodos.
});
