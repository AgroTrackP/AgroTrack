import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { Users } from '../Users/entities/user.entity';
import { SubscriptionPlan } from '../SubscriptionPlan/entities/subscriptionplan.entity';
import { MailService } from '../nodemailer/mail.service';
import { SubscriptionStatus } from '../Users/subscriptionStatus.enum';

@Injectable()
export class StripeService {
  constructor(
    @InjectRepository(Users)
    private readonly userDbService: Repository<Users>,
    @InjectRepository(SubscriptionPlan)
    private readonly subscriptionPlanRepository: Repository<SubscriptionPlan>,
    @Inject('STRIPE_CLIENT') private stripe: Stripe,
    private readonly mailService: MailService,
  ) {}

  // Crear una sesión de checkout
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

  // Lógica al confirmar el pago
  async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const stripeCustomerId = session.customer as string;

    const checkoutSession = await this.stripe.checkout.sessions.retrieve(
      session.id,
      {
        expand: ['line_items'],
      },
    );

    if (!checkoutSession.line_items) {
      throw new InternalServerErrorException(
        'Could not retrieve line items from session.',
      );
    }

    const stripePriceId = checkoutSession.line_items.data[0].price!.id;

    const user = await this.userDbService.findOneBy({ stripeCustomerId });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const plan = await this.subscriptionPlanRepository.findOneBy({
      stripePriceId,
    });
    if (!plan) {
      throw new NotFoundException('Subscription plan does not exist.');
    }

    user.suscription_level = plan;
    user.subscriptionStatus = SubscriptionStatus.ACTIVE;
    await this.userDbService.save(user);

    console.log(
      `User ${user.email} successfully subscribed to plan ${plan.name}.`,
    );

    await this.mailService.sendPaymentSuccessEmail(user, plan);
  }

  async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    const stripeCustomerId = invoice.customer as string;
    const user = await this.userDbService.findOneBy({ stripeCustomerId });

    if (user) {
      console.log(
        `Renovación exitosa registrada para el usuario: ${user.email}`,
      );
      user.subscriptionStatus = SubscriptionStatus.ACTIVE;
      await this.userDbService.save(user);
      await this.mailService.sendRenewalSuccessEmail(user);
    } else {
      console.warn(
        `Usuario con Stripe Customer ID ${stripeCustomerId} no encontrado para 'invoice.payment_succeeded'.`,
      );
    }
  }

  async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const stripeCustomerId = invoice.customer as string;
    const user = await this.userDbService.findOneBy({ stripeCustomerId });

    if (user) {
      user.subscriptionStatus = SubscriptionStatus.PAST_DUE;
      await this.userDbService.save(user);
      console.log(`Pago fallido notificado al usuario: ${user.email}`);
      await this.mailService.sendPaymentFailedEmail(user);
    } else {
      console.warn(
        `Usuario con Stripe Customer ID ${stripeCustomerId} no encontrado para 'invoice.payment_failed'.`,
      );
    }
  }

  async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const stripeCustomerId = subscription.customer as string;
    const user = await this.userDbService.findOneBy({ stripeCustomerId });

    if (user) {
      user.suscription_level = null;
      user.subscriptionStatus = SubscriptionStatus.CANCELED;
      await this.userDbService.save(user);
      console.log(`Suscripción cancelada para el usuario: ${user.email}`);
      await this.mailService.sendSubscriptionCanceledEmail(user);
    } else {
      console.warn(
        `Usuario con Stripe Customer ID ${stripeCustomerId} no encontrado para 'customer.subscription.deleted'.`,
      );
    }
  }

  async cancelSubscription(userId: string) {
    
  }

  // Método para la lógica de negocio del webhook
  async handleWebhookEvent(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed': {
        // Lógica para activar la suscripción del usuario en la base de datos
        console.log('Checkout session completed:', event.data.object);
        const session = event.data.object as Stripe.Checkout.Session;
        await this.handleCheckoutSessionCompleted(session);
        break;
      }
      case 'invoice.payment_succeeded': {
        // Lógica para registrar un pago exitoso
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Renovación completada:', event.data.object);
        await this.handleInvoicePaymentSucceeded(invoice);
        break;
      }
      case 'invoice.payment_failed': {
        // Lógica para manejar un pago fallido, como notificar al usuario
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Pago fallido:', event.data.object);
        await this.handleInvoicePaymentFailed(invoice);
        break;
      }
      case 'customer.subscription.deleted': {
        // Lógica para desactivar la suscripción del usuario
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Suscripción cancelada:', event.data.object);
        await this.handleSubscriptionDeleted(subscription);
        break;
      }

      default:
        console.warn(`Unhandled event type ${event.type}`);
    }
  }
}
