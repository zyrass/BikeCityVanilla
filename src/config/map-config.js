/**
 * ============================================================================
 * MAP CONFIGURATION
 * ----------------------------------------------------------------------------
 * Stocke tous les paramètres configurables de la carte Leaflet.
 * Centraliser ces valeurs permet de modifier l'apparence ou le zoom initial
 * en une seule modification sans altérer la logique du code.
 * ============================================================================
 */

export const MAP_CONFIG = {
  // Coordonnées de départ par défaut (Centrées sur la France en général ou Lyon)
  defaultCenter: [45.764043, 4.835659], // Lyon, France
  
  // Niveaux de zoom configurés
  defaultZoom: 13,
  minZoom: 3,
  maxZoom: 18,
  
  // URL des tuiles OpenStreetMap
  tileLayerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  
  // Crédits obligatoires pour l'utilisation d'OpenStreetMap
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
};
