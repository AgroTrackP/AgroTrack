import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCheckoutSessionDto {
  @ApiProperty({
    description: 'ID del usuario',
    example: '25edb52a-6870-432c-baf4-3a2639260022',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'ID del precio en Stripe',
    example: 'price_1RuwJoGaHr3A0Zt9f2EPWn9J',
  })
  @IsString()
  @IsNotEmpty()
  priceId: string;
}
