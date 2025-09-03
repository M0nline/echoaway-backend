import { IsString, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../users/user.entity';

export class RegisterDto {
  @IsString({ message: 'Le login doit être une chaîne de caractères' })
  @MinLength(3, { message: 'Le login doit contenir au moins 3 caractères' })
  @MaxLength(50, { message: 'Le login ne peut pas dépasser 50 caractères' })
  login: string;

  @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
  @MinLength(2, { message: 'Le prénom doit contenir au moins 2 caractères' })
  @MaxLength(100, { message: 'Le prénom ne peut pas dépasser 100 caractères' })
  firstname: string;

  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  @MaxLength(100, { message: 'Le nom ne peut pas dépasser 100 caractères' })
  name: string;

  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @MaxLength(100, { message: 'Le mot de passe ne peut pas dépasser 100 caractères' })
  password: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Rôle invalide' })
  role?: UserRole;

  @IsOptional()
  @IsString({ message: 'L\'avatar doit être une URL valide' })
  avatar?: string;
}



