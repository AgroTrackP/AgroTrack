import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ContactService } from './conctacto.service';
import { CreateContactDto, ResponseContactDto } from './dto/contacto.dto';
import { PassportJwtAuthGuard } from 'src/Guards/passportJwt.guard';
import { RoleGuard } from 'src/Guards/role.guard';
import { Roles } from '../Auth/decorators/roles.decorator';
import { Role } from '../Users/user.enum';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Contact } from './entities/contacto.entity';
import { IsActiveGuard } from 'src/Guards/isActive.guard';

@ApiBearerAuth('jwt')
@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  @ApiOperation({ summary: 'Enviar mensaje de contacto' })
  @ApiResponse({ status: 201, description: 'Mensaje enviado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: CreateContactDto })
  sendContact(@Body() dto: CreateContactDto) {
    return this.contactService.createContact(dto);
  }
  @Get()
  @UseGuards(PassportJwtAuthGuard, RoleGuard, IsActiveGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener todos los mensajes de contacto (solo admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de mensajes de contacto ordenados por fecha',
    type: Contact,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado (token faltante o inválido)',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado. Solo Admin puede acceder.',
  })
  getAllContacts() {
    return this.contactService.findAllContacts();
  }

  @Post('reply')
  @ApiOperation({ summary: 'Enviar mensaje de contacto' })
  @ApiResponse({ status: 201, description: 'Mensaje enviado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: ResponseContactDto })
  sendresponse(@Body() dto: ResponseContactDto) {
    return this.contactService.sendResponse(dto);
  }
}
