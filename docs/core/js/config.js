// core/js/config.js - Sistema de configuración visual del sistema corregido
export class SystemConfig {
    constructor() {
        // Guardamos la configuración por defecto original
        this.defaultConfig = this.getDefaultConfig();
        // Cargamos la configuración guardada o la por defecto
        this.config = this.loadConfig();
        this.configPanel = null;
        this.isVisible = false;
    }
    
    // Configuración por defecto basada en los valores originales de core.css
    getDefaultConfig() {
        return {
            bars: {
                width: {
                    red: 100,    // ancho barra roja en % (100% en CSS original)
                    blue: 12.5     // ancho barra azul en % (5rem de 24rem base ≈ 20%)
                },
                height: {
                    red: 12.5,   // alto barra roja en % (3rem de 24rem base ≈ 12.5%)
                    blue: 100    // alto barra azul en % (100% en CSS original)
                },
                color: {
                    red: 'linear-gradient(90deg, hsla(0, 100%, 6%, 0.6), hsla(0, 95%, 30%, 0.6))',
                    blue: 'linear-gradient(270deg, hsla(240, 100%, 6%, 0.6), hsla(250, 95%, 30%, 0.6))'
                },
                transparency: {
                    red: 0.3,   // transparencia barra roja (0-1)
                    blue: 0.3   // transparencia barra azul (0-1)
                },
                blur: {
                    red: 10,     // blur barra roja en px
                    blue: 10     // blur barra azul en px
                },
                borderRadius: 1, // redondeo de bordes (rem)
                margin: 15         // margen en px
            },
            typography: {
                fontFamily: "'Inter', sans-serif",
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
            if (saved) {
                const parsedConfig = JSON.parse(saved);
                // Combinamos con la configuración por defecto para asegurar todas las propiedades
                return this.mergeDeep(this.defaultConfig, parsedConfig);
            }
            return this.defaultConfig;
        } catch (error) {
            console.error('Error al cargar configuración:', error);
            return this.defaultConfig;
        }
    }
    
    // Función para combinar objetos profundamente
    mergeDeep(target, source) {
        const output = Object.assign({}, target);
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target))
                        Object.assign(output, { [key]: source[key] });
                    else
                        output[key] = this.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    }
    
    // Función auxiliar para verificar si es un objeto
    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }
    
    // Guardar configuración en localStorage
    saveConfig() {
        try {
            localStorage.setItem('mizu-config', JSON.stringify(this.config));
        } catch (error) {
            console.error('Error al guardar configuración:', error);
            this.showNotification('Error al guardar la configuración');
        }
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
                            <input type="range" id="red-bar-width" min="10" max="100" value="${this.config.bars.width.red}">
                            <span class="value-display">${this.config.bars.width.red}%</span>
                        </div>
                        <div class="config-option">
                            <label>Alto Barra Roja</label>
                            <input type="range" id="red-bar-height" min="5" max="30" value="${this.config.bars.height.red}">
                            <span class="value-display">${this.config.bars.height.red}%</span>
                        </div>
                        <div class="config-option">
                            <label>Ancho Barra Azul</label>
                            <input type="range" id="blue-bar-width" min="10" max="100" value="${this.config.bars.width.blue}">
                            <span class="value-display">${this.config.bars.width.blue}%</span>
                        </div>
                        <div class="config-option">
                            <label>Alto Barra Azul</label>
                            <input type="range" id="blue-bar-height" min="10" max="100" value="${this.config.bars.height.blue}">
                            <span class="value-display">${this.config.bars.height.blue}%</span>
                        </div>
                        <div class="config-option">
                            <label>Color Barra Roja</label>
                            <div class="color-gradient-picker">
                                <input type="color" id="red-bar-color-start" value="#1e0000" title="Color inicial">
                                <span>→</span>
                                <input type="color" id="red-bar-color-end" value="#4d0000" title="Color final">
                            </div>
                        </div>
                        <div class="config-option">
                            <label>Color Barra Azul</label>
                            <div class="color-gradient-picker">
                                <input type="color" id="blue-bar-color-start" value="#000033" title="Color inicial">
                                <span>→</span>
                                <input type="color" id="blue-bar-color-end" value="#000066" title="Color final">
                            </div>
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
                                <option value="'Inter', sans-serif">Inter</option>
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
                } else if (input.id.includes('width') || input.id.includes('height')) {
                    value = value + '%';
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
        this.config.bars.height.red = parseInt(document.getElementById('red-bar-height').value);
        this.config.bars.width.blue = parseInt(document.getElementById('blue-bar-width').value);
        this.config.bars.height.blue = parseInt(document.getElementById('blue-bar-height').value);
        
        // Para los colores de gradiente, necesitamos obtener ambos colores
        const redBarColorStart = document.getElementById('red-bar-color-start').value;
        const redBarColorEnd = document.getElementById('red-bar-color-end').value;
        const blueBarColorStart = document.getElementById('blue-bar-color-start').value;
        const blueBarColorEnd = document.getElementById('blue-bar-color-end').value;
        
        // Convertir hex a HSLA para los gradientes
        this.config.bars.color.red = this.createGradient(redBarColorStart, redBarColorEnd, this.config.bars.transparency.red, 90);
        this.config.bars.color.blue = this.createGradient(blueBarColorStart, blueBarColorEnd, this.config.bars.transparency.blue, 270);
        
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
    
    // Crear gradiente HSLA a partir de colores hex
    createGradient(hexColor1, hexColor2, alpha, direction) {
        const hsla1 = this.hexToHsla(hexColor1, alpha);
        const hsla2 = this.hexToHsla(hexColor2, alpha);
        return `linear-gradient(${direction}deg, ${hsla1}, ${hsla2})`;
    }
    
    // Convertir hex a HSLA
    hexToHsla(hex, alpha) {
        // Eliminar # si está presente
        hex = hex.replace('#', '');
        
        // Manejar formatos cortos (#RGB)
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        
        // Validar que es un valor hexadecimal válido
        if (!/^[0-9A-F]{6}$/i.test(hex)) {
            console.warn('Valor hexadecimal no válido:', hex);
            return `hsla(0, 0%, 0%, ${alpha})`;
        }
        
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0; // acromático
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
        
        return `hsla(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%, ${alpha})`;
    }
    
    // Aplicar estilos al DOM
    applyStyles() {
        const redBar = document.getElementById('red-bar');
        const blueBar = document.getElementById('blue-bar');
        const hologram = document.getElementById('hologram');
        const body = document.body;
        
        if (redBar) {
            redBar.style.width = this.config.bars.width.red + '%';
            redBar.style.height = this.config.bars.height.red + '%';
            redBar.style.background = this.config.bars.color.red;
            redBar.style.backdropFilter = `blur(${this.config.bars.blur.red}px)`;
            redBar.style.borderRadius = this.config.bars.borderRadius + 'rem';
            redBar.style.margin = this.config.bars.margin + 'px';
        }
        
        if (blueBar) {
            blueBar.style.width = this.config.bars.width.blue + '%';
            blueBar.style.height = this.config.bars.height.blue + '%';
            blueBar.style.background = this.config.bars.color.blue;
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
            const hologramInner = hologram.querySelector('#cube') || hologram;
            if (hologramInner) {
                hologramInner.style.animation = `rotateCube ${this.config.hologram.rotationSpeed}s infinite linear`;
            }
        }
    }
    
    // Restablecer configuración - CORREGIDO
    resetConfig() {
        // Restaurar la configuración por defecto original
        this.config = JSON.parse(JSON.stringify(this.defaultConfig));
        this.updatePanelValues();
        this.applyStyles();
        this.saveConfig();
        this.showNotification('Configuración restablecida a valores originales');
    }
    
    // Actualizar valores del panel
    updatePanelValues() {
        if (!this.configPanel) return;
        
        document.getElementById('red-bar-width').value = this.config.bars.width.red;
        document.getElementById('red-bar-height').value = this.config.bars.height.red;
        document.getElementById('blue-bar-width').value = this.config.bars.width.blue;
        document.getElementById('blue-bar-height').value = this.config.bars.height.blue;
        
        // Para los colores de gradiente, necesitamos extraer los colores del gradiente
        const redGradient = this.extractGradientColors(this.config.bars.color.red);
        const blueGradient = this.extractGradientColors(this.config.bars.color.blue);
        
        if (redGradient) {
            document.getElementById('red-bar-color-start').value = redGradient.start;
            document.getElementById('red-bar-color-end').value = redGradient.end;
        }
        
        if (blueGradient) {
            document.getElementById('blue-bar-color-start').value = blueGradient.start;
            document.getElementById('blue-bar-color-end').value = blueGradient.end;
        }
        
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
    
    // Extraer colores de un gradiente
    extractGradientColors(gradient) {
        const match = gradient.match(/linear-gradient\(\d+deg,\s*hsla?\(([^)]+)\),\s*hsla?\(([^)]+)\)\)/);
        if (!match) return null;
        
        // Extraer valores HSLA
        const hsla1 = match[1].split(',').map(val => val.trim());
        const hsla2 = match[2].split(',').map(val => val.trim());
        
        // Convertir HSL a hex
        const hex1 = this.hslaToHex(hsla1[0], hsla1[1], hsla1[2]);
        const hex2 = this.hslaToHex(hsla2[0], hsla2[1], hsla2[2]);
        
        return {
            start: hex1,
            end: hex2
        };
    }
    
    // Convertir HSL a Hex
    hslaToHex(h, s, l) {
        h = parseInt(h) / 360;
        s = parseInt(s) / 100;
        l = parseInt(l) / 100;
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l; // acromático
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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
}

// Instancia global del sistema de configuración
// Se crea después de que la clase esté completamente definida
let systemConfig;
document.addEventListener('DOMContentLoaded', () => {
    systemConfig = new SystemConfig();
    // Hacerlo global para que pueda ser accedido desde los atributos onclick
    window.systemConfig = systemConfig;
});
