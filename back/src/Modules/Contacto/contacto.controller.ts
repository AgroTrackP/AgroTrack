import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ContactService } from './conctacto.service';
import { CreateContactDto } from './dto/contacto.dto';
import { PassportJwtAuthGuard } from 'src/Guards/passportJwt.guard';
import { RoleGuard } from 'src/Guards/role.guard';
import { Roles } from '../Auth/decorators/roles.decorator';
import { Role } from '../Users/user.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('jwt')
@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  sendContact(@Body() dto: CreateContactDto) {
    return this.contactService.createContact(dto);
  }
  @Get()
  @UseGuards(PassportJwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  getAllContacts() {
    return this.contactService.findAllContacts();
  }
}
