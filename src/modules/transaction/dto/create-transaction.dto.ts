import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsEnum, IsOptional, IsString } from 'class-validator';
import { TransactionStatus } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'ID of the user associated with the transaction',
    example: 1,
  })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'Transaction amount', example: 100 })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({
    description: 'Status of the transaction',
    enum: TransactionStatus,
    example: TransactionStatus.PENDING,
  })
  @IsEnum(TransactionStatus)
  @IsOptional()
  status?: TransactionStatus;

  @ApiPropertyOptional({
    description: 'UPI ID for the transaction',
    example: 'user@upi',
  })
  @IsString()
  @IsOptional()
  upiId?: string; // ✅ Added UPI ID field
}
