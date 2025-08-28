import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'The email associated with the user account',
    example: 'urban12the@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
