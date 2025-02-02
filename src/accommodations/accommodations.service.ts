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

  // génère id et ajoute l'hébergement à la liste + retoune l'hébergement créé
  async create(newAccommodation: {
    name: string;
    location: string;
    type: string;
    connectivity: string;
  }): Promise<Accommodation> {
    const accommodation = this.accommodationsRepository.create({
      ...newAccommodation,
      connectivity: newAccommodation.connectivity as ConnectivityLevel, // Assure la correspondance avec l'Enum
    });

    return this.accommodationsRepository.save(accommodation);
  }
}
