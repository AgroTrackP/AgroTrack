import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsJWT()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description:
      'The password must contain at least one capital letter, one number, and one of these symbols: !@#$%^&*',
    example: 'JohnDoe.13!',
  })
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/)
  password: string;
}
