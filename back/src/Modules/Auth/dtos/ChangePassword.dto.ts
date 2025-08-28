import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description:
      'The password must contain at least one capital letter, one number, and one of these symbols: !@#$%^&*',
    example: 'Facundo.13!',
  })
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/)
  currentPassword: string;

  @ApiProperty({
    description:
      'The password must contain at least one capital letter, one number, and one of these symbols: !@#$%^&*',
    example: 'Facundito.13!',
  })
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/)
  newPassword: string;
}
