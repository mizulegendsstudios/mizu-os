// apps/spreadsheet/modules/operations.js — Botones de operaciones
import { rows, cols, createTable, cellValues, getCellId } from './ui.js';
import { getCellPosition } from './logic.js';

export function initializeOperations() {
    document.getElementById('add-row-btn').addEventListener('click', () => {
        rows++;
        createTable();
    });
    
    document.getElementById('add-col-btn').addEventListener('click', () => {
        cols++;
        createTable();
    });
    
    document.getElementById('del-row-btn').addEventListener('click', () => {
        if (rows > 1) {
            rows--;
            
            const newCellValues = {};
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    const oldId = getCellId(i + 1, j);
                    const newId = getCellId(i, j);
                    newCellValues[newId] = cellValues[oldId];
                }
            }
            
            Object.keys(cellValues).forEach(key => delete cellValues[key]);
            Object.assign(cellValues, newCellValues);
            
            createTable();
        }
    });
    
    document.getElementById('del-col-btn').addEventListener('click', () => {
        if (cols > 1) {
            cols--;
            createTable();
        }
    });
}
