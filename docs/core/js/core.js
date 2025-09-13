// core/js/config.js - Sistema de configuración visual del sistema
export class SystemConfig {
    constructor() {
        this.config = this.loadConfig();
        this.configPanel = null;
        this.isVisible = false;
    }

    // Configuración por defecto
    getDefaultConfig() {
        return {
            bars: {
                width: {
                    red: 80,    // ancho barra roja en px
                    blue: 80   // ancho barra azul en px
                },
                color: {
                    red: 'rgba(30, 0, 0, 0.6)',      // color barra roja
                    blue: 'rgba(0, 0, 30, 0.6)'     // color barra azul
                },
                transparency: {
                    red: 0.6,   // transparencia barra roja (0-1)
                    blue: 0.6   // transparencia barra azul (0-1)
                },
                blur: {
                    red: 5,      // blur barra roja en px
                    blue: 5      // blur barra azul en px
                },
                borderRadius: 0.5, // redondeo de bordes (rem)
                margin: 15         // margen en px
            },
            typography: {
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: 14        // tamaño base en px
            },
            hologram: {
                size: 80,          // tamaño del holograma en px
                rotationSpeed: 20   // velocidad de rotación en segundos
            }
        };
    }

    // Cargar configuración desde localStorage
    loadConfig() {
        try {
            const saved = localStorage.getItem('mizu-config');
            return saved ? { ...this.getDefaultConfig(), ...JSON.parse(saved) } : this.getDefaultConfig();
        } catch {
            return this.getDefaultConfig();
        }
    }

    // Guardar configuración en localStorage
    saveConfig() {
        localStorage.setItem('mizu-config', JSON.stringify(this.config));
    }

