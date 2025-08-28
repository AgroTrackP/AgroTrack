import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({
    example: 'Consulta sobre precios',
    description: 'Título o asunto del mensaje',
  })
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    example: 'cliente@correo.com',
    description: 'Correo electrónico del usuario que envía el mensaje',
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiProperty({
    example: 'Hola, quisiera obtener más información sobre el plan premium.',
    description: 'Contenido del mensaje',
  })
  @IsNotEmpty()
  description: string;
}

export class ResponseContactDto {
  @ApiProperty({
    example: 'abc123',
    description: 'ID del mensaje que se está respondiendo',
  })
  @IsNotEmpty()
  id: string; // <-- nuevo campo

  @ApiProperty({
    example: 'Consulta sobre precios',
    description: 'Título o asunto del mensaje',
  })
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    example: 'cliente@correo.com',
    description: 'Correo electrónico del usuario que envía el mensaje',
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiProperty({
    example: 'Hola, quisiera obtener más información sobre el plan premium.',
    description: 'Contenido del mensaje',
  })
  @IsNotEmpty()
  description: string;
}
