import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: "L'adresse email est invalide" })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  password: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;
  
  @IsString()
  @IsNotEmpty()
  roleId: string;
}
