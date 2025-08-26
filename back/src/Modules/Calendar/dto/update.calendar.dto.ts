import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCalendarEntryDto {
  @ApiProperty({ description: 'The title or name of the calendar entry.' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description:
      'The next action date for the entry (e.g., for irrigation or product application).',
  })
  @IsDateString()
  @IsNotEmpty()
  nextActionDate: Date;

  @ApiProperty({
    description:
      'The type of action for the entry (e.g., "riego", "aplicacion_producto").',
  })
  @IsString()
  @IsNotEmpty()
  actionType: string;
}
