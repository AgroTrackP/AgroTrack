import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contacto.entity';
import { CreateContactDto, ResponseContactDto } from './dto/contacto.dto';
import { MailService } from '../nodemailer/mail.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepo: Repository<Contact>,
    private mailService: MailService,
  ) {}

  async createContact(dto: CreateContactDto) {
    const contact = this.contactRepo.create(dto);
    await this.contactRepo.save(contact);

    // Enviar mail a administradores
    await this.mailService.sendMail(
      'agrotrackproject@gmail.com',
      `Nuevo contacto: ${dto.title}`,
      `<p><b>Email:</b> ${dto.email}</p>
       <p><b>Descripción:</b><br>${dto.description}</p>`,
    );

    return { message: 'Mensaje enviado correctamente' };
  }

  // Nuevo método para encontrar todos los mensajes de contacto
  async findAllContacts(): Promise<Contact[]> {
    return this.contactRepo.find({
      where: { isActive: true }, // Solo contactos activos
      order: { createdAt: 'DESC' },
    });
  }

  async sendResponse(dto: ResponseContactDto & { id: string }) {
    // Enviar correo
    await this.mailService.sendMail(
      dto.email,
      `AgroTrack: Respuesta a tu consulta "${dto.title}"`,
      `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="background-color: #2E7D32; padding: 20px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px;">AgroTrack</h1>
          <p style="margin: 5px 0 0; font-size: 14px;">Soluciones inteligentes para tu agricultura</p>
        </div>
        <div style="padding: 20px; color: #333333; line-height: 1.6;">
          <p>Hola,</p>
          <p>Hemos recibido tu mensaje y te respondemos a continuación:</p>
          <div style="margin: 20px 0; padding: 15px; background-color: #e8f5e9; border-left: 4px solid #43a047; border-radius: 4px;">
            <p><strong>Nuestra respuesta:</strong></p>
            <p>${dto.title}</p>
            <p>${dto.description}</p>
          </div>
          <p>Gracias por confiar en AgroTrack. Estamos aquí para ayudarte a sacar el máximo provecho a tu actividad agrícola.</p>
        </div>
        <div style="background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 12px; color: #555;">
          <p>AgroTrack Project &copy; ${new Date().getFullYear()}</p>
          <p>Aceptamos respuestas a este correo.</p>
        </div>
      </div>
    </div>
    `,
    );

    // Actualizar el mensaje original como inactivo
    await this.contactRepo.update({ id: dto.id }, { isActive: false });

    return { message: 'Respuesta enviada correctamente y mensaje desactivado' };
  }
}
