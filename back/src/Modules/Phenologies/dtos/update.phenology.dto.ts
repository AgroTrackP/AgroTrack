import { PartialType } from '@nestjs/mapped-types';
import { CreatePhenologyDto } from './create.phenology.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional } from 'class-validator';

export class UpdatePhenologyDto extends PartialType(CreatePhenologyDto) {
  @ApiPropertyOptional({ description: 'ID del usuario asociado' })
  @IsUUID()
  @IsOptional()
  userId?: string;
}
