import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Krytyczny polyfill dla środowisk przeglądarkowych
if (typeof window !== 'undefined') {
  (window as any).process = {
    env: {
      API_KEY: (window as any).process?.env?.API_KEY || ''
    }
  };
}

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Antosia App: Render initiated.");
  } catch (err) {
    console.error("Antosia App: Render crash", err);
    rootElement.innerHTML = `<div style="padding: 50px; text-align: center; font-family: sans-serif;">
      <h2>Wystąpił błąd aplikacji</h2>
      <p>${err instanceof Error ? err.message : 'Nieznany błąd'}</p>
      <button onclick="window.location.reload()" style="background: #ef4444; color: white; padding: 10px 20px; border: none; border-radius: 20px; cursor: pointer;">Odśwież stronę</button>
    </div>`;
  }
} else {
  console.error("Antosia App: Root element not found!");
}