import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contacto.entity';
import { ContactService } from './conctacto.service';
import { ContactController } from './contacto.controller';
import { MailService } from '../nodemailer/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contact])],
  providers: [ContactService, MailService],
  controllers: [ContactController],
})
export class ContactModule {}
