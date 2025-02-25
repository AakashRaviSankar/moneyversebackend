import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuModulesController } from './menu-modules.controller';
import { MenuModulesService } from './menu-modules.service';
import { Module as MenuModule } from './entities/module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MenuModule])],
  controllers: [MenuModulesController],
  providers: [MenuModulesService],
  exports: [MenuModulesService], 
})
export class MenuModulesModule {}
