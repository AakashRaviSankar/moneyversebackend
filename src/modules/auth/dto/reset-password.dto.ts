import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  token: string; // Reset JWT Token

  @MinLength(6)
  newPassword: string;
}
