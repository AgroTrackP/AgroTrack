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
import { ActivityService } from '../ActivityLogs/activity-logs.service';
import { ActivityType } from '../ActivityLogs/entities/activity-logs.entity';

@Injectable()
export class StripeService {
  constructor(
    @InjectRepository(Users)
    private readonly userDbService: Repository<Users>,
    @InjectRepository(SubscriptionPlan)
    private readonly subscriptionPlanRepository: Repository<SubscriptionPlan>,
    @Inject('STRIPE_CLIENT') private stripe: Stripe,
    private readonly mailService: MailService,
    private readonly activityService: ActivityService,
  ) {}

  async getMonthlyRevenue() {
    try {
      // Calcular el rango de fechas para el mes actual
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Convertir a timestamp de Unix (en segundos)
      const startTimestamp = Math.floor(startOfMonth.getTime() / 1000);
      const endTimestamp = Math.floor(now.getTime() / 1000);

      // Obtener todas las transacciones de cobro en ese rango
      let totalRevenue = 0;
      const transactions = this.stripe.balanceTransactions.list({
        created: {
          gte: startTimestamp,
          lte: endTimestamp,
        },
        type: 'charge', // Solo nos interesan los cobros exitosos
        limit: 100, // Máximo por página
      });

      // Iterar sobre los resultados (Stripe pagina automáticamente)
      for await (const transaction of transactions) {
        totalRevenue += transaction.amount;
      }

      // Formatear y devolver el resultado
      const revenueInDollars = totalRevenue / 100;

      return {
        startDate: startOfMonth.toISOString(),
        endDate: now.toISOString(),
        grossRevenue: revenueInDollars,
        currency: 'usd',
      };
    } catch (error) {
      console.error('Error fetching monthly revenue from Stripe:', error);
      throw new InternalServerErrorException(
        'Could not fetch monthly revenue.',
      );
    }
  }

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
        client_reference_id: userId,
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
    const clientReferenceId = session.client_reference_id;

    // Verificamos que el client_reference_id (userId) exista en la sesión.
    if (!clientReferenceId) {
      throw new BadRequestException(
        `Webhook Error: client_reference_id no encontrado.`,
      );
    }

    // Ahora que sabemos que clientReferenceId es un string, podemos usarlo de forma segura.
    const user = await this.userDbService.findOneBy({ id: clientReferenceId });
    if (!user) {
      throw new NotFoundException(
        `Webhook Error: Usuario con ID ${clientReferenceId} no encontrado.`,
      );
    }

    // Obtenemos el Price ID de forma segura.
    const lineItems = await this.stripe.checkout.sessions.listLineItems(
      session.id,
      { limit: 1 },
    );

    if (lineItems.data.length === 0 || !lineItems.data[0].price) {
      console.error(
        `Webhook Error: No se encontró un price object en la sesión ${session.id}.`,
      );
      return;
    }
    const stripePriceId = lineItems.data[0].price.id;

    const plan = await this.subscriptionPlanRepository.findOneBy({
      stripePriceId,
    });
    if (!plan) {
      throw new NotFoundException(
        `Webhook Error: Plan con Stripe Price ID ${stripePriceId} no encontrado.`,
      );
    }

    // Actualizamos el usuario
    user.stripeCustomerId = stripeCustomerId;
    user.suscription_level = plan;
    user.subscriptionStatus = SubscriptionStatus.ACTIVE;
    await this.userDbService.save(user);

    console.log(
      `Usuario ${user.email} suscrito exitosamente al plan ${plan.name}.`,
    );

    await this.activityService.logActivity(
      user,
      ActivityType.SUBSCRIPTION_STARTED,
      `El usuario '${user.name}' se suscribió al plan '${plan.name}'.`,
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

  // Manejar la respuesta de Stripe cuando un pago falla
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

  // Manjear la respuesta de Stripe cuando se cancela una suscripción
  async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const stripeCustomerId = subscription.customer as string;
    const user = await this.userDbService.findOneBy({ stripeCustomerId });

    if (user) {
      user.suscription_level = null;
      user.subscriptionStatus = SubscriptionStatus.CANCELED;
      await this.userDbService.save(user);

      console.log(`Suscripción cancelada para el usuario: ${user.email}`);

      await this.activityService.logActivity(
        user,
        ActivityType.SUBSCRIPTION_CANCELED,
        `El usuario '${user.name}' ha cancelado su suscripción.`,
      );

      await this.mailService.sendSubscriptionCanceledEmail(user);
    } else {
      console.warn(
        `Usuario con Stripe Customer ID ${stripeCustomerId} no encontrado para 'customer.subscription.deleted'.`,
      );
    }
  }

