import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AccommodationsService } from './accommodations.service';
import { Accommodation } from './accommodation.entity';

@Controller('api/accommodations')
export class AccommodationsController {
  constructor(private readonly accommodationsService: AccommodationsService) {}

  @Get()
  async findAll(): Promise<Accommodation[]> {
    return await this.accommodationsService.getAllAccommodations();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Accommodation | null> {
    return await this.accommodationsService.findOne(Number(id));
  }

  @Post()
  async create(
    @Body() newAccommodation: Partial<Accommodation>,
  ): Promise<Accommodation> {
    return await this.accommodationsService.create(newAccommodation);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAccommodation: Partial<Accommodation>,
  ): Promise<Accommodation> {
    return await this.accommodationsService.update(
      Number(id),
      updateAccommodation,
    );
  }

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
