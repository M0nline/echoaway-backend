import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AccommodationsService } from './accommodations.service';
import { Accommodation } from './accommodation.entity';

@Controller('api/accommodations')
export class AccommodationsController {
  constructor(private readonly accommodationsService: AccommodationsService) {}

  // route pour récupérer tous les hébergements
  @Get()
  async findAll(): Promise<Accommodation[]> {
    return await this.accommodationsService.getAllAccommodations();
  }

  // Route pour récupérer un hébergement spécifique depuis l'id de l'URL
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Accommodation | null> {
    return await this.accommodationsService.findOne(Number(id));
  }

  // Route pour créer un hébergement
  @Post()
  async create(
    @Body()
    newAccommodation: {
      name: string;
      location: string;
      type: string;
      connectivity: string;
    },
  ): Promise<Accommodation> {
    return await this.accommodationsService.create(newAccommodation);
  }

  // Route pour supprimer un hébergement
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.accommodationsService.remove(Number(id));
      return { message: `Accommodation with ID ${id} successfully deleted` };
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }
  }
}
