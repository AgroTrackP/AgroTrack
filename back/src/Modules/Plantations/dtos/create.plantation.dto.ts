import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreatePlantationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  area_m2: number;

  @IsString()
  crop_type: string;

  @IsString()
  location: string;

  @IsDateString()
  start_date: string; // mejor que Date para validación en DTO

  @IsOptional()
  @IsString()
  userId?: string; // payload para relacionar usuario
}
