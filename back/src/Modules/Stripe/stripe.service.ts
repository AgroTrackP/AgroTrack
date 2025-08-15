import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { Users } from '../Users/entities/user.entity';

@Injectable()
export class StripeService {
  constructor(
    @InjectRepository(Users) private userDbService: Repository<Users>,
    @Inject('STRIPE_CLIENT') private stripe: Stripe,
  ) {}

  async createCheckoutSession(
    priceId: string,
    userId: string,
  ): Promise<Stripe.Checkout.Session> {
    try {
      const user = await this.userDbService.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        customer_email: user.email,
        success_url: String.raw`${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw new BadRequestException(
        `Unable to create checkout session: ${error}`,
      );
    }
  }

  // Manejar la validación de la firma del webhook
  constructEventFromPayload(payload: Buffer, sig: string): Stripe.Event {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err}`);
    }
  }

  // Método para la lógica de negocio del webhook
  handleWebhookEvent(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed': {
        console.log('Checkout session completed:', event.data.object);
        // Añadir la lógica para activar la suscripción del usuario en la base de datos
        break;
      }
      case 'invoice.payment_succeeded':
        console.log('Renovación completada:', event.data.object);
        // Lógica para registrar un pago exitoso
        break;
      case 'invoice.payment_failed':
        console.log('Pago fallido:', event.data.object);
        // Lógica para manejar un pago fallido, como notificar al usuario
        break;
      case 'customer.subscription.deleted':
        console.log('Suscripción cancelada:', event.data.object);
        // Lógica para desactivar la suscripción del usuario
        break;
      default:
        console.warn(`Unhandled event type ${event.type}`);
    }
  }
}
