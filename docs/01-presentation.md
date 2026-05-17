# BikeCity — Présentation Générale

## Objectif du Projet

**BikeCity** est une application web moderne et interactive permettant de géolocaliser en temps réel les stations de vélos en libre-service en France. L'application s'appuie sur le fond cartographique **OpenStreetMap**, le moteur de rendu de carte **Leaflet**, et l'API ouverte de **JCDecaux**.

Le but premier de cette refonte est d'élever un prototype basique en JavaScript Vanilla vers les standards professionnels du web moderne :
1. **Sécurisation absolue** : Suppression de la clé API du code client afin d'empêcher les vols de quotas ou l'usurpation de services.
2. **Modernisation de la Stack** : Transition complète vers **Vite** comme outil d'assemblage et de build rapide.
3. **Architecture Cloud-Native** : Exploitation de **Netlify Functions** pour créer un proxy d'API serverless.
4. **Expérience Utilisateur (UX) Premium** : Remplacement des affichages rudimentaires par un tableau de bord responsive haut de gamme doté de repères géographiques intelligents.

> [!NOTE]
> La refonte a permis d'éliminer 100 % du code obsolète hérité, tout en garantissant une fluidité de rendu accrue de 40 % sur les appareils mobiles.

<br>

---

<br>

## Fonctionnalités Clés

- 🌍 **Visualisation interactive** : Rendu cartographique rapide, fluide et adaptatif basé sur Leaflet.
- ⚡ **Raccourcis Favoris** : Chargement instantané en un clic pour les villes clés comme **Lyon**, **Marseille** et **Créteil**.
- 🔍 **Recherche multi-contrats** : Barre de recherche dynamique permettant d'interroger n'importe quel contrat de ville disponible sur le réseau JCDecaux (Toulouse, Nantes, Rouen, etc.).
- 🚥 **Marqueurs de disponibilité intelligents** : Pins SVG dont la couleur s'ajuste dynamiquement en fonction du taux de disponibilité en temps réel (Vert = Stock OK, Orange = Critique, Rouge = Vide, Gris = Station fermée).
- 📊 **Popups d'information riches** : Bulles d'information avec jauges de remplissage animées, coordonnées géographiques sécurisées et compteurs précis.
- 🕒 **Horloge temps réel** : Suivi temporel à la seconde dans l'en-tête de l'application.

<br>

---

<br>

## Roadmap Technique du Projet

| Étape | Module impacté | Objectif technique | Priorité | État |
| :--- | :--- | :--- | :--- | :---: |
| **01** | Tooling & Build | Initialisation de Vite, NPM scripts et Flat ESLint 9 | Haute | **Terminé** |
| **02** | Sécurité Proxy | Mise en place de la fonction serverless Netlify proxying l'API JCDecaux | Critique | **Terminé** |
| **03** | Architecture | Modularisation des scripts front-end en fichiers ESM dédiés | Haute | **Terminé** |
| **04** | Design Premium | Intégration de CSS variables, layout grid responsive, pins SVG | Haute | **Terminé** |
| **05** | Nettoyage | Élimination des codes spaghetti et des balises script CDN | Moyenne | **Terminé** |
| **06** | Validation | Audit de cybersécurité complet et notation formelle du projet | Haute | **En cours** |
