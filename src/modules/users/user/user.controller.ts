import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'common/decorators/public.decorator';
import { MailService } from 'common/modules/services/mail.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('v1/users')
@Public()
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async findAll(): Promise<User[]> {
    const users = await this.userService.findAll();
    return users;
  }
  @Post(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Get(':id')
  async softDeleteUser(@Param('id') id: number) {
    return this.userService.softDeleteUser(id);
  }
}
