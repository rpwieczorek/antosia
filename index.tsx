import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Polyfill dla process.env jeśli nie jest wstrzykiwany przez bundler
// Użyto rzutowania na any, aby uniknąć błędu TypeScript dotyczącego braku właściwości process w obiekcie window
if (typeof window !== 'undefined' && !(window as any).process) {
  (window as any).process = { env: {} };
}

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Nie znaleziono elementu #root");
}