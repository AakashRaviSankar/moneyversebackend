import { IsString, IsInt, IsArray } from 'class-validator';

export class UpdateMenuScreenDto {
  @IsInt()
  menuScreenId: number;

  @IsString()
  screenName: string;

  @IsInt()
  moduleId: number;

  @IsString()
  screenRoute: string;

  @IsArray()
  action: number[];
}
