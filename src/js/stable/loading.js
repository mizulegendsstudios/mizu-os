export function initializeLoadingScreen() {
  // Estilo inicial más robusto
  document.documentElement.style.visibility = 'hidden';
  document.documentElement.style.opacity = '0';
  document.documentElement.style.transition = 'opacity 0.3s ease-in';
  
  function revealContent() {
    // Verificar carga de estilos
    const stylesReady = Array.from(document.styleSheets).every(sheet => {
      try {
        return sheet.cssRules || sheet.rules || sheet.href === null;
      } catch (e) {
        return false;
      }
    });
    
    if (stylesReady) {
      document.documentElement.style.visibility = 'visible';
      requestAnimationFrame(() => {
        document.documentElement.style.opacity = '1';
      });
    } else {
      setTimeout(revealContent, 100);
    }
  }
  
  // Intentar revelar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealContent);
  } else {
    revealContent();
  }
  
  // Fallback absoluto
  setTimeout(revealContent, 3000);
}
