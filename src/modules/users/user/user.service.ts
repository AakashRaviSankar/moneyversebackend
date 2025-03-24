import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { promises } from 'dns';
import { UpdateUserDto } from './dto/update-user.dto';
import { Wallet } from 'modules/wallet/entities/wallet.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}
  async findAll(isAuth: boolean = false): Promise<any[]> {
    const users = await this.userRepository.find({
      select: isAuth
        ? ['id', 'username', 'email', 'password', 'salt', 'roleId', 'isActive']
        : ['id', 'username', 'email', 'isActive'],
      relations: ['wallet'],
    });

    return users.map((user) => ({
      ...user,
      wallet: user.wallet ? user.wallet.balance : 0,
      // Extract only balance
    }));
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['wallet'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Update user fields if provided
    if (updateUserDto.username) user.username = updateUserDto.username;
    if (updateUserDto.email) user.email = updateUserDto.email;

    // Update wallet if balance is provided
    if (updateUserDto.balance !== undefined && user.wallet) {
      user.wallet.balance = updateUserDto.balance;
      await this.walletRepository.save(user.wallet); // Save wallet changes
    }

    return this.userRepository.save(user); // Save user changes
  }
  async softDeleteUser(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = user.isActive ? false : true;
    await this.userRepository.save(user);

    return {
      message: !user.isActive
        ? 'User deactivated successfully'
        : 'User activated successfully',
    };
  }

  async findOne(
    username: string,
    isAuth: boolean = false,
  ): Promise<User | undefined> {
    let users = await this.findAll(isAuth);
    const returnData = users.find(
      (user) =>
        (user.username.toLocaleLowerCase() === username ||
          user.email.toLocaleLowerCase() === username) &&
        user.isActive,
    );

    return returnData;
  }
  async findEmail(
    email: string,
    isAuth: boolean = false,
  ): Promise<User | undefined> {
    let users = await this.findAll(isAuth);
    const returnData = users.find(
      (user) => user.email.toLocaleLowerCase() === email,
    );

    return returnData;
  }
}
