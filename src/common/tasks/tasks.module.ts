import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TaskLog } from './entities/task-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskLog])],  // Register TaskLog entity
  providers: [TasksService],
  exports: [TasksService],  // Export TasksService if used elsewhere
})
export class TasksModule { }