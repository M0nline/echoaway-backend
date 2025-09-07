import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AccommodationsService } from './accommodations.service';
import { Accommodation } from './accommodation.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('api/accommodations') // Ajout du préfixe 'api/accommodations'
export class AccommodationsController {
  constructor(private readonly accommodationsService: AccommodationsService) {}

  @Get()
  async findAll(): Promise<Accommodation[]> {
    return this.accommodationsService.getAllAccommodations();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Accommodation | null> {
    return this.accommodationsService.findOne(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VISITOR, UserRole.ADMIN, UserRole.HOST)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createAccommodationDto: any,
    @CurrentUser() _user: User,
  ): Promise<Accommodation> {
    const newAccommodation = await this.accommodationsService.create(
      createAccommodationDto,
    );
    // Note: hostId sera géré dans le service ou l'entité
    return newAccommodation;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VISITOR, UserRole.ADMIN, UserRole.HOST)
  async update(
    @Param('id') id: string,
    @Body() updateAccommodationDto: any,
    @CurrentUser() user: User,
  ): Promise<Accommodation> {
    // Vérifier que l'utilisateur est le propriétaire ou un admin
    if (user.role !== UserRole.ADMIN) {
      const accommodation = await this.accommodationsService.findOne(
        Number(id),
      );
      if (accommodation && accommodation.hostId !== user.id) {
        throw new Error('Non autorisé à modifier cet hébergement');
      }
    }

    return this.accommodationsService.update(
      Number(id),
      updateAccommodationDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VISITOR, UserRole.ADMIN, UserRole.HOST)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    // Vérifier que l'utilisateur est le propriétaire ou un admin
    if (user.role !== UserRole.ADMIN) {
      const accommodation = await this.accommodationsService.findOne(
        Number(id),
      );
      if (accommodation && accommodation.hostId !== user.id) {
        throw new Error('Non autorisé à supprimer cet hébergement');
      }
    }

    return this.accommodationsService.remove(Number(id));
  }
}
