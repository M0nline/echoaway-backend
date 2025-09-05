# EchoAway - Complete Application

**Accommodation management application for electrosensitive people**

## 🏗️ Multi-Repository Architecture

This application uses a **multi-repository** architecture with two separate projects:

- **Backend** : NestJS API with TypeORM and PostgreSQL (this repository)
- **Frontend** : Vue3/Quasar with Vite (separate repository)
- **Deployment** : Railway (backend) + Vercel (frontend)

### 📁 Repository Structure

```
echoaway-app/                    # Parent folder (no Git repo)
├── echoaway-backend/            # Backend Repository (this repo)
│   ├── docker-compose.yml       # 🐳 Backend + PostgreSQL
│   ├── Dockerfile
│   └── src/
└── echoaway-frontend/           # Frontend Repository (separate repo)
    ├── package.json
    └── src/
```

## 🛠️ Technical Stack

### Backend (this repository)
- **NestJS** : Node.js framework
- **TypeORM** : ORM for PostgreSQL
- **PostgreSQL** : Database
- **TypeScript** : Static typing
- **Docker** : Containerization

### Frontend (separate repository)
- **Vue 3** : JavaScript framework
- **Quasar** : UI framework
- **Vite** : Build tool and dev server
- **Pinia** : State management
- **TypeScript** : Static typing

## 🚀 Complete Application Launch

**This repository contains the main `docker-compose.yml` to launch the backend and database.**

*Note : The Docker project name will be `echoaway-backend` (based on the folder name).*

### Prerequisites
- **Docker and Docker Compose** installed
- **Available ports** : 3001 (backend) and 5432 (database)
- **Node.js 18+** (recommended: use NVM)
- **Git** for cloning repositories

### Node.js Version Management (NVM)
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Use the project's Node.js version (automatically detected)
nvm install
nvm use
```

### 🚀 Quick Start

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
# - Frontend: http://localhost:3000 (Vite dev server)
# - Backend API: http://localhost:3001 (Docker)
# - Database: localhost:5432 (Docker)
```

### 🐳 Useful Docker Commands
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

### 🎨 Useful Frontend Commands
```bash
# Start frontend
cd ../echoaway-frontend
npm run dev

# Install dependencies
npm install

## 📦 Backend Scripts

```bash
npm run dev          # Development mode with hot reload
npm run build        # Production build
npm run start        # Start in production mode
npm run start:prod   # Optimized production start
npm run lint         # Linting with ESLint
npm run lint:check   # Linting verification
npm run format       # Formatting with Prettier
npm run format:check # Formatting verification
```

## ⚙️ Environment Variables

1. Copy the example file:
```bash
cp env.example .env
```

2. Modify the `.env` file with your values

## 🚀 Production Deployment

### Platforms Used
- **Backend** : Railway (automatic deployment from Git)
- **Frontend** : Vercel (automatic deployment from Git)
- **Database** : PostgreSQL on Railway

### Production URLs
- **Frontend** : `https://echoaway.vercel.app`
- **Backend** : `https://echoaway-backend-production.up.railway.app`

### CI/CD Pipeline (GitHub Actions)

The CI/CD is managed by **GitHub Actions** with workflows in `.github/workflows/ci.yml`.

#### Automatic Tests
Each push on `main` and `dev` branches automatically triggers GitHub Actions:

1. **Linting** : Code verification with ESLint
2. **Build** : Application compilation
3. **Tests** : Unit test execution

#### Automatic Deployment
Only push on `main` branch triggers automatic deployment on Railway via GitHub Actions.

#### Workflow Configuration
- **Trigger** : Push on `main` and `dev` branches
- **Tests** : All branches (`main` and `dev`)
- **Deployment** : Only `main` branch
- **Platforms** : Railway (backend) + Vercel (frontend)

### Development Workflow

#### Main Branches
- **`main`** : Production branch (automatic deployment)
- **`dev`** : Development branch (automatic tests only)

#### Work Branches
- **`feature/feature-name`** : New features
- **`fix/bug-name`** : Bug fixes
- **`hotfix/urgent-name`** : Urgent production fixes

#### Development Process
1. **Development** on `feature/*` or `fix/*`
2. **Tests** on `dev` (push/PR)
3. **Merge** to `main` → Automatic deployment

## 🐳 Docker

```bash
# Build image
docker build -t echoaway-backend .

# Run
docker run -p 3001:3001 echoaway-backend
```

## 🏗️ Backend Architecture

- **Modules** : NestJS modular architecture
- **Entities** : TypeORM models with relationships
- **Services** : Centralized business logic
- **Controllers** : HTTP request handling
- **Guards** : Route protection by authentication
- **Decorators** : User information extraction

## 🗄️ Database Migrations

### Main Commands
```bash
# Generate a migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# View status
npm run migration:show
```

### Conventions
- **Format** : `Timestamp-DescriptiveName.ts`
- **Example** : `1703123456789-UpdateAccommodations.ts`
- **Verbs** : Create, Add, Update, Remove, Drop

### Configuration
```env
# Development (auto sync)
NODE_ENV=development
DB_SYNC=true

# Production (manual migrations)
NODE_ENV=production
DB_SYNC=false
```

---

## 📚 Complete Documentation

- **Frontend** : See [Frontend README](../echoaway-frontend/README.md)
- **Components** : See [COMPONENTS.md](../echoaway-frontend/COMPONENTS.md) for component architecture
- **Deployment** : Complete documentation in [DEPLOYMENT.md](../DEPLOYMENT.md)
