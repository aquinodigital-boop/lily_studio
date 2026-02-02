
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("Executando index.tsx...");

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Remove o loader assim que o React montar
    const loader = document.getElementById('loader-overlay');
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
      }, 300);
    }
    
    console.log("Lily Studio montado com sucesso.");
  } catch (e) {
    console.error("Erro fatal na renderização:", e);
    alert("Erro ao iniciar o app. Por favor, clique em 'Resetar Cache' na tela.");
  }
}
