/**
 * ============================================================================
 * STATION MARKER GENERATOR
 * ----------------------------------------------------------------------------
 * Ce module crée des marqueurs personnalisés interactifs pour chaque station.
 * 
 * DESIGN RIGAUREUX & PREMIUM :
 * Les icônes par défaut de Leaflet sont remplacées par des pins SVG
 * dynamiques dotés d'effets de lueur (glow) et dont la couleur indique
 * l'état en temps réel de la station.
 * ============================================================================
 */

import L from 'leaflet';
import { escapeHtml } from '../security/sanitize-html.js';

/**
 * Détermine la couleur thématique associée à l'état de la station.
 * 
 * @param {object} station Données de la station normalisée.
 * @returns {string} Code couleur hexadécimal.
 */
function getStationColor(station) {
  if (station.status !== 'OPEN') {
    return '#64748b'; // Ardoise / Inactif (Fermé)
  }
  if (station.availableBikes === 0) {
    return '#ef4444'; // Rouge / Alerte (Aucun vélo)
  }
  if (station.availableBikes <= 5) {
    return '#f97316'; // Orange / Attention (Remplissage faible)
  }
  return '#10b981'; // Vert / Optimal (Disponible)
}

/**
 * Génère le code HTML d'un pin SVG personnalisé avec ombre portée et couleur d'état.
 * 
 * @param {string} color Couleur hexadécimale du marqueur.
 * @returns {string} Chaîne SVG.
 */
function getSvgIcon(color) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" style="filter: drop-shadow(0px 3px 5px rgba(0,0,0,0.3));">
      <path fill="${color}" d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `;
}

/**
 * Crée un marqueur Leaflet entièrement configuré avec un popup stylisé pour une station.
 * 
 * @param {object} station Données de la station normalisée.
 * @returns {L.Marker|null} Marqueur Leaflet configuré ou null si la position est erronée.
 */
export function createStationMarker(station) {
  const lat = Number(station.position?.latitude);
  const lng = Number(station.position?.longitude);

  // Validation préventive des coordonnées géographiques
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    console.warn("Station ignorée en raison de coordonnées géographiques erronées:", station);
    return null;
  }

  const themeColor = getStationColor(station);

  // Création de l'icône SVG sur mesure
  const customIcon = L.divIcon({
    html: getSvgIcon(themeColor),
    className: 'custom-bike-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -34]
  });

  // Calcul du taux de remplissage pour la jauge visuelle
  const capacity = station.totalStands || 1;
  const fillPercentage = Math.min(100, Math.max(0, (station.availableBikes / capacity) * 100));

  // Libellé de statut en français
  const statusLabel = station.status === 'OPEN' ? 'Ouverte' : 'Fermée / Hors service';
  const statusClass = station.status === 'OPEN' ? 'status-open' : 'status-closed';

  // Création du marqueur Leaflet
  const marker = L.marker([lat, lng], { icon: customIcon });

  // Injection d'une bulle d'information (Popup) premium
  marker.bindPopup(`
    <div class="leaflet-custom-popup">
      <header class="popup-header">
        <h3 class="popup-title">${escapeHtml(station.name)}</h3>
        <span class="popup-status ${statusClass}">${statusLabel}</span>
      </header>
      
      <div class="popup-body">
        <p class="popup-address">
          <strong>Adresse :</strong> ${escapeHtml(station.address)}
        </p>
        
        <div class="popup-metrics">
          <div class="metric-card metric-bikes">
            <span class="metric-icon">🚲</span>
            <span class="metric-label">Vélos</span>
            <span class="metric-value" style="color: ${themeColor};">${station.availableBikes}</span>
          </div>
          <div class="metric-card metric-stands">
            <span class="metric-icon">🔒</span>
            <span class="metric-label">Bornes</span>
            <span class="metric-value">${station.availableStands}</span>
          </div>
        </div>

        <div class="popup-capacity-bar">
          <div class="capacity-bar-fill" style="width: ${fillPercentage}%; background-color: ${themeColor};"></div>
        </div>
        <div class="capacity-text">
          Capacité totale : ${capacity} bornes
        </div>
      </div>
    </div>
  `);

  return marker;
}
