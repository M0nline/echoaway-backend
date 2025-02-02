import { Controller, Get, Param } from '@nestjs/common';
import { AccommodationsService } from './accommodations.service';
import { Accommodation } from './accommodation.entity';

@Controller('api/accommodations')
export class AccommodationsController {
  constructor(private readonly accommodationsService: AccommodationsService) {}

  // route pour récupérer tous les hébergements
  @Get()
  findAll(): Accommodation[] {
    return this.accommodationsService.getAllAccommodations();
  }
  // Route pour récupérer un hébergement spécifique depuis l'id de l'URL
  @Get(':id')
  findOne(@Param('id') id: string) {
    // Paramètres sont toujours des strings
    return this.accommodationsService.findOne(Number(id)); // Convertir en nombre
  }
}
