import { Injectable } from '@nestjs/common';
import { Accommodation } from './accommodation.entity';

@Injectable()
export class AccommodationsService {
  private accommodations: Accommodation[] = [
    {
      id: 1,
      name: 'EcoLodge Montagne',
      location: 'Alpes, France',
      type: 'Lodge',
      connectivity: 'None',
    },
    {
      id: 2,
      name: 'Domaine Digital Detox',
      location: 'Ardèche, France',
      type: 'Camping',
      connectivity: 'Low',
    },
  ];

  getAllAccommodations(): Accommodation[] {
    return this.accommodations;
  }

  findOne(id: number) {
    console.log(`Recherche de l'hébergement avec l'ID :`, id);
    return (
      this.accommodations.find((acc) => acc.id === id) || {
        error: 'Accommodation not found',
      }
    );
  }
}
