import { IsNotEmpty, IsString, IsUrl, IsDateString } from 'class-validator';

export class CloudinaryImageDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsString()
  @IsNotEmpty()
  public_id: string;

  @IsDateString()
  @IsNotEmpty()
  created_at: string;
}
