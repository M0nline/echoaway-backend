import { ConfigService } from '@nestjs/config';

export interface SecurityConfig {
  helmet: any;
  cors: any;
  rateLimit: any;
}

export const createSecurityConfig = (configService: ConfigService): SecurityConfig => {
  const isProduction = configService.get('NODE_ENV') === 'production';
  const frontendUrl = configService.get('FRONTEND_URL');

  return {
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false, // Désactivé pour éviter les problèmes avec les APIs
      hsts: isProduction ? {
        maxAge: 31536000, // 1 an
        includeSubDomains: true,
        preload: true,
      } : false, // HSTS seulement en production
    },

    cors: {
      origin: [
        'http://localhost:3000',           // Développement local
        'http://localhost:3001',           // Développement local (alternative)
        frontendUrl,                       // Production (si défini)
      ].filter(Boolean), // Retire les valeurs undefined
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },

    rateLimit: {
      throttlers: [
        {
          name: 'short',
          ttl: 60000, // 1 minute
          limit: 3,   // 3 requêtes par minute
        },
        {
          name: 'medium',
          ttl: 300000, // 5 minutes
          limit: 20,   // 20 requêtes par 5 minutes
        },
        {
          name: 'long',
          ttl: 900000, // 15 minutes
          limit: 100,  // 100 requêtes par 15 minutes
        },
      ],
    },
  };
};
