import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * Polyfill dla obiektu process.env.
 * Przeglądarki nie posiadają go natywnie, a jest on wymagany przez serwis Gemini.
 */
(function initializeEnv() {
  if (typeof window !== 'undefined') {
    (window as any).process = (window as any).process || {};
    (window as any).process.env = (window as any).process.env || {};
    
    try {
      // @ts-ignore
      const metaEnv = import.meta.env;
      if (metaEnv) {
        (window as any).process.env.API_KEY = 
          metaEnv.VITE_API_KEY || 
          metaEnv.API_KEY || 
          (window as any).process.env.API_KEY;
      }
    } catch (e) {
      // Ignorujemy jeśli import.meta nie jest dostępne
    }
  }
})();

console.log("🚀 Inicjalizacja aplikacji Antosi...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("❌ BŁĄD KRYTYCZNY: Nie znaleziono elementu <div id='root'> w pliku index.html.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("✅ Aplikacja została zamontowana w elemencie #root.");
  } catch (error) {
    console.error("❌ BŁĄD RENDEROWANIA:", error);
  }
}