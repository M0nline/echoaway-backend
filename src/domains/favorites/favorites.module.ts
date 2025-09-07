import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite])],
})
export class FavoritesModule {}
