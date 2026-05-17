# BikeCity — Guide de Déploiement & Développement Local

Ce guide détaille pas-à-pas comment faire tourner l'environnement de développement complet sur votre poste, et comment déployer l'application en production sur la plateforme **Netlify**.

---

## 1. Prérequis Système

- **Node.js** : Version `>= 20.0.0` recommandée.
- **NPM** : Installé conjointement avec Node.
- **Netlify CLI** (Facultatif mais recommandé pour le dev local) : Pour exécuter le serveur local simulant parfaitement le cloud Netlify.

---

## 2. Lancement en Développement Local

Pour tester l'application et la fonction serverless en simultané, nous utilisons **Netlify Dev** (intégré via nos scripts package.json).

### Étape 1 : Cloner et installer les paquets
```bash
npm install
```

### Étape 2 : Configurer les Variables Locales
Dupliquez le fichier d'exemple et renseignez vos variables :
```bash
cp .env.example .env
```
Éditez le fichier `.env` nouvellement créé :
```env
JCDECAUX_API_KEY=your_secret_api_key_here
JCDECAUX_API_BASE_URL=https://api.jcdecaux.com/vls/v3
```

### Étape 3 : Démarrer le serveur local
```bash
npm run dev
```
Cette commande va lancer **Netlify CLI** sous le capot. Elle va :
1. Démarrer le bundler **Vite** sur le port `5173`.
2. Démarrer le compilateur de Netlify Functions sur le port `8888`.
3. Établir une passerelle proxy afin que tout appel vers `http://localhost:8888/api/*` soit redirigé localement vers vos fonctions Netlify en cours d'exécution.

Ouvrez simplement votre navigateur sur : **`http://localhost:8888`**

---

## 3. Déploiement en Production sur Netlify

### Méthode 1 : Liaison Continue Git (Recommandée)
1. Poussez votre code sur votre dépôt Git public ou privé (GitHub, GitLab, Bitbucket).
2. Connectez-vous sur votre console **Netlify**.
3. Cliquez sur **Add new site** > **Import an existing project**.
4. Sélectionnez votre dépôt `BikeCityVanilla`.
5. Netlify va lire automatiquement votre fichier `netlify.toml` et pré-remplir les réglages de build :
   - **Build Command** : `npm run build`
   - **Publish Directory** : `dist`
   - **Functions Directory** : `netlify/functions`
6. **Très Important : Configurer les variables d'environnement de production** :
   - Allez dans **Site configuration** > **Environment variables**.
   - Cliquez sur **Add a variable** et ajoutez :
     - `JCDECAUX_API_KEY` = *[Votre clé API secrète]*
     - `JCDECAUX_API_BASE_URL` = `https://api.jcdecaux.com/vls/v3`
7. Cliquez sur **Deploy site**.
8. Votre site est en ligne et 100% sécurisé !

---

## 4. Scripts Utilitaires Disponibles

| Commande | Rôle |
| :--- | :--- |
| `npm run dev` | Lance l'environnement local unifié (Vite + Netlify Functions) |
| `npm run dev:vite` | Démarre uniquement le serveur de développement Vite (Front seul) |
| `npm run build` | Compile et minifie les fichiers du front dans le dossier `dist/` |
| `npm run preview` | Permet de prévisualiser localement le build de production généré |
| `npm run lint` | Lance l'outil de linter ESLint 9 sur l'ensemble du projet |
| `npm run check` | Enchaîne la validation linter et le build de production pour valider la stabilité |
