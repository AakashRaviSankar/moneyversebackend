import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionStatus } from './entities/transaction.entity';
import { User } from 'modules/users/user/user.entity';
import { Wallet } from 'modules/wallet/entities/wallet.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const {
      userId,
      amount,
      status = TransactionStatus.PENDING,
      upiId,
    } = createTransactionDto;

    // Check if user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if wallet exists
    const wallet = await this.walletRepository.findOne({ where: { userId } });
    if (!wallet) {
      throw new NotFoundException(`Wallet for user ID ${userId} not found`);
    }
    const alreadyInPending = await this.transactionRepository.find({
      where: { userId },
      relations: ['user'],
    });

    const somePending = alreadyInPending.some(
      (transaction) => transaction.status === TransactionStatus.PENDING,
    );

    if (somePending) {
      throw new NotFoundException(
        `Transaction already in pending, once its completed you can create new transaction`,
      );
    }

    // Update wallet balance
    if (amount > wallet.balance) {
      throw new NotFoundException(`Insufficient balance`);
    }
    wallet.balance -= amount;
    await this.walletRepository.save(wallet);

    // Create new transaction
    const transaction = this.transactionRepository.create({
      userId,
      amount,
      status,
      upiId,
    });

    return await this.transactionRepository.save(transaction);
  }

  async updateTransactionStatus(
    id: number,
    status: TransactionStatus,
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    transaction.status = status;
    return await this.transactionRepository.save(transaction);
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find({ relations: ['user'] });
  }

  async findByUser(userId: number): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { userId },
      relations: ['user'],
    });
  }
}
