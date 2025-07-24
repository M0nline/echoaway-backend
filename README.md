# EchoAway Backend

API REST NestJS pour l'application EchoAway - Projet RNCP

## Stack Technique

- **NestJS** framework Node.js
- **TypeORM** pour l'ORM
- **PostgreSQL** base de données
- **Class-validator** pour la validation
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
│   ├── accommodations/     # Module hébergements
│   │   ├── accommodation.entity.ts
│   │   ├── accommodations.controller.ts
│   │   ├── accommodations.service.ts
│   │   └── accommodations.module.ts
│   ├── app.controller.ts   # Contrôleur principal
│   ├── app.service.ts      # Service principal
│   ├── app.module.ts       # Module racine
│   └── main.ts            # Point d'entrée
├── Dockerfile
└── package.json
```

## API Endpoints

- `GET /api/status` - Statut de l'API
- `GET /api/accommodations` - Liste des hébergements
- `GET /api/accommodations/:id` - Détail d'un hébergement
- `POST /api/accommodations` - Créer un hébergement
- `PUT /api/accommodations/:id` - Modifier un hébergement
- `DELETE /api/accommodations/:id` - Supprimer un hébergement

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
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_SSL=false
FRONTEND_URL=http://localhost:3000
```

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
