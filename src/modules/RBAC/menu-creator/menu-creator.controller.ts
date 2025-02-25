import { Body, Controller, Get, Post, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { MenuCreatorService } from './menu-creator.service';
import { CreateUpdateMenuDto } from './dto/create-update-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ApiTags } from '@nestjs/swagger';
import { Module as MenuModule } from './entities/module.entity';
import { BaseController } from '../../../base.controller';

@Controller('menu-creator')
@ApiTags('RBAC-Menu Control')
export class MenuCreatorController extends BaseController {

  constructor(private readonly menuCreatorService: MenuCreatorService) {
    super();
  }

  @Get()
  async getAllMenus() {
    const menus = await this.menuCreatorService.getMenu();
    return { menus };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrUpdateMenu(@Body() data: any[]): Promise<{ message: string }> {
    return this.menuCreatorService.createOrUpdateMenu(data);
  }

  @Get(':roleId')
  async getMenusByRole(@Param('roleId') roleId: number) {
    return this.menuCreatorService.getMenuByRoleId(roleId);
  }

  @Get('/screen/:screenId/actions')
  async getActionsForScreen(@Param('screenId') screenId: number) {
    return this.menuCreatorService.getActionsForScreen(screenId);
  }
}