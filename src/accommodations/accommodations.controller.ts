import { Controller, Get } from '@nestjs/common';
import { AccommodationsService } from './accommodations.service';
import { Accommodation } from './accommodation.entity';

@Controller('api/accommodations')
export class AccommodationsController {
  constructor(private readonly accommodationsService: AccommodationsService) {}

  @Get()
  findAll(): Accommodation[] {
    return this.accommodationsService.getAccommodations();
  }
}
