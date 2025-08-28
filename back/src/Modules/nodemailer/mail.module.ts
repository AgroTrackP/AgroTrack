import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../Users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [MailService],
  exports: [MailService],
})
export class NodemailerModule {}
