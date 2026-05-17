/**
 * ============================================================================
 * SECURITY MODULE: sanitize-html.js
 * ----------------------------------------------------------------------------
 * Assure la désinfection élémentaire des données textuelles provenant d'APIs
 * tierces. Bien que JCDecaux soit un service fiable, c'est une règle d'or en
 * cybersécurité de ne jamais faire confiance aux entrées externes (Never Trust
 * User Input).
 * 
 * Ce module évite les failles Cross-Site Scripting (XSS) lors de l'injection
 * de variables (comme le nom de la station ou son adresse) directement dans 
 * l'HTML des popups Leaflet.
 * ============================================================================
 */

/**
 * Échappe les caractères HTML sensibles afin de désamorcer toute injection de script.
 * 
 * @param {unknown} value Valeur textuelle à assainir.
 * @returns {string} Chaîne filtrée prête pour l'insertion HTML sécurisée.
 */
export function escapeHtml(value) {
  // Conversion en chaîne et gestion des valeurs nulles ou indéfinies
  const stringValue = String(value ?? '');
  
  return stringValue
    .replaceAll('&', '&amp;')   // Échappe le caractère &
    .replaceAll('<', '&lt;')    // Échappe la balise ouvrante <
    .replaceAll('>', '&gt;')    // Échappe la balise fermante >
    .replaceAll('"', '&quot;')  // Échappe les guillemets doubles "
    .replaceAll("'", '&#039;')  // Échappe l'apostrophe '
    .replaceAll('`', '&#x60;'); // Échappe le backtick ` (souvent utilisé en template strings)
}
