import { Injectable } from '@nestjs/common';
import { Accommodation, ConnectivityLevel } from './accommodation.entity';
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
    newAccommodation: Partial<Accommodation>,
  ): Promise<Accommodation> {
    const accommodation = this.accommodationsRepository.create({
      ...newAccommodation,
      connectivity:
        (newAccommodation.connectivity as ConnectivityLevel) || 'None',
    });

    return this.accommodationsRepository.save(accommodation);
  }

  async update(
    id: number,
    updateAccommodation: Partial<Accommodation>,
  ): Promise<Accommodation> {
    const accommodation = await this.findOne(id);
    if (!accommodation) {
      throw new Error(`Accommodation with ID ${id} not found`);
    }

    Object.assign(accommodation, updateAccommodation);
    return this.accommodationsRepository.save(accommodation);
  }

  async remove(id: number): Promise<void> {
    const result = await this.accommodationsRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Accommodation with ID ${id} not found`);
    }
  }
}
