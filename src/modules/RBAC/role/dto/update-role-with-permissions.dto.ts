import { IsOptional, IsNumber, IsArray, ValidateNested, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class PermissionDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNumber()
  screenId: number;

  @IsArray()
  @IsNotEmpty({ each: true })
  actionIds: string[]; // Ensure actionIds are validated as non-empty strings
}

export class UpdateRoleWithPermissionsDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsNumber()
  activeFlag?: number;

  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions: PermissionDto[];
}
