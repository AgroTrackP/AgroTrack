import {
  IsOptional,
  IsNumber,
  Min,
  IsString,
  IsIn,
  IsBoolean,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;
}

export class PlantationFilterDto {
  @IsOptional()
  @IsString()
  crop_type?: string;

  @IsOptional()
  @IsString()
  season?: string;
}

export class QueryPlantationsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  crop_type?: string;

  @IsOptional()
  @IsString()
  season?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'name';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'ASC';

  @IsOptional()
  @IsString()
  ownerName?: string;

  // --- AÑADE ESTA PROPIEDAD ---
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true') // Convierte "true" a true y cualquier otra cosa a false
  isActive?: boolean;
}
