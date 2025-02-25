import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Transaction } from './entities/transaction.entity';
import { User } from 'modules/users/user/user.entity';
import { Wallet } from 'modules/wallet/entities/wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User, Wallet])],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
