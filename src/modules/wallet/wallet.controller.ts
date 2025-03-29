import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags(`wallets`)
@Controller('v1/wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  findAll() {
    return this.walletService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: number) {
    return this.walletService.findByUserId(+userId);
  }

  @Post(':userId')
  async updateWallet(
    @Param('userId') userId: number,
    @Body() updateWalletDto: UpdateWalletDto,
  ) {
    return this.walletService.updateWallet(userId, updateWalletDto);
  }
}
