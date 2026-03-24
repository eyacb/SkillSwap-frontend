# Cahier des Charges — SkillSwap
> Plateforme d'échange de compétences entre particuliers  
> Version 1.0 — Projet Fullstack React + Node.js

---

## Table des matières

1. [Présentation du projet](#1-présentation-du-projet)
2. [Objectifs et périmètre](#2-objectifs-et-périmètre)
3. [Fonctionnalités détaillées](#3-fonctionnalités-détaillées)
4. [Architecture technique](#4-architecture-technique)
5. [Structure des dossiers](#5-structure-des-dossiers)
6. [Modèles de données (Mongoose)](#6-modèles-de-données-mongoose)
7. [API RESTful — Routes backend](#7-api-restful--routes-backend)
8. [Frontend — Pages et composants](#8-frontend--pages-et-composants)
9. [Authentification JWT](#9-authentification-jwt)
10. [Gestion de l'état (Context API)](#10-gestion-de-létat-context-api)
11. [Variables d'environnement](#11-variables-denvironnement)
12. [Instructions d'installation](#12-instructions-dinstallation)
13. [Contraintes et règles de développement](#13-contraintes-et-règles-de-développement)
14. [Livrables attendus](#14-livrables-attendus)

---

## 1. Présentation du projet

**SkillSwap** est une plateforme web full-stack permettant à des utilisateurs d'échanger leurs compétences sans argent. Chaque utilisateur publie ce qu'il sait faire (offre) et ce qu'il souhaite apprendre (demande). L'application suggère automatiquement des paires d'utilisateurs dont les offres et demandes sont mutuellement compatibles, créant ainsi un système de troc de savoirs.

**Exemple concret :**
- Alice maîtrise Figma et veut apprendre la guitare.
- Bob maîtrise la guitare et veut apprendre Figma.
- SkillSwap les met en relation automatiquement.

---

## 2. Objectifs et périmètre

### Objectifs principaux

- Permettre à tout utilisateur de s'inscrire, créer un profil et publier ses compétences.
- Afficher un catalogue public de compétences disponibles à l'échange.
- Proposer un algorithme de matching entre utilisateurs dont les compétences sont complémentaires.
- Gérer le cycle de vie d'un échange : proposition → acceptation / refus → échange réalisé.
- Sécuriser les routes sensibles via un système d'authentification JWT.

### Ce qui est hors périmètre (v1)

- Système de messagerie interne entre utilisateurs.
- Paiement ou monétisation.
- Application mobile native.
- Système de notation ou d'évaluation post-échange.
- Notifications en temps réel (WebSocket).

---

## 3. Fonctionnalités détaillées

### 3.1 Authentification

| Fonctionnalité | Description |
|---|---|
| Inscription | Création d'un compte avec nom, email, mot de passe (hashé bcrypt) |
| Connexion | Retourne un token JWT valide 7 jours |
| Déconnexion | Suppression du token côté client (localStorage) |
| Route protégée | Toute route privée vérifie le token via middleware |
| Persistance | Token stocké dans `localStorage`, rechargé au démarrage via `AuthContext` |

### 3.2 Gestion du profil utilisateur

| Fonctionnalité | Description |
|---|---|
| Voir son profil | Affichage du nom, bio, avatar, liste de ses compétences |
| Modifier son profil | Mise à jour du nom, bio, avatar (URL) |
| Voir le profil d'un autre | Page publique d'un utilisateur avec ses compétences offertes |

### 3.3 Gestion des compétences (Skills)

| Fonctionnalité | Description |
|---|---|
| Publier une compétence | Titre, catégorie, niveau, type (offre ou demande), description |
| Modifier une compétence | Mise à jour par le propriétaire uniquement |
| Supprimer une compétence | Suppression par le propriétaire uniquement |
| Lister toutes les compétences | Accessible sans connexion, avec filtrage par catégorie |
| Filtrer les compétences | Par catégorie, type (offre/demande), niveau |

**Catégories disponibles :** Technologie, Musique, Langues, Design, Cuisine, Sport, Art, Business, Autre.

**Niveaux :** Débutant, Intermédiaire, Avancé.

**Types :** `offer` (je propose), `want` (je recherche).

### 3.4 Système de matching

| Fonctionnalité | Description |
|---|---|
| Suggestions automatiques | L'API calcule les paires dont l'offre de A = demande de B et vice-versa |
| Proposer un échange | Un utilisateur connecté envoie une demande de match |
| Recevoir une proposition | Notification visuelle de match entrant dans l'interface |
| Accepter un match | Statut passe à `accepted`, les deux parties sont notifiées |
| Refuser un match | Statut passe à `declined` |
| Historique | Liste de tous ses matchs passés et présents |

**Logique de matching (backend) :**
```
Pour chaque skill X de type "offer" appartenant à l'utilisateur A,
chercher les skills Y de type "want" d'autres utilisateurs B,
où X.title ≈ Y.title (comparaison case-insensitive ou par catégorie),
ET il existe un skill Z de type "offer" chez B dont le titre correspond
à un skill de type "want" chez A.
```

---

## 4. Architecture technique

### Stack technologique

| Couche | Technologie |
|---|---|
| Frontend | React 18, React Router 6, Axios, Context API |
| Backend | Node.js 18+, Express 4 |
| Base de données | MongoDB (Atlas ou local), Mongoose 7 |
| Authentification | JSON Web Token (jsonwebtoken), bcryptjs |
| Sécurité | helmet, cors, express-validator |
| Développement | nodemon, dotenv, concurrently |

### Schéma d'architecture globale

```
┌─────────────────────────────┐         ┌─────────────────────────────────────┐
│       FRONTEND (React)      │         │          BACKEND (Node/Express)     │
│                             │         │                                     │
│  React Router               │         │  Middleware                         │
│  ├── /           HomePage   │         │  ├── cors()                         │
│  ├── /profile    Profile    │◄───────►│  ├── helmet()                       │
│  ├── /matches    Matches    │  REST   │  ├── express.json()                 │
│  └── /auth       AuthPage   │  JSON   │  └── authMiddleware (JWT verify)    │
│                             │         │                                     │
│  AuthContext (JWT)          │         │  Routes                             │
│  Axios instance             │         │  ├── /api/auth                      │
│                             │         │  ├── /api/skills                    │
│                             │         │  ├── /api/matches                   │
│                             │         │  └── /api/users                     │
└─────────────────────────────┘         │                                     │
                                        │  Controllers → Models               │
                                        └────────────────┬────────────────────┘
                                                         │
                                                         ▼
                                              ┌──────────────────┐
                                              │  MongoDB Atlas   │
                                              │  ├── users       │
                                              │  ├── skills      │
                                              │  └── matches     │
                                              └──────────────────┘
```

### Flux d'une requête authentifiée

```
Client React
   │
   ├─► Axios (avec header Authorization: Bearer <token>)
   │
   ▼
Express Router
   │
   ├─► authMiddleware.js  ← vérifie et décode le JWT
   │         │
   │         ▼ (req.user = { id, email })
   │
   ├─► Controller        ← logique métier + validation
   │         │
   │         ▼
   ├─► Mongoose Model    ← requête MongoDB
   │
   └─► Response JSON (200 / 201 / 400 / 401 / 403 / 404 / 500)
```

---

## 5. Structure des dossiers

```
skillswap/
│
├── backend/
│   ├── config/
│   │   └── db.js                   ← Connexion MongoDB via Mongoose
│   │
│   ├── controllers/
│   │   ├── authController.js       ← register, login
│   │   ├── skillController.js      ← CRUD compétences
│   │   ├── matchController.js      ← suggestions, propose, accept, decline
│   │   └── userController.js       ← profil, update
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js       ← vérification JWT (req.user)
│   │   └── errorHandler.js        ← middleware d'erreur global (4 params)
│   │
│   ├── models/
│   │   ├── User.js                 ← schéma Mongoose User
│   │   ├── Skill.js                ← schéma Mongoose Skill
│   │   └── Match.js                ← schéma Mongoose Match
│   │
│   ├── routes/
│   │   ├── auth.js                 ← POST /register, POST /login
│   │   ├── skills.js               ← GET / POST / PUT / DELETE
│   │   ├── matches.js              ← GET suggestions / POST / PATCH
│   │   └── users.js                ← GET /me / PUT /me
│   │
│   ├── .env                        ← MONGO_URI, JWT_SECRET, PORT
│   ├── .env.example                ← Template sans valeurs sensibles
│   ├── package.json
│   └── server.js                   ← Point d'entrée Express
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/                 ← Images, icônes statiques
│   │   │
│   │   ├── components/             ← Composants réutilisables
│   │   │   ├── Navbar.jsx
│   │   │   ├── SkillCard.jsx
│   │   │   ├── MatchCard.jsx
│   │   │   ├── SkillForm.jsx
│   │   │   ├── ProtectedRoute.jsx  ← Redirige si non connecté
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ErrorMessage.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx     ← user, token, login(), logout()
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.jsx        ← Catalogue public de skills
│   │   │   ├── ProfilePage.jsx     ← Mon profil + mes skills (CRUD)
│   │   │   ├── MatchPage.jsx       ← Suggestions + historique des matchs
│   │   │   └── AuthPage.jsx        ← Connexion / Inscription
│   │   │
│   │   ├── services/
│   │   │   └── api.js              ← Instance Axios + intercepteur Bearer token
│   │   │
│   │   ├── App.jsx                 ← React Router, layout global
│   │   └── main.jsx                ← ReactDOM.createRoot
│   │
│   ├── .env                        ← VITE_API_URL=http://localhost:5000
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 6. Modèles de données (Mongoose)

### User

```javascript
{
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true },          // hashé bcrypt (salt 10)
  bio:       { type: String, default: '' },
  avatar:    { type: String, default: '' },             // URL image
  createdAt: { type: Date, default: Date.now }
}
```

> Le mot de passe ne doit **jamais** être retourné dans les réponses API (`select: false`).

### Skill

```javascript
{
  user:        { type: ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true, trim: true },
  category:    { type: String, enum: ['Technologie','Musique','Langues','Design',
                 'Cuisine','Sport','Art','Business','Autre'], required: true },
  level:       { type: String, enum: ['Débutant','Intermédiaire','Avancé'], required: true },
  type:        { type: String, enum: ['offer','want'], required: true },
  description: { type: String, default: '' },
  createdAt:   { type: Date, default: Date.now }
}
```

### Match

```javascript
{
  requester:  { type: ObjectId, ref: 'User', required: true },
  receiver:   { type: ObjectId, ref: 'User', required: true },
  skillOffered:   { type: ObjectId, ref: 'Skill', required: true },  // skill du requester
  skillRequested: { type: ObjectId, ref: 'Skill', required: true },  // skill souhaité
  status:     { type: String, enum: ['pending','accepted','declined'], default: 'pending' },
  createdAt:  { type: Date, default: Date.now }
}
```

---

## 7. API RESTful — Routes backend

### Base URL : `http://localhost:5000/api`

### Authentification (`/auth`)

| Méthode | Endpoint | Auth | Body | Réponse succès |
|---|---|---|---|---|
| POST | `/auth/register` | ✗ | `{ name, email, password }` | `201` `{ token, user }` |
| POST | `/auth/login` | ✗ | `{ email, password }` | `200` `{ token, user }` |

### Compétences (`/skills`)

| Méthode | Endpoint | Auth | Description | Réponse succès |
|---|---|---|---|---|
| GET | `/skills` | ✗ | Liste toutes les compétences (populaté user) | `200` `[skills]` |
| GET | `/skills/:id` | ✗ | Détail d'une compétence | `200` `{ skill }` |
| POST | `/skills` | ✓ | Créer une compétence | `201` `{ skill }` |
| PUT | `/skills/:id` | ✓ | Modifier (owner uniquement) | `200` `{ skill }` |
| DELETE | `/skills/:id` | ✓ | Supprimer (owner uniquement) | `200` `{ message }` |
| GET | `/skills/user/:userId` | ✗ | Skills d'un utilisateur | `200` `[skills]` |

### Matchs (`/matches`)

| Méthode | Endpoint | Auth | Description | Réponse succès |
|---|---|---|---|---|
| GET | `/matches/suggestions` | ✓ | Utilisateurs compatibles | `200` `[matches]` |
| GET | `/matches/mine` | ✓ | Mes matchs (envoyés + reçus) | `200` `[matches]` |
| POST | `/matches` | ✓ | Proposer un échange | `201` `{ match }` |
| PATCH | `/matches/:id/accept` | ✓ | Accepter (receiver uniquement) | `200` `{ match }` |
| PATCH | `/matches/:id/decline` | ✓ | Refuser (receiver uniquement) | `200` `{ match }` |

### Utilisateurs (`/users`)

| Méthode | Endpoint | Auth | Description | Réponse succès |
|---|---|---|---|---|
| GET | `/users/me` | ✓ | Profil de l'utilisateur connecté | `200` `{ user }` |
| PUT | `/users/me` | ✓ | Modifier son profil | `200` `{ user }` |
| GET | `/users/:id` | ✗ | Profil public d'un utilisateur | `200` `{ user }` |

### Codes de statut HTTP utilisés

| Code | Usage |
|---|---|
| `200` | Succès (GET, PUT, PATCH) |
| `201` | Ressource créée (POST) |
| `400` | Validation échouée |
| `401` | Non authentifié (token absent ou invalide) |
| `403` | Accès interdit (ne pas être propriétaire) |
| `404` | Ressource introuvable |
| `500` | Erreur serveur interne |

---

## 8. Frontend — Pages et composants

### Pages (React Router)

#### `HomePage.jsx` — Route `/`
- Affiche la grille publique de toutes les compétences disponibles.
- Filtres par catégorie et type (offre / demande).
- Chaque `SkillCard` affiche : titre, catégorie, niveau, nom de l'utilisateur.
- Bouton "Je propose un échange" → redirige vers `/auth` si non connecté, sinon ouvre la modale de proposition.
- États gérés : `loading`, `error`, `skills[]`, `activeFilter`.

#### `ProfilePage.jsx` — Route `/profile` (protégée)
- Affiche les informations de l'utilisateur connecté.
- Liste de ses compétences avec boutons Modifier / Supprimer.
- Formulaire inline (`SkillForm.jsx`) pour ajouter ou modifier une compétence.
- Section "Mes échanges en attente" avec les matchs `pending`.

#### `MatchPage.jsx` — Route `/matches` (protégée)
- Section "Suggestions" : liste des utilisateurs compatibles retournés par `/matches/suggestions`.
- Section "Mes échanges" : tous les matchs (`pending`, `accepted`, `declined`).
- Boutons Accepter / Refuser visibles uniquement pour le receiver.

#### `AuthPage.jsx` — Route `/auth`
- Bascule entre les formulaires Connexion et Inscription.
- Affiche les erreurs de validation inline.
- Après connexion, redirige vers `/profile`.
- Token stocké dans `localStorage` via `AuthContext.login()`.

### Composants réutilisables

| Composant | Rôle |
|---|---|
| `Navbar.jsx` | Barre de navigation avec liens conditionnels selon l'état d'auth |
| `SkillCard.jsx` | Carte d'une compétence (titre, catégorie, niveau, user) |
| `MatchCard.jsx` | Carte d'un match avec statut coloré et boutons d'action |
| `SkillForm.jsx` | Formulaire contrôlé pour créer / modifier une compétence |
| `ProtectedRoute.jsx` | HOC qui redirige vers `/auth` si `user` est null |
| `LoadingSpinner.jsx` | Indicateur de chargement centré |
| `ErrorMessage.jsx` | Affichage d'erreur avec message et bouton "Réessayer" |

---

## 9. Authentification JWT

### Flux complet

```
1. [POST /auth/register]
   ├── Validation : email unique, password >= 6 chars
   ├── Hash du mot de passe : bcrypt.hash(password, 10)
   ├── Sauvegarde User en base
   └── Retour : jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })

2. [POST /auth/login]
   ├── Recherche de l'utilisateur par email
   ├── Comparaison : bcrypt.compare(password, user.password)
   └── Retour : nouveau token JWT

3. [Requête protégée]
   ├── Header : Authorization: Bearer <token>
   ├── authMiddleware.js : jwt.verify(token, JWT_SECRET)
   ├── req.user = { id: decoded.id }
   └── Passage au controller suivant
```

### Stockage côté client

```javascript
// AuthContext.jsx
const login = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  setUser(user);
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setUser(null);
};
```

### Intercepteur Axios

```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL + '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

---

## 10. Gestion de l'état (Context API)

### `AuthContext.jsx`

```javascript
// Valeurs exposées via useContext(AuthContext)
{
  user,           // objet User ou null
  loading,        // boolean (vérification initiale du token)
  login(token, user),
  logout()
}
```

Au montage, le contexte vérifie si un token est présent dans `localStorage` et appelle `GET /users/me` pour recharger l'utilisateur. Si le token est expiré ou invalide, il efface le localStorage et reste déconnecté.

### État local par page

Chaque page gère ses propres états locaux avec `useState` :

```javascript
const [skills, setSkills] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

Le pattern `try / catch / finally` est utilisé systématiquement pour tous les appels Axios.

---

## 11. Variables d'environnement

### `backend/.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/skillswap
JWT_SECRET=votre_secret_jwt_tres_long_et_aleatoire
NODE_ENV=development
```

### `frontend/.env`

```env
VITE_API_URL=http://localhost:5000
```

### Règles

- Les fichiers `.env` ne doivent **jamais** être committés sur Git.
- Un fichier `.env.example` avec les clés mais sans valeurs est fourni pour chaque dossier.
- Le fichier `.gitignore` doit inclure `.env` à la racine et dans chaque sous-dossier.

---

## 12. Instructions d'installation

### Prérequis

- Node.js >= 18
- npm >= 9
- MongoDB Atlas (compte gratuit) ou MongoDB local (port 27017)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Remplir MONGO_URI et JWT_SECRET dans .env
npm run dev
# Serveur disponible sur http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:5000
npm run dev
# Application disponible sur http://localhost:5173
```

### Scripts npm (backend)

```json
{
  "dev":   "nodemon server.js",
  "start": "node server.js"
}
```

### Scripts npm (frontend)

```json
{
  "dev":   "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

---

## 13. Contraintes et règles de développement

### Sécurité

- Aucun credential (clé, mot de passe, URI) ne doit apparaître en dur dans le code source.
- Le mot de passe est toujours hashé avec bcrypt avant persistance.
- Les routes PUT/DELETE vérifient que `req.user.id === resource.user.toString()` avant toute modification.
- Les entrées utilisateur sont validées avec `express-validator` avant traitement.

### Code

- Structure de dossiers respectée : `routes/` → `controllers/` → `models/`.
- Un fichier `errorHandler.js` centralise toutes les erreurs Express (middleware 4 paramètres).
- Les `console.log` de debug sont retirés avant livraison.
- Commits Git atomiques avec messages descriptifs (ex. : `feat: add match suggestion endpoint`).

### Frontend

- Tous les appels API passent par l'instance Axios centralisée (`services/api.js`).
- Les états de chargement (`loading`) et d'erreur (`error`) sont gérés sur chaque page.
- Les routes privées utilisent `<ProtectedRoute>` (pas de logique de redirection inline).
- Les composants sont sans état quand possible (passage de props).

---

## 14. Livrables attendus

| Livrable | Description |
|---|---|
| Dépôt Git | Code source complet avec historique de commits significatifs |
| `README.md` | Instructions d'installation, présentation du projet, captures d'écran |
| `.env.example` | Fichiers templates (backend et frontend) |
| Application fonctionnelle | Inscription → connexion → publier une compétence → recevoir un match → accepter |
| Version locale | Fonctionne entièrement sur `localhost` sans configuration supplémentaire |

### Fonctionnalités minimales obligatoires pour la validation

- [x] Inscription et connexion avec JWT
- [x] CRUD complet sur les compétences (Create, Read, Update, Delete)
- [x] Au moins 3 routes frontend (React Router)
- [x] Appels Axios connectés au backend
- [x] Interface responsive avec états de chargement et d'erreur
- [x] Routes protégées avec token
- [x] Validation des entrées et gestion globale des erreurs

---

*Document rédigé pour le projet SkillSwap — Formation Fullstack React + Node.js*