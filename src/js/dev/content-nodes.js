// content-nodes.js — Sistema de contenedores + puertos (paso 1: solo estructura base)

let containerId = 0;

/**
 * Crea un nuevo nodo compuesto (contenedor + puertos) — NO ACTIVO AÚN
 * @param {number} x - Posición inicial X
 * @param {number} y - Posición inicial Y
 * @param {function} redrawCallback - Callback para redibujar conexiones
 * @returns {HTMLElement} - El contenedor principal
 */
function createContentNode(x = 100, y = 100, redrawCallback) {
  console.log('[content-nodes.js] Función createContentNode llamada — pero aún no activa.');

  // Por ahora, solo devuelve un div vacío — no modifica el DOM real
  const dummy = document.createElement('div');
  dummy.dataset.dummy = 'content-node';
  return dummy;
}

// Exportar para que core.js pueda importarlo
export { createContentNode };
