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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');
        
        const config = {
          type: 'postgres' as const,
          url: databaseUrl,
          entities: [User, Accommodation, Favorite, AccommodationImage],
          synchronize: true, // ✅ En dev, TypeORM crée tout automatiquement
          logging: true,
          // migrations: [__dirname + '/migrations/*{.ts,.js}'], // ❌ Pas besoin en dev
          ssl: { rejectUnauthorized: false }, // Railway nécessite SSL
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
  }
}
