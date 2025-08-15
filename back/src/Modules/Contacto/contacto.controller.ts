import { Controller, Post, Body } from '@nestjs/common';
import { ContactService } from './conctacto.service';
import { CreateContactDto } from './dto/contacto.dto';

@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  sendContact(@Body() dto: CreateContactDto) {
    return this.contactService.createContact(dto);
  }
}
