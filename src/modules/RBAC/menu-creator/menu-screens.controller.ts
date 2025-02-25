import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MenuScreensService } from './menu-screens.service';
import { CreateMenuScreenDto } from './dto/create-menu-screen.dto';
import { UpdateMenuScreenDto } from './dto/update-menu-screen.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('menu-screens')
@ApiTags('RBAC-Menu Screen')
export class MenuScreensController {
  constructor(private readonly menuScreensService: MenuScreensService) {}

  @Post()
  async create(@Body() createMenuScreenDto: CreateMenuScreenDto) {
    return this.menuScreensService.create(createMenuScreenDto);
  }

  @Post(':menuScreenId')
  async update(@Param('menuScreenId') menuScreenId: number, @Body() updateMenuScreenDto: UpdateMenuScreenDto) {
    return this.menuScreensService.update(menuScreenId, updateMenuScreenDto);
  }

  @Get()
  async findAll() {
    return this.menuScreensService.findAll();
  }

  @Delete(':menuScreenId')
  async remove(@Param('menuScreenId') menuScreenId: number) {
    return this.menuScreensService.remove(menuScreenId);
  }
}
