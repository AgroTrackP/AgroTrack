import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePlantationDto {
  @ApiPropertyOptional({
    example: 'Plantación de Trigo',
    description: 'Nombre de la plantación',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 3000,
    description: 'Área en m2 de la plantación',
  })
  @IsOptional()
  @IsNumber()
  area_m2?: number;

  @ApiPropertyOptional({ example: 'Trigo', description: 'Tipo de cultivo' })
  @IsOptional()
  @IsString()
  crop_type?: string;

  @ApiPropertyOptional({
    example: 'Cauquenes, Chile',
    description: 'Ubicación de la plantación',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    example: '2025-10-01',
    description: 'Fecha de inicio (ISO date)',
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({
    example: 'uuid-del-usuario',
    description: 'ID del usuario',
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({
    example: 'Verano 2026',
    description: 'Temporada actualizada de la plantación',
  })
  @IsOptional()
  @IsString()
  season?: string;
}
