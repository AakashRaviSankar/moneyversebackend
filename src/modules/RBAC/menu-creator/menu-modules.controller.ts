import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { MenuModulesService } from './menu-modules.service';
import { CreateMenuModuleDto } from './dto/create-menu-module.dto';
import { UpdateMenuModuleDto } from './dto/update-menu-module.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('menu-modules')
@ApiTags('RBAC-Menu Module')
export class MenuModulesController {
  constructor(private readonly menuModulesService: MenuModulesService) {}

  @Post()
  async create(@Body() createMenuModuleDto: CreateMenuModuleDto) {
    return this.menuModulesService.create(createMenuModuleDto);
  }

  @Post('update/:menuModuleId')
  async update(@Param('menuModuleId') menuModuleId: number, @Body() updateMenuModuleDto: UpdateMenuModuleDto) {
    return this.menuModulesService.update(menuModuleId, updateMenuModuleDto);
  }

  @Get()
  async findAll() {
    return this.menuModulesService.findAll();
  }

  @Delete(':menuModuleId')
  async remove(@Param('menuModuleId') menuModuleId: number) {
    return this.menuModulesService.remove(menuModuleId);
  }
}
