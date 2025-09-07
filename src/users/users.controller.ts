import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserRole } from './user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
  @MinLength(2, { message: 'Le prénom doit contenir au moins 2 caractères' })
  @MaxLength(100, { message: 'Le prénom ne peut pas dépasser 100 caractères' })
  firstname?: string;

  @IsOptional()
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  @MaxLength(100, { message: 'Le nom ne peut pas dépasser 100 caractères' })
  name?: string;

  @IsOptional()
  @IsString({ message: "L'avatar doit être une URL valide" })
  avatar?: string;
}

export class ChangePasswordDto {
  @IsString({
    message: 'Le mot de passe actuel doit être une chaîne de caractères',
  })
  @MinLength(1, { message: 'Le mot de passe actuel est requis' })
  currentPassword: string;

  @IsString({
    message: 'Le nouveau mot de passe doit être une chaîne de caractères',
  })
  @MinLength(8, {
    message: 'Le nouveau mot de passe doit contenir au moins 8 caractères',
  })
  @MaxLength(100, {
    message: 'Le nouveau mot de passe ne peut pas dépasser 100 caractères',
  })
  newPassword: string;
}

export class UpdateUserRoleDto {
  @IsEnum(UserRole, { message: 'Rôle invalide' })
  role: UserRole;
}

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('profile')
  async getProfile(@CurrentUser() user: User): Promise<User> {
    const userProfile = await this.usersService.findOne(user.id);
    if (!userProfile) {
      throw new Error('Utilisateur non trouvé');
    }
    return userProfile;
  }

  @Put('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.usersService.update(user.id, updateUserDto);
    if (!updatedUser) {
      throw new Error('Utilisateur non trouvé');
    }
    return updatedUser;
  }

  @Put('profile/password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const currentUser = await this.usersService.findOne(user.id);
    if (!currentUser) {
      throw new Error('Utilisateur non trouvé');
    }

    const isCurrentPasswordValid = await this.usersService.validatePassword(
      changePasswordDto.currentPassword,
      currentUser.password,
    );

    if (!isCurrentPasswordValid) {
      throw new Error('Mot de passe actuel incorrect');
    }

    const hashedNewPassword = await this.usersService.hashPassword(
      changePasswordDto.newPassword,
    );
    await this.usersService.update(user.id, { password: hashedNewPassword });

    return { message: 'Mot de passe modifié avec succès' };
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    return user;
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.usersService.update(id, updateUserDto);
    if (!updatedUser) {
      throw new Error('Utilisateur non trouvé');
    }
    return updatedUser;
  }

  @Put(':id/role')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<User> {
    const updatedUser = await this.usersService.update(id, {
      role: updateUserRoleDto.role,
    });
    if (!updatedUser) {
      throw new Error('Utilisateur non trouvé');
    }
    return updatedUser;
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usersService.remove(id);
  }
}
