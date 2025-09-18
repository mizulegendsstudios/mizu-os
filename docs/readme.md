# 🌐 Mizu OS - Entorno de productividad multimodal en la nube

> "Sistema operativo web nativo construido con JavaScript puro, HTML5 y CSS3. Diseñado para ejecutar aplicaciones productivas directamente en el navegador, sin frameworks, sin dependencias, 100% en la nube".

![Versión](https://img.shields.io/badge/versión-3.0.1-green)
![Licencia](https://img.shields.io/badge/licencia-AGPL--3.0-blue)
![Tecnología](https://img.shields.io/badge/tecnología-Vanilla_JS_CSS_HTML-purple)
![Estado](https://img.shields.io/badge/status/beta-orange)
![Arquitectura](https://img.shields.io/badge/arquitectura-h%C3%ADbrida_descentralizada-blueviolet)

---

## 🌐 Demo en vivo

👉 [https://mizulegendsstudios.github.io/mizu-os/](https://mizulegendsstudios.github.io/mizu-os/)

---

## 🌟 Visión del Proyecto

Mizu OS es un sistema operativo web modular diseñado con prioridad absoluta en **compatibilidad**, **rendimiento** y **simplicidad técnica** para integrar múltiples aplicaciones productivas en una interfaz unificada y coherente. 

La versión 3.0.1 introduce una arquitectura **híbrida-descentralizada** que elimina cuellos de botella y permite que las aplicaciones se auto-registren en el sistema.

---

### 📱 Apps / Roadmap

| App           | Estado   | Notas clave                                                     |
| ------------- | -------- | --------------------------------------------------------------- |
| 🎵 Reproductor | ✅ Beta   | Reproduce links de YouTube y archivos locales con controles persistentes |
| 📊 Diagramas   | 🚧 Plan   | Nodos + puertos anclados, líneas sin SVG, conexiones divisibles |
| 📋 Editor      | 🚧 Plan   | Procesador de texto con formato plano, Markdown, WYSIWYG.       |
| 📈 Hojas de Cálculo | 🚧 Plan  | Tablas dinámicas + fórmulas matemáticas, export CSV             |
| ⚙️ Configuración | 🚧 Plan   | Sistema de configuración centralizado                           |
| 🔍 Rendimiento | ✅ Beta   | Detección de capacidades y optimización automática               |
| 🖼️ Fondos      | 🚧 Plan   | Gestor de fondos de pantalla (video, imagen, gradiente)         |
| 👤 Cuentas     | 🚧 Plan   | Sistema de cuentas y perfiles de usuario                        |
| 🔒 Privacidad   | 🚧 Plan   | Términos y política de privacidad                               |
| 🔋 Energía      | 🚧 Plan   | Monitor de consumo y modo de bajo consumo                        |

---

## 🏗️ Arquitectura Técnica (v3.0.1)
### Principios Fundamentales

    ✅ Zero Dependencies: Solo HTML/CSS/JavaScript vanilla. Sin frameworks, sin Tailwind, sin SVG añadido.
    ✅ Cloud-Native: Ejecución 100% en navegador (GitHub Pages + jsDelivr) — sin build, sin bundlers, sin node_modules, sin servidores locales.
    ✅ Compatibilidad First: Sin breaking changes
    ✅ Arquitectura Híbrida-Descentralizada: Eliminación de cuellos de botella mediante auto-registro de aplicaciones.
    ✅ Extensible por diseño: cada app es un módulo independiente con su propio bootstrap.
    ✅ Licencia libre: GNU AGPL-3.0 — cualquier modificación públicada en la red debe compartirse la fuente.

### 🔄 Nueva Arquitectura Descentralizada (v3.0.1)

A partir de la versión 3.0.1, Mizu OS ha evolucionado de una arquitectura centralizada a una **arquitectura híbrida-descentralizada**:
```text
Antigua (Centralizada):
index.html → appcore.js → app-loader.js (cuello de botella) → Apps 

Nueva (Descentralizada):
index.html → appcore.js → SystemBootstrap → AppRegistry → Apps (auto-registradas)
                       │
                       ├── EventBus (comunicación)
                       ├── AppContainerManager (UI)
                       ├── AppOptimizer (rendimiento)
                       └── LoaderFactory (carga especializada) 
```
 
**Ventajas de la nueva arquitectura:**
- ✅ **Descentralización real**: Cada aplicación gestiona su propio registro
- ✅ **Eliminación del cuello de botella**: No más app-loader.js monolítico
- ✅ **Carga bajo demanda**: Solo se carga lo necesario
- ✅ **Escalabilidad**: Fácil añadir nuevos tipos de aplicaciones
- ✅ **Mantenibilidad**: Loaders especializados por tipo
- ✅ **Resiliencia**: Fallos aislados no colapsan el sistema

### 📦 Stack Tecnológico
```text
// Tecnologías principales
- ES6+ JavaScript (módulos nativos)
- CSS3 con Custom Properties
- HTML5 APIs (Canvas, WebAudio, etc.)

// Estructura de módulos descentralizados
Mizu OS → Core Framework → [AppRegistry, EventBus, ContainerManager, Optimizer] → Apps

### 📦 Stack Tecnológico
    // Tecnologías principales
    - ES6+ JavaScript (módulos nativos)
    - CSS3 con Custom Properties
    - HTML5 APIs (Canvas, WebAudio, etc.)

    // Estructura de módulos
    Mizu OS → Core Framework → [Diagramas, Texto, Tablas, Media, Gráficos, 3D]
```
---

## 🗂️ Estructura del Proyecto
```text
main/
├─ LICENSE                                     # GNU AGPL-3.0
│  ├─ docs/
│  │  ├─ index.html                            # Entry-point
│  │  ├─ apps/                                 # Módulos de aplicaciones
│  │  │  ├─ core/                              # Motor del sistema
│  │  │  │  ├─ modules/                        # Módulos descentralizados
│  │  │  │  │  ├── eventbus.js                 # Sistema de comunicación
│  │  │  │  │  ├── app-registry.js             # Registro de aplicaciones
│  │  │  │  │  ├── app-container-manager.js    # Gestor de contenedores
│  │  │  │  │  ├── app-loader-base.js          # Clase base para loaders
│  │  │  │  │  ├── app-specialized-loaders.js  # Loaders especializados
│  │  │  │  │  ├── app-optimizer.js            # Optimizador del sistema
│  │  │  │  │  ├── system-bootstrap.js         # Inicializador del sistema
│  │  │  │  │  ├── css.js                      # Gestor de estilos
│  │  │  │  │  ├── config.js                   # Configuración
│  │  │  │  │  ├── status-widget.js            # Widgets de estado
│  │  │  │  │  └── system-ui.js                # UI del sistema
│  │  │  │  ├─ core.js                         # Orquestador principal
│  │  │  │  └─ assets/                         # Recursos del sistema
│  │  │  ├─ music/                             # Aplicación de música
│  │  │  │  ├── manifest.json                  # Manifiesto de la app
│  │  │  │  ├── appcore.js                     # Lógica de la app
│  │  │  │  └── bootstrap.js                   # Auto-registro en el sistema
│  │  │  ├─ performance/                       # Aplicación de rendimiento
│  │  │  │  ├── manifest.json
│  │  │  │  ├── appcore.js
│  │  │  │  └── bootstrap.js
│  │  │  ├─ diagram/                           # (Próximo) Aplicación de diagramas
│  │  │  ├─ editor/                            # (Próximo) Editor de texto
│  │  │  ├─ spreadsheet/                       # (Próximo) Hojas de cálculo
│  │  │  ├─ settings/                          # (Próximo) Configuración
│  │  │  ├─ wallpaper/                         # (Próximo) Gestor de fondos
│  │  │  ├─ accounts/                          # (Próximo) Sistema de cuentas
│  │  │  ├─ privacy/                           # (Próximo) Privacidad
│  │  │  └─ energy/                            # (Próximo) Monitor de energía
│  ├─ .nojekyll                                # -
│  ├─ readme.md                                # Este archivo
│  ├─ favicon.ico                              # -
│  ├─ contribution.md                          # Guía de contribución
│  └─ architecture.md                          # Documentación técnica
└─ .gitignore                                  # -
```

---

## 🎯 Características técnicas actuales (v3.0.1)
### ✅ Implementado

**SISTEMA DESCENTRALIZADO**
       
    - 🔄 Arquitectura híbrida-descentralizada con auto-registro de aplicaciones.
    - 📦 AppRegistry: Sistema de registro y descubrimiento de aplicaciones.
    - 🗂️ AppContainerManager: Gestión de contenedores para aplicaciones principales y persistentes.
    - ⚡ LoaderFactory: Loaders especializados por tipo de aplicación (web, persistente, widget, servicio, sistema).
    - 🔧 AppOptimizer: Sistema de optimización automática basada en capacidades del dispositivo.
    - 📡 EventBus: Sistema de comunicación entre componentes desacoplado.
    - 🚀 SystemBootstrap: Inicializador del sistema que coordina todos los módulos.

**CORE**
    
    - 🖼️ Fondo de video inmersivo con optimización automática para dispositivos de gama baja.
    - 🖱️ Monitor de coordenadas y viewport en tiempo real.
    - 🎚️ Barras superior y lateral con ocultamiento automático tras 5s de inactividad.
    - ✨ Efectos de transparencia, blur y sombras (estilo "glassmorphism").
    - 🧊 Cubo holográfico 3D: Rotación continua en esquina superior izquierda.
    - 🔧 Área de trabajo expandible: Se agranda al ocultar las barras laterales.
    - 📊 Widgets de estado: Reloj, batería, WiFi, volumen.
    - 🎯 Detección automática de capacidades del dispositivo y optimización.

**APP/MÚSICA**

    - 🎵 Reproductor con soporte para YouTube, SoundCloud, Mixcloud y archivos locales.
    - 📝 Playlist con gestión completa (añadir, eliminar, reordenar).
    - 🎛️ Controles persistentes (no se cierran al cambiar de aplicación).
    - 🔄 Carga automática de pista por defecto (Mare - Mizu OS Theme).
    - 👁️ Sistema de visibilidad (ocultar/mostrar sin destruir).
    - 📱 Interfaz totalmente responsiva.

**APP/RENDIMIENTO**

    - 📊 Diagnóstico completo del dispositivo (FPS, RAM, rendimiento).
    - ⚡ Recomendaciones automáticas de optimización.
    - 🔧 Modos predefinidos (gama baja, ahorro de batería, TV).
    - 📈 Monitoreo en tiempo real de recursos del sistema.

### 🔄 En Desarrollo 

**SISTEMA**

    - [ ] Navegación por teclado para Smart TVs.
    - [ ] Sistema de persistencia mejorado (IndexedDB).
    - [ ] Gestor de actualizaciones del sistema.

**APLICACIONES**

    - [ ] Diagramas: Sistema de nodos interactivos.
    - [ ] Editor: Procesador de texto multi-formato.
    - [ ] Hojas de Cálculo: Tablas dinámicas con fórmulas.
    - [ ] Configuración: Panel centralizado de opciones.
    - [ ] Fondos: Gestor de wallpapers dinámicos.
    - [ ] Cuentas: Sistema de perfiles de usuario.
    - [ ] Privacidad: Términos y políticas.
    - [ ] Energía: Monitor de consumo.
---
## 📜 Licencia 

Este proyecto está bajo GNU Affero General Public License v3.0 — Usa, modifica y redistribuye libremente. Al redistribuir o ejecutar como servicio en red, mantén créditos, ofrece el código fuente y usa la misma licencia. ver [LICENSE](./LICENSE) para detalles completos.

    "Si usas este software en un servidor público, debes ofrecer el código fuente modificado a los usuarios."

Copyright / COPYING

    Mizu OS - Sistema operativo visual modular en la nube  
    Copyright (C) 2025  Mizu Legends Studios  

    This program is free software: you can redistribute it and/or modify  
    it under the terms of the GNU Affero General Public License as published by  
    the Free Software Foundation, either version 3 of the License, or  
    (at your option) any later version.  

    This program is distributed in the hope that it will be useful,  
    but WITHOUT ANY WARRANTY; without even the implied warranty of  
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the  
    GNU Affero General Public License for more details.  

    You should have received a copy of the GNU Affero General Public License  
    along with this program.  If not, see <https://www.gnu.org/licenses/>.  

    Additional permissions under AGPL-3.0 section 7:  
    1. Static assets (images, videos, fonts) may be served via public CDN.  
    2. The copyright notice must remain visible in the interface footer.  
    3. Modified versions must display “Based on Mizu OS” in the about dialog.  

### Derechos y Obligaciones

    ✅ Puedes: Usar, modificar, distribuir comercialmente.
    ⚠️ Debes: Mantener licencia AGPLv3, incluir copyright.
    🔒 Debes: Proveer código fuente a usuarios web, documentar cambios significativos.

### 🧭 Filosofía del Proyecto 

    Prioridad #1: Compatibilidad.
    Regla #1: No agregar funciones no solicitadas.
    Stack: Solo HTML, CSS, JS plano.
    Entorno: 100% en la nube — sin frameworks, sin librerías externas.
---

## 👥 Contribución - Instalación para uso o desarrollo local
¡Contribuciones son bienvenidas! Este proyecto sigue el [Código de Conducta](./CODE_OF_CONDUCT.md) y está bajo [AGPL-3.0](./LICENSE).

### Prerrequisitos
    # Navegadores compatibles
    - Chrome 80+ / Firefox 75+ / Safari 13+ / Edge 80+
    - JavaScript ES6+ habilitado
    - Conexión internet (para recursos CDN)

### Instalación Local

    # Clonar y servir localmente
    git clone https://github.com/mizulegendsstudios/mizu-os.git
    cd mizu-board/docs

    # Con Python
    python -m http.server 8000

    # Con Node.js
    npx serve .

    # Con PHP
    php -S localhost:8000

### Despliegue Producción

    # Plataformas compatibles
    - GitHub Pages (actual)
    - Netlify / Vercel / Cloudflare Pages
    - Any static hosting

### Contribuir

    Fork → rama feature/nombre
    Crea tu app en apps/nombre-app/ (sin dependencias)
    Branch para feature: git checkout -b feature/amazing-feature
    Commit cambios: git commit -m 'feat: add amazing feature'
    Push al branch: git push origin feature/amazing-feature
    Pull Request con descripción detallada

### Guías de Estilo

    Commits: Conventional commits specification
    Código: ESLint config (próximamente)
    Documentación: Markdown con ejemplos de código
    Testing: Jest unit tests (futuro)

### Guía para Nuevas Aplicaciones
    
**Estructura**

    apps/mi-app/
    ├── manifest.json      # Metadatos de la aplicación
    ├── appcore.js        # Lógica principal de la aplicación
    └── bootstrap.js      # Auto-registro en el sistema

**Manifiesto**
```json
{
  "name": "Mi Aplicación",
  "version": "1.0.0",
  "description": "Descripción de mi aplicación",
  "icon": "📱",
  "entry": "appcore.js",
  "type": "web-app",  // web-app, persistent, widget, service, system
  "styles": [],
  "scripts": [],
  "permissions": [],
  "dependencies": [],
  "author": "Mizu Legends Studios",
  "license": "GNU AGPL-3.0"
}
```
**Bootstrap**
```javascript
/*
 * Mizu OS - Mi App Bootstrap
 * Copyright (C) 2025 Mizu Legends Studios.
 */

// Función autoejecutable para registrar la aplicación
(async function() {
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
    await waitForSystem();
    
    // Importar la clase de la aplicación
    const { default: MyApp } = await import('./appcore.js');
    
    // Obtener el loader adecuado para el tipo de aplicación
    const loader = window.LoaderFactory.getLoader('web-app', window.EventBus);
    
    // Registrar la aplicación en el sistema
    const success = await window.AppRegistry.registerApp(
      'my-app', 
      './apps/my-app/manifest.json', 
      loader.constructor
    );
    
    if (success) {
      console.log('✅ Mi App: Registrada correctamente');
    }
  } catch (error) {
    console.error('❌ Mi App Bootstrap: Error:', error);
  }
})();
```

**Appcore**
```javascript
/*
 * Mizu OS - Mi App
 * Copyright (C) 2025 Mizu Legends Studios.
 */

export default class MyApp {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.panel = null;
    this.isVisible = true;
  }
  
  async init() {
    console.log('MyApp: Inicializando');
    return Promise.resolve();
  }
  
  render() {
    // Crear y retornar el elemento DOM principal
    this.panel = document.createElement('div');
    this.panel.className = 'my-app-panel';
    // ... contenido de la aplicación
    return this.panel;
  }
  
  toggleVisibility(data) {
    // Manejar visibilidad (para apps persistentes)
    if (data && data.hide) {
      this.isVisible = false;
    } else {
      this.isVisible = !this.isVisible;
    }
    this.panel.style.display = this.isVisible ? 'flex' : 'none';
  }
}
```
---

## 🌐 Soporte y Comunidad

📋 Reportar Issues: [Github Issues](https://github.com/mizulegendsstudios/mizu-os/issues)

📚 Docs: [Architecture.md](./docs/architecture.md)

📧 Email: mizulegendsgg@gmail.com

---

Mizu OS - Redefiniendo la productividad en la nube, un módulo a la vez. 🚀

    © 2025 Mizu Legends Studios — Construido con disciplina, técnica y simplicidad elegante. 

¡Dale una ⭐ en GitHub si crees en el futuro del software vanilla en la nube!
