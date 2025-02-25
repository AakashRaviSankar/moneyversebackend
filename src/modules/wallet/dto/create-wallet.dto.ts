import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateWalletDto {
  @ApiProperty({
    description: 'User ID to whom the wallet belongs',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ description: 'Initial balance of the wallet', example: 1000 })
  @IsNumber()
  balance: number;

  @ApiProperty({ description: 'Whether the wallet is active', example: true })
  @IsBoolean()
  isActive: boolean;
}
