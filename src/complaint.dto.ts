import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ComplaintDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail({}, { message: 'Invalid email format' }) // Ensures a valid email
  email: string;

  @ApiProperty({
    example: 'The issue description here',
    description: 'Complaint details',
  })
  @IsString()
  @IsNotEmpty({ message: 'Complaint cannot be empty' }) // Ensures complaint is provided
  complaint: string;
}
