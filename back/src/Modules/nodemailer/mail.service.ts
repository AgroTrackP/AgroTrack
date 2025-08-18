import { Injectable, InternalServerErrorException } from '@nestjs/common';
import nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import { SubscriptionPlan } from '../SubscriptionPlan/entities/suscriptionplan.entity';
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
}
