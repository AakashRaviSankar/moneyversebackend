import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { LoggingModule } from '../../../common/logging/logging.module';
import { TasksModule } from '../../../common/tasks/tasks.module';
import { LoggerModule } from '../../../common/writelogging/logger.module'; // Import TasksModule
import { SharedModule } from 'common/modules/shared.module';
import { WalletModule } from 'modules/wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    WalletModule,
    SharedModule,
    LoggingModule,
    LoggerModule,
    TasksModule, // Import TasksModule here to use TasksService
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, SharedModule],
})
export class UserModule {}
