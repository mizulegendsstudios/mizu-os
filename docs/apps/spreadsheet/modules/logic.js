// apps/spreadsheet/modules/logic.js — Lógica de cálculo y fórmulas
export let cellValues = {};
export let selectedCells = new Set();

export function getColLetter(colIndex) {
    let letter = '';
    while (colIndex >= 0) {
        letter = String.fromCharCode(65 + (colIndex % 26)) + letter;
        colIndex = Math.floor(colIndex / 26) - 1;
    }
    return letter;
}

export function getCellId(rowIndex, colIndex) {
    return `${getColLetter(colIndex)}${rowIndex + 1}`;
}

export function getCellPosition(cellId) {
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

export function getCellValue(cellId) {
    const formula = cellValues[cellId] || '';
    return evaluateFormula(formula);
}

export function getCellRange(start, end) {
    const startPos = getCellPosition(start);
    const endPos = getCellPosition(end);
    
    if (!startPos || !endPos) return [];
    
    const startRow = Math.min(startPos.rowIndex, endPos.rowIndex);
    const endRow = Math.max(startPos.rowIndex, endPos.rowIndex);
    const startCol = Math.min(startPos.colIndex, endPos.colIndex);
    const endCol = Math.max(startPos.colIndex, endPos.colIndex);
    
    const cells = [];
    for (let i = startRow; i <= endRow; i++) {
        for (let j = startCol; j <= endCol; j++) {
            cells.push(getCellId(i, j));
        }
    }
    
    return cells;
}

export function evaluateFormula(formula) {
    if (formula.startsWith('=')) {
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
                    const range = getCellRange(startCell.trim(), endCell.trim());
                    values = range.map(id => parseFloat(getCellValue(id))).filter(val => !isNaN(val));
                } else {
                    values = args.split(',').map(arg => {
                        const trimmedArg = arg.trim();
                        const pos = getCellPosition(trimmedArg);
                        if (pos) {
                            return parseFloat(getCellValue(trimmedArg));
                        }
                        return parseFloat(trimmedArg);
                    }).filter(val => !isNaN(val));
                }
                
                switch (funcName) {
                    case 'SUMA': return values.reduce((acc, val) => acc + val, 0);
                    case 'RESTA': return values.length < 2 ? '#ERROR!' : values.slice(1).reduce((acc, val) => acc - val, values[0]);
                    case 'MULTIPLICACION': return values.length === 0 ? 0 : values.reduce((acc, val) => acc * val, 1);
                    case 'DIVISION': return values.length < 2 || values[1] === 0 ? '#DIV/0!' : values[0] / values[1];
                    case 'PROMEDIO': return values.length === 0 ? 0 : values.reduce((acc, val) => acc + val, 0) / values.length;
                    case 'MIN': return Math.min(...values);
                    case 'MAX': return Math.max(...values);
                    case 'CONTAR': return args.split(',').map(arg => arg.trim()).filter(val => val !== '').length;
                    default: return '#NOMBRE?';
                }
            } catch (e) {
                return '#ERROR!';
            }
        } else {
            let expression = formula.substring(1);
            const cellRegex = /([A-Z]+\d+)/gi;
            
            let evalExpression = expression.replace(cellRegex, (match) => {
                const cellId = match.toUpperCase();
                const value = parseFloat(getCellValue(cellId));
                return isNaN(value) ? 0 : value;
            });
            
            try {
                return eval(evalExpression);
            } catch (e) {
                return '#ERROR!';
            }
        }
    }
    
    return formula;
}

export function updateCellContent(cellInput) {
    const cellId = cellInput.dataset.cellId;
    const formula = cellInput.value;
    
    cellValues[cellId] = formula;
    const displayValue = evaluateFormula(formula);
    cellInput.value = displayValue;
    cellInput.dataset.formula = formula;
    
    // Actualizar celdas dependientes
    Object.keys(cellValues).forEach(id => {
        const formulaToReevaluate = cellValues[id];
        if (formulaToReevaluate.includes(cellId.toUpperCase())) {
            const dependentCellInput = document.querySelector(`td[data-cell-id='${id}'] input`);
            if(dependentCellInput) {
                dependentCellInput.value = evaluateFormula(formulaToReevaluate);
            }
        }
    });
}

export function initializeLogic() {
    // Lógica ya definida en funciones exportadas
    // No necesita inicialización adicional
}
