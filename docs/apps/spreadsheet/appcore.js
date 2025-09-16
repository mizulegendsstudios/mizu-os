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
 * Soporta fórmulas y redimensionamiento
 */
export default class SpreadsheetApp {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.container = null;
    this.tableBody = null;
    this.tableHead = null;
    this.formulaInput = null;
    this.rows = 10;
    this.cols = 8;
    this.selectedCells = new Set();
    this.isDragging = false;
    this.startCellId = null;
    this.cellValues = {}; // Objeto para almacenar valores y fórmulas
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
      color: white;
      font-family: 'Inter', sans-serif;
    `;
    
    // Título de la aplicación
    const title = document.createElement('h1');
    title.className = 'spreadsheet-title';
    title.textContent = 'Hoja de Cálculo';
    title.style.cssText = `
      color: white;
      margin-bottom: 20px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
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
      justify-content: center;
    `;
    
    const addRowBtn = this.createOperationButton('Añadir Fila', '#10b981');
    const addColBtn = this.createOperationButton('Añadir Columna', '#10b981');
    const delRowBtn = this.createOperationButton('Eliminar Fila', '#ef4444');
    const delColBtn = this.createOperationButton('Eliminar Columna', '#ef4444');
    
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
      background: rgba(255, 255, 255, 0.05);
    `;
    
    // Crear tabla
    const table = document.createElement('table');
    table.id = 'data-table';
    table.style.cssText = `
      border-collapse: separate;
      border-spacing: 0;
      width: 100%;
      background-color: rgba(255, 255, 255, 0.05);
    `;
    
    // Crear encabezado
    const thead = document.createElement('thead');
    this.tableHead = document.createElement('tr');
    
    // Celda vacía en la esquina superior izquierda
    const cornerCell = document.createElement('th');
    cornerCell.className = 'col-header sticky-cell-header';
    cornerCell.style.cssText = `
      background-color: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 8px;
      min-width: 50px;
      text-align: center;
      position: sticky;
      top: 0;
      z-index: 10;
    `;
    this.tableHead.appendChild(cornerCell);
    
    // Añadir encabezados de columna (A, B, C, ...)
    for (let j = 0; j < this.cols; j++) {
      const th = document.createElement('th');
      th.className = 'col-header';
      th.textContent = this.getColLetter(j);
      th.style.cssText = `
        background-color: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 8px;
        min-width: 80px;
        text-align: center;
        position: sticky;
        top: 0;
        z-index: 10;
        user-select: none;
      `;
      this.tableHead.appendChild(th);
    }
    
    thead.appendChild(this.tableHead);
    table.appendChild(thead);
    
    // Crear cuerpo de la tabla
    this.tableBody = document.createElement('tbody');
    
    // Añadir filas iniciales
    for (let i = 0; i < this.rows; i++) {
      this.createRow(i);
    }
    
    table.appendChild(this.tableBody);
    tableContainer.appendChild(table);
    
    // Ensamblar todo
    container.appendChild(title);
    container.appendChild(controls);
    container.appendChild(operations);
    container.appendChild(tableContainer);
    
    // Guardar referencia al contenedor
    this.container = container;
    
    // Adjuntar eventos después de crear todos los elementos
    this.attachEvents(applyBtn, addRowBtn, addColBtn, delRowBtn, delColBtn);
    
    // Añadir redimensionadores
    this.addResizers();
    
