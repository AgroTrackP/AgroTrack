import { IsIn, IsString } from 'class-validator';

export class UpdateSubscriptionDto {
  @IsString()
  @IsIn(['Básico', 'Pro', 'Premium', 'not subscription'])
  planName: string;
}
