import { Injectable, InternalServerErrorException } from '@nestjs/common';
import nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

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

  async sendMail(
    to: string,
    subject: string,
    templateName: string,
    // replacements: Record<string, string>,
  ) {
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
}
