import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionStatus } from './entities/transaction.entity';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'common/decorators/public.decorator';

@ApiTags('transactions')
@Controller('v1/transactions')

export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
    @Public()
  @Post()
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.createTransaction(createTransactionDto);
  }

    @Public()
  @Post(':id/status')
  async updateTransactionStatus(
    @Param('id') id: number,
    @Body('status') status: TransactionStatus,
  ) {
    return this.transactionService.updateTransactionStatus(id, status);
  }

    @Public()
  @Get()
  async findAll() {
    return this.transactionService.findAll();
  }

    @Public()
  @Get('/user/:userId')
  async findByUser(@Param('userId') userId: number) {
    return this.transactionService.findByUser(userId);
  }
}
