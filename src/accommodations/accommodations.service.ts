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

  getAccommodations(): Accommodation[] {
    return this.accommodations;
  }
}
