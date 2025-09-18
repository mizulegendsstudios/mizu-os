/*
 * Mizu OS - Music App Bootstrap
 * Copyright (C) 2025 Mizu Legends Studios.
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
 * Bootstrap para la aplicación de música de Mizu OS
 * Permite el auto-registro de la aplicación en el sistema descentralizado
 * // apps/music/bootstrap.js
 */

// Función autoejecutable para registrar la aplicación
(async function() {
  console.log('🎵 Music App Bootstrap: Iniciando auto-registro');
  
  // Esperar a que el sistema esté disponible
  const waitForSystem = () => {
    return new Promise((resolve) => {
      if (window.AppRegistry && window.LoaderFactory) {
        resolve();
      } else {
        setTimeout(waitForSystem, 100);
      }
    });
  };
  
  try {
    // Esperar a que el sistema esté disponible
    await waitForSystem();
    
    // Importar la clase de la aplicación
    const { default: MusicApp } = await import('./appcore.js');
    
    // Obtener el loader adecuado para aplicaciones persistentes
    const loader = window.LoaderFactory.getLoader('persistent', window.EventBus);
    
    // Registrar la aplicación en el sistema
    const success = await window.AppRegistry.registerApp(
      'music', 
      './apps/music/manifest.json', 
      loader.constructor
    );
    
    if (success) {
      console.log('✅ Music App: Registrada correctamente en el sistema');
      
      // Notificar al sistema que la aplicación está lista
      window.EventBus.emit('app:bootstrap-complete', {
        appId: 'music',
        timestamp: Date.now()
      });
    } else {
      console.error('❌ Music App: Error al registrar en el sistema');
    }
  } catch (error) {
    console.error('❌ Music App Bootstrap: Error durante el auto-registro:', error);
  }
})();
