import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'username' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'password' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'email', required: false })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ description: 'roleId' })
  @IsInt()
  roleId: number;

  @ApiProperty({ description: 'device ID of the user device' })
  @IsString()
  deviceId: string;
}
