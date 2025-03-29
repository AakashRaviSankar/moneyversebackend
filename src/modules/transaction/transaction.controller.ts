import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionStatus } from './entities/transaction.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('transactions')
@Controller('v1/transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.createTransaction(createTransactionDto);
  }

  @Post(':id/status')
  async updateTransactionStatus(
    @Param('id') id: number,
    @Body('status') status: TransactionStatus,
  ) {
    return this.transactionService.updateTransactionStatus(id, status);
  }

  @Get()
  async findAll() {
    return this.transactionService.findAll();
  }

  @Get('/user/:userId')
  async findByUser(@Param('userId') userId: number) {
    return this.transactionService.findByUser(userId);
  }
}
