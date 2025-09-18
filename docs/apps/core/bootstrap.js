// bootstrap.js
import { ConfigManager } from './configManager.js';
import { StyleEngine } from './styleEngine.js';
import { ModuleLoader } from './moduleLoader.js';

class SystemBootstrap {
  constructor() {
    this.config = new ConfigManager();
    this.styleEngine = new StyleEngine();
    this.moduleLoader = new ModuleLoader();
  }

  async init() {
    // Cargar configuración
    await this.config.load();
    
    // Generar estilos base
    this.styleEngine.generateBaseStyles();
    
    // Cargar módulos principales
    await this.moduleLoader.loadCoreModules();
    
    console.log(`Mizu OS v${this.config.get('version')} inicializado`);
  }
}

// Iniciar sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const system = new SystemBootstrap();
  system.init().catch(console.error);
});
