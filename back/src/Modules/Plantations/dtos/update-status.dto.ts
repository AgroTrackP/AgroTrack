import { IsBoolean } from 'class-validator';

export class UpdatePlantationStatusDto {
  @IsBoolean()
  isActive: boolean;
}
