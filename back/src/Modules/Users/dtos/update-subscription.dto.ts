import { IsIn, IsString } from 'class-validator';

export class UpdateSubscriptionDto {
  @IsString()
  @IsIn(['Basic', 'Pro', 'Premium', 'not subscription'])
  planName: string;
}
