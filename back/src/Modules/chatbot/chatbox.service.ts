import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class ChatService {
  private openai: OpenAI;

  // Inyectamos ConfigService para acceder a las variables de entorno de forma segura.
  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async getBotReply(message: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Eres AgroBot, el asistente virtual oficial de AgroTrack.
Habla siempre con un tono amigable, cercano y en español neutro.
Tu misión es ayudar a agricultores a entender cómo funciona AgroTrack y sus planes de suscripción.
Planes:
- Plan Básico – $19.99/mes: Asesoría mensual, Monitoreo de cultivos, Acceso a boletines.
- Plan Pro – $29.99/mes: Asesoría quincenal, Reporte de productividad, Acceso a eventos virtuales.
- Plan Premium – $49.99/mes: Asesoría semanal, Monitoreo satelital, Alertas por clima, Soporte prioritario.`,
          },
          {
            role: 'user',
            content: message, // El mensaje del usuario.
          },
        ],
      });

      // CORRECCIÓN: Se maneja el caso en que la respuesta sea nula.
      // Si `content` es `null`, se usará el texto alternativo.
      // Esto asegura que `reply` siempre sea un string, solucionando el error.
      const reply =
        completion.choices[0].message.content ??
        'Lo siento, no pude generar una respuesta en este momento.';
      return reply;
    } catch (error) {
      console.error('Error al contactar la API de OpenAI:', error);
      throw new InternalServerErrorException(
        'Error al procesar el mensaje. Intenta de nuevo.',
      );
    }
  }
}
