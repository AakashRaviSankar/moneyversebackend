import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceLog } from './entities/service-log.entity';
import { LoggingService } from './logging.service';

@Module({
    imports: [TypeOrmModule.forFeature([ServiceLog])],
    providers: [LoggingService],
    exports: [LoggingService],
})
export class LoggingModule {}
