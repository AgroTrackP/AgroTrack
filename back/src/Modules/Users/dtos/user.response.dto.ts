import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
export class UserResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  id: string;
  @Expose()
  @ApiProperty({ example: 'Juan Perez' })
  name: string;
  @Expose()
  @ApiProperty({ example: 'juan@example.com' })
  email: string;
}
