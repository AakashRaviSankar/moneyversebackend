import { Injectable } from '@nestjs/common';
import { CreateMenuModuleDto } from './dto/create-menu-module.dto';
import { UpdateMenuModuleDto } from './dto/update-menu-module.dto';

@Injectable()
export class MenuModulesService {
  // Define methods to interact with the database or data source

  async create(createMenuModuleDto: CreateMenuModuleDto) {
    // Implement create logic
  }

  async update(menuModuleId: number, updateMenuModuleDto: UpdateMenuModuleDto) {
    // Implement update logic
  }

  async findAll() {
    // Implement list logic
  }

  async remove(menuModuleId: number) {
    // Implement delete logic
  }
}
