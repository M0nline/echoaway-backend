import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Charger les variables d'environnement
config();

// Chemin absolu vers le dossier src
const srcPath = __dirname;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'echoaway',
  password: process.env.DB_PASSWORD || 'echoaway',
  database: process.env.DB_NAME || 'echoaway',
  synchronize: false,
  logging: true,
  entities: [join(srcPath, '**', '*.entity.{ts,js}')],
  migrations: [join(srcPath, 'migrations', '*.{ts,js}')],
  migrationsTableName: 'migrations',
  migrationsRun: false // Ne pas exécuter les migrations automatiquement
});
