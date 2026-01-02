import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Sprawdzenie czy process istnieje (ważne przy budowaniu do statycznych plików)
if (typeof process === 'undefined') {
  (window as any).process = { env: {} };
}

console.log("🚀 Inicjalizacja aplikacji Antosi...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("❌ BŁĄD KRYTYCZNY: Nie znaleziono elementu <div id='root'> w pliku index.html. Aplikacja nie może zostać zamontowana.");
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
    console.error("❌ BŁĄD RENDEROWANIA REACT:", error);
    rootElement.innerHTML = `<div style="padding: 20px; color: red;">Wystąpił błąd podczas ładowania aplikacji. Sprawdź konsolę przeglądarki.</div>`;
  }
}