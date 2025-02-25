import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async create(createWalletDto: CreateWalletDto): Promise<Wallet> {
    const existingWallet = await this.walletRepository.findOne({
      where: { userId: createWalletDto.userId },
    });

    if (existingWallet) {
      throw new ConflictException('User already has a wallet');
    }

    const wallet = this.walletRepository.create(createWalletDto);
    return await this.walletRepository.save(wallet);
  }

  async findAll(): Promise<Wallet[]> {
    return await this.walletRepository.find();
  }

  async findByUserId(userId: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({ where: { userId } });
    if (!wallet) {
      throw new NotFoundException('Wallet not found for the given user');
    }
    return wallet;
  }

  async updateWallet(
    userId: number,
    updateWalletDto: UpdateWalletDto,
  ): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({ where: { userId } });

    if (!wallet) {
      throw new NotFoundException(`Wallet not found for user ID ${userId}`);
    }

    Object.assign(wallet, updateWalletDto);
    return await this.walletRepository.save(wallet);
  }
}
