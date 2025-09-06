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
        const isProduction = configService.get('NODE_ENV') === 'production';
        
        return {
          type: 'postgres' as const,
          host: configService.get('DB_HOST'),
          port: parseInt(configService.get('DB_PORT')) || 5432,
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [User, Accommodation, Favorite, AccommodationImage],
          synchronize: !isProduction, // ❌ Jamais en production
          logging: !isProduction,
          ssl: isProduction ? { rejectUnauthorized: false } : false,
        };
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
