import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Juan Perez' })
  name: string;

  @ApiProperty({ example: 'juan@example.com' })
  email: string;
}
