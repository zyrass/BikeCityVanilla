# BikeCity — Sécurité & Protection des Clés d'API

## La faille du Prototype : Clé API côté Navigateur

Dans la version originale de **BikeCity**, la clé d'API personnelle de JCDecaux était définie directement dans le fichier JavaScript destiné à s'exécuter sur le poste de l'utilisateur :

```javascript
// EXTRAIT DE LA FAILLE DU PROTOTYPE ORIGINAL (app.js:93) :
const API_KEY_PERSO = "your_secret_api_key_here";
```

### Pourquoi c'est une faille de sécurité critique ?

Toute ressource téléchargée par un navigateur client (fichiers HTML, CSS, JavaScript) est **entièrement lisible** par n'importe quel utilisateur ou robot explorateur. 

1. **Aucun masquage n'est efficace côté client** : Même en minifiant, obscurcissant, compressant le code, ou en injectant la clé via des variables d'environnement Vite préfixées par `VITE_`, la clé finale sera injectée en clair dans le bundle Javascript compilé et transmis au client.
2. **Facilité d'interception** :
   - Via l'inspecteur d'éléments (F12) dans l'onglet **Network (Réseau)** pour analyser l'URL appelée.
   - Via l'onglet **Sources** en recherchant le terme `apiKey` ou des chaînes hexadécimales dans les fichiers Javascript.
   - Via des crawlers automatisés parcourant GitHub si le code source y est hébergé en public.

### Risques réels en production

Si des personnes malveillantes s'emparent de votre clé API :
- **Épuisement des quotas (DDoS indirect)** : L'attaquant fait des milliers de requêtes sous votre identité, bloquant instantanément l'accès pour vos vrais utilisateurs en raison de la limitation de débit (Rate Limiting).
- **Frais financiers (Billing Abuse)** : Si l'API est payante ou facturée à l'usage, cela peut générer des milliers d'euros de facturation imprévue.
- **Bannissement définitif** : Si l'attaquant effectue des opérations frauduleuses ou illégales avec votre clé, votre compte développeur sera révoqué et banni par le fournisseur.

<br>

---

<br>

## La Solution Professionnelle : Le Proxy Serverless (Netlify Functions)

Pour immuniser l'application, nous avons mis en œuvre une **architecture de contournement par proxy**, éliminant totalement l'exposition de la clé côté navigateur.

```txt
[ Navigateur Client ]
       │
       ▼  (Appel local - Pas de clé API visible)
  GET /api/stations?contract=Lyon
       │
       ▼
[ Proxy Serverless Netlify ]   ◄───  [ Variable d'environnement masquée (Secured) ]
       │                                     - JCDECAUX_API_KEY
       ▼  (Appel sécurisé côté serveur)
  GET https://api.jcdecaux.com/vls/v3/stations?contract=Lyon&apiKey=5ef227...
       │
       ▼
[ Serveur API JCDecaux ]
```

> [!IMPORTANT]
> *Sous ce schéma conceptuel de flux sécurisé, il est **absolument primordial de remarquer que la communication chiffrée avec JCDecaux est confinée au backend**, éliminant ainsi toute **fuite potentielle d'identifiants**.*

### Avantages Majeurs du Proxy Serverless

1. **Isolation de la clé d'API** : La clé est injectée sur le conteneur serveur exécutant la Netlify Function. Elle n'est JAMAIS envoyée au navigateur. Le client ne voit passer que l'URL locale `/api/stations`.
2. **Validation stricte (Zod)** : Nous validons la conformité des paramètres clients en amont. Si un utilisateur essaie d'envoyer des caractères malveillants dans le paramètre `contract` (comme pour tenter des injections de code), la validation Zod échoue immédiatement au niveau du proxy et stoppe la requête, évitant de surcharger JCDecaux.
3. **Optimisation des performances (Caching)** : La Netlify Function applique un en-tête `Cache-Control: public, max-age=30`. Cela signifie que si 500 utilisateurs ouvrent l'application à Lyon au même moment, notre proxy ne requêtera JCDecaux qu'une seule fois, et servira la réponse en cache à tous les autres utilisateurs. Les quotas de clés d'API sont ainsi parfaitement préservés.
4. **Header de sécurité (CSP et Cors)** : Nous bloquons les requêtes de types non autorisées (POST, PUT, DELETE) et durcissons les en-têtes HTTP de l'application grâce au fichier de configuration `public/_headers` (Protection contre le clickjacking et le vol d'en-tête).
