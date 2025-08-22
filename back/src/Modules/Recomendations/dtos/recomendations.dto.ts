import { IsString, IsNumber, IsOptional } from 'class-validator';

export class RecommendationDto {
  @IsString()
  crop_type: string; // "Tomate", "Lechuga", etc.

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
  recommended_diseases?: {
    id: string;
    name: string;
    description: string;
  }[];

  @IsOptional()
  recommended_products?: {
    id: string;
    name: string;
    concentration: number;
    water_per_liter: number;
    stock: number;
    alert_threshold: number;
    isActive: boolean;
    category: {
      id: string;
      name: string;
    };
  }[];

  @IsOptional()
  recommended_application_type?: {
    id: string;
    name: string;
    description: string;
  };

  @IsOptional()
  @IsString()
  additional_notes?: string;
}
