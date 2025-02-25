import { IsString, IsOptional, IsInt, IsArray } from 'class-validator';

export class UpdateMenuModuleDto {
  @IsInt()
  menuModuleId: number;

  @IsString()
  @IsOptional()
  moduleName?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  route?: string;

  @IsInt()
  @IsOptional()
  parentModuleId?: number;
}
