import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contacto.entity';
import { CreateContactDto } from './dto/contacto.dto';
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
      order: { createdAt: 'DESC' },
    });
  }
}
