/**
 * ============================================================================
 * VITE APPLICATION ENTRYPOINT: main.js
 * ----------------------------------------------------------------------------
 * Charge les feuilles de style globales et lance l'orchestration principale.
 * ============================================================================
 */

import './styles/main.css';
import { initApp } from './app/init-app.js';

// Démarrage de l'application dès que le DOM est complètement chargé
document.addEventListener('DOMContentLoaded', () => {
  initApp().catch((error) => {
    console.error("Échec critique lors de l'initialisation de main.js:", error);
  });
});
