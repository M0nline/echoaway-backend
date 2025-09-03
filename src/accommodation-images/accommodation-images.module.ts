import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccommodationImage } from './accommodation-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccommodationImage])],
})
export class AccommodationImagesModule {}