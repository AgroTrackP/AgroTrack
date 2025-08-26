import { PartialType } from '@nestjs/swagger';
import { CreateCalendarEntryDto } from './update.calendar.dto';

export class UpdateCalendarEntryDto extends PartialType(
  CreateCalendarEntryDto,
) {}
