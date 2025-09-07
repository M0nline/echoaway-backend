import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';

@Injectable()
export class ThrottlingConfigService implements ThrottlerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createThrottlerOptions(): ThrottlerModuleOptions {
    console.log('🔍 ENQUÊTE - Début createThrottlerOptions...');

    const nodeEnv = this.configService.get('NODE_ENV');
    const isProduction = nodeEnv === 'production';

    console.log('🔧 Environnement détecté:', nodeEnv);
    console.log('🔧 Mode production:', isProduction);
    console.log("🔍 ENQUÊTE - Variables d'environnement récupérées...");

    const throttlers = [
      // Protection générale - requêtes par minute
      {
        name: 'general',
        ttl: 60000, // 1 minute
        limit: isProduction ? 100 : 1000, // 100 en prod, 1000 en dev
      },

      // Protection anti-brute force - Login par utilisateur
      {
        name: 'login-user',
        ttl: 300000, // 5 minutes
        limit: isProduction ? 3 : 20, // 3 en prod, 20 en dev
      },

      // Protection anti-brute force - Login par IP
      {
        name: 'login-ip',
        ttl: 300000, // 5 minutes
        limit: isProduction ? 10 : 50, // 10 en prod, 50 en dev
      },

      // Protection anti-brute force - Register par IP
      {
        name: 'register-ip',
        ttl: 600000, // 10 minutes
        limit: isProduction ? 3 : 10, // 3 en prod, 10 en dev
      },

      // Protection anti-brute force - Reset password par IP
      {
        name: 'reset-password-ip',
        ttl: 3600000, // 1 heure
        limit: isProduction ? 3 : 10, // 3 en prod, 10 en dev
      },

      // Protection globale - requêtes par heure
      {
        name: 'hourly',
        ttl: 3600000, // 1 heure
        limit: isProduction ? 1000 : 10000, // 1000 en prod, 10000 en dev
      },
    ];

    console.log(
      '🔧 Configuration Throttler appliquée:',
      JSON.stringify(throttlers, null, 2),
    );

    console.log('🔍 ENQUÊTE - Avant return de createThrottlerOptions...');
    const result = { throttlers };
    console.log('🔍 ENQUÊTE - createThrottlerOptions terminé avec succès');
    return result;
  }
}