    // Crear panel de configuración
    createConfigPanel() {
        if (this.configPanel) {
            this.toggleConfigPanel();
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'config-panel';
        panel.className = 'config-panel';
        panel.innerHTML = `
            <div class="config-header">
                <h3>Configuración Visual</h3>
                <button class="config-close" onclick="systemConfig.toggleConfigPanel()">✕</button>
            </div>
            <div class="config-content">
                <div class="config-section">
                    <h4>Barras</h4>
                    <div class="config-options">
                        <div class="config-option">
                            <label>Ancho Barra Roja</label>
                            <input type="range" id="red-bar-width" min="40" max="200" value="${this.config.bars.width.red}">
                            <span class="value-display">${this.config.bars.width.red}px</span>
                        </div>
                        <div class="config-option">
                            <label>Ancho Barra Azul</label>
                            <input type="range" id="blue-bar-width" min="40" max="200" value="${this.config.bars.width.blue}">
                            <span class="value-display">${this.config.bars.width.blue}px</span>
                        </div>
                        <div class="config-option">
                            <label>Color Barra Roja</label>
                            <input type="color" id="red-bar-color" value="${this.rgbaToHex(this.config.bars.color.red)}">
                        </div>
                        <div class="config-option">
                            <label>Color Barra Azul</label>
                            <input type="color" id="blue-bar-color" value="${this.rgbaToHex(this.config.bars.color.blue)}">
                        </div>
                        <div class="config-option">
                            <label>Transparencia Roja</label>
                            <input type="range" id="red-bar-transparency" min="0" max="1" step="0.1" value="${this.config.bars.transparency.red}">
                            <span class="value-display">${Math.round(this.config.bars.transparency.red * 100)}%</span>
                        </div>
                        <div class="config-option">
                            <label>Transparencia Azul</label>
                            <input type="range" id="blue-bar-transparency" min="0" max="1" step="0.1" value="${this.config.bars.transparency.blue}">
                            <span class="value-display">${Math.round(this.config.bars.transparency.blue * 100)}%</span>
                        </div>
                        <div class="config-option">
                            <label>Blur Rojo</label>
                            <input type="range" id="red-bar-blur" min="0" max="20" value="${this.config.bars.blur.red}">
                            <span class="value-display">${this.config.bars.blur.red}px</span>
                        </div>
                        <div class="config-option">
                            <label>Blur Azul</label>
                            <input type="range" id="blue-bar-blur" min="0" max="20" value="${this.config.bars.blur.blue}">
                            <span class="value-display">${this.config.bars.blur.blue}px</span>
                        </div>
                    </div>
                </div>
                
                <div class="config-section">
                    <h4>Apariencia</h4>
                    <div class="config-options">
                        <div class="config-option">
                            <label>Redondeo de Bordes</label>
                            <input type="range" id="border-radius" min="0" max="2" step="0.1" value="${this.config.bars.borderRadius}">
                            <span class="value-display">${this.config.bars.borderRadius}rem</span>
                        </div>
                        <div class="config-option">
                            <label>Margen</label>
                            <input type="range" id="bar-margin" min="0" max="50" value="${this.config.bars.margin}">
                            <span class="value-display">${this.config.bars.margin}px</span>
                        </div>
                        <div class="config-option">
                            <label>Tamaño de Fuente</label>
                            <input type="range" id="font-size" min="10" max="24" value="${this.config.typography.fontSize}">
                            <span class="value-display">${this.config.typography.fontSize}px</span>
                        </div>
                        <div class="config-option">
                            <label>Fuente</label>
                            <select id="font-family">
                                <option value="-apple-system, BlinkMacSystemFont, sans-serif">System</option>
                                <option value="Arial, sans-serif">Arial</option>
                                <option value="Georgia, serif">Georgia</option>
                                <option value="'Courier New', monospace">Courier New</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="config-section">
                    <h4>Holograma</h4>
                    <div class="config-options">
                        <div class="config-option">
                            <label>Tamaño</label>
                            <input type="range" id="hologram-size" min="40" max="150" value="${this.config.hologram.size}">
                            <span class="value-display">${this.config.hologram.size}px</span>
                        </div>
                        <div class="config-option">
                            <label>Velocidad de Rotación</label>
                            <input type="range" id="hologram-speed" min="5" max="60" value="${this.config.hologram.rotationSpeed}">
                            <span class="value-display">${this.config.hologram.rotationSpeed}s</span>
                        </div>
                    </div>
                </div>
                
                <div class="config-actions">
                    <button class="config-btn" onclick="systemConfig.resetConfig()">Restablecer Valores</button>
                    <button class="config-btn primary" onclick="systemConfig.applyConfig()">Aplicar Cambios</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        this.configPanel = panel;
        this.isVisible = true;
        this.attachEventListeners();
    }

    // Adjuntar event listeners
    attachEventListeners() {
        const inputs = this.configPanel.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.updateValueDisplay(e.target);
            });
        });
    }

    // Actualizar display de valores
    updateValueDisplay(input) {
        const valueDisplay = input.parentNode.querySelector('.value-display');
        if (valueDisplay) {
            let value = input.value;
            if (input.type === 'range') {
                if (input.id.includes('transparency')) {
                    value = Math.round(value * 100) + '%';
                } else if (input.id.includes('border-radius')) {
                    value = value + 'rem';
                } else if (input.id.includes('font-size') || input.id.includes('hologram-size')) {
                    value = value + 'px';
                } else if (input.id.includes('hologram-speed')) {
                    value = value + 's';
                } else {
                    value = value + 'px';
                }
            }
            valueDisplay.textContent = value;
        }
    }

    // Aplicar configuración
    applyConfig() {
        // Obtener valores del panel
        this.config.bars.width.red = parseInt(document.getElementById('red-bar-width').value);
        this.config.bars.width.blue = parseInt(document.getElementById('blue-bar-width').value);
        this.config.bars.color.red = this.hexToRgba(document.getElementById('red-bar-color').value, this.config.bars.transparency.red);
        this.config.bars.color.blue = this.hexToRgba(document.getElementById('blue-bar-color').value, this.config.bars.transparency.blue);
        this.config.bars.transparency.red = parseFloat(document.getElementById('red-bar-transparency').value);
        this.config.bars.transparency.blue = parseFloat(document.getElementById('blue-bar-transparency').value);
        this.config.bars.blur.red = parseInt(document.getElementById('red-bar-blur').value);
        this.config.bars.blur.blue = parseInt(document.getElementById('blue-bar-blur').value);
        this.config.bars.borderRadius = parseFloat(document.getElementById('border-radius').value);
        this.config.bars.margin = parseInt(document.getElementById('bar-margin').value);
        this.config.typography.fontSize = parseInt(document.getElementById('font-size').value);
        this.config.typography.fontFamily = document.getElementById('font-family').value;
        this.config.hologram.size = parseInt(document.getElementById('hologram-size').value);
        this.config.hologram.rotationSpeed = parseInt(document.getElementById('hologram-speed').value);

        // Aplicar estilos
        this.applyStyles();
        
        // Guardar configuración
        this.saveConfig();
        
        // Mostrar notificación
        this.showNotification('Configuración aplicada correctamente');
    }

    // Aplicar estilos al DOM
    applyStyles() {
        const redBar = document.getElementById('red-bar');
        const blueBar = document.getElementById('blue-bar');
        const hologram = document.getElementById('hologram');
        const body = document.body;

        if (redBar) {
            redBar.style.width = this.config.bars.width.red + 'px';
            redBar.style.backgroundColor = this.config.bars.color.red;
            redBar.style.backdropFilter = `blur(${this.config.bars.blur.red}px)`;
            redBar.style.borderRadius = this.config.bars.borderRadius + 'rem';
            redBar.style.margin = this.config.bars.margin + 'px';
        }

        if (blueBar) {
            blueBar.style.width = this.config.bars.width.blue + 'px';
            blueBar.style.backgroundColor = this.config.bars.color.blue;
            blueBar.style.backdropFilter = `blur(${this.config.bars.blur.blue}px)`;
            blueBar.style.borderRadius = this.config.bars.borderRadius + 'rem';
            blueBar.style.margin = this.config.bars.margin + 'px';
        }

        if (body) {
            body.style.fontFamily = this.config.typography.fontFamily;
            body.style.fontSize = this.config.typography.fontSize + 'px';
        }

        if (hologram) {
            hologram.style.width = this.config.hologram.size + 'px';
            hologram.style.height = this.config.hologram.size + 'px';
            
            // Actualizar animación de rotación
            const hologramInner = hologram.querySelector('#hologram');
            if (hologramInner) {
                hologramInner.style.animation = `rotateCube ${this.config.hologram.rotationSpeed}s infinite linear`;
            }
        }
    }

    // Restableecer configuración
    resetConfig() {
        this.config = this.getDefaultConfig();
        this.updatePanelValues();
        this.applyStyles();
        this.saveConfig();
        this.showNotification('Configuración restablecida');
    }

    // Actualizar valores del panel
    updatePanelValues() {
        if (!this.configPanel) return;

        document.getElementById('red-bar-width').value = this.config.bars.width.red;
        document.getElementById('blue-bar-width').value = this.config.bars.width.blue;
        document.getElementById('red-bar-color').value = this.rgbaToHex(this.config.bars.color.red);
        document.getElementById('blue-bar-color').value = this.rgbaToHex(this.config.bars.color.blue);
        document.getElementById('red-bar-transparency').value = this.config.bars.transparency.red;
        document.getElementById('blue-bar-transparency').value = this.config.bars.transparency.blue;
        document.getElementById('red-bar-blur').value = this.config.bars.blur.red;
        document.getElementById('blue-bar-blur').value = this.config.bars.blur.blue;
        document.getElementById('border-radius').value = this.config.bars.borderRadius;
        document.getElementById('bar-margin').value = this.config.bars.margin;
        document.getElementById('font-size').value = this.config.typography.fontSize;
        document.getElementById('font-family').value = this.config.typography.fontFamily;
        document.getElementById('hologram-size').value = this.config.hologram.size;
        document.getElementById('hologram-speed').value = this.config.hologram.rotationSpeed;

        // Actualizar displays
        this.configPanel.querySelectorAll('.value-display').forEach(display => {
            const input = display.parentNode.querySelector('input, select');
            if (input) {
                this.updateValueDisplay(input);
            }
        });
    }

    // Toggle panel de configuración
    toggleConfigPanel() {
        if (!this.configPanel) {
            this.createConfigPanel();
        } else {
            this.configPanel.style.display = this.isVisible ? 'none' : 'flex';
            this.isVisible = !this.isVisible;
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
        }, 2000);
    }

    // Utilidades de conversión de color
    hexToRgba(hex, alpha = 1) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    rgbaToHex(rgba) {
        const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (!match) return '#000000';
        
        const r = parseInt(match[1]).toString(16).padStart(2, '0');
        const g = parseInt(match[2]).toString(16).padStart(2, '0');
        const b = parseInt(match[3]).toString(16).padStart(2, '0');
        
        return `#${r}${g}${b}`;
    }
}

// Instancia global del sistema de configuración
export const systemConfig = new SystemConfig();
