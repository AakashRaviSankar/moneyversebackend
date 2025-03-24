import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { promises } from 'dns';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async findAll(isAuth: boolean = false): Promise<any[]> {
    const users = await this.userRepository.find({
      select: isAuth
        ? ['id', 'username', 'email', 'password', 'salt', 'roleId']
        : ['id', 'username', 'email', 'isActive'],
      relations: ['wallet'],
    });

    return users.map((user) => ({
      ...user,
      wallet: user.wallet ? user.wallet.balance : 0,
      // Extract only balance
    }));
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);

    return this.userRepository.save(user);
  }

  async softDeleteUser(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = user.isActive ? false : true;
    await this.userRepository.save(user);

    return {
      message: user.isActive
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
