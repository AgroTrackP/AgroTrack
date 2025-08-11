import {
  BadRequestException,
  Controller,
  Headers,
  HttpCode,
  Post,
  Req,
} from '@nestjs/common';
import Stripe from 'stripe';

@Controller('stripe')
export class StripeWebhookController {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-07-30',
  });

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Req() req,
    @Headers('stripe-signature') signature: string,
  ) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err}`);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        console.log('Checkout session completed:', event.data.object);
        break;
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
}
