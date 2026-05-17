/**
 * ============================================================================
 * NETLIFY FUNCTION: stations.js
 * ----------------------------------------------------------------------------
 * Ce script sert de proxy sécurisé (Gatekeeper) entre le navigateur et
 * l'API JCDecaux Open Data.
 * 
 * RÔLE SÉCURITÉ :
 * La clé API JCDecaux est stockée sur le serveur (via une variable 
 * d'environnement Netlify) et n'est JAMAIS envoyée au navigateur client.
 * Le navigateur fait une requête locale sur `/api/stations` et ce proxy
 * y injecte la clé API avant d'interroger JCDecaux.
 * ============================================================================
 */

import { z } from 'zod';

/**
 * Schéma de validation des paramètres de requête (Query Parameters)
 * Utilise Zod pour s'assurer que les entrées utilisateurs sont saines et valides.
 * - contract : Doit être une chaîne alphanumérique (avec tirets/underscores), max 80 caractères.
 */
const QuerySchema = z.object({
  contract: z
    .string()
    .trim()
    .min(1, "Le nom du contrat ne peut pas être vide.")
    .max(80, "Le nom du contrat est trop long.")
    .regex(/^[a-zA-Z0-9_-]+$/, "Le nom du contrat contient des caractères invalides.")
    .optional()
});

// Récupération des variables d'environnement configurées sur Netlify
const API_BASE_URL = process.env.JCDECAUX_API_BASE_URL;
const API_KEY = process.env.JCDECAUX_API_KEY;

/**
 * Handler principal de la Netlify Function (Serverless)
 * 
 * @param {object} event Événement déclencheur fourni par Netlify (contient headers, query params, etc.).
 * @returns {Promise<object>} Objet de réponse HTTP formaté pour Netlify.
 */
export async function handler(event) {
  // RÈGLE DE SÉCURITÉ : Seules les requêtes GET sont autorisées
  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, {
      error: 'Méthode non autorisée. Seul GET est accepté.'
    });
  }

  // Contrôle de la configuration système serveur
  if (!API_BASE_URL || !API_KEY) {
    console.error("ERREUR DE CONFIGURATION : Les variables d'environnement JCDECAUX_API_BASE_URL ou JCDECAUX_API_KEY sont absentes.");
    return jsonResponse(500, {
      error: 'Configuration serveur incomplète ou manquante.'
    });
  }

  // Validation des paramètres reçus du client
  const parsedQuery = QuerySchema.safeParse(event.queryStringParameters ?? {});

  if (!parsedQuery.success) {
    return jsonResponse(400, {
      error: 'Paramètres invalides.',
      details: parsedQuery.error.format()
    });
  }

  // Construction de l'URL pour requêter l'API JCDecaux
  const apiUrl = new URL(`${API_BASE_URL}/stations`);
  apiUrl.searchParams.set('apiKey', API_KEY);

  // Si un contrat spécifique est demandé, on l'ajoute au filtre de l'API
  if (parsedQuery.data.contract) {
    apiUrl.searchParams.set('contract', parsedQuery.data.contract);
  }

  try {
    // Requête vers le service externe JCDecaux
    const response = await fetch(apiUrl, {
      headers: {
        Accept: 'application/json'
      }
    });

    // Gestion des codes d'erreur HTTP retournés par JCDecaux
    if (!response.ok) {
      console.warn(`JCDecaux API a retourné un code erreur: ${response.status}`);
      return jsonResponse(response.status, {
        error: 'Erreur lors de la récupération des données de stations depuis le serveur externe.'
      });
    }

    const stations = await response.json();

    // Normalisation et renvoi de la réponse avec un en-tête de Cache de 30 secondes
    // pour éviter de saturer notre quota de requêtes API JCDecaux en cas de spams.
    return jsonResponse(200, {
      count: Array.isArray(stations) ? stations.length : 0,
      stations: normalizeStations(stations)
    }, {
      'Cache-Control': 'public, max-age=30'
    });

  } catch (error) {
    console.error("Exception interceptée durant l'appel proxy:", error);
    return jsonResponse(502, {
      error: 'Le service externe JCDecaux est temporairement indisponible.'
    });
  }
}

/**
 * Nettoie, filtre et structure les données reçues de l'API JCDecaux.
 * Cela évite de propager au client des champs inutiles ou des structures verbeuses,
 * et permet également de cast proprement les types de données.
 * 
 * @param {Array} stations Tableau brut retourné par JCDecaux.
 * @returns {Array} Tableau normalisé et sécurisé.
 */
function normalizeStations(stations) {
  if (!Array.isArray(stations)) {
    return [];
  }

  return stations.map((station) => {
    return {
      number: Number(station.number),
      // Tronquage préventif pour éviter les injections massives de textes
      name: String(station.name ?? '').slice(0, 120),
      address: String(station.address ?? '').slice(0, 180),
      status: String(station.status ?? 'UNKNOWN'),
      contractName: String(station.contractName ?? ''),
      position: {
        latitude: Number(station.position?.latitude ?? 0),
        longitude: Number(station.position?.longitude ?? 0)
      },
      // API JCDecaux v3 structure : totalStands.capacity et totalStands.availabilities
      totalStands: Number(station.totalStands?.capacity ?? 0),
      availableBikes: Number(station.totalStands?.availabilities?.bikes ?? 0),
      availableStands: Number(station.totalStands?.availabilities?.stands ?? 0)
    };
  });
}

/**
 * Helper utilitaire pour formater les réponses JSON standardisées du serveur.
 * 
 * @param {number} statusCode Code HTTP (200, 400, etc.)
 * @param {object} body Données à sérialiser en JSON
 * @param {object} headers En-têtes HTTP personnalisés optionnels
 * @returns {object} Structure de réponse conforme Netlify
 */
function jsonResponse(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*', // Autoriser les tests en développement local
      ...headers
    },
    body: JSON.stringify(body)
  };
}
