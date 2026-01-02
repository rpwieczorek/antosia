import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Aplikacja Antosi: Renderowanie rozpoczęte.");
  } catch (err) {
    console.error("Aplikacja Antosi: Błąd krytyczny", err);
    rootElement.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; text-align:center; padding:20px;">
        <h2 style="color:#ef4444;">Ups! Coś poszło nie tak.</h2>
        <p style="color:#666;">Próbujemy uruchomić stronę ponownie...</p>
        <button onclick="window.location.reload()" style="margin-top:20px; padding:12px 24px; background:#ef4444; color:white; border:none; border-radius:50px; cursor:pointer; font-weight:bold;">Odśwież stronę</button>
      </div>
    `;
  }
}