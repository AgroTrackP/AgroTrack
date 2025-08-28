import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty, Matches } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The password reset token sent to the user email',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJ1cmJhbjEydGhlQGdtYWlsLmNvbSIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
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
