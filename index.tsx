import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Polyfill dla process.env jeśli nie jest wstrzykiwany przez bundler
if (typeof window !== 'undefined' && !(window as any).process) {
  (window as any).process = { env: {} };
}

const render = () => {
  const rootElement = document.getElementById('root');

  if (rootElement) {
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      console.log("Aplikacja Antosi: Zamontowano poprawnie.");
    } catch (error) {
      console.error("Aplikacja Antosi: Błąd renderowania:", error);
      rootElement.innerHTML = `<div style="padding: 20px; font-family: sans-serif;">Wystąpił błąd podczas ładowania strony. Prosimy spróbować później.</div>`;
    }
  } else {
    console.error("Aplikacja Antosi: Nie znaleziono kontenera #root w index.html");
  }
};

// Startujemy dopiero, gdy DOM jest gotowy
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', render);
} else {
  render();
}