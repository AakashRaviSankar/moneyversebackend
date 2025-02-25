import { Injectable } from '@nestjs/common';
import { CreateMenuScreenDto } from './dto/create-menu-screen.dto';
import { UpdateMenuScreenDto } from './dto/update-menu-screen.dto';

@Injectable()
export class MenuScreensService {
  // Define methods to interact with the database or data source

  async create(createMenuScreenDto: CreateMenuScreenDto) {
    // Implement create logic
  }

  async update(menuScreenId: number, updateMenuScreenDto: UpdateMenuScreenDto) {
    // Implement update logic
  }

  async findAll() {
    // Implement list logic
  }

  async remove(menuScreenId: number) {
    // Implement delete logic
  }
}
