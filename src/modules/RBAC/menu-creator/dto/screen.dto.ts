import { IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScreenDto {
  @ApiProperty({ description: 'Name of the screen' })
  @IsString()
  screenName: string;

  @ApiProperty({ description: 'Route of the screen' })
  @IsString()
  screenRoute: string;

  @ApiProperty({ description: 'List of actions for the screen' })
  @IsArray()
  actions: string[];
}
