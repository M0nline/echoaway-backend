import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccommodationImage } from '../../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([AccommodationImage])],
})
export class AccommodationImagesModule {}
