/**
 * ============================================================================
 * LEAFLET MAP INITIALIZER
 * ----------------------------------------------------------------------------
 * Ce module initialise l'instance de la carte interactive Leaflet.
 * 
 * RÈGLE DE RENDU BUNDLER :
 * Résout également le problème classique de perte des chemins d'icônes
 * par défaut de Leaflet lors de la compilation par des outils modernes comme Vite.
 * ============================================================================
 */

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_CONFIG } from '../config/map-config.js';

// RÉSOLUTION DU BUG VITE + LEAFLET IMAGES :
// Par défaut, Leaflet cherche ses images d'icônes sous forme d'URLs relatives statiques.
// Ce bloc réaffecte dynamiquement les bons chemins d'assets compilés par Vite.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

/**
 * Initialise l'objet Map Leaflet sur le conteneur HTML spécifié.
 * 
 * @param {string} containerId Identifiant ID du conteneur HTML (ex. "map-root").
 * @returns {L.Map} L'instance de la carte Leaflet initialisée.
 */
export function createMap(containerId) {
  // Initialisation de la carte avec les valeurs par défaut
  const map = L.map(containerId, {
    minZoom: MAP_CONFIG.minZoom,
    maxZoom: MAP_CONFIG.maxZoom
  }).setView(MAP_CONFIG.defaultCenter, MAP_CONFIG.defaultZoom);

  // Ajout du fond cartographique OpenStreetMap
  L.tileLayer(MAP_CONFIG.tileLayerUrl, {
    attribution: MAP_CONFIG.attribution
  }).addTo(map);

  return map;
}
