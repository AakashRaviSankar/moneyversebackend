import { IsString, IsInt, IsArray } from 'class-validator';

export class CreateMenuScreenDto {
  @IsString()
  screenName: string;

  @IsInt()
  moduleId: number;

  @IsString()
  screenRoute: string;

  @IsArray()
  action: number[];
}
