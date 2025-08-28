import {
  Controller,
  Headers,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { StripeService } from './stripe.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import Stripe from 'stripe';
import { StripeSignatureGuard } from 'src/Guards/stripeSignature.guard';

@ApiTags('Stripe Webhooks')
@Controller('stripe/webhook')
export class StripeWebhookController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  @UseGuards(StripeSignatureGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Recibe eventos webhook de Stripe' })
  @ApiResponse({
    status: 200,
    description: 'Webhook recibido correctamente',
    schema: { example: { received: true } },
  })
  async handleWebhook(@Req() req: Request) {
    const event = (req as any).stripeEvent as Stripe.Event;

    await this.stripeService.handleWebhookEvent(event);

    return { received: true };
  }
}
