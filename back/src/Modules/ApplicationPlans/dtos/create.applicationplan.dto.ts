import {
  IsUUID,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Status } from '../status.enum';
import { CreateApplicationPlanItemDto } from './create.applicationplanitem.dto';

export class CreateApplicationPlanDto {
  @IsDateString()
  planned_date: string;

  @IsNumber()
  total_water: number;

  @IsNumber()
  total_product: number;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @IsUUID()
  user_id: string;

  @IsUUID()
  plantation_id: string;

  @IsUUID()
  disease_id: string;

  @ValidateNested({ each: true })
  @Type(() => CreateApplicationPlanItemDto)
  @ArrayMinSize(1)
  items: CreateApplicationPlanItemDto[];
}
