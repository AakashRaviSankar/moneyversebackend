import { IsInt, IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ScreenDto {
  @IsInt()
  screenId: number;

  @IsString()
  screenName: string;

  @IsString()
  screenRoute: string;

  @IsArray()
  @IsInt({ each: true })
  actions: number[];
}

export class UpdateMenuDto {
  @IsInt()
  moduleId: number;

  @IsString()
  moduleName: string;

  @IsString()
  type: string;

  @IsString()
  moduleRoute: string;

  @IsOptional()
  @IsInt()
  parentModuleId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScreenDto)
  screens: ScreenDto[];
}
