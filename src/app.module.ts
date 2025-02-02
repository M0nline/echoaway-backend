import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccommodationsModule } from './accommodations/accommodations.module';
import { Accommodation } from './accommodations/accommodation.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), // 🔥 Charge les variables d'environnement
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Accommodation],
      synchronize: true,
    }),
    AccommodationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
