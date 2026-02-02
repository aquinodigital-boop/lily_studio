
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("Lily Studio: Iniciando componentes...");

const container = document.getElementById('root');
const loader = document.getElementById('loader-overlay');

if (container) {
  try {
    const root = createRoot(container);
    root.render(<App />);
    
    // Oculta o loader após um curto delay para garantir que o React começou a renderizar
    setTimeout(() => {
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
      }
    }, 1500);

    console.log("Lily Studio: Sistema pronto.");
  } catch (err) {
    console.error("Lily Studio: Erro crítico:", err);
  }
}
