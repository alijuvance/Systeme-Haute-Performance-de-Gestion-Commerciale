import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: "L'adresse email est invalide" })
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
