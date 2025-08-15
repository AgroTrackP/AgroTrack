import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../Users/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { NodemailerModule } from '../nodemailer/mail.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RoleGuard } from 'src/Guards/role.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    NodemailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RoleGuard],
  exports: [PassportModule, JwtStrategy],
})
export class AuthModule {}
