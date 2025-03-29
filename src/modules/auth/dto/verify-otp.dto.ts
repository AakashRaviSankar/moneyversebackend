import { IsEmail, IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail()
  email: string;

  @IsNumberString()
  otp: string;

  @IsNotEmpty()
  token: string; // OTP JWT Token
}
