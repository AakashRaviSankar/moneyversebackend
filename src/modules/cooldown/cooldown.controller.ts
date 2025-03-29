import { Controller, Get, Post, Query } from '@nestjs/common';
import { CooldownService } from './cooldown.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('transactions')
@Controller('v1/cooldown')
export class CooldownController {
  constructor(private readonly cooldownService: CooldownService) {}

  @Post('add-number')
  async addNumber(
    @Query('userId') userId: string,
    @Query('task') task: string,
    @Query('number') number: string, // Accept as string from query params
  ) {
    const parsedNumber = parseInt(number, 10);
    if (isNaN(parsedNumber)) {
      return { error: 'Invalid number format' };
    }
    return await this.cooldownService.addNumber(userId, task, parsedNumber);
  }

  @Get('status')
  async getCooldownStatus(
    @Query('userId') userId: string,
    @Query('task') task: string,
  ) {
    return await this.cooldownService.getCooldownStatus(userId, task);
  }
}
