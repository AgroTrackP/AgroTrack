// create.plantation.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlantationDto {
  @ApiProperty({
    example: 'Plantación de Maíz',
    description: 'Nombre de la plantación',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 5000, description: 'Área de la plantación en m2' })
  @IsNumber()
  area_m2: number;

  @ApiProperty({ example: 'Maíz', description: 'Tipo de cultivo' })
  @IsString()
  crop_type: string;

  @ApiProperty({
    example: 'Amazonas, Brasil',
    description: 'Ubicación de la plantación',
  })
  @IsString()
  location: string;

  @ApiProperty({
    example: '2025-09-01',
    description: 'Fecha de inicio de la plantación (ISO date)',
  })
  @IsDateString()
  start_date: string;

  @ApiPropertyOptional({
    example: 'uuid-del-usuario',
    description: 'ID del usuario dueño de la plantación',
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    example: 'Primavera 2025',
    description: 'Temporada de la plantación',
  })
  @IsString()
  season: string;
}
