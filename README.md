# EchoAway Backend

API REST NestJS pour l'application EchoAway - Projet RNCP

## 🏗️ Architecture du projet

Ce projet fait partie d'une architecture **multi-repositories** avec :
- **Backend** : API NestJS avec TypeORM et PostgreSQL (ce repository)
- **Frontend** : Application Vue3/Quasar avec Vite (repository séparé)
- **Déploiement** : Railway (backend) + Vercel (frontend)

## Stack Technique

- **NestJS** framework Node.js
- **TypeORM** pour l'ORM
- **PostgreSQL** base de données
- **TypeScript** pour le typage

## Installation

```bash
npm install
```

## Développement

```bash
# Mode développement avec hot reload
npm run dev

# Mode production
npm run start:prod
```

## Build

```bash
npm run build
```

## Structure du projet

```
echoaway-backend/
├── src/
│   ├── accommodations/           # Module hébergements
│   ├── auth/                     # Module d'authentification
│   ├── users/                    # Module utilisateurs
│   ├── favorites/                # Module favoris
│   ├── accommodation-images/      # Module images d'hébergement
│   ├── app.controller.ts         # Contrôleur principal
│   ├── app.service.ts            # Service principal
│   ├── app.module.ts             # Module racine
│   └── main.ts                   # Point d'entrée
├── Dockerfile
├── docker-compose.yml            # Développement local
├── env.example
└── package.json
```

## Variables d'environnement

1. Copier le fichier d'exemple :
```bash
cp env.example .env
```

2. Modifier le fichier `.env` avec vos valeurs :
```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USER=echoaway
DB_PASSWORD=echoaway_password
DB_NAME=echoaway
DB_SSL=false
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

## 🚀 Lancement de l'application complète

**Ce répertoire contient le `docker-compose.yml` principal pour lancer l'application complète en local.**

### Prérequis
- Docker et Docker Compose installés
- Ports 3000 (frontend) et 3001 (backend) disponibles
- Git pour cloner les repositories

### Démarrage rapide
```bash
# 1. Cloner le repository backend (ce repository)
git clone <url-echoaway-backend>
cd echoaway-backend

# 2. Cloner le repository frontend dans le même dossier parent
git clone <url-echoaway-frontend> ../echoaway-frontend

# 3. Lancer l'application complète
docker-compose up -d

# L'application sera accessible sur :
# - Frontend : http://localhost:3000
# - Backend API : http://localhost:3001
# - Base de données : localhost:5432
```

### Structure des dossiers
```
echoaway-app/
├── echoaway-backend/          # Ce repository (contient docker-compose.yml)
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── src/
└── echoaway-frontend/         # Repository frontend
    ├── Dockerfile
    └── src/
```

### Services disponibles
- **Backend** : Port 3001 (ce repository)
- **Frontend** : Port 3000 (repository séparé)
- **PostgreSQL** : Port 5432

### Commandes Docker utiles
```bash
# Voir les logs
docker-compose logs -f backend

# Redémarrer le backend
docker-compose restart backend

# Arrêter tous les services
docker-compose down

# Voir le statut
docker-compose ps
```

## 🚀 Déploiement en production

### Plateformes utilisées
- **Backend** : Railway (déploiement automatique depuis Git)
- **Frontend** : Vercel (déploiement automatique depuis Git)
- **Base de données** : Railway PostgreSQL

### Configuration Railway
1. Connecter le repository GitHub à Railway
2. Configurer les variables d'environnement
3. Déploiement automatique à chaque push

## Docker

```bash
# Build de l'image
docker build -t echoaway-backend .

# Exécution
docker run -p 3001:3001 echoaway-backend
```

## Scripts disponibles

- `npm run dev` - Mode développement avec hot reload
- `npm run build` - Build de production
- `npm run start` - Démarrage en mode production
- `npm run start:prod` - Démarrage optimisé pour production
- `npm run format` - Formatage du code avec Prettier

## Architecture

- **Modules** : Architecture modulaire NestJS
- **Entités** : Modèles TypeORM avec relations
- **Services** : Logique métier centralisée
- **Controllers** : Gestion des requêtes HTTP
- **Guards** : Protection des routes par authentification
- **Decorators** : Extraction des informations utilisateur

## 🔗 Liens utiles

- **Repository Frontend** : [echoaway-frontend](<url-frontend>)
- **Documentation NestJS** : https://nestjs.com/
- **Documentation TypeORM** : https://typeorm.io/
- **Railway** : https://railway.app/
- **Vercel** : https://vercel.com/

## 📚 Documentation complète

Pour une vue d'ensemble complète du projet, consultez la documentation de chaque composant :
- **Backend** : Ce README
- **Frontend** : README du repository frontend
- **Déploiement** : Configuration Railway et Vercel
