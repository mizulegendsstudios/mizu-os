/* Estilos para la nueva estructura del nodo */
.node {
  position: absolute;
  min-width: 60px;
  min-height: 60px;
  background: #fff;
  border: 3px solid #0077cc;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: move;
  user-select: none;
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s, width 0.3s, height 0.3s;
  z-index: 2;
  padding: 8px;
  box-sizing: border-box;
  overflow: hidden;
}

.node-icon {
  font-size: 18px;
  line-height: 1;
  margin-bottom: 2px;
  pointer-events: none; /* Evita interferir con eventos del nodo */
}

.node-text {
  font-size: 12px;
  text-align: center;
  width: 100%;
  word-wrap: break-word;
  outline: none; /* Quitar borde al editar */
  pointer-events: none; /* Evita interferir con eventos del nodo */
}

.node-text[contenteditable="true"] {
  pointer-events: auto; /* Habilitar eventos al editar */
  cursor: text;
}

.node:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 10px rgba(0,0,0,0.2);
}

.node.selected {
  border-color: #ff5500;
  box-shadow: 0 0 0 3px rgba(255, 85, 0, 0.3);
}
