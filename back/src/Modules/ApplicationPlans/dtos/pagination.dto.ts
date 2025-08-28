import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class FindPendingPlansDto {
  @ApiProperty({
    description:
      'Fecha de inicio para la búsqueda (formato ISO 8601, ej. 2025-08-28T00:00:00.000Z).',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description:
      'Fecha de fin para la búsqueda (formato ISO 8601, ej. 2025-08-28T23:59:59.999Z).',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
