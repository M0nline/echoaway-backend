import { IsString, MinLength, MaxLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString({ message: 'Le token doit être une chaîne de caractères' })
  token: string;

  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  @MaxLength(100, {
    message: 'Le mot de passe ne peut pas dépasser 100 caractères',
  })
  password: string;
}
