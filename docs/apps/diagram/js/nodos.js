/* Estilos para nodos con texto expandible */
.node {
  position: absolute;
  min-width: 60px;
  min-height: 60px;
  background: #fff;
  border: 3px solid #0077cc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  user-select: none;
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s, width 0.3s ease, height 0.3s ease;
  z-index: 2;
  padding: 0;
  text-align: center;
  overflow: hidden;
}

.node-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 5px;
}

.node-text {
  font-size: 14px;
  line-height: 1.2;
  text-align: center;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
  cursor: text;
  outline: none;
}

.node-text:focus {
  background: rgba(0, 119, 204, 0.1);
  border-radius: 3px;
}

.node-coordinates {
  font-size: 9px;
  color: #666;
  margin-top: 2px;
  display: none; /* Oculto por defecto */
}

.node:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 10px rgba(0,0,0,0.2);
}

.node.selected {
  border-color: #ff5500;
  box-shadow: 0 0 0 3px rgba(255, 85, 0, 0.3);
}

/* Para modo debug: mostrar coordenadas */
.debug .node-coordinates {
  display: block;
}
