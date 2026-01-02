
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Usunięto polyfill process.env - zgodnie z wytycznymi zmienna ta musi być dostarczona zewnętrznie przez środowisko wykonawcze.

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