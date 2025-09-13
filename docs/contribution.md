
# 👥 Guía de Contribución - Mizu OS

> ¡Gracias por tu interés en contribuir a Mizu OS! Esta guía te ayudará a entender nuestro flujo de trabajo, estándares de código y filosofía de desarrollo.

---

## 📋 Tabla de Contenidos
- [Filosofía del Proyecto](#-filosofía-del-proyecto)
- [Primeros Pasos](#-primeros-pasos)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Estándares de Código](#-estándares-de-código)
- [Flujo de Desarrollo](#-flujo-de-desarrollo)
- [Creando una Nueva Aplicación](#-creando-una-nueva-aplicación)
- [Pruebas y Calidad](#-pruebas-y-calidad)
- [Política de Pull Requests](#-política-de-pull-requests)
- [Licencia y Derechos](#-licencia-y-derechos)

---

## 🎯 Filosofía del Proyecto

### Principios Fundamentales
- **✅ Vanilla Puro**: Solo HTML, CSS y JavaScript nativo - sin frameworks, sin preprocesadores
- **✅ Compatibilidad Primero**: No romper funcionalidad existente al añadir nuevas características
- **✅ Nube Nativo**: Todo debe funcionar directamente en el navegador - sin builds, sin compilación
- **✅ Modularidad**: Cada aplicación debe ser independiente y auto-contenida
- **✅ Licencia AGPL**: Todo código contribuido debe ser compatible con GNU AGPL-3.0

### ❌ Lo que NO hacemos
- No usamos React, Vue, Angular, o cualquier otro framework JS
- No usamos Sass, Less, Tailwind, o cualquier preprocesador CSS
- No usamos Webpack, Vite, Rollup, o cualquier sistema de build
- No usamos SVG para elementos de UI (solo para contenido opcional)
- No añadimos dependencias externas sin aprobación explícita

---

## 🚀 Primeros Pasos

### 1. Configuración del Entorno
```bash
# 1. Haz fork del repositorio
# 2. Clona tu fork localmente
git clone https://github.com/tu-usuario/mizu-os.git
cd mizu-board

# 3. Configura el remote upstream
git remote add upstream https://github.com/mizulegendsstudios/mizu-os.git

# 4. Sirve la carpeta docs/ (¡NO abras index.html directamente!)
python -m http.server 8000
# o
npx serve docs/
# o
php -S localhost:8000 -t docs/
```

### 2. Entendiendo la Estructura
```
docs/
├── index.html          # Punto de entrada principal
├── core/               # Sistema central - MODIFICAR CON PRECAUCIÓN
│   ├── css/core.css    # Estilos base del sistema
│   └── js/             # Módulos core
└── apps/               # Aplicaciones - ZONA SEGURA PARA CONTRIBUCIONES
    ├── diagram/        # App de diagramas existente
    └── tu-app/         # ¡Tu nueva app aquí!
```

### 3. Flujo Básico de Trabajo
```bash
# 1. Sincroniza con upstream
git fetch upstream
git checkout main
git merge upstream/main

# 2. Crea una rama para tu feature
git checkout -b feature/nombre-de-tu-feature

# 3. Desarrolla y prueba localmente
# 4. Haz commit de tus cambios
git add .
git commit -m "feat: añadir [breve descripción]"

# 5. Push a tu fork
git push origin feature/nombre-de-tu-feature

# 6. Abre un Pull Request
```

---

## 🏗️ Estándares de Código

### Estructura de una Aplicación
```
apps/
└── mi-app/
    ├── js/
    │   └── mi-app.js          # Lógica principal - debe exportar initApp()
    ├── css/
    │   └── mi-app.css         # Estilos específicos - usar BEM
    ├── assets/                # Recursos (imágenes, etc.)
    └── README.md              # Documentación de la app
```

### JavaScript
```javascript
// ✅ CORRECTO - Módulos ES6, export nombrados
export function initApp(redrawCallback) {
    // Tu código aquí
}

// ✅ CORRECTO - Compatibilidad con navegadores antiguos
function miFuncion() {
    // Usar características ES6+ pero con fallbacks
    const elemento = document.getElementById('id') || document.querySelector('.clase');
}

// ❌ INCORRECTO - No usar frameworks
import React from 'react'; // ¡NO!
const app = Vue.createApp({}); // ¡NO!
```

### CSS
```css
/* ✅ CORRECTO - Usar metodología BEM */
.mi-app { /* Block */ }
.mi-app__elemento { /* Element */ }
.mi-app--modificador { /* Modifier */ }

/* ✅ CORRECTO - Variables CSS nativas */
:root {
    --mi-app-color-primary: #0077cc;
    --mi-app-spacing: 1rem;
}

.mi-app {
    color: var(--mi-app-color-primary);
    padding: var(--mi-app-spacing);
}

/* ❌ INCORRECTO - No usar preprocesadores */
/* .mi-app {
    &:hover { // ¡NO! Sass/Less
        color: darken(@primary, 10%); // ¡NO!
    }
} */
```

### HTML
```html
<!-- ✅ CORRECTO - Semántico y accesible -->
<section class="mi-app" aria-label="Nombre de la aplicación">
    <h2 class="mi-app__titulo">Título</h2>
    <button class="mi-app__boton" type="button">Acción</button>
</section>

<!-- ❌ INCORRECTO - No usar frameworks -->
<div id="app"></div>
<!-- ¡NO usar para Vue/React! -->
```

---

## 🔧 Flujo de Desarrollo

### 1. Para Correcciones de Bugs
```bash
# 1. Identifica el bug y crea un issue si no existe
# 2. Crea una rama desde main
git checkout -b fix/nombre-del-bug

# 3. Desarrolla la corrección
# 4. Añade tests si es posible
# 5. Documenta los cambios
```

### 2. Para Nuevas Features
```bash
# 1. Discute la feature en un issue primero
# 2. Crea una rama desde main  
git checkout -b feature/nombre-feature

# 3. Desarrolla incrementalmente
# 4. Mantén la compatibilidad con apps existentes
# 5. Documenta exhaustivamente
```

### 3. Para Nuevas Aplicaciones
```bash
# 1. Propón la app en un issue con especificaciones
# 2. Crea una rama desde main
git checkout -b app/nombre-app

# 3. Sigue la plantilla de aplicación
# 4. Asegura la integración con el sistema core
# 5. Prueba en múltiples navegadores
```

---

## 🎨 Creando una Nueva Aplicación

### Plantilla Básica de Aplicación
```javascript
// apps/mi-app/js/mi-app.js
/**
 * Mi Nueva Aplicación
 * @module mi-app
 * @version 1.0.0
 * @license AGPL-3.0
 */

// Variables de estado de la aplicación
let appState = {
    initialized: false,
    elements: []
};

/**
 * Inicializa la aplicación
 * @param {Function} redrawCallback - Callback para redibujar conexiones
 * @returns {boolean} - True si se inicializó correctamente
 */
export function initApp(redrawCallback) {
    if (appState.initialized) {
        console.warn('La aplicación ya está inicializada');
        return false;
    }
    
    try {
        // 1. Crear elementos DOM
        createAppElements();
        
        // 2. Configurar event listeners
        setupEventListeners();
        
        // 3. Integrar con el sistema core si es necesario
        integrateWithCore();
        
        appState.initialized = true;
        console.log('Aplicación inicializada correctamente');
        return true;
    } catch (error) {
        console.error('Error inicializando aplicación:', error);
        return false;
    }
}

/**
 * Limpia y destruye la aplicación
 */
export function destroyApp() {
    // Limpieza de event listeners y elementos
    appState.initialized = false;
    appState.elements = [];
}

// Funciones internas de la aplicación
function createAppElements() {
    // Crear elementos DOM de la aplicación
}

function setupEventListeners() {
    // Configurar event listeners
}

function integrateWithCore() {
    // Integración con sistema core si es necesario
}
```

### Estilos de la Aplicación
```css
/* apps/mi-app/css/mi-app.css */
/**
 * Estilos para Mi Aplicación
 * Usar metodología BEM y variables CSS nativas
 */

.mi-app {
    position: relative;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.5rem;
    padding: 1rem;
}

.mi-app__titulo {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: #ffffff;
}

.mi-app__boton {
    background: #0077cc;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.mi-app__boton:hover {
    background: #005fa3;
}
```

### Integración con el Sistema Core
```javascript
// En core/js/core.js - Añadir la nueva app
import { initApp as initMiApp } from '../apps/mi-app/js/mi-app.js';

// En la función de inicialización
document.addEventListener('DOMContentLoaded', () => {
    // ... inicialización existente
    
    // Inicializar nueva aplicación
    initMiApp(drawLines);
});
```

---

## 🧪 Pruebas y Calidad

### Checklist de Calidad
- [ ] ✅ Funciona en Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- [ ] ✅ No rompe funcionalidad existente
- [ ] ✅ Sin errores en la consola del navegador
- [ ] ✅ Performance: < 100ms de latencia en interacciones
- [ ] ✅ Accesibilidad: Soporte básico de ARIA y navegación por teclado
- [ ] ✅ Responsive: Funciona en diferentes tamaños de pantalla
- [ ] ✅ Documentación: Comentarios JSDoc y README actualizado

### Pruebas Manuales
```bash
# Probar en diferentes navegadores
# Verificar que las barras se ocultan/muestran correctamente
# Testear arrastre de elementos y redibujado de conexiones
# Verificar que no hay memory leaks
```

---

## 🔄 Política de Pull Requests

### Proceso de PR
1. **Discutir primero**: Abre un issue antes de trabajar en features grandes
2. **Una PR por feature**: Mantén las PRs focalizadas y pequeñas
3. **Describe los cambios**: Explica qué, por qué y cómo has hecho los cambios
4. **Incluye screenshots**: Para cambios visuales, incluye capturas
5. **Menciona issues relacionados**: Usa "Closes #123" para issues que resuelves

### Plantilla de PR
```markdown
## Descripción
[Explica qué cambios has hecho y por qué]

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva feature
- [ ] Nueva aplicación
- [ ] Refactor
- [ ] Documentación

## Checklist
- [ ] He leído la guía de contribución
- [ ] Mi código sigue los estándares del proyecto
- [ ] He probado en múltiples navegadores
- [ ] He actualizado la documentación
- [ ] No he añadido dependencias externas

## Capturas de Pantalla
[Añade capturas si aplica]

## Issues Relacionados
Closes #123, Related to #456
```

### Revisión de Código
- **Objetivo**: 1-2 revisores por PR
- **Tiempo**: Objetivo de revisión en 48 horas
- **Criterios**: Compatibilidad, rendimiento, estándares de código
- **Comentarios**: Constructivos y específicos

---

## 📜 Licencia y Derechos

### Licencia AGPL-3.0
Al contribuir a Mizu OS, aceptas que tu código será licenciado bajo **GNU Affero General Public License v3.0**.

### Derechos de Autor
- Mantén los headers de copyright existentes
- Añade tu nombre al archivo AUTHORS si es tu primera contribución
- No incluyas código con licencias incompatibles

### Atribución Requerida
```javascript
/**
 * Mizu OS - [Nombre de tu aplicación]
 * Copyright (C) 2024 [Tu Nombre] y contribuidores
 * 
 * Este programa es software libre: puedes redistribuirlo y/o modificarlo
 * bajo los términos de la GNU Affero General Public License como publicada por
 * la Free Software Foundation, ya sea versión 3 de la Licencia, o
 * (a tu elección) cualquier versión posterior.
 */
```

---

## 🆘 ¿Necesitas Ayuda?

### Recursos
- 📚 [Documentación de Arquitectura](./architecture.md)
- 🐛 [Reportar Bugs](https://github.com/mizulegendsstudios/mizu-os/issues)
- 💡 [Sugerir Features](https://github.com/mizulegendsstudios/mizu-os/discussions)
- 💬 [Discord/Slack]([enlace a canal de chat]) - *Próximamente*

### Puntos de Contacto
- **Issues técnicos**: @mizulegendsstudios
- **Dudas de diseño**: Abre un discussion
- **Problemas de licencia**: Revisa LICENSE file

---

## ✨ Reconocimientos

### Para Contribuidores Primerizos
- Issues etiquetados con `good-first-issue` son ideales para empezar
- No tengas miedo de preguntar - la comunidad es amigable
- Las PRs pequeñas son más fáciles de revisar y mergear

### Estilo de Commit
Usa [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` para nuevas features
- `fix:` para correcciones de bugs
- `docs:` para documentación
- `refactor:` para refactorizaciones
- `test:` para tests

Ejemplo:
```bash
git commit -m "feat: añadir editor de texto básico"
git commit -m "fix: correr cálculo de posiciones en conexiones"
```

---

**¡Gracias por contribuir a Mizu OS!** 🚀

*Juntos construimos el futuro del software vanilla en la nube.*
