import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';
import { Action } from './entities/action.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Action])],
  controllers: [ActionsController],
  providers: [ActionsService],
})
export class ActionsModule {}
