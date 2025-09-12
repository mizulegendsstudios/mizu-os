# 🌐 Mizu OS - Entorno de productividad multimodal en la nube

    “Sistema operativo web nativo construido con JavaScript puro, HTML5 y CSS3. Diseñado para ejecutar aplicaciones productivas directamente en el navegador, sin frameworks, sin dependencias, 100% en la nube".

![Versión](https://img.shields.io/badge/versión-2.10.20-green)
![Licencia](https://img.shields.io/badge/licencia-AGPL--3.0-blue)
![Tecnología](https://img.shields.io/badge/tecnología-Vanilla_JS_CSS_HTML-purple)
![Estado](https://img.shields.io/badge/status/alpha-orange)

---

## 🌐 Demo en vivo

👉 [https://mizulegendsstudios.github.io/mizu-board/](https://mizulegendsstudios.github.io/mizu-board/)

---

## 🌟 Visión del Proyecto

Mizu OS es un sistema operativo web modular diseñado con prioridad absoluta en **compatibilidad**, **rendimiento** y **simplicidad técnica** para integrar múltiples aplicaciones productivas en una interfaz unificada y coherente. 

---

### 📱 Apps / Roadmap

| App         | Estado   | Notas clave                                                     |
| ----------- | -------- | --------------------------------------------------------------- |
| 📊 Diagramas   | ✅ Alpha  | Nodos + puertos anclados, líneas sin SVG, conexiones divisibles |
| 📋 Texto       | 🚧 Plan  | Procesador de texto con formato plano, Markdown, WYSIWYG.                       |
| 📈 Tablas      | 🚧 Plan  | Tablas dinámicas + fórmulas matematicas, export CSV              |
| 🎧 Reproductor | 🚧 Plan  | Audio + listas + visualizador de onda en tiempo real                       |
| 🎨 Gráficos 2D | 🚧 Plan  | Manipulación de imágenes y vectores por capas, PNG/SVG export                       |
| 🧊 Editor 3D   | 🚧 Plan  | modelado básico, rotación, iluminación, exportación OBJ                      |

---

## 🏗️ Arquitectura Técnica
### Principios Fundamentales

    ✅ Zero Dependencies: Solo HTML/CSS/JavaScript vanilla. Sin frameworks, sin Tailwind, sin SVG añadido.
    ✅ Cloud-Native: Ejecución 100% en navegador (GitHub Pages + jsDelivr) — sin build, sin bundlers, sin node_modules, sin servidores locales.
    ✅ Compatibilidad First: Sin breaking changes
    ✅ Extensible por diseño: cada app es un módulo independiente.
    ✅ Licencia libre: GNU AGPL-3.0 — cualquier modificación públicada en la red debe compartirse la fuente.

### 📦 Stack Tecnológico
    // Tecnologías principales
    - ES6+ JavaScript (módulos nativos)
    - CSS3 con Custom Properties
    - HTML5 APIs (Canvas, WebAudio, etc.)

    // Estructura de módulos
    Mizu OS → Core Framework → [Diagramas, Texto, Tablas, Media, Gráficos, 3D]
---

## 🗂️ Estructura del Proyecto
```text
main/
├─ LICENSE                         # GNU AGPL-3.0
│  ├─ docs/
│  ├─ index.html                   # Entry-point
│  ├─ core/                        # Motor
│  │  ├─ assets/                   # video, imágenes
│  │  ├─ js/
│  │  │   ├── js/core.js           # Orquestador
│  │  │   ├── js/loading.js        # Pantalla carga
│  │  │   ├── js/monitor_axis.js   # Mouse/viewport
│  │  │   ├── js/monitor_bars.js   # Auto-hide barras
│  │  ├─ css/
│  │  │   │   └── css/core.css     # Layout fijo (5 rem barras)
│  │  └─ json/
│  ├─ apps/                        # Módulos
│  │  ├─ diagram/
│  │  │   ├── js/
│  │  │   │   ├── nodos.js         # Nodos tradicionales
│  │  │   │   ├── nodos-puertos.js # Contenedores + 4 puertos
│  │  │   │   └── drawlines.js     # Dibuja líneas con <div>
│  │  │   └── css/
│  │  │       └── nodos.css        # Estilos nodos y conexiones
│  │  ├─ text/                     # (Próximo) Plantilla app
│  │  ├─ table/                    # (Próximo) Plantilla app
│  ├─ readme.md                    # -
│  ├─ favicon.ico                  # -
│  ├─ contribution.md              # Guía de contribución
│  ├─ contribution.md              # Guía de contribución
│  └─ architecture.md              # Documentación técnica
├─ .nojekyll                       # -
└─ .gitignore                      # -
```

---

## 🎯 Características técnicas actuales (v2.10.20)
### ✅ Implementado

**CORE**

    - 🖼️ Fondo de video inmersivo.
    - 🖱️ Monitor de coordenadas y viewport en tiempo real.
    - 🎚️ Barras superior y lateral con ocultamiento automático tras 5s de inactividad.
    - ✨ Efectos de transparencia, blur y sombras (estilo “glassmorphism”).
    - 📦 Estructura modular: `core/`, `apps/`, `assets/`.
    - 🧊 Cubo holográfico 3D: Rotación continua en esquina superior izquierda.
    - 🔧 Área de trabajo expandible: Se agranda al ocultar las barras laterales.

**APP/DIAGRAM**

    - ➕ Sistema de nodos interactivos:
      - Arrastrables.
      - Íconos cambiables con doble clic.
      - Conexiones con flechas (SVG).
      - Eliminación de conexiones con clic derecho.
    - 🔄 Conexiones dibujadas con `div` + CSS (sin SVG, compatible con zoom/pan futuro).

### 🔄 En Desarrollo
**CORE**

    - [ ] Crear plantilla base para nuevas apps (`app-template.js`, `app-template.css`).
    - [ ] Implementar sistema de persistencia (localStorage → luego IndexedDB).

**APP/DIAGRAM**
    
    - [ ] Integrar zoom/pan sin conflictos con arrastre de nodos/puertos.
    - [ ] Nuevo sistema de contenedores con puertos anclados.

---
Copyright / COPYING

    Mizu OS - Sistema operativo visual modular en la nube  
    Copyright (C) 2024  Mizu Legends Studios  

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

---

## 📜 Licencia 

Este proyecto está bajo GNU Affero General Public License v3.0 — Usa, modifica y redistribuye libremente. Al redistribuir o ejecutar como servicio en red, mantén créditos, ofrece el código fuente y usa la misma licencia. ver [LICENSE](https://github.com/mizulegendsstudios/mizu-board/blob/main/LICENSE) para detalles completos.

    "Si usas este software en un servidor público, debes ofrecer el código fuente modificado a los usuarios."

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
¡Contribuciones son bienvenidas! Este proyecto sigue el [Código de Conducta](https://mizulegendsstudios.github.io/mizu-board/) y está bajo [AGPL-3.0](https://github.com/mizulegendsstudios/mizu-board/blob/main/LICENSE).

### Prerrequisitos
    # Navegadores compatibles
    - Chrome 80+ / Firefox 75+ / Safari 13+ / Edge 80+
    - JavaScript ES6+ habilitado
    - Conexión internet (para recursos CDN)

### Instalación Local

    # Clonar y servir localmente
    git clone https://github.com/mizulegendsstudios/mizu-board.git
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
    
    apps/mi-app/
    ├── css/mi-app.css
    ├── js/mi-app.js
    └── assets/
---

## 🌐 Soporte y Comunidad

📋 Issues: [Reportar bugs](https://github.com/mizulegendsstudios/mizu-board/issues)

📚 Docs: [Documentación técnica](https://github.com/mizulegendsstudios/mizu-board/blob/main/docs/architecture.md)

📧 Email: mizulegendsgg@gmail.com

---

Mizu OS - Redefiniendo la productividad en la nube, un módulo a la vez. 🚀

¡Dale una ⭐ en GitHub si crees en el futuro del software vanilla en la nube!

© Mizu Legends Studios — Construido con disciplina, técnica y simplicidad elegante. 
