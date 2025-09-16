/*
 * Mizu OS - Config Module
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
 * Sistema de configuración para Mizu OS
 * Gestiona las opciones de configuración del sistema
 */
// apps/core/modules/config.js
export default class Config {
  constructor() {
    this.config = {
      version: '3.0.1',
      architecture: 'hybrid-decentralized',
      debug: true,
      theme: 'dark',
      language: 'es',
      autoSave: true,
      notifications: true
    };
    console.log('[DEBUG] Config: Constructor llamado');
  }

  async init() {
    console.log('[DEBUG] Config: Inicializando configuración');
    
    try {
      // Cargar configuración desde localStorage si existe
      const savedConfig = localStorage.getItem('mizuOSConfig');
      if (savedConfig) {
        this.config = { ...this.config, ...JSON.parse(savedConfig) };
        console.log('[DEBUG] Config: Configuración cargada desde localStorage');
      }
      
      // Guardar configuración inicial si no existe
      if (!savedConfig) {
        this.saveConfig();
        console.log('[DEBUG] Config: Configuración inicial guardada');
      }
      
      console.log('[DEBUG] Config: Configuración inicializada:', this.config);
      return true;
    } catch (error) {
      console.error('[ERROR] Config: Error al inicializar configuración:', error);
      return false;
    }
  }

  get(key) {
    return this.config[key];
  }

  set(key, value) {
    this.config[key] = value;
    this.saveConfig();
    console.log(`[DEBUG] Config: ${key} establecido a ${value}`);
  }

  saveConfig() {
    try {
      localStorage.setItem('mizuOSConfig', JSON.stringify(this.config));
      console.log('[DEBUG] Config: Configuración guardada en localStorage');
    } catch (error) {
      console.error('[ERROR] Config: Error al guardar configuración:', error);
    }
  }

  resetConfig() {
    this.config = {
      version: '3.0.0',
      architecture: 'hybrid-decentralized',
      debug: true,
      theme: 'dark',
      language: 'es',
      autoSave: true,
      notifications: true
    };
    this.saveConfig();
    console.log('[DEBUG] Config: Configuración restablecida a valores predeterminados');
  }
}
