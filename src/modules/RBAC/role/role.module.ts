import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { Role } from './entities/role.entity';
import { RolePermission } from './entities/role-permission.entity';
import { Module as MenuModule } from '../menu-creator/entities/module.entity'; 
import { Screen } from '../menu-creator/entities/screen.entity';
import { RoleController } from './role.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, RolePermission, MenuModule, Screen]),
  ],
  providers: [RoleService],
  exports: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
