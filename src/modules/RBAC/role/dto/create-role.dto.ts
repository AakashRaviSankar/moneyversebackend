import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  permissions?: {
    screenId: number;
    actionIds: string[];
  }[];
}
