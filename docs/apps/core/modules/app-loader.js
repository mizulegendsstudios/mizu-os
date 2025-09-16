//docs/apps/core/modules/app-loader.js
/*
 * Mizu OS - App Loader Module
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
 * Sistema de carga dinámica de aplicaciones para Mizu OS
 * Gestiona el descubrimiento, carga y descarga de aplicaciones de forma modular
 */
export default class AppLoader {
    constructor(eventBus, config) {
        this.eventBus = eventBus;
        this.config = config;
        this.apps = {};
        this.activeApp = null;
        
        // Escuchar eventos de activación de aplicaciones
        this.eventBus.on('app:activate', (appName) => {
            this.activateApp(appName);
        });
    }
    
    async loadAvailableApps() {
        console.log('AppLoader: Cargando aplicaciones disponibles');
        
        // Lista de aplicaciones para cargar
        const appList = [
            { name: 'music', path: './apps/music/appcore.js' }
            // Aquí se pueden añadir más aplicaciones
        ];
        
        for (const appInfo of appList) {
            try {
                const module = await import(appInfo.path);
                const AppClass = module.default;
                this.apps[appInfo.name] = new AppClass(this.eventBus, this.config);
                await this.apps[appInfo.name].init();
                console.log(`AppLoader: Aplicación ${appInfo.name} cargada correctamente`);
            } catch (error) {
                console.error(`AppLoader: Error al cargar la aplicación ${appInfo.name}`, error);
            }
        }
    }
    
    async activateApp(appName) {
        if (!this.apps[appName]) {
            console.error(`AppLoader: La aplicación ${appName} no está disponible`);
            return;
        }
        
        // Desactivar la aplicación actual si existe
        if (this.activeApp) {
            await this.activeApp.deactivate();
        }
        
        // Activar la nueva aplicación
        const container = document.getElementById('black-content-wrapper');
        if (container) {
            await this.apps[appName].activate(container);
            this.activeApp = this.apps[appName];
            console.log(`AppLoader: Aplicación ${appName} activada`);
        }
    }
}
