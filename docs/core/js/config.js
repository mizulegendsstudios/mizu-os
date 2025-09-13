// core/js/config.js - Sistema de configuración visual del sistema
export class SystemConfig {
    constructor() {
        this.config = this.loadConfig();
        this.configPanel = null;
        this.isVisible = false;
    }
    
    // ... (el resto del código se mantiene igual hasta applyStyles)
    
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
            // Corrección: buscar la clase o ID correcta para el holograma interior
            const hologramInner = hologram.querySelector('.hologram-inner') || hologram;
            if (hologramInner) {
                hologramInner.style.animation = `rotateCube ${this.config.hologram.rotationSpeed}s infinite linear`;
            }
        }
    }
    
    // ... (el resto del código se mantiene igual)
}

// Instancia global del sistema de configuración
export const systemConfig = new SystemConfig();
