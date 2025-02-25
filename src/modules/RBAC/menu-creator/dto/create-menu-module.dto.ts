import { IsString, IsOptional, IsInt, IsArray } from 'class-validator';

export class CreateMenuModuleDto {
  @IsString()
  moduleName: string;

  @IsString()
  type: string; 

  @IsString()
  @IsOptional()
  moduleRoute?: string;

  @IsInt()
  @IsOptional()
  parentModuleId?: number;
}
