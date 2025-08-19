// Este archivo define la estructura y las reglas de validación para los datos que llegan.

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatMessageDto {
  @IsString({ message: 'El mensaje debe ser texto.' })
  @IsNotEmpty({ message: 'El mensaje no puede estar vacío.' })
  message: string;
}
