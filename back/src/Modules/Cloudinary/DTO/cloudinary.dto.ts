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

export class CloudinaryResource {
  secure_url: string;
  public_id: string;
  created_at: string;
}

export class CloudinarySearchResponse {
  resources: CloudinaryResource[];
}
