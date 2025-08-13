import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateApplicationTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
