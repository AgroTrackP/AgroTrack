import { Module } from '@nestjs/common';
import { ChatController } from './chatbot.controller';
import { ChatService } from './chatbox.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule], // Importamos ConfigModule para que el servicio pueda usarlo.
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
