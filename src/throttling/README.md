# Module Throttling

Ce module gère la configuration du rate limiting et de la protection anti-brute force de l'application.

## Architecture

```
src/throttling/
├── throttling.module.ts          # Module principal
├── throttling-config.service.ts  # Service de configuration
├── index.ts                      # Exports publics
└── README.md                     # Documentation
```

## Fonctionnalités

### 🛡️ Protection Multi-Niveaux
- **Générale** : Limite les requêtes par minute
- **Login utilisateur** : Protection par utilisateur
- **Login IP** : Protection par adresse IP
- **Register IP** : Limitation des inscriptions
- **Reset password IP** : Protection des resets de mot de passe
- **Horaire** : Limite globale par heure

### 🔧 Configuration Environnement-Aware
- **Développement** : Limites permissives pour faciliter le dev
- **Production** : Limites strictes pour la sécurité

## Utilisation

### Import du Module
```typescript
import { ThrottlingModule } from './throttling/throttling.module';

@Module({
  imports: [
    ThrottlingModule,
    // autres modules...
  ],
})
export class AppModule {}
```

### Configuration Automatique
Le module se configure automatiquement en fonction de `NODE_ENV` :
- `development` : Limites permissives
- `production` : Limites strictes

## Service de Configuration

Le `ThrottlingConfigService` implémente `ThrottlerOptionsFactory` et :
- Détecte automatiquement l'environnement
- Configure les throttlers appropriés
- Fournit des logs de debug

## Intégration avec les Contrôleurs

Les contrôleurs utilisent les décorateurs `@Throttle` pour spécifier quels throttlers appliquer :

```typescript
@Throttle({ 
  'login-user': {}, // Utilise la config globale
  'login-ip': {}    // Utilise la config globale
})
async login(@Body() loginDto: LoginDto) {
  // logique de login
}
```

## Monitoring

Les headers de réponse incluent les informations de rate limiting :
- `X-RateLimit-Limit-{name}` : Limite configurée
- `X-RateLimit-Remaining-{name}` : Requêtes restantes
- `X-RateLimit-Reset-{name}` : Temps de reset en secondes
