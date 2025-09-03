import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'Le login doit être une chaîne de caractères' })
  @MinLength(1, { message: 'Le login est requis' })
  login: string;

  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @MinLength(1, { message: 'Le mot de passe est requis' })
  password: string;
}



