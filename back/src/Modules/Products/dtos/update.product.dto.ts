import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  IsNumber,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Nombre del producto',
    maxLength: 100,
    example: 'Fertilizante B',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    description: 'Concentración del producto',
    example: 15.0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  concentration?: number;

  @ApiPropertyOptional({
    description: 'Cantidad de agua requerida por litro',
    example: 2.8,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  water_per_liter?: number;

  @ApiPropertyOptional({
    description: 'Cantidad de stock disponible',
    example: 85,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({
    description: 'Umbral para alerta de stock bajo',
    example: 5,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  alert_threshold?: number;
}
