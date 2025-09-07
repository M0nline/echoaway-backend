# Configuration du Throttling - Protection Anti-Brute Force

## Vue d'ensemble

Cette configuration implémente une protection professionnelle contre les attaques par force brute en utilisant une approche multi-niveaux.

## Stratégie de Protection

### 1. Protection par Utilisateur
- **Login** : 3 tentatives par utilisateur toutes les 5 minutes
- Empêche les attaques ciblées sur un compte spécifique

### 2. Protection par IP
- **Login** : 10 tentatives par IP toutes les 5 minutes
- **Register** : 3 tentatives par IP toutes les 10 minutes
- **Reset Password** : 3 tentatives par IP toutes les heures
- Empêche les attaques distribuées depuis une même IP

### 3. Protection Globale
- **Générale** : 100 requêtes par minute (prod) / 1000 (dev)
- **Horaire** : 1000 requêtes par heure (prod) / 10000 (dev)

## Configuration par Environnement

### Développement (NODE_ENV=development)
- **Générale** : 1000 requêtes/minute
- **Login utilisateur** : 20 tentatives/5min
- **Login IP** : 50 tentatives/5min  
- **Register IP** : 10 tentatives/10min
- **Reset password IP** : 10 tentatives/heure
- **Horaire** : 10000 requêtes/heure

### Production (NODE_ENV=production)
- **Générale** : 100 requêtes/minute
- **Login utilisateur** : 3 tentatives/5min
- **Login IP** : 10 tentatives/5min
- **Register IP** : 3 tentatives/10min
- **Reset password IP** : 3 tentatives/heure
- **Horaire** : 1000 requêtes/heure

## Endpoints Protégés

| Endpoint | Protection | Limite | Fenêtre |
|----------|------------|--------|---------|
| `POST /auth/login` | Utilisateur + IP | 3 + 10 | 5 min |
| `POST /auth/register` | IP | 3 | 10 min |
| `POST /auth/forgot-password` | IP | 3 | 1 heure |
| `POST /auth/reset-password` | IP | 3 | 1 heure |

## Bonnes Pratiques Implémentées

✅ **Throttling progressif** : Plusieurs niveaux de protection  
✅ **Double protection** : Par utilisateur ET par IP  
✅ **Fenêtres adaptées** : Temps d'attente appropriés  
✅ **Environnement-aware** : Limites différentes dev/prod  
✅ **Endpoints spécifiques** : Protection ciblée par fonctionnalité  

## Monitoring Recommandé

- Logs des tentatives de connexion échouées
- Alertes après X échecs consécutifs
- Surveillance des IPs suspectes
- Métriques de throttling

## Codes d'Erreur

- `429 Too Many Requests` : Limite de throttling atteinte
- `X-RateLimit-Limit` : Limite maximale
- `X-RateLimit-Remaining` : Tentatives restantes
- `X-RateLimit-Reset` : Timestamp de reset
