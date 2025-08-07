import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, MaxLength, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    maxLength: 100,
    example: 'Fertilizante A',
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Concentración del producto',
    example: 12.5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  concentration: number;

  @ApiProperty({
    description: 'Cantidad de agua requerida por litro de producto',
    example: 3.5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  water_per_liter: number;

  @ApiProperty({
    description: 'Cantidad disponible en stock',
    example: 120,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({
    description: 'Umbral de alerta para stock bajo',
    example: 10,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  alert_threshold: number;
}
