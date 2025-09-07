import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  IsEmail,
} from 'class-validator';
import { UserRole } from '../../../entities';

export class RegisterDto {
  @IsString({ message: "L'email doit être une chaîne de caractères" })
  @IsEmail({}, { message: "L'email doit être valide" })
  @MaxLength(255, { message: "L'email ne peut pas dépasser 255 caractères" })
  email: string;

  @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
  @MinLength(2, { message: 'Le prénom doit contenir au moins 2 caractères' })
  @MaxLength(100, { message: 'Le prénom ne peut pas dépasser 100 caractères' })
  firstname: string;

  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  @MaxLength(100, { message: 'Le nom ne peut pas dépasser 100 caractères' })
  name: string;

  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  @MaxLength(100, {
    message: 'Le mot de passe ne peut pas dépasser 100 caractères',
  })
  password: string;

  @IsOptional()
  @IsEnum([UserRole.HOST, UserRole.GUEST], {
    message: 'Rôle invalide. Seuls "host" et "guest" sont autorisés',
  })
  role?: UserRole;

  @IsOptional()
  @IsString({ message: "L'avatar doit être une URL valide" })
  avatar?: string;
}
