import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccommodationsModule } from './accommodations/accommodations.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FavoritesModule } from './favorites/favorites.module';
import { AccommodationImagesModule } from './accommodation-images/accommodation-images.module';
import { SecurityModule } from './security/security.module';
import { SecurityConfigService } from './security/security-config.service';

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
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule, SecurityModule],
      useFactory: (configService: ConfigService, securityConfigService: SecurityConfigService) => {
        return securityConfigService.getRateLimitConfig();
      },
      inject: [ConfigService, SecurityConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');
        
        // Détecter l'environnement
        const isProduction = process.env.NODE_ENV === 'production';
        
        const config = {
          type: 'postgres' as const,
          host: configService.get<string>('DB_HOST') || 'db',
          port: parseInt(configService.get<string>('DB_PORT') || '5432'),
          username: configService.get<string>('DB_USER') || 'postgres',
          password: configService.get<string>('DB_PASSWORD') || 'password',
          database: configService.get<string>('DB_NAME') || 'echoaway',
          entities: [User, Accommodation, Favorite, AccommodationImage],
          synchronize: true, // ✅ En dev, TypeORM crée tout automatiquement
          logging: true,
          // migrations: [__dirname + '/migrations/*{.ts,.js}'], // ❌ Pas besoin en dev
          ssl: isProduction ? { rejectUnauthorized: false } : false, // SSL seulement en production
        };
        
        console.log('🔧 TypeORM Config:', {
          url: databaseUrl ? 'configured' : 'missing',
          synchronize: config.synchronize,
          logging: config.logging,
          entities: config.entities.map(e => e.name)
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
    console.log('🔧 ThrottlerModule configuré avec:', {
      ttl: 60000,
      limit: 3
    });
  }
}
