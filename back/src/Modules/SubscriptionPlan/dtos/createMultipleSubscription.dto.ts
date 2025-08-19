import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateSuscriptionDto } from './createSubscriptionPlan.dto';

export class CreateMultipleSubscriptionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSuscriptionDto)
  plans: CreateSuscriptionDto[];
}
