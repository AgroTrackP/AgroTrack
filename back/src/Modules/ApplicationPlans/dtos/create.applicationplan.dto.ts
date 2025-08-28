import {
  IsUUID,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; // ✅ Importamos los decoradores
import { Status } from '../status.enum';

// Suponemos que tienes este DTO para los items del plan
export class CreateApplicationPlanItemDto {
  @ApiProperty({
    description: 'ID del producto a aplicar.',
    example: 'd1c9e8f7-6a5b-4c3d-2e1f-0d9c8b7a6f5e',
  })
  @IsUUID()
  product_id: string;

  @ApiProperty({
    description: 'Dosis del producto por metro cuadrado.',
    example: 0.5,
  })
  @IsNumber()
  dosage_per_m2: number;

  @ApiProperty({
    description: 'Cantidad total calculada del producto.',
    example: 25.5,
  })
  @IsNumber()
  calculated_quantity: number;
}

export class CreateApplicationPlanDto {
  @ApiProperty({
    description:
      'Fecha y hora planificada para la aplicación (formato ISO 8601).',
    example: '2025-09-01T10:00:00.000Z',
  })
  @IsDateString()
  planned_date: string;

  @ApiProperty({
    description: 'Cantidad total de agua en litros.',
    example: 100,
  })
  @IsNumber()
  total_water: number;

  @ApiProperty({
    description: 'Cantidad total de producto en kilogramos o litros.',
    example: 5,
  })
  @IsNumber()
  total_product: number;

  @ApiPropertyOptional({
    description: 'Estado inicial del plan. Por defecto es PENDING.',
    enum: Status,
    example: 'PENDING',
  })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @ApiProperty({
    description: 'ID del usuario propietario del plan.',
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  })
  @IsUUID()
  user_id: string;

  @ApiProperty({
    description: 'ID de la plantación a la que se aplica el plan.',
    example: 'f5e4d3c2-b1a0-9e8d-7c6b-5a4d3c2b1a0f',
  })
  @IsUUID()
  plantation_id: string;

  @ApiProperty({
    description: 'ID de la enfermedad asociada al plan.',
    example: '11122233-4455-6677-8899-aabbccddeeff',
  })
  @IsUUID()
  disease_id: string;

  @ApiProperty({
    description: 'Lista de productos a aplicar.',
    type: [CreateApplicationPlanItemDto],
    minItems: 1,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateApplicationPlanItemDto)
  @ArrayMinSize(1)
  items: CreateApplicationPlanItemDto[];
}
