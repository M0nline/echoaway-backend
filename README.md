# EchoAway Backend

NestJS REST API for EchoAway application

## 🏗️ Project Architecture

This project is part of a **multi-repositories** architecture with:
- **Backend** : NestJS API with TypeORM and PostgreSQL (this repository)
- **Frontend** : Vue3/Quasar application with Vite (separate repository)
- **Deployment** : Railway (backend) + Vercel (frontend)

## Technical Stack Backend

- **NestJS** Node.js framework
- **TypeORM** for ORM
- **PostgreSQL** database
- **TypeScript** for typing

## 🚀 Complete Application Launch

**This directory contains the main `docker-compose.yml` for launching the backend and database locally.**

*Note: The Docker project name will be `echoaway-backend` (based on this folder name).*

### Prerequisites
- Docker and Docker Compose installed
- Ports 3001 (backend) and 5432 (database) available
- Node.js 18+ (recommended: use NVM for version management)
- Git for cloning repositories

### Node.js Version Management (NVM)
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Use the project's Node.js version (automatically detected)
nvm install
nvm use
```

### Quick Start
```bash
# 1. Clone the backend repository (this repository)
git clone <url-echoaway-backend>
cd echoaway-backend

# 2. Clone the frontend repository in the same parent folder
git clone <url-echoaway-frontend> ../echoaway-frontend

# 3. Launch the backend and database
docker-compose up -d

# 4. Launch the frontend in development mode
cd ../echoaway-frontend
npm install
npm run dev

# The application will be accessible on:
# - Frontend: http://localhost:3000 (npm run dev)
# - Backend API: http://localhost:3001
# - Database: localhost:5432
```

### Folder Structure
```
echoaway-app/
├── echoaway-backend/          # This repository (contains docker-compose.yml)
│   ├── docker-compose.yml     # Backend + DB
│   ├── Dockerfile
│   └── src/
└── echoaway-frontend/         # Frontend repository
    ├── package.json
    └── src/
```

### Available Services
- **Backend** : Port 3001 (this repository, Docker)
- **Frontend** : Port 3000 (separate repository, npm run dev)
- **PostgreSQL** : Port 5432 (Docker)

### Useful Docker Commands
```bash
# View logs
docker-compose logs -f backend

# Restart backend
docker-compose restart backend

# Stop all services
docker-compose down

# View status
docker-compose ps
```

### Useful Frontend Commands
```bash
# Start frontend
cd ../echoaway-frontend
npm run dev

# Install dependencies
npm install

## Installation

```bash
npm install
```

## Development

```bash
# Development mode with hot reload
npm run dev
```

## Production Build

```bash
npm run build
```

## Production Preview

```bash
npm run preview
```

## Environment Variables

### Development

1. Copy the example file:
```bash
cp env.example .env
```

2. Modify the `.env` file with your values:

```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=echoaway
DB_PASSWORD=echoaway
DB_NAME=echoaway
DB_SSL=false
JWT_SECRET=your-development-secret
JWT_EXPIRES_IN=7d
```

### Production (Railway)

Les variables d'environnement sont configurées dans Railway :

```env
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-super-secret-production-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://echoaway.vercel.app
```

**Note importante** : Railway utilise une seule variable `DATABASE_URL` qui contient toutes les informations de connexion PostgreSQL.

## 🚀 Production Deployment

### URLs de Production

- **Backend** : `https://echoaway-backend-production.up.railway.app`
- **Frontend** : `https://echoaway.vercel.app`

### Platforms Used
- **Backend** : Railway (automatic deployment from Git)
- **Frontend** : Vercel (automatic deployment from Git)
- **Database** : Railway PostgreSQL

### CI/CD Pipeline

Chaque push sur la branche `main` déclenche automatiquement :

1. **Linting** : Vérification du code avec ESLint
2. **Build** : Compilation de l'application
3. **Deploy** : Déploiement automatique sur Railway

### Workflow de Développement

#### Branches principales
- **`main`** : Branche de production (déploiement automatique)
- **`dev`** : Branche de développement (intégration)

#### Branches de travail
- **`feature/nom-feature`** : Nouvelles fonctionnalités
- **`fix/nom-correction`** : Corrections de bugs
- **`hotfix/nom-urgence`** : Corrections urgentes en production

#### Processus de développement
1. **Nouvelle fonctionnalité** :
   ```bash
   git checkout -b feature/nom-feature
   # Développement...
   git push origin feature/nom-feature
   # Pull Request vers dev
   ```

2. **Correction de bug** :
   ```bash
   git checkout -b fix/nom-correction
   # Correction...
   git push origin fix/nom-correction
   # Pull Request vers dev
   ```

3. **Correction urgente** :
   ```bash
   git checkout -b hotfix/nom-urgence
   # Correction...
   git push origin hotfix/nom-urgence
   # Pull Request vers main (puis merge vers dev)
   ```

4. **Intégration** :
   - Merge `feature/*` ou `fix/*` → `dev`
   - Tests sur `dev`
   - Merge `dev` → `main`
   - Déploiement automatique

## Docker

```bash
# Build image
docker build -t echoaway-backend .

# Run
docker run -p 3001:3001 echoaway-backend
```

## Available Scripts

- `npm run dev` - Development mode with hot reload
- `npm run build` - Production build
- `npm run start` - Start in production mode
- `npm run start:prod` - Optimized production start
- `npm run lint` - Code linting with ESLint
- `npm run lint:check` - Check linting without fixing
- `npm run format` - Code formatting with Prettier
- `npm run format:check` - Check code formatting

## Architecture

- **Modules** : NestJS modular architecture
- **Entities** : TypeORM models with relationships
- **Services** : Centralized business logic
- **Controllers** : HTTP request handling
- **Guards** : Route protection by authentication
- **Decorators** : User information extraction

## 🗄️ Database Migrations

### Commandes principales
```bash
# Générer une migration
npm run migration:generate -- -n NomDeLaMigration

# Exécuter les migrations
npm run migration:run

# Annuler la dernière migration
npm run migration:revert

# Voir le statut
npm run migration:show
```

### Conventions
- **Format** : `Timestamp-NomDescriptif.ts`
- **Exemple** : `1703123456789-UpdateAccommodations.ts`
- **Verbes** : Create, Add, Update, Remove, Drop

### Configuration
```env
# Développement (synchronisation auto)
NODE_ENV=development
DB_SYNC=true

# Production (migrations manuelles)
NODE_ENV=production
DB_SYNC=false
```

## Health Check

L'application expose un endpoint de health check :

- **URL** : `GET /status`
- **Réponse** : `{ "status": "API is running 🚀" }`

Cet endpoint est utilisé par Railway pour vérifier que l'application fonctionne correctement.
