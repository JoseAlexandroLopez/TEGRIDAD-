import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import './styles/globals.css';
import Login from './pages/auth/Login';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);

// Registro del Service Worker para cumplir con el Consolidado 2.2
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registrado con éxito. Alcance:', registration.scope);
      })
      .catch((error) => {
        console.error('Error en el registro del Service Worker:', error);
      });
  });
}