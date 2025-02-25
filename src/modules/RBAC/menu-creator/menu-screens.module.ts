import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuScreensController } from './menu-screens.controller';
import { MenuScreensService } from './menu-screens.service';
import { Screen } from './entities/screen.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([Screen])],
  controllers: [MenuScreensController],
  providers: [MenuScreensService],
  exports: [MenuScreensService],
})
export class MenuScreensModule {}
