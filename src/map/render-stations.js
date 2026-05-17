/**
 * ============================================================================
 * MAP STATION RENDERING SERVICE
 * ----------------------------------------------------------------------------
 * Ce module orchestre le rendu collectif de toutes les stations récupérées.
 * Il assure le nettoyage de la carte avant chaque nouveau tracé et ajuste
 * dynamiquement la caméra (fitBounds) pour que tous les marqueurs soient visibles
 * à l'écran de l'utilisateur.
 * ============================================================================
 */

import L from 'leaflet';
import { createStationMarker } from './create-station-marker.js';

// Référence vers le groupe de calque des marqueurs actuellement affichés
let stationLayerGroup = null;

/**
 * Nettoie et redessine l'ensemble des stations sur la carte Leaflet.
 * 
 * @param {L.Map} map L'instance active de la carte Leaflet.
 * @param {object[]} stations Liste des stations de vélos normalisées à afficher.
 */
export function renderStations(map, stations) {
  // 1. DÉSINTRÉGRATION DU CALQUE PRÉCÉDENT
  // Évite l'empilement infini de marqueurs obsolètes dans la mémoire du navigateur
  if (stationLayerGroup) {
    stationLayerGroup.clearLayers();
    map.removeLayer(stationLayerGroup);
  }

  // 2. CONVERSION ET CRÉATION DES MARQUEURS
  // Génère un marqueur pour chaque station valide (les coordonnées incorrectes renvoient null)
  const markers = stations
    .map(createStationMarker)
    .filter(Boolean); // Filtre pour retirer d'éventuels éléments invalides

  if (markers.length === 0) {
    console.info("Aucun marqueur valide à afficher sur la carte.");
    return;
  }

  // 3. CRÉATION DU NOUVEAU GROUPE DE CALQUES ET AJOUT A LA CARTE
  stationLayerGroup = L.layerGroup(markers);
  stationLayerGroup.addTo(map);

  // 4. CADRAGE OPTIMAL DE LA CAMÉRA (FIT BOUNDS)
  // Calcule la boîte de délimitation (bounding box) englobant tous les marqueurs
  // et ajuste le zoom de la carte avec un padding de sécurité pour tout afficher proprement.
  const featureGroup = L.featureGroup(markers);
  map.fitBounds(featureGroup.getBounds(), {
    padding: [50, 50], // Marge intérieure en pixels
    maxZoom: 16       // Empêche un zoom excessif si une seule station est retournée
  });
}
