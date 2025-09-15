// apps/spreadsheet/modules/style.js — Genera estilos CSS dinámicamente
export function generateStyles() {
    const css = `
        .spreadsheet-container {
            font-family: 'Inter', sans-serif;
            max-width: 90%;
            margin: 0 auto;
            padding: 24px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .spreadsheet-title {
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
            text-align: center;
            margin-bottom: 24px;
        }
        
        .spreadsheet-controls {
            display: flex;
            gap: 16px;
            margin-bottom: 24px;
            flex-wrap: wrap;
            justify-content: center;
        }
        
        .formula-input {
            flex-grow: 1;
            padding: 12px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            font-size: 14px;
            outline: none;
        }
        
        .formula-input:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px #3b82f6;
        }
        
        .apply-btn {
            padding: 12px 24px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .apply-btn:hover {
            background: #2563eb;
        }
        
        .spreadsheet-operations {
            display: flex;
            gap: 12px;
            margin-bottom: 24px;
            flex-wrap: wrap;
            justify-content: center;
        }
        
        .spreadsheet-operations button {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s, transform 0.1s;
        }
        
        .spreadsheet-operations button:hover {
            transform: scale(1.05);
        }
        
        .add-row-btn, .add-col-btn {
            background: #10b981;
            color: white;
        }
        
        .add-row-btn:hover, .add-col-btn:hover {
            background: #059669;
        }
        
        .del-row-btn, .del-col-btn {
            background: #ef4444;
            color: white;
        }
        
        .del-row-btn:hover, .del-col-btn:hover {
            background: #dc2626;
        }
        
        .table-container {
            overflow: auto;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        table {
            border-collapse: separate;
            border-spacing: 0;
            width: 100%;
            background-color: white;
        }
        
        thead th, thead td {
            background-color: #f9fafb;
            font-weight: 600;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        
        th, td {
            border: 1px solid #e5e7eb;
            padding: 0;
            position: relative;
            min-width: 80px;
            height: 32px;
            font-size: 14px;
            text-align: center;
        }
        
        .row-header, .col-header {
            background-color: #e5e7eb;
            font-weight: 500;
            user-select: none;
            cursor: default;
            z-index: 20;
        }
        
        .cell {
            padding: 8px;
            width: 100%;
            height: 100%;
            border: none;
            outline: none;
            box-sizing: border-box;
            background-color: white;
            text-align: left;
        }
        
        .cell:focus {
            outline: 2px solid #3b82f6;
            outline-offset: -2px;
            box-shadow: 0 0 0 2px #3b82f6;
        }
        
        .selected {
            background-color: #d1e5fd !important;
        }
        
        .resizer {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 8px;
            height: 8px;
            background-color: #3b82f6;
            border-radius: 50%;
            cursor: se-resize;
            z-index: 30;
        }
        
        .col-resizer {
            right: -4px;
            top: 0;
            width: 8px;
            height: 100%;
            cursor: col-resize;
            border-radius: 0;
            background-color: transparent;
        }
        
        .row-resizer {
            bottom: -4px;
            left: 0;
            height: 8px;
            width: 100%;
            cursor: row-resize;
            border-radius: 0;
            background-color: transparent;
        }
        
        .resizer:hover {
            background-color: #1d4ed8;
        }
        
        .col-resizer:hover {
            background-color: #3b82f6;
        }
        
        .row-resizer:hover {
            background-color: #3b82f6;
        }
        
        .highlighted {
            background-color: #bfdbfe;
        }
    `;
    
    const styleId = 'spreadsheet-styles';
    const existing = document.getElementById(styleId);
    if (existing) existing.remove();
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = css;
    document.head.appendChild(style);
}

export function unloadStyles() {
    const style = document.getElementById('spreadsheet-styles');
    if (style) style.remove();
}
