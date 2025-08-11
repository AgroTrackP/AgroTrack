import { IsOptional, IsString, IsArray, IsUUID } from 'class-validator';

export class UpdateDiseaseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  productIds?: string[];
}