  // Método para cancelar la suscripción del usuario
  async cancelSubscription(userId: string) {
    const user = await this.userDbService.findOneBy({ id: userId });
    if (!user || !user.stripeCustomerId) {
      throw new NotFoundException(
        'Usuario o ID de cliente de Stripe no encontrado.',
      );
    }

    try {
      const subscriptions = await this.stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: 'active',
        limit: 1,
      });

      if (subscriptions.data.length === 0) {
        throw new NotFoundException(
          'No se encontró una suscripción activa para este usuario.',
        );
      }

      const subscriptionId = subscriptions.data[0].id;

      await this.stripe.subscriptions.cancel(subscriptionId);

      return { message: 'Tu suscripción ha sido cancelada exitosamente.' };
    } catch (error) {
      console.error('Error al cancelar la suscripción en Stripe:', error);
      throw new InternalServerErrorException(
        'No se pudo cancelar la suscripción.',
      );
    }
  }

  async findActiveSubscription(stripeCustomerId: string) {
    const subscriptions = await this.stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'active',
      limit: 1,
    });
    return subscriptions.data[0];
  }

  async changeSubscriptionPlan(subscriptionId: string, newPriceId: string) {
    const subscription =
      await this.stripe.subscriptions.retrieve(subscriptionId);
    const currentItemId = subscription.items.data[0].id;

    return this.stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: currentItemId,
          price: newPriceId,
        },
      ],
      proration_behavior: 'create_prorations',
    });
  }

  async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    console.log('--- Iniciando handleSubscriptionUpdated ---');
    const stripeCustomerId = subscription.customer as string;

    const user = await this.userDbService.findOne({
      where: { stripeCustomerId },
      relations: ['suscription_level'], // Aseguramos que la relación esté cargada
    });

    if (!user) {
      throw new NotFoundException(`Webhook Error: Usuario no encontrado.`);
    }
    console.log(
      `✅ Usuario encontrado: ${user.email}. Plan actual en DB: ${user.suscription_level?.name || 'Ninguno'}`,
    );

    const newStripePriceId = subscription.items.data[0]?.price.id;
    if (!newStripePriceId) {
      throw new BadRequestException(`Webhook Error: No se encontró Price ID.`);
    }

    const newPlan = await this.subscriptionPlanRepository.findOneBy({
      stripePriceId: newStripePriceId,
    });
    if (!newPlan) {
      throw new NotFoundException(`Webhook Error: Plan no encontrado en DB.`);
    }
    console.log(`✅ Plan a asignar encontrado en DB: ${newPlan.name}`);

    // Comparamos los IDs para evitar un guardado innecesario
    if (user.suscription_level?.id === newPlan.id) {
      console.log(
        'El usuario ya tiene el plan correcto. No se requieren cambios.',
      );
      return;
    }

    // --- DEPURACIÓN DEL GUARDADO ---
    console.log(`Asignando el nuevo plan '${newPlan.name}' al usuario...`);
    user.suscription_level = newPlan;
    user.subscriptionStatus = SubscriptionStatus.ACTIVE;

    try {
      console.log('A punto de ejecutar .save(user)...');
      await this.userDbService.save(user);
      console.log('✅ ¡ÉXITO! La operación .save() se completó sin errores.');
    } catch (error) {
      console.error('❌ ERROR DURANTE .save(user):', error);
      // Si hay un error aquí, es un problema con TypeORM o la base de datos
      throw new InternalServerErrorException(
        'Fallo al guardar el usuario en la base de datos.',
      );
    }
  }

  async createCustomer(name: string, email: string) {
    try {
      const customer = await this.stripe.customers.create({
        name,
        email,
        description: 'Cliente generado por AgroTrack',
      });
      return customer;
    } catch (error) {
      console.error('Error al crear un cliente en Stripe:', error);
      throw new InternalServerErrorException(
        'No se pudo crear el cliente en Stripe.',
      );
    }
  }

  async createNewSubscription(stripeCustomerId: string, priceId: string) {
    try {
      await this.stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: [{ price: priceId }],
      });
    } catch (error) {
      console.error('Error al crear una nueva suscripción en Stripe:', error);
      throw new InternalServerErrorException(
        `No se pudo crear la nueva suscripción en Stripe. Es posible que el cliente no tenga un método de pago válido.`,
      );
    }
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
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Suscripción actualizada:', subscription);
        await this.handleSubscriptionUpdated(subscription);
        break;
      }

      default:
        console.warn(`Unhandled event type ${event.type}`);
    }
  }
}
