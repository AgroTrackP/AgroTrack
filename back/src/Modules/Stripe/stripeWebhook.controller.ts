import {
  BadRequestException,
  Controller,
  Headers,
  HttpCode,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { StripeService } from './stripe.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import Stripe from 'stripe';

@ApiTags('Stripe Webhooks')
@Controller('stripe/webhook')
export class StripeWebhookController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Recibe eventos webhook de Stripe' })
  @ApiResponse({
    status: 200,
    description: 'Webhook recibido correctamente',
    schema: { example: { received: true } },
  })
  async handleWebhook(
    @Headers('stripe-signature') sig: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!sig) {
      throw new BadRequestException('Missing Stripe signature header');
    }

    let event: Stripe.Event;

    try {
      // La validación de la firma se hace en el controlador
      event = await this.stripeService.constructEventFromPayload(req.body, sig);
    } catch (err) {
      throw new BadRequestException(`Webhook signature verification failed.`);
    }

    // La lógica de negocio del evento se delega al servicio
    await this.stripeService.handleWebhookEvent(event);

    return { received: true };
  }
}
