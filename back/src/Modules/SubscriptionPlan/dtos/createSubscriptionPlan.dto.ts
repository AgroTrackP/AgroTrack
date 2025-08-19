import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class CreateSuscriptionDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 40)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  maxUsers: number;

  @IsNotEmpty()
  maxDevices: number;

  @IsNotEmpty()
  @IsArray()
  features: string[];

  @IsNotEmpty()
  @IsString()
  stripePriceId: string;
}
