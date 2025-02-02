import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccommodationsService } from './accommodations.service';
import { AccommodationsController } from './accommodations.controller';
import { Accommodation } from './accommodation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Accommodation])], // 🔥 Connexion du repository
  controllers: [AccommodationsController],
  providers: [AccommodationsService],
  exports: [AccommodationsService], // Permet d'utiliser le service ailleurs
})
export class AccommodationsModule {}
