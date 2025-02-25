import { PartialType } from '@nestjs/swagger';
import { CreateMenuCreatorDto } from './create-menu-creator.dto';

export class UpdateMenuCreatorDto extends PartialType(CreateMenuCreatorDto) {}
