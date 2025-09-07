import { IsString, IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsString({ message: "L'email doit être une chaîne de caractères" })
  @IsEmail({}, { message: "L'email doit être valide" })
  email: string;
}
