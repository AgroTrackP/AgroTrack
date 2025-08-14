import { IsNumber, IsUUID } from 'class-validator';

export class CreateApplicationPlanItemDto {
  @IsNumber()
  dosage_per_m2: number;

  @IsNumber()
  calculated_quantity: number;

  @IsUUID()
  product_id: string;
}
