/**
 * ============================================================================
 * FRONT-END API CLIENT
 * ----------------------------------------------------------------------------
 * Ce module gère les appels réseau depuis le navigateur vers notre proxy
 * serverless local.
 * 
 * NOTE SÉCURITÉ :
 * Le front-end ne communique JAMAIS directement avec le serveur de JCDecaux.
 * Il interroge notre point d'entrée local `/api/stations` hébergé sur Netlify.
 * ============================================================================
 */

/**
 * Récupère les données des stations de vélos depuis le proxy local Netlify.
 * 
 * @param {string} [contract=''] Contrat de ville facultatif (ex. "Lyon", "Marseille").
 * @returns {Promise<object[]>} Liste normalisée des stations.
 */
export async function fetchStations(contract = '') {
  // Construction dynamique de l'URL pointant vers le proxy local `/api/stations`
  const url = new URL('/api/stations', window.location.origin);

  // Si une ville spécifique est fournie, on l'ajoute comme paramètre
  if (contract) {
    url.searchParams.set('contract', contract);
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    const data = await response.json();

    // Gestion des codes d'erreur renvoyés par notre proxy
    if (!response.ok) {
      throw new Error(data.error ?? `Erreur serveur (Code: ${response.status})`);
    }

    return data.stations ?? [];

  } catch (error) {
    console.error("Échec lors du chargement des stations:", error);
    // On propage un message d'erreur lisible pour l'interface utilisateur
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Impossible de joindre le serveur. Veuillez vérifier votre connexion.'
    );
  }
}
