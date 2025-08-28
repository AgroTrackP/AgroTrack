import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ChatService } from './chatbox.service';
import { CreateChatMessageDto } from './chatbox.dto';

@Controller('api/chat') // Define la ruta base para este controlador: /chat
export class ChatController {
  // Inyectamos el servicio que contiene la lógica.
  constructor(private readonly chatService: ChatService) {}

  @Post() // Define que este método manejará peticiones POST a /chat
  async create(
    @Body(new ValidationPipe()) createChatMessageDto: CreateChatMessageDto,
  ) {
    const userMessage = createChatMessageDto.message;
    const botReply = await this.chatService.getBotReply(userMessage);

    // NestJS se encarga de serializar esto a JSON y enviarlo con un código 201 (Created).
    return { reply: botReply };
  }
}
