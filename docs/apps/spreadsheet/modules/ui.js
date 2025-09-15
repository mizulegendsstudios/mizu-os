// apps/spreadsheet/modules/ui.js — Creación de tabla y eventos
import { getCellId, getCellPosition, updateCellContent, selectedCells, evaluateFormula, cellValues } from './logic.js';

export let rows = 4;
export let cols = 4;
let isDragging = false;
let startCellId = null;

export function createTable() {
    const tableBody = document.querySelector('#data-table tbody');
    const tableHead = document.querySelector('#data-table thead tr');
    
    tableBody.innerHTML = '';
    tableHead.innerHTML = `<th class="col-header"></th>`;
    
    for (let j = 0; j < cols; j++) {
        const th = document.createElement('th');
        th.className = 'col-header';
        th.textContent = getColLetter(j);
        tableHead.appendChild(th);
    }
    
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        
        const rowHeader = document.createElement('td');
        rowHeader.className = 'row-header';
        rowHeader.textContent = i + 1;
        row.appendChild(rowHeader);
        
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('td');
            const cellId = getCellId(i, j);
            cell.dataset.cellId = cellId;
            
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'cell';
            input.placeholder = cellId;
            input.dataset.cellId = cellId;
            
            const formula = cellValues[cellId] || '';
            input.value = evaluateFormula(formula);
            input.dataset.formula = formula;
            
            cell.appendChild(input);
            row.appendChild(cell);
        }
        
        tableBody.appendChild(row);
    }
    
    addResizers();
}

export function addResizers() {
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
            const allCells = document.querySelectorAll(`table tr td:nth-child(${cellIndex + 1})`);
            
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
    
    document.querySelectorAll('td').forEach(cell => {
        if (cell.classList.contains('col-header')) {
            const colResizer = document.createElement('div');
            colResizer.className = 'col-resizer';
            cell.appendChild(colResizer);
            colResizer.addEventListener('mousedown', onMouseDown);
        } else if (cell.classList.contains('row-header')) {
            const rowResizer = document.createElement('div');
            rowResizer.className = 'row-resizer';
            cell.appendChild(rowResizer);
            rowResizer.addEventListener('mousedown', onMouseDown);
        }
    });
}

export function updateSelection(cellId) {
    selectedCells.clear();
    document.querySelectorAll('.selected').forEach(c => c.classList.remove('selected'));
    
    selectedCells.add(cellId);
    const cell = document.querySelector(`td[data-cell-id='${cellId}']`);
    if(cell) cell.classList.add('selected');
}

export function initializeUI() {
    createTable();
    
    document.addEventListener('mousedown', (e) => {
        const cell = e.target.closest('td[data-cell-id]');
        if (!cell) return;
        
        startCellId = cell.dataset.cellId;
        isDragging = true;
        
        if (!e.ctrlKey && !e.metaKey) {
            updateSelection(startCellId);
        } else {
            selectedCells.add(startCellId);
            cell.classList.add('selected');
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const cell = e.target.closest('td[data-cell-id]');
        if (!cell) return;
        
        document.querySelectorAll('.selected').forEach(c => {
            const cellId = c.dataset.cellId;
            if (cellId && !selectedCells.has(cellId)) {
                c.classList.remove('selected');
            }
        });
        
        const range = getCellRange(startCellId, cell.dataset.cellId);
        range.forEach(id => {
            const el = document.querySelector(`td[data-cell-id='${id}']`);
            if (el) {
                el.classList.add('selected');
                selectedCells.add(id);
            }
        });
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    document.addEventListener('click', (e) => {
        const cell = e.target.closest('td[data-cell-id]');
        if (!cell) return;
        
        const cellInput = cell.querySelector('.cell');
        if (!cellInput) return;
        
        if (!e.ctrlKey && !e.metaKey) {
            updateSelection(cell.dataset.cellId);
        } else {
            selectedCells.add(cell.dataset.cellId);
            cell.classList.add('selected');
        }
        
        const formulaInput = document.getElementById('formula-input');
        formulaInput.value = cellInput.dataset.formula;
    });
    
    document.addEventListener('keydown', (e) => {
        const activeElement = document.activeElement;
        if (!activeElement || !activeElement.classList.contains('cell')) return;
        
        const cellInput = activeElement;
        const cellId = cellInput.dataset.cellId;
        const pos = getCellPosition(cellId);
        let nextPos = null;
        
        switch (e.key) {
            case 'Enter':
            case 'ArrowDown':
                e.preventDefault();
                updateCellContent(cellInput);
                nextPos = { rowIndex: pos.rowIndex + 1, colIndex: pos.colIndex };
                break;
            case 'ArrowUp':
                e.preventDefault();
                updateCellContent(cellInput);
                nextPos = { rowIndex: pos.rowIndex - 1, colIndex: pos.colIndex };
                break;
            case 'ArrowLeft':
                e.preventDefault();
                updateCellContent(cellInput);
                nextPos = { rowIndex: pos.rowIndex, colIndex: pos.colIndex - 1 };
                break;
            case 'ArrowRight':
                e.preventDefault();
                updateCellContent(cellInput);
                nextPos = { rowIndex: pos.rowIndex, colIndex: pos.colIndex + 1 };
                break;
        }
        
        if (nextPos) {
            const nextCellId = getCellId(nextPos.rowIndex, nextPos.colIndex);
            const nextCellInput = document.querySelector(`td[data-cell-id='${nextCellId}'] input`);
            if (nextCellInput) {
                nextCellInput.focus();
                document.getElementById('formula-input').value = nextCellInput.dataset.formula;
                updateSelection(nextCellId);
            }
        }
    });
    
    document.getElementById('apply-formula-btn').addEventListener('click', () => {
        const formula = document.getElementById('formula-input').value;
        if (!formula || selectedCells.size === 0) return;
        
        selectedCells.forEach(cellId => {
            const cellInput = document.querySelector(`td[data-cell-id='${cellId}'] input`);
            if (cellInput) {
                cellInput.value = formula;
                updateCellContent(cellInput);
            }
        });
    });
}
