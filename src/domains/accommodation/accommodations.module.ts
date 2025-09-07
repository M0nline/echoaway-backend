import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccommodationsService } from './accommodations.service';
import { AccommodationsController } from './accommodations.controller';
import { Accommodation } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Accommodation])], // 🔥 Connexion du repository
  controllers: [AccommodationsController],
  providers: [AccommodationsService],
  exports: [AccommodationsService], // Permet d'utiliser le service ailleurs
})
export class AccommodationsModule {}
