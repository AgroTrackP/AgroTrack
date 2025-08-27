import { Injectable, InternalServerErrorException } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { SubscriptionPlan } from '../SubscriptionPlan/entities/subscriptionplan.entity';
import { Users } from '../Users/entities/user.entity';
import { render } from '@react-email/components';
import PaymentSuccessEmail from 'src/emails/payment-success';
import ConfirmationEmail from 'src/emails/confirmation';
import RenewalSuccessEmail from 'src/emails/renewal-success';
import SubscriptionCanceledEmail from 'src/emails/subscription-canceled';
import PasswordResetEmail from 'src/emails/password-reset';

@Injectable()
export class MailService {
  private transporter: ReturnType<typeof nodemailer.createTransport>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true para puerto 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: `"Agrotrack" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html, // El contenido ahora es el HTML renderizado
      });
      console.log(`📨 Email enviado a ${to} con asunto: ${subject}`);
    } catch (error) {
      console.error('❌ Error enviando correo:', error);
      throw new InternalServerErrorException('No se pudo enviar el correo');
    }
  }

  async sendRegistrationEmail(name: string, email: string) {
    // 1. Renderiza el componente a un string de HTML
    const html = await render(ConfirmationEmail({ name, email }));

    // 2. Llama a tu método genérico para enviar el correo
    await this.sendMail(email, 'Bienvenido a AgroTrack', html);
  }

  async sendPaymentSuccessEmail(user: Users, plan: SubscriptionPlan) {
    // Renderiza el componente de React a un string de HTML
    const html = await render(
      PaymentSuccessEmail({
        name: user.name,
        planName: plan.name,
        planPrice: plan.price,
        planFeatures: plan.features,
      }),
    );

    // Envía el correo usando tu método genérico o la lógica directa
    try {
      await this.transporter.sendMail({
        from: `"AgroTrack" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: '✅ ¡Tu suscripción a AgroTrack está activa!',
        html,
      });
      console.log(`Payment confirmation email sent to ${user.email}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `Failed to send email to ${user.email}: ${error.message}`,
        );
      } else {
        console.error(
          `Failed to send email to ${user.email} with an unknown error.`,
        );
      }
    }
  }

  async sendRenewalSuccessEmail(user: Users) {
    if (!user.suscription_level) {
      console.error(
        `Intento de enviar correo de renovación sin datos del plan para el usuario ${user.email}`,
      );
      return;
    }

    const plan = user.suscription_level;
    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    const html = await render(
      RenewalSuccessEmail({
        name: user.name,
        planName: plan.name,
        planPrice: plan.price,
        nextBillingDate: nextBillingDate.toLocaleDateString('es-AR'),
      }),
    );

    try {
      await this.transporter.sendMail({
        from: `"AgroTrack" <no-reply@agrotrack.com>`,
        to: user.email,
        subject: '✅ Tu suscripción a AgroTrack ha sido renovada',
        html,
      });
      console.log(`Correo de renovación exitosa enviado a ${user.email}`);
    } catch (error) {
      console.error(
        `Falló el envío de correo de renovación a ${user.email}`,
        error,
      );
    }
  }

  async sendPaymentFailedEmail(user: Users) {
    // URL a la página de configuración de facturación de tu aplicación
    // o directamente al portal de cliente de Stripe.
    const billingUrl = `${process.env.FRONTEND_URL}/account/billing`;

    const mailOptions = {
      from: '"AgroTrack" <no-reply@agrotrack.com>',
      to: user.email,
      subject: '⚠️ Problema con tu pago de AgroTrack',
      html: `
        <h1>¡Hola, ${user.name}!</h1>
        <p>Te informamos que no pudimos procesar el pago de renovación de tu suscripción a AgroTrack. Esto puede deberse a una tarjeta vencida o fondos insuficientes.</p>
        <p>Tu cuenta ha entrado en un período de gracia para que puedas seguir accediendo a tus beneficios mientras solucionas el problema.</p>
        <p><strong>Por favor, actualiza tu método de pago para mantener tu suscripción activa:</strong></p>
        <a href="${billingUrl}" style="background-color: #f0ad4e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Actualizar Información de Pago</a>
        <p>Una vez actualizado, intentaremos realizar el cobro nuevamente en los próximos días. Si tienes alguna pregunta, no dudes en contactar a nuestro soporte.</p>
        <br>
        <p>El equipo de AgroTrack</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Correo de pago fallido enviado a ${user.email}`);
    } catch (error) {
      console.error(
        `Falló el envío de correo de pago fallido a ${user.email}`,
        error,
      );
    }
  }

  async sendSubscriptionCanceledEmail(user: Users) {
    const html = await render(
      SubscriptionCanceledEmail({
        name: user.name,
      }),
    );

    try {
      await this.transporter.sendMail({
        from: `"AgroTrack" <no-reply@agrotrack.com>`,
        to: user.email,
        subject: 'Tu suscripción a AgroTrack ha sido cancelada',
        html,
      });
      console.log(
        `Correo de cancelación de suscripción enviado a ${user.email}`,
      );
    } catch (error) {
      console.error(
        `Falló el envío del correo de cancelación a ${user.email}`,
        error,
      );
    }
  }

  async sendPasswordResetEmail(name: string, email: string, resetUrl: string) {
    const html = await render(
      PasswordResetEmail({
        name,
        resetUrl,
      }),
    );

    try {
      await this.transporter.sendMail({
        from: `"AgroTrack" <no-reply@agrotrack.com>`,
        to: email,
        subject: 'Restablece tu contraseña de AgroTrack',
        html,
      });
      console.log(
        `Correo de restablecimiento de contraseña enviado a ${email}`,
      );
    } catch (error) {
      console.error(
        `Falló el envío del correo de restablecimiento a ${email}`,
        error,
      );
    }
  }
}
