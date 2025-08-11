import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class UpdatePlantationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  area_m2?: number;

  @IsOptional()
  @IsString()
  crop_type?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
