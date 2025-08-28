import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationPlanDto } from './create.applicationplan.dto';

export class UpdateApplicationPlanDto extends PartialType(
  CreateApplicationPlanDto,
) {}
