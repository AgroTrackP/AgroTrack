import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCheckoutSessionDto } from './dtos/createCheckoutSession.dto';

@ApiTags('Stripe')
@Controller('stripe')
export class StripeWebhookController {
  private stripe: Stripe;

  constructor(private readonly stripeService: StripeService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-07-30.basil',
    });
  }

  // Endpoint para recibir eventos webhook de Stripe
  @Post('webhook')
  @HttpCode(200)
  @ApiOperation({ summary: 'Recibe eventos webhook de Stripe' })
  @ApiResponse({
    status: 200,
    description: 'Webhook recibido correctamente',
    schema: { example: { received: true } },
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleWebhook(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'] as string;
    if (!sig) {
      throw new BadRequestException('Missing Stripe signature');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err}`);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const session = event.data.object;
        console.log('Checkout session completed:', event.data.object);
        break;
      }
      case 'invoice.payment_succeeded':
        console.log('Renovación completada:', event.data.object);
        break;
      case 'invoice.payment_failed':
        console.log('Pago fallido:', event.data.object);
        break;
      case 'customer.subscription.deleted':
        console.log('Suscripción cancelada:', event.data.object);
        break;
    }

    return { received: true };
  }

  // Endpoint para crear una sesión de checkout
  @Post('create-checkout-session')
  @ApiOperation({ summary: 'Crear sesión de checkout' })
  @ApiBody({ type: CreateCheckoutSessionDto })
  @ApiResponse({
    status: 201,
    description: 'URL de sesión de checkout creada',
    schema: {
      example: { url: 'https://checkout.stripe.com/session/abc123' },
    },
  })
  async createCheckoutSession(
    @Body() createCheckoutSessionDto: CreateCheckoutSessionDto,
  ) {
    const { userId, priceId } = createCheckoutSessionDto;
    const session = await this.stripeService.createCheckoutSession(
      priceId,
      userId,
    );
    return { url: session.url };
  }
}