    return container;
  }
  
  // Método destroy requerido por el AppLoader
  destroy() {
    console.log('SpreadsheetApp: Destruyendo aplicación de hoja de cálculo');
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
  
  // Crear una fila
  createRow(rowIndex) {
    const tr = document.createElement('tr');
    
    // Encabezado de fila (1, 2, 3, ...)
    const rowHeader = document.createElement('td');
    rowHeader.className = 'row-header';
    rowHeader.textContent = rowIndex + 1;
    rowHeader.style.cssText = `
      background-color: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 8px;
      min-width: 50px;
      text-align: center;
      user-select: none;
    `;
    tr.appendChild(rowHeader);
    
    // Celdas de datos
    for (let j = 0; j < this.cols; j++) {
      const cellId = this.getCellId(rowIndex, j);
      const td = document.createElement('td');
      td.dataset.cellId = cellId;
      td.style.cssText = `
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 0;
        position: relative;
        min-width: 80px;
        height: 32px;
        font-size: 14px;
        text-align: center;
      `;
      
      // Contenido editable de la celda
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'cell';
      input.placeholder = cellId;
      input.dataset.cellId = cellId;
      input.style.cssText = `
        padding: 8px;
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
        box-sizing: border-box;
        background-color: transparent;
        text-align: left;
        color: white;
      `;
      
      // Si existe un valor o fórmula guardada, la usamos
      const formula = this.cellValues[cellId] || '';
      input.value = this.evaluateFormula(formula);
      input.dataset.formula = formula;
      
      td.appendChild(input);
      tr.appendChild(td);
    }
    
    this.tableBody.appendChild(tr);
  }
  
  // Crear botón de operación
  createOperationButton(text, bgColor) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.cssText = `
      padding: 8px 12px;
      border-radius: 5px;
      border: none;
      background: ${bgColor};
      color: white;
      cursor: pointer;
      font-size: 14px;
      transition: transform 0.1s ease-in-out;
    `;
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.05)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
    });
    return button;
  }
  
  // Adjuntar eventos a los elementos
  attachEvents(applyBtn, addRowBtn, addColBtn, delRowBtn, delColBtn) {
    // Evento para aplicar fórmula
    applyBtn.addEventListener('click', () => {
      this.handleApplyFormula();
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
    
    // Eventos del ratón para selección
    this.container.addEventListener('mousedown', (e) => {
      this.handleMouseDown(e);
    });
    
    this.container.addEventListener('mousemove', (e) => {
      this.handleMouseMove(e);
    });
    
    this.container.addEventListener('mouseup', () => {
      this.handleMouseUp();
    });
    
    // Eventos de teclado para navegación
    this.container.addEventListener('keydown', (e) => {
      this.handleKeyDown(e);
    });
    
    // Evento para clic en celdas
    this.container.addEventListener('click', (e) => {
      this.handleCellClick(e);
    });
  }
  
  // Funciones de utilidad
  getColLetter(colIndex) {
    let letter = '';
    while (colIndex >= 0) {
      letter = String.fromCharCode(65 + (colIndex % 26)) + letter;
      colIndex = Math.floor(colIndex / 26) - 1;
    }
    return letter;
  }
  
  getCellId(rowIndex, colIndex) {
    return `${this.getColLetter(colIndex)}${rowIndex + 1}`;
  }
  
  getCellPosition(cellId) {
    const match = cellId.match(/^([A-Z]+)(\d+)$/i);
    if (!match) return null;
    const colLetter = match[1].toUpperCase();
    const rowIndex = parseInt(match[2], 10) - 1;
    let colIndex = 0;
    for (let i = 0; i < colLetter.length; i++) {
      colIndex = colIndex * 26 + (colLetter.charCodeAt(i) - 64);
    }
    return { rowIndex, colIndex: colIndex - 1 };
  }
  
  getCellValue(cellId) {
    const formula = this.cellValues[cellId] || '';
    const displayValue = this.evaluateFormula(formula);
    return displayValue;
  }
  
  getCellRange(start, end) {
    const startPos = this.getCellPosition(start);
    const endPos = this.getCellPosition(end);
    if (!startPos || !endPos) return [];
    const startRow = Math.min(startPos.rowIndex, endPos.rowIndex);
    const endRow = Math.max(startPos.rowIndex, endPos.rowIndex);
    const startCol = Math.min(startPos.colIndex, endPos.colIndex);
    const endCol = Math.max(startPos.colIndex, endPos.colIndex);
    const cells = [];
    for (let i = startRow; i <= endRow; i++) {
      for (let j = startCol; j <= endCol; j++) {
        cells.push(this.getCellId(i, j));
      }
    }
    return cells;
  }
  
  // Lógica de la hoja de cálculo
  evaluateFormula(formula) {
    if (formula.startsWith('=')) {
      // Intenta primero con fórmulas de función (ej. =SUMA(A1,B1))
      const funcRegex = /=(\w+)\((.*)\)/i;
      const match = formula.match(funcRegex);
      if (match) {
        const funcName = match[1].toUpperCase();
        let args = match[2];
        try {
          const isRange = args.includes(':');
          let values = [];
          if (isRange) {
            const [startCell, endCell] = args.split(':');
            const range = this.getCellRange(startCell.trim(), endCell.trim());
            values = range.map(id => parseFloat(this.getCellValue(id))).filter(val => !isNaN(val));
          } else {
            values = args.split(',').map(arg => {
              const trimmedArg = arg.trim();
              const pos = this.getCellPosition(trimmedArg);
              if (pos) {
                return parseFloat(this.getCellValue(trimmedArg));
              }
              return parseFloat(trimmedArg);
            }).filter(val => !isNaN(val));
          }
          switch (funcName) {
            case 'SUMA':
              return values.reduce((acc, val) => acc + val, 0);
            case 'RESTA':
              if (values.length < 2) return '#ERROR!';
              return values.slice(1).reduce((acc, val) => acc - val, values[0]);
            case 'MULTIPLICACION':
              if (values.length === 0) return 0;
              return values.reduce((acc, val) => acc * val, 1);
            case 'DIVISION':
              if (values.length < 2 || values[1] === 0) return '#DIV/0!';
              return values[0] / values[1];
            case 'PROMEDIO':
              if (values.length === 0) return 0;
              return values.reduce((acc, val) => acc + val, 0) / values.length;
            case 'MIN':
              return Math.min(...values);
            case 'MAX':
              return Math.max(...values);
            case 'CONTAR':
              const nonNumericCount = args.split(',').map(arg => {
                const trimmedArg = arg.trim();
                const pos = this.getCellPosition(trimmedArg);
                if (pos) {
                  return this.getCellValue(trimmedArg);
                }
                return trimmedArg;
              }).filter(val => val !== '').length;
              return nonNumericCount;
            case 'SI':
              const ifArgs = args.split(',').map(arg => arg.trim());
              const condition = this.evaluateLogical(ifArgs[0]);
              if (condition) {
                return ifArgs[1].startsWith('=') ? this.evaluateFormula(ifArgs[1]) : ifArgs[1];
              } else {
                return ifArgs[2].startsWith('=') ? this.evaluateFormula(ifArgs[2]) : ifArgs[2];
              }
            case 'Y':
              const andArgs = args.split(',').map(arg => this.evaluateLogical(arg.trim()));
              return andArgs.every(Boolean);
            case 'O':
              const orArgs = args.split(',').map(arg => this.evaluateLogical(arg.trim()));
              return orArgs.some(Boolean);
            default:
              return '#NOMBRE?';
          }
        } catch (e) {
          return '#ERROR!';
        }
      } else {
        // Si no es una función, intenta evaluarlo como una expresión matemática simple
        let expression = formula.substring(1); // Elimina el '=' inicial
        const cellRegex = /([A-Z]+\d+)/gi; // Expresión regular para encontrar referencias de celdas
        let evalExpression = expression.replace(cellRegex, (match) => {
          const cellId = match.toUpperCase();
          const value = parseFloat(this.getCellValue(cellId));
          return isNaN(value) ? 0 : value;
        });
        try {
          // Evalúa la expresión usando la función de JavaScript
          return eval(evalExpression);
        } catch (e) {
          return '#ERROR!';
        }
      }
    } else if (formula.startsWith('+')) {
      // Si la fórmula comienza con '+', la trata como una expresión
      let expression = formula.substring(1); // Elimina el '+' inicial
      const cellRegex = /([A-Z]+\d+)/gi;
      let evalExpression = expression.replace(cellRegex, (match) => {
        const cellId = match.toUpperCase();
        const value = parseFloat(this.getCellValue(cellId));
        return isNaN(value) ? 0 : value;
      });
      try {
        return eval(evalExpression);
      } catch (e) {
        return '#ERROR!';
      }
    }
    return formula;
  }
  
  evaluateLogical(expr) {
    // Simple logical evaluation for now (e.g., A1 > 10, A1 = B1)
    const comparisonRegex = /^([A-Z]+\d+)\s*([<>=!]+)\s*([A-Z]+\d+|\d+)$/i;
    const match = expr.match(comparisonRegex);
    if (match) {
      const cellId = match[1];
      const op = match[2];
      const val2 = match[3];
      
      const val1 = parseFloat(this.getCellValue(cellId));
      let numericVal2 = parseFloat(val2);
      if (isNaN(val1)) return false;
      if (isNaN(numericVal2)) {
        const cellPos = this.getCellPosition(val2);
        if (cellPos) {
          numericVal2 = parseFloat(this.getCellValue(val2));
        } else {
          return false; // No es un número ni una celda válida
        }
      }
      switch (op) {
        case '>': return val1 > numericVal2;
        case '<': return val1 < numericVal2;
        case '=': return val1 === numericVal2;
        case '>=': return val1 >= numericVal2;
        case '<=': return val1 <= numericVal2;
        case '!=': return val1 !== numericVal2;
        default: return false;
      }
    }
    return false;
  }
  
  updateCellContent(cellInput) {
    const cellId = cellInput.dataset.cellId;
    const formula = cellInput.value;
    this.cellValues[cellId] = formula;
    const displayValue = this.evaluateFormula(formula);
    
    cellInput.value = displayValue;
    cellInput.dataset.formula = formula; 
    
    // Forzar la reevaluación de las fórmulas que dependen de esta celda
    Object.keys(this.cellValues).forEach(id => {
      const formulaToReevaluate = this.cellValues[id];
      if (formulaToReevaluate.includes(cellId.toUpperCase())) {
        const dependentCellInput = this.container.querySelector(`input[data-cell-id='${id}']`);
        if(dependentCellInput) {
          dependentCellInput.value = this.evaluateFormula(formulaToReevaluate);
        }
      }
    });
  }
  
  // Manejadores de eventos
  handleMouseDown(e) {
    const cell = e.target.closest('td[data-cell-id]');
    if (!cell) return;
    this.startCellId = cell.dataset.cellId;
    this.isDragging = true;
    
    if (!e.ctrlKey && !e.metaKey) {
      this.updateSelection(this.startCellId);
    } else {
      this.selectedCells.add(this.startCellId);
      cell.classList.add('selected');
    }
  }
  
  handleMouseMove(e) {
    if (!this.isDragging) return;
    const cell = e.target.closest('td[data-cell-id]');
    if (!cell) return;
    this.container.querySelectorAll('.selected').forEach(c => {
      const cellId = c.dataset.cellId;
      if (cellId && !this.selectedCells.has(cellId)) {
        c.classList.remove('selected');
      }
    });
    const range = this.getCellRange(this.startCellId, cell.dataset.cellId);
    range.forEach(id => {
      const el = this.container.querySelector(`td[data-cell-id='${id}']`);
      if (el) {
        el.classList.add('selected');
        this.selectedCells.add(id);
      }
    });
  }
  
  handleMouseUp() {
    this.isDragging = false;
  }
  
  handleKeyDown(e) {
    const activeElement = document.activeElement;
    if (!activeElement || !activeElement.classList.contains('cell')) return;
    const cellInput = activeElement;
    const cellId = cellInput.dataset.cellId;
    const pos = this.getCellPosition(cellId);
    let nextPos = null;
    switch (e.key) {
      case 'Enter':
      case 'ArrowDown':
        e.preventDefault();
        this.updateCellContent(cellInput);
        nextPos = { rowIndex: pos.rowIndex + 1, colIndex: pos.colIndex };
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.updateCellContent(cellInput);
        nextPos = { rowIndex: pos.rowIndex - 1, colIndex: pos.colIndex };
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.updateCellContent(cellInput);
        nextPos = { rowIndex: pos.rowIndex, colIndex: pos.colIndex - 1 };
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.updateCellContent(cellInput);
        nextPos = { rowIndex: pos.rowIndex, colIndex: pos.colIndex + 1 };
        break;
    }
    if (nextPos) {
      const nextCellId = this.getCellId(nextPos.rowIndex, nextPos.colIndex);
      const nextCellInput = this.container.querySelector(`input[data-cell-id='${nextCellId}']`);
      if (nextCellInput) {
        nextCellInput.focus();
        this.formulaInput.value = nextCellInput.dataset.formula;
        this.updateSelection(nextCellId); // Actualiza la selección
      }
    }
  }
  
  handleCellClick(e) {
    const cell = e.target.closest('td[data-cell-id]');
    if (!cell) return;
    const cellInput = cell.querySelector('.cell');
    if (!cellInput) return;
    if (!e.ctrlKey && !e.metaKey) {
      this.updateSelection(cell.dataset.cellId);
    } else {
      this.selectedCells.add(cell.dataset.cellId);
      cell.classList.add('selected');
    }
    this.formulaInput.value = cellInput.dataset.formula;
  }
  
  handleApplyFormula() {
    const formula = this.formulaInput.value;
    if (!formula || this.selectedCells.size === 0) return;
    this.selectedCells.forEach(cellId => {
      const cellInput = this.container.querySelector(`input[data-cell-id='${cellId}']`);
      if (cellInput) {
        cellInput.value = formula;
        this.updateCellContent(cellInput);
      }
    });
  }
  
  // Función para actualizar la selección
  updateSelection(cellId) {
    // Limpia la selección anterior
    this.selectedCells.clear();
    this.container.querySelectorAll('.selected').forEach(c => c.classList.remove('selected'));
    
    // Añade la celda actual y la marca
    this.selectedCells.add(cellId);
    const cell = this.container.querySelector(`td[data-cell-id='${cellId}']`);
    if(cell) {
      cell.classList.add('selected');
    }
  }
  
  // Redimensionamiento de celdas
  addResizers() {
    let resizer = null;
    let startX, startY, startWidth, startHeight;
    
    const onMouseDown = (e) => {
      resizer = e.target;
      startX = e.clientX;
      startY = e.clientY;
      const cell = resizer.parentElement;
      startWidth = cell.offsetWidth;
      startHeight = cell.offsetHeight;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };
    
    const onMouseMove = (e) => {
      if (!resizer) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      if (resizer.classList.contains('col-resizer')) {
        const cellIndex = Array.from(resizer.parentElement.parentNode.children).indexOf(resizer.parentElement);
        const allCells = this.container.querySelectorAll(`table tr td:nth-child(${cellIndex + 1})`);
        allCells.forEach(cell => {
          cell.style.width = `${startWidth + dx}px`;
        });
      } else if (resizer.classList.contains('row-resizer')) {
        resizer.parentElement.style.height = `${startHeight + dy}px`;
      }
    };
    
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      resizer = null;
    };
    
    this.container.querySelectorAll('th').forEach(cell => {
      if (cell.classList.contains('col-header')) {
        const colResizer = document.createElement('div');
        colResizer.className = 'col-resizer';
        colResizer.style.cssText = `
          right: -4px;
          top: 0;
          width: 8px;
          height: 100%;
          cursor: col-resize;
          border-radius: 0;
          background-color: transparent;
        `;
        cell.appendChild(colResizer);
        colResizer.addEventListener('mousedown', onMouseDown);
      }
    });
    
    this.container.querySelectorAll('.row-header').forEach(cell => {
      const rowResizer = document.createElement('div');
      rowResizer.className = 'row-resizer';
      rowResizer.style.cssText = `
        bottom: -4px;
        left: 0;
        height: 8px;
        width: 100%;
        cursor: row-resize;
        border-radius: 0;
        background-color: transparent;
      `;
      cell.appendChild(rowResizer);
      rowResizer.addEventListener('mousedown', onMouseDown);
    });
  }
  
  // Añadir/Eliminar filas y columnas
  addRow() {
    this.rows++;
    this.createRow(this.rows - 1);
    this.addResizers();
    this.showNotification('Fila añadida correctamente');
  }
  
  addColumn() {
    this.cols++;
    
    // Añadir encabezado de columna
    const th = document.createElement('th');
    th.className = 'col-header';
    th.textContent = this.getColLetter(this.cols - 1);
    th.style.cssText = `
      background-color: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 8px;
      min-width: 80px;
      text-align: center;
      position: sticky;
      top: 0;
      z-index: 10;
      user-select: none;
    `;
    this.tableHead.appendChild(th);
    
    // Añadir celda a cada fila
    const rows = this.tableBody.querySelectorAll('tr');
    rows.forEach((row, i) => {
      const cellId = this.getCellId(i, this.cols - 1);
      const td = document.createElement('td');
      td.dataset.cellId = cellId;
      td.style.cssText = `
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 0;
        position: relative;
        min-width: 80px;
        height: 32px;
        font-size: 14px;
        text-align: center;
      `;
      
      // Contenido editable de la celda
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'cell';
      input.placeholder = cellId;
      input.dataset.cellId = cellId;
      input.style.cssText = `
        padding: 8px;
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
        box-sizing: border-box;
        background-color: transparent;
        text-align: left;
        color: white;
      `;
      
      td.appendChild(input);
      row.appendChild(td);
    });
    
    this.addResizers();
    this.showNotification('Columna añadida correctamente');
  }
  
  deleteRow() {
    if (this.rows > 1) {
      // Eliminar la última fila
      this.tableBody.removeChild(this.tableBody.lastChild);
      this.rows--;
      
      // Ajustar cellValues para las filas restantes
      const newCellValues = {};
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          const oldId = this.getCellId(i + 1, j);
          const newId = this.getCellId(i, j);
          newCellValues[newId] = this.cellValues[oldId];
        }
      }
      this.cellValues = newCellValues;
      
      this.showNotification('Fila eliminada correctamente');
    } else {
      this.showNotification('No se pueden eliminar más filas');
    }
  }
  
  deleteColumn() {
    if (this.cols > 1) {
      // Eliminar el último encabezado de columna
      this.tableHead.removeChild(this.tableHead.lastChild);
      
      // Eliminar la última celda de cada fila
      const rows = this.tableBody.querySelectorAll('tr');
      rows.forEach(row => {
        row.removeChild(row.lastChild);
      });
      
      this.cols--;
      this.showNotification('Columna eliminada correctamente');
    } else {
      this.showNotification('No se pueden eliminar más columnas');
    }
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
