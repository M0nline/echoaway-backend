import { Injectable } from '@nestjs/common';
import { Accommodation, ConnectivityType, AccommodationType } from './accommodation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AccommodationsService {
  constructor(
    @InjectRepository(Accommodation)
    private readonly accommodationsRepository: Repository<Accommodation>,
  ) {}

  async getAllAccommodations(): Promise<Accommodation[]> {
    return this.accommodationsRepository.find();
  }

  async findOne(id: number): Promise<Accommodation | null> {
    console.log(`🏨 Recherche de l'hébergement avec l'ID :`, id);
    return this.accommodationsRepository.findOne({ where: { id } });
  }

  async create(
    newAccommodation: any,
  ): Promise<Accommodation> {
    // Convertir les strings en enums
    const accommodationData = {
      ...newAccommodation,
      type: newAccommodation.type as AccommodationType,
      connectivity: newAccommodation.connectivity as ConnectivityType,
    };

    const accommodation = this.accommodationsRepository.create(accommodationData);
    return this.accommodationsRepository.save(accommodation);
  }

  async update(
    id: number,
    updateAccommodation: any,
  ): Promise<Accommodation> {
    const accommodation = await this.findOne(id);
    if (!accommodation) {
      throw new Error(`Accommodation with ID ${id} not found`);
    }

    // Convertir les strings en enums si nécessaire
    const updateData = {
      ...updateAccommodation,
      type: updateAccommodation.type ? updateAccommodation.type as AccommodationType : accommodation.type,
      connectivity: updateAccommodation.connectivity ? updateAccommodation.connectivity as ConnectivityType : accommodation.connectivity,
    };

    Object.assign(accommodation, updateData);
    return this.accommodationsRepository.save(accommodation);
  }

  async remove(id: number): Promise<void> {
    const result = await this.accommodationsRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Accommodation with ID ${id} not found`);
    }
  }
}
