import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'common/decorators/public.decorator';
import { MailService } from 'common/modules/services/mail.service';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Get()
  async findAll(): Promise<User[]> {
    const users = await this.userService.findAll();
    return users;
  }
}
