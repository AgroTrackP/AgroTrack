import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../Users/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
<<<<<<< HEAD
import { requiresAuth } from 'express-openid-connect';
=======
import { NodemailerModule } from '../nodemailer/mail.module';
>>>>>>> b89e825527a597ade08f1831c6d1e06ff339953b

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
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requiresAuth()).forRoutes('user/auth0/protected');
  }
}
