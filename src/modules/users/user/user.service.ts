import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { promises } from 'dns';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async findAll(isAuth: boolean = false): Promise<User[]> {
    return this.userRepository.find({
      select: isAuth
        ? ['id', 'username', 'email', 'password', 'salt', 'roleId']
        : ['id', 'username', 'email'],
    });
  }
  async findOne(
    username: string,
    isAuth: boolean = false,
  ): Promise<User | undefined> {
    let users = await this.findAll(isAuth);
    const returnData = users.find(
      (user) => user.username.toLocaleLowerCase() === username,
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
