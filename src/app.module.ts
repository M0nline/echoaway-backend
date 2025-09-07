import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccommodationsModule } from './accommodations/accommodations.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FavoritesModule } from './favorites/favorites.module';
import { AccommodationImagesModule } from './accommodation-images/accommodation-images.module';
import { SecurityModule } from './security/security.module';
import { ThrottlingModule } from './throttling/throttling.module';

// Import explicite de toutes les entités
import { User } from './users/user.entity';
import { Accommodation } from './accommodations/accommodation.entity';
import { Favorite } from './favorites/favorite.entity';
import { AccommodationImage } from './accommodation-images/accommodation-image.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlingModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');
        const isProduction = process.env.NODE_ENV === 'production';

        // Configuration conditionnelle selon l'environnement
        const config = isProduction 
          ? {
              // 🚀 PRODUCTION (Railway) : utiliser DATABASE_URL
              type: 'postgres' as const,
              url: databaseUrl,
              entities: [User, Accommodation, Favorite, AccommodationImage],
              synchronize: false, // ❌ PROD : pas de synchronize automatique
              logging: false, // ❌ PROD : pas de logs SQL
              ssl: { rejectUnauthorized: false }, // ✅ PROD : SSL requis
            }
          : {
              // 🛠️ DEVELOPMENT (Docker local) : variables individuelles
              type: 'postgres' as const,
              host: configService.get<string>('DB_HOST') || 'db',
              port: parseInt(configService.get<string>('DB_PORT') || '5432'),
              username: configService.get<string>('DB_USER') || 'echoaway',
              password: configService.get<string>('DB_PASSWORD') || 'echoaway',
              database: configService.get<string>('DB_NAME') || 'echoaway',
              entities: [User, Accommodation, Favorite, AccommodationImage],
              synchronize: true, // ✅ DEV : synchronize automatique
              logging: true, // ✅ DEV : logs SQL pour debug
              ssl: false, // ❌ DEV : pas de SSL
            };

        console.log('🔧 TypeORM Config:', {
          environment: isProduction ? 'PRODUCTION' : 'DEVELOPMENT',
          connection: isProduction ? 'DATABASE_URL' : 'individual variables',
          synchronize: config.synchronize,
          logging: config.logging,
          entities: config.entities.map((e) => e.name),
        });

        return config;
      },
      inject: [ConfigService],
    }),
    SecurityModule,
    AccommodationsModule,
    AuthModule,
    UsersModule,
    FavoritesModule,
    AccommodationImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    console.log('🚀 AppModule initialized successfully!');
    console.log('📦 Modules loaded:', this.constructor.name);
    console.log(
      '🔧 ThrottlingModule configuré avec protection anti-brute force',
    );
  }
}
