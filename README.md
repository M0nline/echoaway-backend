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

1. Copy the example file:
```bash
cp env.example .env
```

2. Rename and modify the `.env` file with your values

## 🚀 Production Deployment

### Platforms Used
- **Backend** : Railway (automatic deployment from Git)
- **Frontend** : Vercel (automatic deployment from Git)
- **Database** : Railway PostgreSQL

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
- `npm run format` - Code formatting with Prettier

## Architecture

- **Modules** : NestJS modular architecture
- **Entities** : TypeORM models with relationships
- **Services** : Centralized business logic
- **Controllers** : HTTP request handling
- **Guards** : Route protection by authentication
- **Decorators** : User information extraction
