import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationTypeDto } from './create.applicationtypes.dto';

export class UpdateApplicationTypeDto extends PartialType(
  CreateApplicationTypeDto,
) {}
