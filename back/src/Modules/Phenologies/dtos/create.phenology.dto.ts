import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreatePhenologyDto {
  @ApiProperty({
    description: 'Nombre único de la fenología',
    maxLength: 100,
    example: 'Floración',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Descripción detallada de la fenología',
    example: 'Período en que la planta desarrolla flores',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'ID del usuario asociado (opcional)',
    required: false,
    example: 'uuid-del-usuario',
  })
  @IsString()
  @IsOptional()
  userId?: string;
}
