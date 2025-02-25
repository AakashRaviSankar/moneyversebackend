import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class ScreenDto {
  @IsString()
  screenName: string;

  @IsString()
  screenRoute: string;

  @IsArray()
  actions: string[];
}

export class CreateUpdateMenuDto {
  @ApiProperty()
  @IsString()
  moduleName: string;

  @IsString()
  type: 'Module' | 'Screen' | 'Submodule';

  @IsString()
  moduleRoute: string;

  @IsOptional()
  @IsInt()
  ParentModuleId?: number;

  @IsOptional()
  @IsArray()
  screens?: ScreenDto[];
}

export class UpdateMenuDto {
  @IsInt()
  moduleId: number;

  @IsString()
  moduleName: string;

  @IsString()
  type: 'Module' | 'Screen' | 'Submodule';

  @IsString()
  moduleRoute: string;

  @IsOptional()
  @IsInt()
  ParentModuleId?: number;

  @IsOptional()
  @IsArray()
  screens?: ScreenDto[];
}
