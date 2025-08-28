import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CreateRecommendationDto {
  @IsString()
  crop_type: string;

  @IsOptional()
  @IsString()
  planting_notes?: string;

  @IsOptional()
  @IsNumber()
  recommended_water_per_m2?: number;

  @IsOptional()
  @IsString()
  recommended_fertilizer?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  recommended_diseases_ids?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  recommended_products_ids?: string[];

  @IsOptional()
  @IsUUID()
  recommended_application_type_id?: string;

  @IsOptional()
  @IsString()
  additional_notes?: string;
}
