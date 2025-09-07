import { IsString, MinLength, IsEmail } from 'class-validator';

export class LoginDto {
  @IsString({ message: "L'email doit être une chaîne de caractères" })
  @IsEmail({}, { message: "L'email doit être valide" })
  email: string;

  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @MinLength(1, { message: 'Le mot de passe est requis' })
  password: string;
}
