import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Charger les variables d'environnement
config();

// Import centralisé de toutes les entités
import {
  User,
  Accommodation,
  Favorite,
  AccommodationImage,
  PasswordResetToken,
} from './entities';

// Configuration conditionnelle selon l'environnement
const isProduction = process.env.NODE_ENV === 'production';

const configService = new ConfigService();

const dataSourceConfig = isProduction
  ? {
      // 🚀 PRODUCTION (Railway) : utiliser DATABASE_URL
      type: 'postgres' as const,
      url: configService.get('DATABASE_URL'),
      entities: [
        User,
        Accommodation,
        Favorite,
        AccommodationImage,
        PasswordResetToken,
      ],
      migrations: ['dist/migrations/*.js'],
      migrationsTableName: 'typeorm_migrations',
      synchronize: false, // ❌ PROD : jamais de synchronize automatique
      logging: false, // ❌ PROD : pas de logs SQL
      ssl: { rejectUnauthorized: false }, // ✅ PROD : SSL requis
    }
  : {
      // 🛠️ DEVELOPMENT (Docker local) : variables individuelles
      type: 'postgres' as const,
      host: configService.get<string>('DB_HOST'),
      port: parseInt(configService.get<string>('DB_PORT')!),
      username: configService.get<string>('DB_USER'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME'),
      entities: [
        User,
        Accommodation,
        Favorite,
        AccommodationImage,
        PasswordResetToken,
      ],
      migrations: ['dist/migrations/*.js'],
      migrationsTableName: 'typeorm_migrations',
      synchronize: false, // ❌ DEV : désactivé pour utiliser les migrations
      logging: true, // ✅ DEV : logs SQL pour debug
      ssl: false, // ❌ DEV : pas de SSL
    };

console.log('🔧 DataSource Config:', {
  environment: isProduction ? 'PRODUCTION' : 'DEVELOPMENT',
  connection: isProduction ? 'DATABASE_URL' : 'individual variables',
  synchronize: dataSourceConfig.synchronize,
  logging: dataSourceConfig.logging,
  entities: dataSourceConfig.entities.map((e) => e.name),
  migrationsPath: dataSourceConfig.migrations,
});

// Créer et exporter la DataSource
export const AppDataSource = new DataSource(dataSourceConfig);

// Fonction pour initialiser la DataSource
export const initializeDataSource = async (): Promise<DataSource> => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log('✅ DataSource initialized successfully');
  }
  return AppDataSource;
};

// Fonction pour fermer la DataSource
export const closeDataSource = async (): Promise<void> => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log('✅ DataSource closed successfully');
  }
};
