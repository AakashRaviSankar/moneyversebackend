import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class UpdateWalletDto {
  @ApiPropertyOptional({ description: 'New wallet balance', example: 500 })
  @IsOptional()
  @IsNumber()
  balance?: number;

  @ApiPropertyOptional({
    description: 'Whether the wallet is active or not',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
