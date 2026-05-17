/**
 * ============================================================================
 * APPLICATION ORCHESTRATOR: init-app.js
 * ----------------------------------------------------------------------------
 * Chef d'orchestre principal de l'application BikeCity.
 * Ce module coordonne l'initialisation de la carte Leaflet, lie les événements
 * d'interface utilisateur (boutons rapides, formulaire de recherche), anime
 * l'horloge du footer et gère les états d'affichage (chargement, succès, erreurs).
 * ============================================================================
 */

import { createMap } from '../map/create-map.js';
import { renderStations } from '../map/render-stations.js';
import { fetchStations } from '../api/stations-api.js';

/**
 * Initialise l'application BikeCity au chargement de la page.
 */
export async function initApp() {
  // 1. INITIALISATION DE LA CARTE SUR LE CONTENEUR HTML '#root'
  // On utilise l'ID 'root' pour conserver la compatibilité avec l'HTML d'origine
  const map = createMap('root');

  // 2. RÉCUPÉRATION DES RÉFÉRENCES DU DOM
  const h1 = document.getElementsByTagName("h1")[0];
  const paragraphPresentation = document.getElementById("paragraphePresention");
  const dateElement = document.querySelector("#date");
  const statusElement = document.querySelector("#status");
  const searchForm = document.querySelector("#search-form");
  const contractInput = document.querySelector("#contract");
  
  const btnLyon = document.querySelector("#btnShowMap--Lyon");
  const btnMarseille = document.querySelector("#btnShowMap--Marseille");
  const btnCreteil = document.querySelector("#btnShowMap--Creteil");

  // 3. INJECTION DES TEXTES ET IDENTIFIANTS PAR DÉFAUT
  if (h1 && !h1.textContent) {
    h1.textContent = "BikeCity";
  }
  
  if (paragraphPresentation && !paragraphPresentation.textContent) {
    paragraphPresentation.textContent = "Visualisation sécurisée en temps réel des stations de vélos en libre-service. Sélectionnez une ville rapide ou recherchez un contrat spécifique pour mettre à jour la carte interactive.";
    paragraphPresentation.classList.add("jeSuisUneClassCreeEnJsEtStylyseeEnCSS");
  }

  /**
   * Fonction interne réutilisable pour charger les stations d'une ville
   * et gérer les retours d'états dans l'UI.
   * 
   * @param {string} contract Nom du contrat / ville (ex: "Lyon").
   */
  async function loadCityStations(contract = '') {
    try {
      // Affichage du loader
      if (statusElement) {
        statusElement.className = "status-info status-loading";
        statusElement.textContent = `Chargement des données pour ${contract || 'le réseau global'}...`;
      }

      // Appel de l'API sécurisée
      const stations = await fetchStations(contract);

      if (stations.length === 0) {
        if (statusElement) {
          statusElement.className = "status-info status-warning";
          statusElement.textContent = `Aucune station active trouvée pour le contrat "${contract}".`;
        }
        return;
      }

      // Rendu cartographique
      renderStations(map, stations);

      // Notification de succès
      if (statusElement) {
        statusElement.className = "status-info status-success";
        statusElement.textContent = `✔ ${stations.length} station(s) chargée(s) avec succès pour "${contract || 'Toutes les villes'}".`;
      }

    } catch (error) {
      console.error("Erreur durant le chargement applicatif:", error);
      // Retour d'information d'erreur pour l'utilisateur
      if (statusElement) {
        statusElement.className = "status-info status-error";
        statusElement.textContent = error instanceof Error 
          ? `❌ Erreur: ${error.message}` 
          : "❌ Une erreur de communication inconnue est survenue.";
      }
    }
  }

  // 4. BINDING DES BOUTONS DE SÉLECTION RAPIDE (Rétrocompatibilité + UX)
  if (btnLyon) {
    btnLyon.addEventListener("click", (e) => {
      e.preventDefault();
      loadCityStations("Lyon");
    });
  }

  if (btnMarseille) {
    btnMarseille.addEventListener("click", (e) => {
      e.preventDefault();
      loadCityStations("Marseille");
    });
  }

  if (btnCreteil) {
    btnCreteil.addEventListener("click", (e) => {
      e.preventDefault();
      loadCityStations("Creteil");
    });
  }

  // 5. BINDING DU FORMULAIRE DE RECHERCHE GÉNERIQUE
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = contractInput ? contractInput.value.trim() : '';
      if (query) {
        loadCityStations(query);
      } else {
        if (statusElement) {
          statusElement.className = "status-info status-warning";
          statusElement.textContent = "Veuillez saisir un nom de contrat valide (ex: Toulouse, Lyon...).";
        }
      }
    });
  }

  // 6. ANIMATION DE L'HORLOGE DANS LE FOOTER
  if (dateElement) {
    const updateClock = () => {
      dateElement.textContent = new Date().toLocaleDateString("fr-FR", {
        day: "numeric",
        year: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "numeric",
        second: "numeric"
      });
    };
    updateClock(); // Appel immédiat pour éviter un blanc d'une seconde
    setInterval(updateClock, 1000);
  }

  // 7. CHARGEMENT INITIAL HORS LIGNE OU SUR UNE VILLE PAR DÉFAUT (Lyon)
  // Permet d'avoir une carte peuplée dès l'ouverture du site
  await loadCityStations("Lyon");
}
