import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../Users/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { NodemailerModule } from '../nodemailer/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    PassportModule.register({ session: true }),
    NodemailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
