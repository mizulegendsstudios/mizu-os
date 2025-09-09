# 🌐 Mizu Board

> Diagrama de flujo interactivo en navegador, sin frameworks, sin dependencias, 100% en la nube.

---

## 🧩 Descripción

Aplicación frontend ligera para crear y manipular diagramas de flujo mediante nodos arrastrables y conexiones con flechas. Diseñada con prioridad absoluta en **compatibilidad**, **rendimiento** y **simplicidad técnica**.

- ✅ Solo HTML, CSS y JavaScript plano (vanilla JS).
- ✅ Sin frameworks, sin Tailwind, sin SVG añadido (solo el existente en HTML, respetado por compatibilidad).
- ✅ Funciona directamente en el navegador — sin build, sin bundlers, sin node_modules.
- ✅ Capas visuales con animaciones, ocultación automática y monitor de coordenadas en tiempo real.

Ideal para prototipos, herramientas educativas o sistemas donde la ligereza y la compatibilidad son críticas.

---

## 🖼️ Características Visuales

- **Barras auto-ocultables**: Roja (superior) y Azul (izquierda) desaparecen tras 5 segundos de inactividad.
- **Cubo holográfico 3D**: Rotación continua en esquina superior izquierda.
- **Área de trabajo expandible**: Se agranda al ocultar las barras laterales.
- **Nodos interactivos**:
  - Arrastrables.
  - Íconos cambiables con doble clic.
  - Conexiones con flechas (SVG).
  - Eliminación de conexiones con clic derecho.
- **Monitor en tiempo real**: Muestra posición del mouse y tamaño del viewport.

---

## 🗂️ Estructura del Proyecto
```text
index.html
src/
├── css/
│   ├── core.css        → Estilos globales y capas
│   └── nodos.css       → Estilos del diagrama de flujo
└── js/
    ├── core.js         → Orquestador principal
    └── dev/
    │   └── nodos.js    → Lógica de nodos y conexiones
    └── stable/
        ├── loading.js      → Control de carga suave
        ├── monitor-axis.js → Monitor de mouse y viewport
        └── monitor-bars.js → Ocultación automática de barras
```

---

## ▶️ Uso

Visita: https://mizulegendsstudios.github.io/mizu-board/

---

📜 Licencia 

AGPL 3.0 — Usa, modifica y redistribuye libremente. Al redistribuir o ejecutar como servicio en red, mantén créditos, ofrece el código fuente y usa la misma licencia.
 
🧭 Filosofía del Proyecto 

    Prioridad #1: Compatibilidad.
    Regla #1: No agregar funciones no solicitadas.
    Stack: Solo HTML, CSS, JS plano.
    Entorno: 100% en la nube — sin frameworks, sin librerías externas.
     

 

© Mizu Legends Studios — Construido con disciplina técnica y simplicidad elegante. 
