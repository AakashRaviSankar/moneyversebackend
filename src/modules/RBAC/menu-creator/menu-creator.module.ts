import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuCreatorService } from './menu-creator.service';
import { MenuCreatorController } from './menu-creator.controller';
import { Module as MenuModule } from './entities/module.entity'; 
import { Screen } from './entities/screen.entity'; 
import { RolePermission } from '../role/entities/role-permission.entity';
import { Action } from '../actions/entities/action.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([MenuModule, Screen, RolePermission, Action]),
  ],
  providers: [MenuCreatorService],
  controllers: [MenuCreatorController],
  exports: [TypeOrmModule],
})
export class MenuCreatorModule {}
