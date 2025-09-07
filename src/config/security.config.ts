import { ConfigService } from '@nestjs/config';

export interface SecurityConfig {
  helmet: any;
  cors: any;
  rateLimit: any;
}

export const createSecurityConfig = (
  configService: ConfigService,
): SecurityConfig => {
  const isProduction = configService.get('NODE_ENV') === 'production';
  const frontendUrl = configService.get('FRONTEND_URL');

  return {
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false, // Désactivé pour éviter les problèmes avec les APIs
      hsts: isProduction
        ? {
            maxAge: 31536000, // 1 an
            includeSubDomains: true,
            preload: true,
          }
        : false, // HSTS seulement en production
    },

    cors: {
      origin: [
        'http://localhost:3000', // Développement local
        'http://localhost:3001', // Développement local (alternative)
        'https://echoaway.vercel.app', // Production Vercel
        frontendUrl, // Production (si défini)
      ].filter(Boolean), // Retire les valeurs undefined
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },

    rateLimit: {
      throttlers: [
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
      ],
    },
  };
};
