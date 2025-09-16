/*
 * Mizu OS - Spreadsheet App
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
 * Aplicación de hoja de cálculo para Mizu OS
 * Soporta fórmulas básicas y redimensionamiento
 */
export default class SpreadsheetApp {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.container = null;
    this.isLoaded = false;
    this.table = null;
    this.currentCell = null;
    this.formulaInput = null;
    this.data = {}; // Almacenará los datos de las celdas
  }
  
  // Método init requerido por el AppLoader
  init() {
    console.log('SpreadsheetApp: Inicializando aplicación de hoja de cálculo');
    return Promise.resolve();
  }
  
  // Método render requerido por el AppLoader
  render() {
    console.log('SpreadsheetApp: Renderizando interfaz de hoja de cálculo');
    
    // Crear el contenedor principal
    const container = document.createElement('div');
    container.className = 'spreadsheet-container';
    container.style.cssText = `
      width: 100%;
      height: 100%;
      background: rgba(30, 30, 30, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.5rem;
      padding: 20px;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    `;
    
    // Título de la aplicación
    const title = document.createElement('h1');
    title.className = 'spreadsheet-title';
    title.textContent = 'Hoja de Cálculo';
    title.style.cssText = `
      color: white;
      margin-bottom: 20px;
      text-align: center;
    `;
    
    // Controles de fórmula
    const controls = document.createElement('div');
    controls.className = 'spreadsheet-controls';
    controls.style.cssText = `
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
    `;
    
    this.formulaInput = document.createElement('input');
    this.formulaInput.type = 'text';
    this.formulaInput.placeholder = 'Introduce una fórmula (ej: =SUMA(A1:B2))';
    this.formulaInput.className = 'formula-input';
    this.formulaInput.style.cssText = `
      flex-grow: 1;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.1);
      color: white;
      outline: none;
    `;
    
    const applyBtn = document.createElement('button');
    applyBtn.textContent = 'Aplicar Fórmula';
    applyBtn.className = 'apply-btn';
    applyBtn.style.cssText = `
      padding: 10px 15px;
      border-radius: 5px;
      border: none;
      background: #6366f1;
      color: white;
      cursor: pointer;
      font-weight: bold;
    `;
    
    controls.appendChild(this.formulaInput);
    controls.appendChild(applyBtn);
    
    // Operaciones de tabla
    const operations = document.createElement('div');
    operations.className = 'spreadsheet-operations';
    operations.style.cssText = `
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
      flex-wrap: wrap;
    `;
    
    const addRowBtn = this.createOperationButton('Añadir Fila');
    const addColBtn = this.createOperationButton('Añadir Columna');
    const delRowBtn = this.createOperationButton('Eliminar Fila');
    const delColBtn = this.createOperationButton('Eliminar Columna');
    
    operations.appendChild(addRowBtn);
    operations.appendChild(addColBtn);
    operations.appendChild(delRowBtn);
    operations.appendChild(delColBtn);
    
    // Contenedor de la tabla
    const tableContainer = document.createElement('div');
    tableContainer.className = 'table-container';
    tableContainer.style.cssText = `
      flex-grow: 1;
      overflow: auto;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 5px;
    `;
    
    // Crear tabla
    this.table = document.createElement('table');
    this.table.id = 'data-table';
    this.table.style.cssText = `
      width: 100%;
      border-collapse: collapse;
      color: white;
    `;
    
    // Crear encabezado
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    // Celda vacía en la esquina superior izquierda
    const cornerCell = document.createElement('th');
    cornerCell.className = 'col-header';
    cornerCell.style.cssText = `
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 8px;
      min-width: 50px;
      text-align: center;
    `;
    headerRow.appendChild(cornerCell);
    
    // Añadir encabezados de columna (A, B, C, ...)
    for (let col = 0; col < 5; col++) {
      const th = document.createElement('th');
      th.textContent = String.fromCharCode(65 + col); // A, B, C, ...
      th.className = 'col-header';
      th.style.cssText = `
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 8px;
        min-width: 100px;
        text-align: center;
        user-select: none;
      `;
      headerRow.appendChild(th);
    }
    
    thead.appendChild(headerRow);
    this.table.appendChild(thead);
    
    // Crear cuerpo de la tabla
    const tbody = document.createElement('tbody');
    
    // Añadir filas iniciales
    for (let row = 0; row < 10; row++) {
      const tr = document.createElement('tr');
      
      // Encabezado de fila (1, 2, 3, ...)
      const rowHeader = document.createElement('th');
      rowHeader.textContent = row + 1;
      rowHeader.className = 'row-header';
      rowHeader.style.cssText = `
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 8px;
        min-width: 50px;
        text-align: center;
        user-select: none;
      `;
      tr.appendChild(rowHeader);
      
      // Celdas de datos
      for (let col = 0; col < 5; col++) {
        const cellId = `${String.fromCharCode(65 + col)}${row + 1}`;
        const td = document.createElement('td');
        td.className = 'data-cell';
        td.dataset.cellId = cellId;
        td.style.cssText = `
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 8px;
          min-width: 100px;
          min-height: 30px;
          background: rgba(255, 255, 255, 0.05);
        `;
        
        // Contenido editable de la celda
        const cellContent = document.createElement('div');
        cellContent.className = 'cell-content';
        cellContent.contentEditable = true;
        cellContent.textContent = '';
        cellContent.style.cssText = `
          outline: none;
          min-height: 20px;
        `;
        
        td.appendChild(cellContent);
        tr.appendChild(td);
      }
      
      tbody.appendChild(tr);
    }
    
    this.table.appendChild(tbody);
    tableContainer.appendChild(this.table);
    
    // Ensamblar todo
    container.appendChild(title);
    container.appendChild(controls);
    container.appendChild(operations);
    container.appendChild(tableContainer);
    
    // Guardar referencia al contenedor
    this.container = container;
    
    // Adjuntar eventos después de crear todos los elementos
    this.attachEvents(applyBtn, addRowBtn, addColBtn, delRowBtn, delColBtn);
    
    return container;
  }
  
  // Método destroy requerido por el AppLoader
  destroy() {
    console.log('SpreadsheetApp: Destruyendo aplicación de hoja de cálculo');
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
  
  // Crear botón de operación
  createOperationButton(text) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.cssText = `
      padding: 8px 12px;
      border-radius: 5px;
      border: none;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      cursor: pointer;
      font-size: 14px;
    `;
    return button;
  }
  
  // Adjuntar eventos a los elementos
  attachEvents(applyBtn, addRowBtn, addColBtn, delRowBtn, delColBtn) {
    // Evento para aplicar fórmula
    applyBtn.addEventListener('click', () => {
      this.applyFormula();
    });
    
    // Eventos para operaciones de tabla
    addRowBtn.addEventListener('click', () => {
      this.addRow();
    });
    
    addColBtn.addEventListener('click', () => {
      this.addColumn();
    });
    
    delRowBtn.addEventListener('click', () => {
      this.deleteRow();
    });
    
    delColBtn.addEventListener('click', () => {
      this.deleteColumn();
    });
    
    // Eventos para celdas
    const cells = this.table.querySelectorAll('.data-cell');
    cells.forEach(cell => {
      cell.addEventListener('click', () => {
        this.selectCell(cell);
      });
      
      const cellContent = cell.querySelector('.cell-content');
      cellContent.addEventListener('input', () => {
        this.updateCellData(cell);
      });
      
      cellContent.addEventListener('blur', () => {
        this.processCellFormulas(cell);
      });
    });
  }
  
  // Seleccionar una celda
  selectCell(cell) {
    // Deseleccionar celda anterior
    if (this.currentCell) {
      this.currentCell.style.background = 'rgba(255, 255, 255, 0.05)';
    }
    
    // Seleccionar nueva celda
    this.currentCell = cell;
    cell.style.background = 'rgba(99, 102, 241, 0.3)';
    
    // Actualizar input de fórmula
    const cellId = cell.dataset.cellId;
    const cellContent = cell.querySelector('.cell-content').textContent;
    
    if (this.data[cellId] && this.data[cellId].formula) {
      this.formulaInput.value = this.data[cellId].formula;
    } else {
      this.formulaInput.value = cellContent;
    }
  }
  
  // Actualizar datos de una celda
  updateCellData(cell) {
    const cellId = cell.dataset.cellId;
    const cellContent = cell.querySelector('.cell-content').textContent;
    
    if (!this.data[cellId]) {
      this.data[cellId] = {};
    }
    
    this.data[cellId].value = cellContent;
    this.data[cellId].displayValue = cellContent;
  }
  
  // Procesar fórmulas de una celda
  processCellFormulas(cell) {
    const cellId = cell.dataset.cellId;
    const cellContent = cell.querySelector('.cell-content');
    
    if (this.data[cellId] && this.data[cellId].formula) {
      // Evaluar fórmula
      const result = this.evaluateFormula(this.data[cellId].formula);
      cellContent.textContent = result;
      this.data[cellId].displayValue = result;
    }
  }
  
  // Aplicar fórmula a la celda seleccionada
  applyFormula() {
    if (!this.currentCell) {
      this.showNotification('Por favor, selecciona una celda primero');
      return;
    }
    
    const formula = this.formulaInput.value.trim();
    if (!formula) {
      this.showNotification('Por favor, introduce una fórmula');
      return;
    }
    
    const cellId = this.currentCell.dataset.cellId;
    const cellContent = this.currentCell.querySelector('.cell-content');
    
    // Guardar fórmula
    if (!this.data[cellId]) {
      this.data[cellId] = {};
    }
    
    this.data[cellId].formula = formula;
    
    // Evaluar fórmula
    const result = this.evaluateFormula(formula);
    cellContent.textContent = result;
    this.data[cellId].displayValue = result;
    
    this.showNotification('Fórmula aplicada correctamente');
  }
  
  // Evaluar una fórmula simple
  evaluateFormula(formula) {
    if (!formula.startsWith('=')) {
      return formula; // No es una fórmula, devolver el texto tal cual
    }
    
    // Eliminar el signo =
    const formulaBody = formula.substring(1);
    
    // Fórmula SUMA simple
    if (formulaBody.toUpperCase().startsWith('SUMA(')) {
      const range = formulaBody.substring(5, formulaBody.length - 1);
      return this.sumRange(range);
    }
    
    // Fórmula PROMEDIO simple
    if (formulaBody.toUpperCase().startsWith('PROMEDIO(')) {
      const range = formulaBody.substring(9, formulaBody.length - 1);
      const sum = this.sumRange(range);
      const count = this.countRange(range);
      return count > 0 ? (sum / count).toFixed(2) : 0;
    }
    
    // Si no es una fórmula reconocida, devolver el texto original
    return formula;
  }
  
  // Sumar un rango de celdas
  sumRange(range) {
    const cells = this.parseRange(range);
    let sum = 0;
    
    cells.forEach(cellId => {
      if (this.data[cellId] && this.data[cellId].value) {
        const value = parseFloat(this.data[cellId].value);
        if (!isNaN(value)) {
          sum += value;
        }
      }
    });
    
    return sum;
  }
  
  // Contar celdas en un rango
  countRange(range) {
    return this.parseRange(range).length;
  }
  
  // Parsear un rango de celdas (ej: A1:B2)
  parseRange(range) {
    const cells = [];
    
    if (range.includes(':')) {
      // Es un rango
      const [start, end] = range.split(':');
      
      const startCol = start.charCodeAt(0) - 65; // A = 0, B = 1, etc.
      const startRow = parseInt(start.substring(1)) - 1;
      
      const endCol = end.charCodeAt(0) - 65;
      const endRow = parseInt(end.substring(1)) - 1;
      
      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          cells.push(`${String.fromCharCode(65 + col)}${row + 1}`);
        }
      }
    } else {
      // Es una sola celda
      cells.push(range);
    }
    
    return cells;
  }
  
  // Añadir una fila
  addRow() {
    const tbody = this.table.querySelector('tbody');
    const rowCount = tbody.rows.length;
    
    const tr = document.createElement('tr');
    
    // Encabezado de fila
    const rowHeader = document.createElement('th');
    rowHeader.textContent = rowCount + 1;
    rowHeader.className = 'row-header';
    rowHeader.style.cssText = `
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 8px;
      min-width: 50px;
      text-align: center;
      user-select: none;
    `;
    tr.appendChild(rowHeader);
    
    // Celdas de datos
    const colCount = tbody.rows[0].cells.length - 1; // -1 por el encabezado de fila
    
    for (let col = 0; col < colCount; col++) {
      const cellId = `${String.fromCharCode(65 + col)}${rowCount + 1}`;
      const td = document.createElement('td');
      td.className = 'data-cell';
      td.dataset.cellId = cellId;
      td.style.cssText = `
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 8px;
        min-width: 100px;
        min-height: 30px;
        background: rgba(255, 255, 255, 0.05);
      `;
      
      // Contenido editable de la celda
      const cellContent = document.createElement('div');
      cellContent.className = 'cell-content';
      cellContent.contentEditable = true;
      cellContent.textContent = '';
      cellContent.style.cssText = `
        outline: none;
        min-height: 20px;
      `;
      
      td.appendChild(cellContent);
      tr.appendChild(td);
      
      // Adjuntar eventos
      td.addEventListener('click', () => {
        this.selectCell(td);
      });
      
      cellContent.addEventListener('input', () => {
        this.updateCellData(td);
      });
      
      cellContent.addEventListener('blur', () => {
        this.processCellFormulas(td);
      });
    }
    
    tbody.appendChild(tr);
    this.showNotification('Fila añadida correctamente');
  }
  
  // Añadir una columna
  addColumn() {
    const thead = this.table.querySelector('thead tr');
    const tbody = this.table.querySelector('tbody');
    
    const colCount = thead.cells.length - 1; // -1 por la celda de la esquina
    const colLetter = String.fromCharCode(65 + colCount);
    
    // Añadir encabezado de columna
    const th = document.createElement('th');
    th.textContent = colLetter;
    th.className = 'col-header';
    th.style.cssText = `
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 8px;
      min-width: 100px;
      text-align: center;
      user-select: none;
    `;
    thead.appendChild(th);
    
    // Añadir celdas a cada fila
    for (let row = 0; row < tbody.rows.length; row++) {
      const tr = tbody.rows[row];
      const cellId = `${colLetter}${row + 1}`;
      
      const td = document.createElement('td');
      td.className = 'data-cell';
      td.dataset.cellId = cellId;
      td.style.cssText = `
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 8px;
        min-width: 100px;
        min-height: 30px;
        background: rgba(255, 255, 255, 0.05);
      `;
      
      // Contenido editable de la celda
      const cellContent = document.createElement('div');
      cellContent.className = 'cell-content';
      cellContent.contentEditable = true;
      cellContent.textContent = '';
      cellContent.style.cssText = `
        outline: none;
        min-height: 20px;
      `;
      
      td.appendChild(cellContent);
      tr.appendChild(td);
      
      // Adjuntar eventos
      td.addEventListener('click', () => {
        this.selectCell(td);
      });
      
      cellContent.addEventListener('input', () => {
        this.updateCellData(td);
      });
      
      cellContent.addEventListener('blur', () => {
        this.processCellFormulas(td);
      });
    }
    
    this.showNotification('Columna añadida correctamente');
  }
  
  // Eliminar la última fila
  deleteRow() {
    const tbody = this.table.querySelector('tbody');
    
    if (tbody.rows.length <= 1) {
      this.showNotification('No se pueden eliminar más filas');
      return;
    }
    
    tbody.removeChild(tbody.lastChild);
    this.showNotification('Fila eliminada correctamente');
  }
  
  // Eliminar la última columna
  deleteColumn() {
    const thead = this.table.querySelector('thead tr');
    const tbody = this.table.querySelector('tbody');
    
    if (thead.cells.length <= 2) { // +1 por la celda de la esquina
      this.showNotification('No se pueden eliminar más columnas');
      return;
    }
    
    // Eliminar encabezado de columna
    thead.removeChild(thead.lastChild);
    
    // Eliminar celda de cada fila
    for (let row = 0; row < tbody.rows.length; row++) {
      const tr = tbody.rows[row];
      tr.removeChild(tr.lastChild);
    }
    
    this.showNotification('Columna eliminada correctamente');
  }
  
  // Mostrar notificación
  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'config-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}
