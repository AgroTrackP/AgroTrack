import { Injectable, InternalServerErrorException } from '@nestjs/common';
import nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import { SubscriptionPlan } from '../SubscriptionPlan/entities/subscriptionplan.entity';
import { Users } from '../Users/entities/user.entity';

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

  private loadTemplate(
    templateName: string,
    replacements: Record<string, string>,
  ): string {
    const isProd = process.env.NODE_ENV === 'production';

    const basePath = isProd
      ? path.join(__dirname, 'templates') // dist/Modules/nodemailer/templates
      : path.join(__dirname, '..', 'templates'); // src/Modules/nodemailer/templates

    const templatePath = path.join(basePath, `${templateName}.html`);

    let template = fs.readFileSync(templatePath, 'utf-8');

    for (const [key, value] of Object.entries(replacements)) {
      template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    return template;
  }

  async sendMail(to: string, subject: string, templateName: string) {
    try {
      await this.transporter.sendMail({
        from: `"Agrotrack" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html: templateName,
      });

      console.log(`📨 Email enviado a ${to} con asunto: ${subject}`);
    } catch (error) {
      console.error('❌ Error enviando correo:', error);
      throw new InternalServerErrorException('No se pudo enviar el correo');
    }
  }

  async sendPaymentSuccessEmail(user: Users, plan: SubscriptionPlan) {
    const mailOptions = {
      from: `"Agrotrack" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: '✅ ¡Tu suscripción a AgroTrack está activa!',
      html: `
        <h1>¡Hola, ${user.name}!</h1>
        <p>Gracias por suscribirte a AgroTrack. Tu pago ha sido procesado exitosamente.</p>
        <p>Has activado el plan: <strong>${plan.name}</strong></p>
        <p>Precio: $${plan.price} ARS</p>
        <p>Ahora tienes acceso a las siguientes características:</p>
        <ul>
          ${plan.features.map((feature) => `<li>${feature}</li>`).join('')}
        </ul>
        <p>¡Gracias por confiar en nosotros para optimizar tus cultivos!</p>
        <br>
        <p>El equipo de AgroTrack</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Payment confirmation email sent to ${user.email}`);
    } catch (error) {
      console.log(`Failed to send email to ${user.email}`, error);
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

    const mailOptions = {
      from: '"AgroTrack" <no-reply@agrotrack.com>',
      to: user.email,
      subject: '✅ Tu suscripción a AgroTrack ha sido renovada',
      html: `
        <h1>¡Hola, ${user.name}!</h1>
        <p>Te confirmamos que tu suscripción al plan <strong>${plan.name}</strong> ha sido renovada exitosamente.</p>
        <p>Hemos procesado el pago de <strong>$${plan.price} ARS</strong> y tu acceso a todas las funcionalidades premium continúa sin interrupciones.</p>
        <p>Tu próxima fecha de facturación será aproximadamente el ${nextBillingDate.toLocaleDateString('es-AR')}.</p>
        <p>Gracias por seguir confiando en AgroTrack para potenciar tus cultivos.</p>
        <br>
        <p>El equipo de AgroTrack</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
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
    const mailOptions = {
      from: '"AgroTrack" <no-reply@agrotrack.com>',
      to: user.email,
      subject: 'Tu suscripción a AgroTrack ha sido cancelada',
      html: `
        <h1>¡Hola, ${user.name}!</h1>
        <p>Te confirmamos que tu suscripción a AgroTrack ha sido cancelada exitosamente.</p>
        <p>Lamentamos verte partir. Aún tendrás acceso a todas las funcionalidades de tu plan hasta el final de tu ciclo de facturación actual.</p>
        <p>Si cambias de opinión en el futuro, siempre serás bienvenido de vuelta. ¡Nos encantaría saber por qué te vas para poder mejorar!</p>
        <p>Si tienes un momento, te agradeceríamos que compartieras tu opinión con nosotros.</p>
        <br>
        <p>Gracias por haber sido parte de la comunidad de AgroTrack.</p>
        <p>El equipo de AgroTrack</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
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
}
